from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, 
    get_jwt_identity, get_jwt, verify_jwt_in_request
)
from src.database import db
from src.models.user import User, UserProfile, Role, Permission, TokenBlacklist

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint."""
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        username = data['username'].strip()
        password = data['password']
        
        # Find user by username or email
        user = User.query.filter(
            (User.username == username) | (User.email == username)
        ).first()
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check if account is locked
        if user.is_locked():
            return jsonify({
                'error': 'Account is locked due to too many failed login attempts',
                'locked_until': user.locked_until.isoformat()
            }), 423
        
        # Check if account is active
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Verify password
        if not user.check_password(password):
            # Increment failed login attempts
            user.failed_login_attempts += 1
            
            # Lock account if too many failed attempts
            if user.failed_login_attempts >= current_app.config.get('MAX_LOGIN_ATTEMPTS', 5):
                user.lock_account(30)  # Lock for 30 minutes
                db.session.commit()
                return jsonify({
                    'error': 'Account locked due to too many failed login attempts',
                    'locked_until': user.locked_until.isoformat()
                }), 423
            
            db.session.commit()
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Reset failed login attempts on successful login
        user.failed_login_attempts = 0
        user.last_login = datetime.now(timezone.utc)
        db.session.commit()
        
        # Create tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict(include_profile=True)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """User logout endpoint."""
    try:
        jti = get_jwt()['jti']
        token_type = get_jwt()['type']
        user_id = get_jwt_identity()
        
        # Add token to blacklist
        blacklisted_token = TokenBlacklist(
            jti=jti,
            token_type=token_type,
            user_id=user_id,
            expires_at=datetime.now(timezone.utc) + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
        )
        db.session.add(blacklisted_token)
        db.session.commit()
        
        return jsonify({'message': 'Successfully logged out'}), 200
        
    except Exception as e:
        current_app.logger.error(f"Logout error: {str(e)}")
        return jsonify({'error': 'Logout failed'}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token endpoint."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 401
        
        new_access_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            'access_token': new_access_token
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Token refresh error: {str(e)}")
        return jsonify({'error': 'Token refresh failed'}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict(include_profile=True)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get profile error: {str(e)}")
        return jsonify({'error': 'Failed to get profile'}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update user fields
        if 'email' in data:
            # Check if email is already taken
            existing_user = User.query.filter(
                User.email == data['email'],
                User.id != user.id
            ).first()
            if existing_user:
                return jsonify({'error': 'Email already in use'}), 400
            user.email = data['email']
        
        # Update or create profile
        if not user.profile:
            user.profile = UserProfile(user_id=user.id)
            db.session.add(user.profile)
        
        profile_fields = ['first_name', 'last_name', 'phone', 'department', 'position', 'specialization']
        for field in profile_fields:
            if field in data:
                setattr(user.profile, field, data[field])
        
        if 'preferences' in data:
            user.profile.preferences = data['preferences']
        
        user.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict(include_profile=True)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Update profile error: {str(e)}")
        return jsonify({'error': 'Failed to update profile'}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        if not data or not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        # Verify current password
        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 400
        
        # Validate new password
        new_password = data['new_password']
        min_length = current_app.config.get('PASSWORD_MIN_LENGTH', 8)
        if len(new_password) < min_length:
            return jsonify({'error': f'Password must be at least {min_length} characters long'}), 400
        
        # Set new password
        user.set_password(new_password)
        user.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        current_app.logger.error(f"Change password error: {str(e)}")
        return jsonify({'error': 'Failed to change password'}), 500

@auth_bp.route('/register', methods=['POST'])
@jwt_required()
def register():
    """Register new user (admin only)."""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user or not current_user.has_role('admin'):
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if username or email already exists
        existing_user = User.query.filter(
            (User.username == data['username']) | (User.email == data['email'])
        ).first()
        if existing_user:
            return jsonify({'error': 'Username or email already exists'}), 400
        
        # Validate password
        password = data['password']
        min_length = current_app.config.get('PASSWORD_MIN_LENGTH', 8)
        if len(password) < min_length:
            return jsonify({'error': f'Password must be at least {min_length} characters long'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email']
        )
        user.set_password(password)
        
        if 'is_active' in data:
            user.is_active = data['is_active']
        
        db.session.add(user)
        db.session.flush()  # Get user ID
        
        # Create profile if profile data provided
        profile_data = data.get('profile', {})
        if profile_data:
            profile = UserProfile(
                user_id=user.id,
                first_name=profile_data.get('first_name'),
                last_name=profile_data.get('last_name'),
                phone=profile_data.get('phone'),
                department=profile_data.get('department'),
                position=profile_data.get('position'),
                specialization=profile_data.get('specialization')
            )
            db.session.add(profile)
        
        # Assign roles if provided
        role_names = data.get('roles', [])
        for role_name in role_names:
            role = Role.query.filter_by(name=role_name).first()
            if role:
                user.roles.append(role)
        
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict(include_profile=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Request password reset."""
    try:
        data = request.get_json()
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
        
        email = data['email'].lower().strip()
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        if not user:
            # Don't reveal if email exists or not for security
            return jsonify({
                'message': 'If the email exists in our system, you will receive a password reset link'
            }), 200
        
        if not user.is_active:
            return jsonify({
                'message': 'If the email exists in our system, you will receive a password reset link'
            }), 200
        
        # Generate password reset token
        reset_token = _generate_password_reset_token(user)
        
        # Store reset token in user record (you might want to create a separate table for this)
        user.password_reset_token = reset_token
        user.password_reset_expires = datetime.now(timezone.utc) + timedelta(hours=1)  # 1 hour expiry
        db.session.commit()
        
        # In a real implementation, you would send an email here
        # For now, we'll log the token (remove this in production)
        current_app.logger.info(f"Password reset token for {email}: {reset_token}")
        
        # TODO: Send email with reset link
        # send_password_reset_email(user.email, reset_token)
        
        return jsonify({
            'message': 'If the email exists in our system, you will receive a password reset link',
            'reset_token': reset_token  # Remove this in production - only for testing
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Forgot password error: {str(e)}")
        return jsonify({'error': 'Failed to process password reset request'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password with token."""
    try:
        data = request.get_json()
        if not data or 'token' not in data or 'password' not in data:
            return jsonify({'error': 'Token and new password are required'}), 400
        
        token = data['token']
        new_password = data['password']
        
        # Validate password strength
        if len(new_password) < 8:
            return jsonify({'error': 'Password must be at least 8 characters long'}), 400
        
        # Find user by reset token
        user = User.query.filter_by(password_reset_token=token).first()
        if not user:
            return jsonify({'error': 'Invalid or expired reset token'}), 400
        
        # Check if token has expired
        if not user.password_reset_expires or user.password_reset_expires < datetime.now(timezone.utc):
            return jsonify({'error': 'Reset token has expired'}), 400
        
        if not user.is_active:
            return jsonify({'error': 'Account is not active'}), 400
        
        # Update password
        user.set_password(new_password)
        user.password_reset_token = None
        user.password_reset_expires = None
        user.updated_at = datetime.now(timezone.utc)
        
        db.session.commit()
        
        current_app.logger.info(f"Password reset successful for user: {user.email}")
        
        return jsonify({
            'message': 'Password has been reset successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Reset password error: {str(e)}")
        return jsonify({'error': 'Failed to reset password'}), 500


def _generate_password_reset_token(user):
    """Generate a secure password reset token."""
    import secrets
    import hashlib
    
    # Generate a random token
    token = secrets.token_urlsafe(32)
    
    # Add user-specific data to make it more secure
    user_data = f"{user.id}:{user.email}:{user.created_at}"
    combined = f"{token}:{user_data}"
    
    # Hash the combined data
    hashed_token = hashlib.sha256(combined.encode()).hexdigest()
    
    return hashed_token[:32]  # Return first 32 characters

