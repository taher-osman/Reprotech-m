import time
import json
import uuid
from functools import wraps
from flask import request, current_app, g
from datetime import datetime

def request_logger(f):
    """Log requests and responses."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Generate request ID
        request_id = str(uuid.uuid4())[:8]
        g.request_id = request_id
        
        # Start timing
        start_time = time.time()
        
        # Log request
        request_data = {
            'request_id': request_id,
            'timestamp': datetime.utcnow().isoformat(),
            'method': request.method,
            'url': request.url,
            'endpoint': request.endpoint,
            'ip_address': request.remote_addr,
            'user_agent': request.headers.get('User-Agent'),
            'content_type': request.content_type,
            'content_length': request.content_length,
        }
        
        # Add user info if available
        try:
            from flask_jwt_extended import get_jwt_identity
            user_id = get_jwt_identity()
            if user_id:
                request_data['user_id'] = user_id
        except:
            pass
        
        # Log query parameters (excluding sensitive data)
        if request.args:
            filtered_args = {}
            for key, value in request.args.items():
                if key.lower() not in ['password', 'token', 'api_key', 'secret']:
                    filtered_args[key] = value
                else:
                    filtered_args[key] = '[REDACTED]'
            request_data['query_params'] = filtered_args
        
        # Log request body for POST/PUT/PATCH (excluding sensitive data)
        if request.method in ['POST', 'PUT', 'PATCH'] and request.is_json:
            try:
                body = request.get_json()
                if body:
                    filtered_body = _filter_sensitive_data(body)
                    request_data['body'] = filtered_body
            except:
                request_data['body'] = '[INVALID_JSON]'
        
        current_app.logger.info(f"REQUEST: {json.dumps(request_data)}")
        
        try:
            # Execute the function
            response = f(*args, **kwargs)
            
            # Calculate response time
            response_time = round((time.time() - start_time) * 1000, 2)  # in milliseconds
            
            # Log response
            response_data = {
                'request_id': request_id,
                'timestamp': datetime.utcnow().isoformat(),
                'status_code': getattr(response, 'status_code', 200),
                'response_time_ms': response_time,
                'content_type': getattr(response, 'content_type', None),
            }
            
            # Add response size if available
            if hasattr(response, 'content_length') and response.content_length:
                response_data['content_length'] = response.content_length
            
            current_app.logger.info(f"RESPONSE: {json.dumps(response_data)}")
            
            return response
            
        except Exception as e:
            # Log error
            response_time = round((time.time() - start_time) * 1000, 2)
            error_data = {
                'request_id': request_id,
                'timestamp': datetime.utcnow().isoformat(),
                'error': str(e),
                'error_type': type(e).__name__,
                'response_time_ms': response_time,
            }
            
            current_app.logger.error(f"ERROR: {json.dumps(error_data)}")
            raise
    
    return decorated_function

def _filter_sensitive_data(data, max_depth=5, current_depth=0):
    """Filter sensitive data from request/response bodies."""
    if current_depth >= max_depth:
        return '[MAX_DEPTH_REACHED]'
    
    if isinstance(data, dict):
        filtered = {}
        for key, value in data.items():
            key_lower = str(key).lower()
            if any(sensitive in key_lower for sensitive in [
                'password', 'token', 'secret', 'key', 'auth', 'credential',
                'ssn', 'social', 'credit', 'card', 'cvv', 'pin'
            ]):
                filtered[key] = '[REDACTED]'
            else:
                filtered[key] = _filter_sensitive_data(value, max_depth, current_depth + 1)
        return filtered
    
    elif isinstance(data, list):
        return [_filter_sensitive_data(item, max_depth, current_depth + 1) for item in data[:10]]  # Limit list size
    
    elif isinstance(data, str) and len(data) > 1000:
        return data[:1000] + '[TRUNCATED]'
    
    else:
        return data

def audit_logger(action, resource_type=None, resource_id=None, details=None):
    """Log audit events."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get user info
            user_id = None
            user_email = None
            try:
                from flask_jwt_extended import get_jwt_identity
                user_id = get_jwt_identity()
                if user_id:
                    from src.models.user import User
                    user = User.query.get(user_id)
                    if user:
                        user_email = user.email
            except:
                pass
            
            # Execute function
            result = f(*args, **kwargs)
            
            # Log audit event
            audit_data = {
                'timestamp': datetime.utcnow().isoformat(),
                'action': action,
                'user_id': user_id,
                'user_email': user_email,
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent'),
                'endpoint': request.endpoint,
                'method': request.method,
                'resource_type': resource_type,
                'resource_id': resource_id,
                'details': details or {},
                'request_id': getattr(g, 'request_id', None)
            }
            
            current_app.logger.info(f"AUDIT: {json.dumps(audit_data)}")
            
            return result
        
        return decorated_function
    return decorator

