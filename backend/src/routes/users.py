from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from src.database import db
from src.models.user import User, UserProfile, Role, Permission

users_bp = Blueprint('users', __name__)

def get_current_user():
    """Get current authenticated user."""
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

def check_admin_permission():
    """Check if current user has admin permissions."""
    current_user = get_current_user()
    return current_user and current_user.has_role('admin')

@users_bp.route('', methods=['GET'])
@jwt_required()
def list_users():
    """List users with filtering and pagination."""
    try:
        if not check_admin_permission():
            return jsonify({'error': 'Admin access required'}), 403
        
        # Get query parameters
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        role_filter = request.args.get('role')
        status_filter = request.args.get('status')
        department_filter = request.args.get('department')
        
        # Build query
        query = User.query
        
        # Apply search filter
        if search:
            query = query.filter(
                or_(
                    User.username.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%')
                )
            )
        
        # Apply role filter
        if role_filter:
            query = query.join(User.roles).filter(Role.name == role_filter)
        
        # Apply status filter
        if status_filter == 'active':
            query = query.filter(User.is_active == True)
        elif status_filter == 'inactive':
            query = query.filter(User.is_active == False)
        
        # Apply department filter
        if department_filter:
            query = query.join(UserProfile).filter(UserProfile.department == department_filter)
        
        # Order by creation date
        query = query.order_by(User.created_at.desc())
        
        # Paginate
        pagination = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        users = [user.to_dict(include_profile=True) for user in pagination.items]
        
        return jsonify({
            'users': users,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"List users error: {str(e)}")
        return jsonify({'error': 'Failed to list users'}), 500

@users_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Get user details."""
    try:
        current_user = get_current_user()
        
        # Users can view their own profile, admins can view any profile
        if str(current_user.id) != user_id and not current_user.has_role('admin'):
            return jsonify({'error': 'Access denied'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict(include_profile=True)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get user error: {str(e)}")
        return jsonify({'error': 'Failed to get user'}), 500

@users_bp.route('/<user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Update user information."""
    try:
        current_user = get_current_user()
        
        # Users can update their own profile, admins can update any profile
        if str(current_user.id) != user_id and not current_user.has_role('admin'):
            return jsonify({'error': 'Access denied'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update user fields (admin only for some fields)
        is_admin = current_user.has_role('admin')
        
        if 'email' in data:
            # Check if email is already taken
            existing_user = User.query.filter(
                User.email == data['email'],
                User.id != user.id
            ).first()
            if existing_user:
                return jsonify({'error': 'Email already in use'}), 400
            user.email = data['email']
        
        if 'username' in data and is_admin:
            # Check if username is already taken
            existing_user = User.query.filter(
                User.username == data['username'],
                User.id != user.id
            ).first()
            if existing_user:
                return jsonify({'error': 'Username already in use'}), 400
            user.username = data['username']
        
        if 'is_active' in data and is_admin:
            user.is_active = data['is_active']
        
        if 'is_verified' in data and is_admin:
            user.is_verified = data['is_verified']
        
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
        
        if 'avatar_url' in data:
            user.profile.avatar_url = data['avatar_url']
        
        user.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict(include_profile=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update user error: {str(e)}")
        return jsonify({'error': 'Failed to update user'}), 500

@users_bp.route('/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """Deactivate user (soft delete)."""
    try:
        if not check_admin_permission():
            return jsonify({'error': 'Admin access required'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Prevent self-deletion
        current_user = get_current_user()
        if str(current_user.id) == user_id:
            return jsonify({'error': 'Cannot deactivate your own account'}), 400
        
        user.is_active = False
        user.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        
        return jsonify({'message': 'User deactivated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Delete user error: {str(e)}")
        return jsonify({'error': 'Failed to deactivate user'}), 500

@users_bp.route('/<user_id>/activate', methods=['POST'])
@jwt_required()
def activate_user(user_id):
    """Activate user account."""
    try:
        if not check_admin_permission():
            return jsonify({'error': 'Admin access required'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user.is_active = True
        user.unlock_account()  # Also unlock if locked
        user.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        
        return jsonify({'message': 'User activated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Activate user error: {str(e)}")
        return jsonify({'error': 'Failed to activate user'}), 500

@users_bp.route('/<user_id>/roles', methods=['GET'])
@jwt_required()
def get_user_roles(user_id):
    """Get user roles."""
    try:
        if not check_admin_permission():
            return jsonify({'error': 'Admin access required'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        roles = [role.to_dict() for role in user.roles]
        
        return jsonify({'roles': roles}), 200
        
    except Exception as e:
        current_app.logger.error(f"Get user roles error: {str(e)}")
        return jsonify({'error': 'Failed to get user roles'}), 500

@users_bp.route('/<user_id>/roles', methods=['POST'])
@jwt_required()
def assign_user_roles(user_id):
    """Assign roles to user."""
    try:
        if not check_admin_permission():
            return jsonify({'error': 'Admin access required'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        if not data or 'role_names' not in data:
            return jsonify({'error': 'Role names are required'}), 400
        
        role_names = data['role_names']
        if not isinstance(role_names, list):
            return jsonify({'error': 'Role names must be a list'}), 400
        
        # Clear existing roles
        user.roles.clear()
        
        # Assign new roles
        for role_name in role_names:
            role = Role.query.filter_by(name=role_name).first()
            if role:
                user.roles.append(role)
        
        user.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        
        return jsonify({
            'message': 'Roles assigned successfully',
            'roles': [role.to_dict() for role in user.roles]
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Assign user roles error: {str(e)}")
        return jsonify({'error': 'Failed to assign roles'}), 500

@users_bp.route('/<user_id>/roles/<role_id>', methods=['DELETE'])
@jwt_required()
def remove_user_role(user_id, role_id):
    """Remove role from user."""
    try:
        if not check_admin_permission():
            return jsonify({'error': 'Admin access required'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        role = Role.query.get(role_id)
        if not role:
            return jsonify({'error': 'Role not found'}), 404
        
        if role in user.roles:
            user.roles.remove(role)
            user.updated_at = datetime.now(timezone.utc)
            db.session.commit()
            return jsonify({'message': 'Role removed successfully'}), 200
        else:
            return jsonify({'error': 'User does not have this role'}), 400
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Remove user role error: {str(e)}")
        return jsonify({'error': 'Failed to remove role'}), 500

@users_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    """Get user statistics."""
    try:
        if not check_admin_permission():
            return jsonify({'error': 'Admin access required'}), 403
        
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        inactive_users = total_users - active_users
        verified_users = User.query.filter_by(is_verified=True).count()
        
        # Users by role
        role_stats = {}
        roles = Role.query.all()
        for role in roles:
            role_stats[role.name] = len(role.users)
        
        # Recent registrations (last 30 days)
        thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
        recent_registrations = User.query.filter(
            User.created_at >= thirty_days_ago
        ).count()
        
        return jsonify({
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': inactive_users,
            'verified_users': verified_users,
            'role_distribution': role_stats,
            'recent_registrations': recent_registrations
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get user stats error: {str(e)}")
        return jsonify({'error': 'Failed to get user statistics'}), 500

