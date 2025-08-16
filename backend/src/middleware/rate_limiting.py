import time
from functools import wraps
from flask import request, jsonify, current_app, g
from collections import defaultdict
from datetime import datetime, timedelta

# In-memory storage for rate limiting (use Redis in production)
rate_limit_storage = defaultdict(list)

class RateLimiter:
    """Rate limiter class for managing API request limits."""
    
    def __init__(self, max_requests=100, window_seconds=3600, storage=None):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.storage = storage or rate_limit_storage
    
    def is_allowed(self, key):
        """Check if request is allowed based on rate limit."""
        now = time.time()
        window_start = now - self.window_seconds
        
        # Clean old entries
        self.storage[key] = [timestamp for timestamp in self.storage[key] if timestamp > window_start]
        
        # Check if limit exceeded
        if len(self.storage[key]) >= self.max_requests:
            return False, self.get_reset_time(key)
        
        # Add current request
        self.storage[key].append(now)
        return True, self.get_reset_time(key)
    
    def get_reset_time(self, key):
        """Get the time when rate limit resets."""
        if not self.storage[key]:
            return int(time.time() + self.window_seconds)
        
        oldest_request = min(self.storage[key])
        return int(oldest_request + self.window_seconds)
    
    def get_remaining_requests(self, key):
        """Get remaining requests in current window."""
        now = time.time()
        window_start = now - self.window_seconds
        
        # Clean old entries
        self.storage[key] = [timestamp for timestamp in self.storage[key] if timestamp > window_start]
        
        return max(0, self.max_requests - len(self.storage[key]))

def rate_limit(max_requests=100, window_seconds=3600, per='ip', key_func=None):
    """
    Rate limiting decorator.
    
    Args:
        max_requests: Maximum number of requests allowed
        window_seconds: Time window in seconds
        per: Rate limit per 'ip', 'user', or 'endpoint'
        key_func: Custom function to generate rate limit key
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Generate rate limit key
                if key_func:
                    key = key_func()
                elif per == 'ip':
                    key = f"ip:{request.remote_addr}"
                elif per == 'user':
                    from flask_jwt_extended import get_jwt_identity
                    try:
                        user_id = get_jwt_identity()
                        key = f"user:{user_id}" if user_id else f"ip:{request.remote_addr}"
                    except:
                        key = f"ip:{request.remote_addr}"
                elif per == 'endpoint':
                    key = f"endpoint:{request.endpoint}:{request.remote_addr}"
                else:
                    key = f"global:{request.remote_addr}"
                
                # Create rate limiter
                limiter = RateLimiter(max_requests, window_seconds)
                
                # Check rate limit
                allowed, reset_time = limiter.is_allowed(key)
                
                if not allowed:
                    response = jsonify({
                        'error': 'Rate limit exceeded',
                        'message': f'Maximum {max_requests} requests per {window_seconds} seconds',
                        'retry_after': reset_time - int(time.time())
                    })
                    response.status_code = 429
                    response.headers['X-RateLimit-Limit'] = str(max_requests)
                    response.headers['X-RateLimit-Remaining'] = '0'
                    response.headers['X-RateLimit-Reset'] = str(reset_time)
                    response.headers['Retry-After'] = str(reset_time - int(time.time()))
                    return response
                
                # Execute the function
                result = f(*args, **kwargs)
                
                # Add rate limit headers to response
                if hasattr(result, 'headers'):
                    remaining = limiter.get_remaining_requests(key)
                    result.headers['X-RateLimit-Limit'] = str(max_requests)
                    result.headers['X-RateLimit-Remaining'] = str(remaining)
                    result.headers['X-RateLimit-Reset'] = str(reset_time)
                
                return result
                
            except Exception as e:
                current_app.logger.error(f"Rate limiting error: {str(e)}")
                # If rate limiting fails, allow the request to proceed
                return f(*args, **kwargs)
        
        return decorated_function
    return decorator

def strict_rate_limit(max_requests=10, window_seconds=60):
    """Strict rate limiting for sensitive endpoints."""
    return rate_limit(max_requests, window_seconds, per='ip')

def user_rate_limit(max_requests=1000, window_seconds=3600):
    """Rate limiting per authenticated user."""
    return rate_limit(max_requests, window_seconds, per='user')

def endpoint_rate_limit(max_requests=100, window_seconds=60):
    """Rate limiting per endpoint per IP."""
    return rate_limit(max_requests, window_seconds, per='endpoint')

def login_rate_limit(max_requests=5, window_seconds=300):
    """Rate limiting for login attempts."""
    def key_func():
        data = request.get_json() or {}
        email = data.get('email', 'unknown')
        return f"login:{email}:{request.remote_addr}"
    
    return rate_limit(max_requests, window_seconds, key_func=key_func)

def api_key_rate_limit(max_requests=10000, window_seconds=3600):
    """Rate limiting for API key usage."""
    def key_func():
        api_key = request.headers.get('X-API-Key', 'unknown')
        return f"api_key:{api_key}"
    
    return rate_limit(max_requests, window_seconds, key_func=key_func)

class RateLimitExceeded(Exception):
    """Exception raised when rate limit is exceeded."""
    
    def __init__(self, message, retry_after=None):
        self.message = message
        self.retry_after = retry_after
        super().__init__(self.message)

def get_rate_limit_status(key_pattern=None):
    """Get current rate limit status for debugging."""
    if not key_pattern:
        return dict(rate_limit_storage)
    
    filtered_storage = {}
    for key, timestamps in rate_limit_storage.items():
        if key_pattern in key:
            filtered_storage[key] = {
                'requests': len(timestamps),
                'oldest_request': min(timestamps) if timestamps else None,
                'newest_request': max(timestamps) if timestamps else None
            }
    
    return filtered_storage

def clear_rate_limit_storage():
    """Clear rate limit storage (for testing)."""
    rate_limit_storage.clear()

def cleanup_expired_entries():
    """Clean up expired rate limit entries."""
    now = time.time()
    keys_to_remove = []
    
    for key, timestamps in rate_limit_storage.items():
        # Remove timestamps older than 24 hours
        rate_limit_storage[key] = [ts for ts in timestamps if now - ts < 86400]
        
        # Remove empty entries
        if not rate_limit_storage[key]:
            keys_to_remove.append(key)
    
    for key in keys_to_remove:
        del rate_limit_storage[key]

