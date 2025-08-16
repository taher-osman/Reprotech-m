"""
Redis Caching Configuration for Reprotech Backend
Provides caching layer for improved performance and reduced database load
"""

import redis
from flask_caching import Cache
from flask import current_app
import json
import logging
from datetime import datetime, timedelta
from typing import Any, Optional, Dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ReprotechCache:
    """
    Advanced caching system for Reprotech backend
    Provides Redis-based caching with automatic expiration and performance monitoring
    """
    
    def __init__(self, app=None):
        self.cache = None
        self.redis_client = None
        self.performance_stats = {
            'hits': 0,
            'misses': 0,
            'total_requests': 0,
            'avg_response_time': 0
        }
        
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize caching with Flask app"""
        try:
            # Configure Flask-Caching with Redis
            app.config['CACHE_TYPE'] = 'redis'
            app.config['CACHE_REDIS_HOST'] = 'localhost'
            app.config['CACHE_REDIS_PORT'] = 6379
            app.config['CACHE_REDIS_DB'] = 0
            app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # 5 minutes default
            
            self.cache = Cache(app)
            
            # Direct Redis client for advanced operations
            self.redis_client = redis.Redis(
                host='localhost',
                port=6379,
                db=0,
                decode_responses=True
            )
            
            # Test connection
            self.redis_client.ping()
            logger.info("✅ Redis cache initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Redis cache: {e}")
            # Fallback to simple cache
            app.config['CACHE_TYPE'] = 'simple'
            self.cache = Cache(app)
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache with performance tracking"""
        start_time = datetime.now()
        
        try:
            value = self.cache.get(key)
            
            # Update performance stats
            self.performance_stats['total_requests'] += 1
            if value is not None:
                self.performance_stats['hits'] += 1
                logger.debug(f"Cache HIT for key: {key}")
            else:
                self.performance_stats['misses'] += 1
                logger.debug(f"Cache MISS for key: {key}")
            
            # Calculate response time
            response_time = (datetime.now() - start_time).total_seconds() * 1000
            self._update_avg_response_time(response_time)
            
            return value
            
        except Exception as e:
            logger.error(f"Cache GET error for key {key}: {e}")
            return None
    
    def set(self, key: str, value: Any, timeout: Optional[int] = None) -> bool:
        """Set value in cache with optional timeout"""
        try:
            success = self.cache.set(key, value, timeout=timeout)
            if success:
                logger.debug(f"Cache SET successful for key: {key}")
            return success
        except Exception as e:
            logger.error(f"Cache SET error for key {key}: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete value from cache"""
        try:
            success = self.cache.delete(key)
            if success:
                logger.debug(f"Cache DELETE successful for key: {key}")
            return success
        except Exception as e:
            logger.error(f"Cache DELETE error for key {key}: {e}")
            return False
    
    def clear_all(self) -> bool:
        """Clear all cache entries"""
        try:
            success = self.cache.clear()
            if success:
                logger.info("Cache cleared successfully")
            return success
        except Exception as e:
            logger.error(f"Cache CLEAR error: {e}")
            return False
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache performance statistics"""
        total_requests = self.performance_stats['total_requests']
        if total_requests > 0:
            hit_rate = (self.performance_stats['hits'] / total_requests) * 100
        else:
            hit_rate = 0
        
        return {
            'total_requests': total_requests,
            'cache_hits': self.performance_stats['hits'],
            'cache_misses': self.performance_stats['misses'],
            'hit_rate_percentage': round(hit_rate, 2),
            'avg_response_time_ms': round(self.performance_stats['avg_response_time'], 3),
            'redis_info': self._get_redis_info()
        }
    
    def _update_avg_response_time(self, response_time: float):
        """Update average response time"""
        current_avg = self.performance_stats['avg_response_time']
        total_requests = self.performance_stats['total_requests']
        
        if total_requests == 1:
            self.performance_stats['avg_response_time'] = response_time
        else:
            # Calculate running average
            new_avg = ((current_avg * (total_requests - 1)) + response_time) / total_requests
            self.performance_stats['avg_response_time'] = new_avg
    
    def _get_redis_info(self) -> Dict[str, Any]:
        """Get Redis server information"""
        try:
            if self.redis_client:
                info = self.redis_client.info()
                return {
                    'redis_version': info.get('redis_version', 'Unknown'),
                    'used_memory_human': info.get('used_memory_human', 'Unknown'),
                    'connected_clients': info.get('connected_clients', 0),
                    'total_commands_processed': info.get('total_commands_processed', 0)
                }
        except Exception as e:
            logger.error(f"Error getting Redis info: {e}")
        
        return {'status': 'Redis info unavailable'}

# Cache decorators for common use cases
def cache_animals_data(timeout=300):
    """Decorator for caching animals data"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            cache_key = f"animals_data_{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = reprotech_cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = f(*args, **kwargs)
            reprotech_cache.set(cache_key, result, timeout=timeout)
            return result
        
        return wrapper
    return decorator

def cache_analytics_data(timeout=60):
    """Decorator for caching analytics data (shorter timeout for real-time data)"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            cache_key = f"analytics_data_{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = reprotech_cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = f(*args, **kwargs)
            reprotech_cache.set(cache_key, result, timeout=timeout)
            return result
        
        return wrapper
    return decorator

# Global cache instance
reprotech_cache = ReprotechCache()