def performance_logger(threshold_ms=1000):
    """Log slow requests."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            start_time = time.time()
            
            result = f(*args, **kwargs)
            
            response_time = (time.time() - start_time) * 1000  # in milliseconds
            
            if response_time > threshold_ms:
                performance_data = {
                    'timestamp': datetime.utcnow().isoformat(),
                    'endpoint': request.endpoint,
                    'method': request.method,
                    'response_time_ms': round(response_time, 2),
                    'threshold_ms': threshold_ms,
                    'url': request.url,
                    'request_id': getattr(g, 'request_id', None)
                }
                
                current_app.logger.warning(f"SLOW_REQUEST: {json.dumps(performance_data)}")
            
            return result
        
        return decorated_function
    return decorator

def error_logger(f):
    """Log application errors with context."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            error_data = {
                'timestamp': datetime.utcnow().isoformat(),
                'error': str(e),
                'error_type': type(e).__name__,
                'endpoint': request.endpoint,
                'method': request.method,
                'url': request.url,
                'ip_address': request.remote_addr,
                'request_id': getattr(g, 'request_id', None),
                'args': str(args) if args else None,
                'kwargs': str(kwargs) if kwargs else None
            }
            
            # Add user context if available
            try:
                from flask_jwt_extended import get_jwt_identity
                user_id = get_jwt_identity()
                if user_id:
                    error_data['user_id'] = user_id
            except:
                pass
            
            current_app.logger.error(f"APPLICATION_ERROR: {json.dumps(error_data)}")
            raise
    
    return decorated_function

def database_logger(f):
    """Log database operations."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        start_time = time.time()
        
        try:
            result = f(*args, **kwargs)
            
            # Log successful database operation
            db_time = (time.time() - start_time) * 1000
            if db_time > 100:  # Log slow database operations
                db_data = {
                    'timestamp': datetime.utcnow().isoformat(),
                    'operation': f.__name__,
                    'execution_time_ms': round(db_time, 2),
                    'endpoint': request.endpoint,
                    'request_id': getattr(g, 'request_id', None)
                }
                
                current_app.logger.warning(f"SLOW_DB_OPERATION: {json.dumps(db_data)}")
            
            return result
            
        except Exception as e:
            # Log database error
            db_data = {
                'timestamp': datetime.utcnow().isoformat(),
                'operation': f.__name__,
                'error': str(e),
                'error_type': type(e).__name__,
                'endpoint': request.endpoint,
                'request_id': getattr(g, 'request_id', None)
            }
            
            current_app.logger.error(f"DB_ERROR: {json.dumps(db_data)}")
            raise
    
    return decorated_function

def security_logger(event_type, severity='INFO'):
    """Log security events."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            security_data = {
                'timestamp': datetime.utcnow().isoformat(),
                'event_type': event_type,
                'severity': severity,
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent'),
                'endpoint': request.endpoint,
                'method': request.method,
                'request_id': getattr(g, 'request_id', None)
            }
            
            # Add user context if available
            try:
                from flask_jwt_extended import get_jwt_identity
                user_id = get_jwt_identity()
                if user_id:
                    security_data['user_id'] = user_id
            except:
                pass
            
            # Execute function
            result = f(*args, **kwargs)
            
            # Log security event
            if severity == 'WARNING':
                current_app.logger.warning(f"SECURITY: {json.dumps(security_data)}")
            elif severity == 'ERROR':
                current_app.logger.error(f"SECURITY: {json.dumps(security_data)}")
            else:
                current_app.logger.info(f"SECURITY: {json.dumps(security_data)}")
            
            return result
        
        return decorated_function
    return decorator

