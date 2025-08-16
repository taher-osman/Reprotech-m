from functools import wraps
from flask import request, jsonify, current_app, g
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, verify_jwt_in_request
from src.models.user import User, TokenBlacklist

def auth_required(f):
    """Decorator to require authentication."""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        try:
            # Get current user
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
            
            if not current_user.is_active:
                return jsonify({'error': 'Account is deactivated'}), 401
            
            # Store user in Flask's g object for access in views
            g.current_user = current_user
            
            return f(*args, **kwargs)
            
        except Exception as e:
            current_app.logger.error(f"Auth middleware error: {str(e)}")
            return jsonify({'error': 'Authentication failed'}), 401
    
    return decorated_function

def role_required(*required_roles):
    """Decorator to require specific roles."""
    def decorator(f):
        @wraps(f)
        @auth_required
        def decorated_function(*args, **kwargs):
            try:
                current_user = g.current_user
                
                # Check if user has any of the required roles
                user_roles = [role.name for role in current_user.roles]
                
                if not any(role in user_roles for role in required_roles):
                    return jsonify({
                        'error': 'Insufficient permissions',
                        'required_roles': list(required_roles),
                        'user_roles': user_roles
                    }), 403
                
                return f(*args, **kwargs)
                
            except Exception as e:
                current_app.logger.error(f"Role check error: {str(e)}")
                return jsonify({'error': 'Permission check failed'}), 403
        
        return decorated_function
    return decorator

def optional_auth(f):
    """Decorator for optional authentication."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Try to verify JWT token
            verify_jwt_in_request(optional=True)
            
            current_user_id = get_jwt_identity()
            if current_user_id:
                current_user = User.query.get(current_user_id)
                if current_user and current_user.is_active:
                    g.current_user = current_user
                else:
                    g.current_user = None
            else:
                g.current_user = None
                
        except Exception:
            # If JWT verification fails, continue without authentication
            g.current_user = None
        
        return f(*args, **kwargs)
    
    return decorated_function

def admin_required(f):
    """Decorator to require admin role."""
    return role_required('admin')(f)

def lab_tech_required(f):
    """Decorator to require lab technician role."""
    return role_required('lab_technician', 'admin')(f)

def veterinarian_required(f):
    """Decorator to require veterinarian role."""
    return role_required('veterinarian', 'admin')(f)

def manager_required(f):
    """Decorator to require manager role or higher."""
    return role_required('manager', 'admin')(f)

def check_resource_ownership(resource_user_id_field='user_id'):
    """Decorator to check if user owns the resource or has admin role."""
    def decorator(f):
        @wraps(f)
        @auth_required
        def decorated_function(*args, **kwargs):
            try:
                current_user = g.current_user
                
                # Admin can access everything
                if any(role.name == 'admin' for role in current_user.roles):
                    return f(*args, **kwargs)
                
                # Get resource from request data or URL parameters
                resource_user_id = None
                
                # Try to get from JSON data
                if request.is_json:
                    data = request.get_json()
                    if data and resource_user_id_field in data:
                        resource_user_id = data[resource_user_id_field]
                
                # Try to get from URL parameters
                if not resource_user_id and resource_user_id_field in kwargs:
                    resource_user_id = kwargs[resource_user_id_field]
                
                # Try to get from query parameters
                if not resource_user_id:
                    resource_user_id = request.args.get(resource_user_id_field)
                
                # Check ownership
                if resource_user_id and str(resource_user_id) != str(current_user.id):
                    return jsonify({'error': 'Access denied: You can only access your own resources'}), 403
                
                return f(*args, **kwargs)
                
            except Exception as e:
                current_app.logger.error(f"Resource ownership check error: {str(e)}")
                return jsonify({'error': 'Access check failed'}), 403
        
        return decorated_function
    return decorator

def check_customer_access(customer_id_field='customer_id'):
    """Decorator to check if user has access to customer data."""
    def decorator(f):
        @wraps(f)
        @auth_required
        def decorated_function(*args, **kwargs):
            try:
                current_user = g.current_user
                
                # Admin can access everything
                if any(role.name == 'admin' for role in current_user.roles):
                    return f(*args, **kwargs)
                
                # Get customer ID from request
                customer_id = None
                
                # Try to get from JSON data
                if request.is_json:
                    data = request.get_json()
                    if data and customer_id_field in data:
                        customer_id = data[customer_id_field]
                
                # Try to get from URL parameters
                if not customer_id and customer_id_field in kwargs:
                    customer_id = kwargs[customer_id_field]
                
                # Try to get from query parameters
                if not customer_id:
                    customer_id = request.args.get(customer_id_field)
                
                # Check if user has access to this customer
                if customer_id:
                    from src.models.customer import Customer
                    customer = Customer.query.get(customer_id)
                    
                    if not customer:
                        return jsonify({'error': 'Customer not found'}), 404
                    
                    # Check if user is assigned to this customer
                    if current_user.id not in customer.assigned_users:
                        return jsonify({'error': 'Access denied: You do not have access to this customer'}), 403
                
                return f(*args, **kwargs)
                
            except Exception as e:
                current_app.logger.error(f"Customer access check error: {str(e)}")
                return jsonify({'error': 'Access check failed'}), 403
        
        return decorated_function
    return decorator

def validate_api_key(f):
    """Decorator to validate API key for external integrations."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            api_key = request.headers.get('X-API-Key')
            
            if not api_key:
                return jsonify({'error': 'API key required'}), 401
            
            # Validate API key with proper implementation
            if not _validate_api_key(api_key):
                return jsonify({'error': 'Invalid API key'}), 401
            
            return f(*args, **kwargs)
            
        except Exception as e:
            current_app.logger.error(f"API key validation error: {str(e)}")
            return jsonify({'error': 'API key validation failed'}), 401
    
    return decorated_function


def _validate_api_key(api_key):
    """Validate API key against database or configuration."""
    import hashlib
    import hmac
    from flask import current_app
    
    try:
        # Method 1: Check against configured API keys
        valid_api_keys = current_app.config.get('VALID_API_KEYS', [])
        if valid_api_keys and api_key in valid_api_keys:
            return True
        
        # Method 2: Check against environment variable
        master_api_key = current_app.config.get('MASTER_API_KEY')
        if master_api_key and api_key == master_api_key:
            return True
        
        # Method 3: Generate and validate API key based on secret
        api_secret = current_app.config.get('API_SECRET', current_app.config.get('SECRET_KEY'))
        if api_secret:
            # Generate expected API key using HMAC
            expected_key = hmac.new(
                api_secret.encode(),
                b'reprotech_api',
                hashlib.sha256
            ).hexdigest()[:32]
            
            if api_key == expected_key:
                return True
        
        # Method 4: Database-based API key validation (implement if needed)
        # This would check against a database table of valid API keys
        # api_key_record = APIKey.query.filter_by(key=api_key, is_active=True).first()
        # if api_key_record and api_key_record.expires_at > datetime.utcnow():
        #     return True
        
        return False
        
    except Exception as e:
        current_app.logger.error(f"API key validation error: {str(e)}")
        return False

def generate_api_key():
    """Generate a new API key for the system."""
    import secrets
    return secrets.token_urlsafe(32)

