
"""
System management routes for monitoring and administration.
"""

from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.database import db
from src.utils.audit import AuditLogger, get_audit_logs, cleanup_old_audit_logs
from src.utils.tasks import task_manager, cleanup_old_tasks, BackgroundTask, TaskStatus
from src.utils.cache import cache, warm_cache
from src.utils.email import send_system_alert, get_admin_emails
from src.middleware.auth import admin_required

system_bp = Blueprint('system', __name__)

# Background Tasks Management
@system_bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_background_tasks():
    """Get background tasks for current user or all tasks for admin."""
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status = request.args.get('status')
        
        # Build query
        query = BackgroundTask.query
        
        # Check if user is admin (simplified check)
        from src.models.user import User
        user = User.query.get(user_id)
        is_admin = user and user.role == 'admin'
        
        if not is_admin:
            query = query.filter(BackgroundTask.user_id == user_id)
        
        if status:
            query = query.filter(BackgroundTask.status == TaskStatus(status))
        
        # Order by most recent first
        query = query.order_by(BackgroundTask.created_at.desc())
        
        tasks_paginated = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'tasks': [task.to_dict() for task in tasks_paginated.items],
            'pagination': {
                'page': tasks_paginated.page,
                'per_page': tasks_paginated.per_page,
                'total': tasks_paginated.total,
                'pages': tasks_paginated.pages,
                'has_next': tasks_paginated.has_next,
                'has_prev': tasks_paginated.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get background tasks error: {str(e)}")
        return jsonify({'error': 'Failed to get background tasks'}), 500

@system_bp.route('/tasks/<task_id>', methods=['GET'])
@jwt_required()
def get_task_status(task_id):
    """Get status of a specific background task."""
    try:
        user_id = get_jwt_identity()
        
        task = BackgroundTask.query.filter_by(task_id=task_id).first()
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        
        # Check if user owns the task or is admin
        from src.models.user import User
        user = User.query.get(user_id)
        is_admin = user and user.role == 'admin'
        
        if not is_admin and task.user_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify(task.to_dict()), 200
        
    except Exception as e:
        current_app.logger.error(f"Get task status error: {str(e)}")
        return jsonify({'error': 'Failed to get task status'}), 500

@system_bp.route('/tasks/<task_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_task(task_id):
    """Cancel a pending background task."""
    try:
        user_id = get_jwt_identity()
        
        task = BackgroundTask.query.filter_by(task_id=task_id).first()
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        
        # Check if user owns the task or is admin
        from src.models.user import User
        user = User.query.get(user_id)
        is_admin = user and user.role == 'admin'
        
        if not is_admin and task.user_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        if task_manager.cancel_task(task_id):
            AuditLogger.log_system_event(
                'TASK_CANCELLED',
                f'Background task {task_id} cancelled by user',
                {'task_id': task_id, 'task_name': task.task_name}
            )
            return jsonify({'message': 'Task cancelled successfully'}), 200
        else:
            return jsonify({'error': 'Task cannot be cancelled'}), 400
        
    except Exception as e:
        current_app.logger.error(f"Cancel task error: {str(e)}")
        return jsonify({'error': 'Failed to cancel task'}), 500

# Audit Logs Management
@system_bp.route('/audit-logs', methods=['GET'])
@jwt_required()
@admin_required
def get_audit_logs_endpoint():
    """Get audit logs (admin only)."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 50, type=int), 200)
        
        # Build filters
        filters = {}
        if request.args.get('event_type'):
            filters['event_type'] = request.args.get('event_type')
        if request.args.get('event_category'):
            filters['event_category'] = request.args.get('event_category')
        if request.args.get('user_email'):
            filters['user_email'] = request.args.get('user_email')
        if request.args.get('entity_type'):
            filters['entity_type'] = request.args.get('entity_type')
        if request.args.get('status'):
            filters['status'] = request.args.get('status')
        if request.args.get('date_from'):
            filters['date_from'] = datetime.fromisoformat(request.args.get('date_from'))
        if request.args.get('date_to'):
            filters['date_to'] = datetime.fromisoformat(request.args.get('date_to'))
        
        logs_paginated = get_audit_logs(filters, page, per_page)
        
        return jsonify({
            'logs': [log.to_dict() for log in logs_paginated.items],
            'pagination': {
                'page': logs_paginated.page,
                'per_page': logs_paginated.per_page,
                'total': logs_paginated.total,
                'pages': logs_paginated.pages,
                'has_next': logs_paginated.has_next,
                'has_prev': logs_paginated.has_prev
            },
            'filters': filters
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get audit logs error: {str(e)}")
        return jsonify({'error': 'Failed to get audit logs'}), 500

# Cache Management
@system_bp.route('/cache/clear', methods=['POST'])
@jwt_required()
@admin_required
def clear_cache():
    """Clear application cache (admin only)."""
    try:
        data = request.get_json() or {}
        pattern = data.get('pattern')
        
        cache.clear(pattern)
        
        AuditLogger.log_system_event(
            'CACHE_CLEARED',
            f'Application cache cleared with pattern: {pattern or "all"}',
            {'pattern': pattern}
        )
        
        return jsonify({'message': 'Cache cleared successfully'}), 200
        
    except Exception as e:
        current_app.logger.error(f"Clear cache error: {str(e)}")
        return jsonify({'error': 'Failed to clear cache'}), 500

@system_bp.route('/cache/warm', methods=['POST'])
@jwt_required()
@admin_required
def warm_cache_endpoint():
    """Warm up application cache (admin only)."""
    try:
        warm_cache()
        
        AuditLogger.log_system_event(
            'CACHE_WARMED',
            'Application cache warmed up successfully'
        )
        
        return jsonify({'message': 'Cache warmed up successfully'}), 200
        
    except Exception as e:
        current_app.logger.error(f"Warm cache error: {str(e)}")
        return jsonify({'error': 'Failed to warm cache'}), 500

# System Monitoring
@system_bp.route('/health/detailed', methods=['GET'])
@jwt_required()
@admin_required
def detailed_health_check():
    """Detailed health check with system metrics (admin only)."""
    try:
        import psutil
        from src.models.animal import Animal
        from src.models.customer import Customer
        from src.models.user import User
        
        # System metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Database metrics
        total_animals = Animal.query.filter(Animal.deleted_at.is_(None)).count()
        total_customers = Customer.query.count()
        total_users = User.query.filter_by(is_active=True).count()
        
        # Background task metrics
        pending_tasks = BackgroundTask.query.filter_by(status=TaskStatus.PENDING).count()
        running_tasks = BackgroundTask.query.filter_by(status=TaskStatus.RUNNING).count()
        
        health_data = {
            'status': 'healthy',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'system': {
                'cpu_percent': cpu_percent,
                'memory_percent': memory.percent,
                'memory_available_gb': round(memory.available / (1024**3), 2),
                'disk_percent': round((disk.used / disk.total) * 100, 2),
                'disk_free_gb': round(disk.free / (1024**3), 2)
            },
            'database': {
                'total_animals': total_animals,
                'total_customers': total_customers,
                'total_users': total_users
            },
            'background_tasks': {
                'pending': pending_tasks,
                'running': running_tasks
            }
        }
        
        # Check for issues
        issues = []
        if cpu_percent > 80:
            issues.append('High CPU usage')
        if memory.percent > 85:
            issues.append('High memory usage')
        if (disk.used / disk.total) * 100 > 90:
            issues.append('Low disk space')
        if running_tasks > 10:
            issues.append('Many running background tasks')
        
        if issues:
            health_data['status'] = 'warning'
            health_data['issues'] = issues
        
        return jsonify(health_data), 200
        
    except Exception as e:
        current_app.logger.error(f"Detailed health check error: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': 'Health check failed',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

# System Maintenance
@system_bp.route('/maintenance/cleanup', methods=['POST'])
@jwt_required()
@admin_required
def system_cleanup():
    """Perform system cleanup tasks (admin only)."""
    try:
        data = request.get_json() or {}
        
        results = {}
        
        # Clean up old audit logs
        if data.get('cleanup_audit_logs', True):
            days_to_keep = data.get('audit_logs_days', 90)
            deleted_logs = cleanup_old_audit_logs(days_to_keep)
            results['audit_logs_cleaned'] = deleted_logs
        
        # Clean up old background tasks
        if data.get('cleanup_tasks', True):
            days_to_keep = data.get('tasks_days', 30)
            deleted_tasks = cleanup_old_tasks(days_to_keep)
            results['tasks_cleaned'] = deleted_tasks
        
        # Clear cache
        if data.get('clear_cache', False):
            cache.clear()
            results['cache_cleared'] = True
        
        AuditLogger.log_system_event(
            'SYSTEM_CLEANUP',
            'System cleanup completed',
            results
        )
        
        return jsonify({
            'message': 'System cleanup completed',
            'results': results
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"System cleanup error: {str(e)}")
        return jsonify({'error': 'System cleanup failed'}), 500

# System Alerts
@system_bp.route('/alerts/test', methods=['POST'])
@jwt_required()
@admin_required
def test_system_alert():
    """Send test system alert (admin only)."""
    try:
        data = request.get_json() or {}
        
        alert_type = data.get('alert_type', 'TEST_ALERT')
        severity = data.get('severity', 'LOW')
        description = data.get('description', 'This is a test system alert')
        
        admin_emails = get_admin_emails()
        if not admin_emails:
            return jsonify({'error': 'No admin emails configured'}), 400
        
        send_system_alert(admin_emails, alert_type, severity, description)
        
        AuditLogger.log_system_event(
            'TEST_ALERT_SENT',
            f'Test system alert sent to {len(admin_emails)} administrators',
            {'alert_type': alert_type, 'severity': severity, 'recipients': admin_emails}
        )
        
        return jsonify({
            'message': f'Test alert sent to {len(admin_emails)} administrators',
            'recipients': admin_emails
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Test system alert error: {str(e)}")
        return jsonify({'error': 'Failed to send test alert'}), 500

