"""
Caching utilities for improved performance.
"""

import json
import hashlib
from datetime import datetime, timedelta
from functools import wraps
from flask import current_app, request
import redis

class CacheManager:
    """Cache manager for handling different cache backends."""
    
    def __init__(self, app=None):
        self.app = app
        self.redis_client = None
        self.memory_cache = {}
        
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize cache with Flask app."""
        self.app = app
        
        # Try to connect to Redis if configured
        redis_url = app.config.get('RATELIMIT_STORAGE_URL', 'redis://localhost:6379')
        try:
            self.redis_client = redis.from_url(redis_url, decode_responses=True)
            self.redis_client.ping()  # Test connection
            app.logger.info("Redis cache connected successfully")
        except Exception as e:
            app.logger.warning(f"Redis not available, using memory cache: {str(e)}")
            self.redis_client = None
    
    def _generate_cache_key(self, prefix, *args, **kwargs):
        """Generate a cache key from arguments."""
        key_data = {
            'args': args,
            'kwargs': sorted(kwargs.items()) if kwargs else {}
        }
        key_string = json.dumps(key_data, sort_keys=True, default=str)
        key_hash = hashlib.md5(key_string.encode()).hexdigest()
        return f"{prefix}:{key_hash}"
    
    def get(self, key):
        """Get value from cache."""
        try:
            if self.redis_client:
                value = self.redis_client.get(key)
                if value:
                    return json.loads(value)
            else:
                # Memory cache with expiration check
                if key in self.memory_cache:
                    data, expires_at = self.memory_cache[key]
                    if datetime.utcnow() < expires_at:
                        return data
                    else:
                        del self.memory_cache[key]
            return None
        except Exception as e:
            current_app.logger.error(f"Cache get error: {str(e)}")
            return None
    
    def set(self, key, value, timeout=300):
        """Set value in cache with timeout in seconds."""
        try:
            if self.redis_client:
                self.redis_client.setex(key, timeout, json.dumps(value, default=str))
            else:
                # Memory cache
                expires_at = datetime.utcnow() + timedelta(seconds=timeout)
                self.memory_cache[key] = (value, expires_at)
                
                # Clean up expired entries periodically
                if len(self.memory_cache) > 1000:
                    self._cleanup_memory_cache()
        except Exception as e:
            current_app.logger.error(f"Cache set error: {str(e)}")
    
    def delete(self, key):
        """Delete value from cache."""
        try:
            if self.redis_client:
                self.redis_client.delete(key)
            else:
                self.memory_cache.pop(key, None)
        except Exception as e:
            current_app.logger.error(f"Cache delete error: {str(e)}")
    
    def clear(self, pattern=None):
        """Clear cache entries matching pattern."""
        try:
            if self.redis_client:
                if pattern:
                    keys = self.redis_client.keys(pattern)
                    if keys:
                        self.redis_client.delete(*keys)
                else:
                    self.redis_client.flushdb()
            else:
                if pattern:
                    # Simple pattern matching for memory cache
                    keys_to_delete = [k for k in self.memory_cache.keys() if pattern in k]
                    for key in keys_to_delete:
                        del self.memory_cache[key]
                else:
                    self.memory_cache.clear()
        except Exception as e:
            current_app.logger.error(f"Cache clear error: {str(e)}")
    
    def _cleanup_memory_cache(self):
        """Clean up expired entries from memory cache."""
        now = datetime.utcnow()
        expired_keys = [
            key for key, (_, expires_at) in self.memory_cache.items()
            if now >= expires_at
        ]
        for key in expired_keys:
            del self.memory_cache[key]

# Global cache instance
cache = CacheManager()

def cached(timeout=300, key_prefix=None):
    """
    Decorator to cache function results.
    
    Args:
        timeout: Cache timeout in seconds (default: 5 minutes)
        key_prefix: Custom prefix for cache key
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Generate cache key
            prefix = key_prefix or f"{f.__module__}.{f.__name__}"
            cache_key = cache._generate_cache_key(prefix, *args, **kwargs)
            
            # Try to get from cache
            cached_result = cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = f(*args, **kwargs)
            cache.set(cache_key, result, timeout)
            
            return result
        return decorated_function
    return decorator

def cache_response(timeout=300, vary_on=None):
    """
    Decorator to cache HTTP response based on request parameters.
    
    Args:
        timeout: Cache timeout in seconds
        vary_on: List of request parameters to include in cache key
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Build cache key from request
            key_parts = [f.__name__]
            
            if vary_on:
                for param in vary_on:
                    value = request.args.get(param) or request.json.get(param) if request.json else None
                    if value:
                        key_parts.append(f"{param}:{value}")
            else:
                # Include all query parameters
                key_parts.extend([f"{k}:{v}" for k, v in request.args.items()])
            
            cache_key = "response:" + ":".join(key_parts)
            
            # Try to get from cache
            cached_result = cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = f(*args, **kwargs)
            
            # Only cache successful responses
            if hasattr(result, 'status_code') and result.status_code == 200:
                cache.set(cache_key, result.get_json(), timeout)
            
            return result
        return decorated_function
    return decorator

def invalidate_cache(pattern):
    """Invalidate cache entries matching pattern."""
    cache.clear(pattern)

def warm_cache():
    """Warm up cache with frequently accessed data."""
    try:
        from src.models.animal import Animal
        from src.models.customer import Customer
        from src.models.laboratory import LabSample
        
        # Cache commonly accessed statistics
        total_animals = Animal.query.filter(Animal.deleted_at.is_(None)).count()
        cache.set("stats:total_animals", total_animals, 3600)  # 1 hour
        
        total_customers = Customer.query.count()
        cache.set("stats:total_customers", total_customers, 3600)
        
        total_samples = LabSample.query.count()
        cache.set("stats:total_samples", total_samples, 3600)
        
        current_app.logger.info("Cache warmed up successfully")
        
    except Exception as e:
        current_app.logger.error(f"Cache warm up error: {str(e)}")

