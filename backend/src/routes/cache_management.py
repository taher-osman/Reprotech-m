"""
Cache Management API Routes
Provides endpoints for cache monitoring, statistics, and management
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.cache import reprotech_cache
from src.utils.audit import AuditLogger
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Create blueprint
cache_bp = Blueprint('cache', __name__)

@cache_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_cache_stats():
    """
    Get comprehensive cache performance statistics
    
    Returns:
        JSON response with cache statistics including:
        - Hit/miss rates
        - Response times
        - Redis server info
        - Performance metrics
    """
    try:
        user_id = get_jwt_identity()
        
        # Get cache statistics
        stats = reprotech_cache.get_stats()
        
        # Add additional performance metrics
        performance_data = {
            'cache_efficiency': 'Excellent' if stats['hit_rate_percentage'] > 80 else 
                              'Good' if stats['hit_rate_percentage'] > 60 else 
                              'Needs Improvement',
            'response_performance': 'Excellent' if stats['avg_response_time_ms'] < 5 else
                                  'Good' if stats['avg_response_time_ms'] < 10 else
                                  'Needs Optimization',
            'recommendations': _get_performance_recommendations(stats)
        }
        
        # Log cache stats access
        AuditLogger.log_system_event(
            'CACHE_STATS_ACCESS',
            f'Cache statistics accessed by user {user_id}',
            user_id=user_id
        )
        
        return jsonify({
            'status': 'success',
            'data': {
                'statistics': stats,
                'performance': performance_data,
                'timestamp': AuditLogger._get_timestamp()
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting cache stats: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve cache statistics',
            'error': str(e)
        }), 500

@cache_bp.route('/clear', methods=['POST'])
@jwt_required()
def clear_cache():
    """
    Clear all cache entries
    
    Requires admin privileges for security
    """
    try:
        user_id = get_jwt_identity()
        
        # Clear all cache entries
        success = reprotech_cache.clear_all()
        
        if success:
            # Log cache clear action
            AuditLogger.log_system_event(
                'CACHE_CLEARED',
                f'All cache entries cleared by user {user_id}',
                user_id=user_id
            )
            
            return jsonify({
                'status': 'success',
                'message': 'Cache cleared successfully',
                'timestamp': AuditLogger._get_timestamp()
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to clear cache'
            }), 500
            
    except Exception as e:
        logger.error(f"Error clearing cache: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to clear cache',
            'error': str(e)
        }), 500

@cache_bp.route('/invalidate', methods=['POST'])
@jwt_required()
def invalidate_cache_key():
    """
    Invalidate specific cache key
    
    Request body:
        {
            "key": "cache_key_to_invalidate"
        }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'key' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Cache key is required'
            }), 400
        
        cache_key = data['key']
        
        # Delete specific cache key
        success = reprotech_cache.delete(cache_key)
        
        if success:
            # Log cache invalidation
            AuditLogger.log_system_event(
                'CACHE_KEY_INVALIDATED',
                f'Cache key "{cache_key}" invalidated by user {user_id}',
                user_id=user_id
            )
            
            return jsonify({
                'status': 'success',
                'message': f'Cache key "{cache_key}" invalidated successfully',
                'timestamp': AuditLogger._get_timestamp()
            }), 200
        else:
            return jsonify({
                'status': 'warning',
                'message': f'Cache key "{cache_key}" not found or already expired'
            }), 404
            
    except Exception as e:
        logger.error(f"Error invalidating cache key: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to invalidate cache key',
            'error': str(e)
        }), 500

@cache_bp.route('/health', methods=['GET'])
def cache_health():
    """
    Check cache system health
    
    Public endpoint for system monitoring
    """
    try:
        # Test cache connectivity
        test_key = 'health_check_test'
        test_value = 'cache_working'
        
        # Test set operation
        set_success = reprotech_cache.set(test_key, test_value, timeout=10)
        
        # Test get operation
        retrieved_value = reprotech_cache.get(test_key)
        
        # Test delete operation
        delete_success = reprotech_cache.delete(test_key)
        
        # Determine health status
        is_healthy = (set_success and 
                     retrieved_value == test_value and 
                     delete_success)
        
        health_status = 'healthy' if is_healthy else 'degraded'
        
        return jsonify({
            'status': health_status,
            'cache_operational': is_healthy,
            'redis_connected': reprotech_cache.redis_client is not None,
            'timestamp': AuditLogger._get_timestamp(),
            'tests': {
                'set_operation': set_success,
                'get_operation': retrieved_value == test_value,
                'delete_operation': delete_success
            }
        }), 200 if is_healthy else 503
        
    except Exception as e:
        logger.error(f"Cache health check failed: {e}")
        return jsonify({
            'status': 'unhealthy',
            'cache_operational': False,
            'error': str(e),
            'timestamp': AuditLogger._get_timestamp()
        }), 503

def _get_performance_recommendations(stats):
    """
    Generate performance recommendations based on cache statistics
    """
    recommendations = []
    
    hit_rate = stats['hit_rate_percentage']
    avg_response_time = stats['avg_response_time_ms']
    
    if hit_rate < 60:
        recommendations.append({
            'type': 'hit_rate',
            'message': 'Consider increasing cache timeout for frequently accessed data',
            'priority': 'high'
        })
    
    if avg_response_time > 10:
        recommendations.append({
            'type': 'response_time',
            'message': 'Cache response time is high, check Redis server performance',
            'priority': 'medium'
        })
    
    if stats['total_requests'] > 10000 and hit_rate > 90:
        recommendations.append({
            'type': 'optimization',
            'message': 'Excellent cache performance! Consider expanding caching to more endpoints',
            'priority': 'low'
        })
    
    if not recommendations:
        recommendations.append({
            'type': 'status',
            'message': 'Cache performance is optimal',
            'priority': 'info'
        })
    
    return recommendations

