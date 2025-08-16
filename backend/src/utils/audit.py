"""
Audit logging system for tracking user actions and system events.
"""

import json
from datetime import datetime, timezone
from functools import wraps
from flask import current_app, request, g
from flask_jwt_extended import get_jwt_identity
from src.database import db

class AuditLog(db.Model):
    """Audit log model for tracking system events."""
    
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Event information
    event_type = db.Column(db.String(100), nullable=False, index=True)
    event_category = db.Column(db.String(50), nullable=False, index=True)
    event_description = db.Column(db.Text)
    
    # User information
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    user_email = db.Column(db.String(255))
    
    # Request information
    ip_address = db.Column(db.String(45))  # IPv6 compatible
    user_agent = db.Column(db.Text)
    request_method = db.Column(db.String(10))
    request_url = db.Column(db.Text)
    
    # Entity information
    entity_type = db.Column(db.String(50), index=True)
    entity_id = db.Column(db.String(50), index=True)
    
    # Data changes
    old_values = db.Column(db.JSON)
    new_values = db.Column(db.JSON)
    
    # Metadata
    audit_metadata = db.Column(db.JSON)
    
    # Status and result
    status = db.Column(db.String(20), default='SUCCESS')  # SUCCESS, FAILED, WARNING
    error_message = db.Column(db.Text)
    
    # Timestamp
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    
    def __repr__(self):
        return f'<AuditLog {self.event_type} by {self.user_email}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_type': self.event_type,
            'event_category': self.event_category,
            'event_description': self.event_description,
            'user_id': self.user_id,
            'user_email': self.user_email,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'request_method': self.request_method,
            'request_url': self.request_url,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'old_values': self.old_values,
            'new_values': self.new_values,
            'metadata': self.audit_metadata,
            'status': self.status,
            'error_message': self.error_message,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AuditLogger:
    """Audit logger for tracking system events."""
    
    @staticmethod
    def log_event(event_type, event_category, description=None, entity_type=None, 
                  entity_id=None, old_values=None, new_values=None, metadata=None,
                  status='SUCCESS', error_message=None):
        """Log an audit event."""
        try:
            # Get user information
            user_id = None
            user_email = None
            
            try:
                user_id = get_jwt_identity()
                if user_id:
                    from src.models.user import User
                    user = User.query.get(user_id)
                    if user:
                        user_email = user.email
            except:
                pass  # No JWT context or user not found
            
            # Get request information
            ip_address = None
            user_agent = None
            request_method = None
            request_url = None
            
            if request:
                ip_address = request.remote_addr
                user_agent = request.headers.get('User-Agent', '')[:500]  # Limit length
                request_method = request.method
                request_url = request.url[:500]  # Limit length
            
            # Create audit log entry
            audit_log = AuditLog(
                event_type=event_type,
                event_category=event_category,
                event_description=description,
                user_id=user_id,
                user_email=user_email,
                ip_address=ip_address,
                user_agent=user_agent,
                request_method=request_method,
                request_url=request_url,
                entity_type=entity_type,
                entity_id=str(entity_id) if entity_id else None,
                old_values=old_values,
                new_values=new_values,
                audit_metadata=metadata,
                status=status,
                error_message=error_message
            )
            
            db.session.add(audit_log)
            db.session.commit()
            
            # Also log to application logger for immediate visibility
            log_level = 'INFO' if status == 'SUCCESS' else 'WARNING' if status == 'WARNING' else 'ERROR'
            log_message = f"AUDIT [{event_category}] {event_type}: {description or 'No description'}"
            if user_email:
                log_message += f" (User: {user_email})"
            if entity_type and entity_id:
                log_message += f" (Entity: {entity_type}#{entity_id})"
            
            getattr(current_app.logger, log_level.lower())(log_message)
            
        except Exception as e:
            # Don't let audit logging break the main application
            current_app.logger.error(f"Audit logging failed: {str(e)}")
    
    @staticmethod
    def log_authentication(event_type, user_email=None, success=True, error_message=None):
        """Log authentication events."""
        AuditLogger.log_event(
            event_type=event_type,
            event_category='AUTHENTICATION',
            description=f"User {event_type.lower()}",
            metadata={'user_email': user_email} if user_email else None,
            status='SUCCESS' if success else 'FAILED',
            error_message=error_message
        )
    
    @staticmethod
    def log_data_access(entity_type, entity_id, action='READ', description=None):
        """Log data access events."""
        AuditLogger.log_event(
            event_type=f'{entity_type.upper()}_{action}',
            event_category='DATA_ACCESS',
            description=description or f"{action} {entity_type}",
            entity_type=entity_type,
            entity_id=entity_id
        )
    
    @staticmethod
    def log_data_modification(entity_type, entity_id, action, old_values=None, 
                            new_values=None, description=None):
        """Log data modification events."""
        AuditLogger.log_event(
            event_type=f'{entity_type.upper()}_{action}',
            event_category='DATA_MODIFICATION',
            description=description or f"{action} {entity_type}",
            entity_type=entity_type,
            entity_id=entity_id,
            old_values=old_values,
            new_values=new_values
        )
    
    @staticmethod
    def log_system_event(event_type, description, metadata=None, status='SUCCESS'):
        """Log system events."""
        AuditLogger.log_event(
            event_type=event_type,
            event_category='SYSTEM',
            description=description,
            metadata=metadata,
            status=status
        )
    
    @staticmethod
    def log_security_event(event_type, description, metadata=None, status='WARNING'):
        """Log security events."""
        AuditLogger.log_event(
            event_type=event_type,
            event_category='SECURITY',
            description=description,
            metadata=metadata,
            status=status
        )

def audit_action(event_type, entity_type=None, description=None):
    """
    Decorator to automatically audit function calls.
    
    Args:
        event_type: Type of event (e.g., 'CREATE_ANIMAL', 'UPDATE_CUSTOMER')
        entity_type: Type of entity being acted upon
        description: Human-readable description of the action
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            start_time = datetime.now(timezone.utc)
            error_occurred = False
            error_message = None
            result = None
            
            try:
                result = f(*args, **kwargs)
                return result
            except Exception as e:
                error_occurred = True
                error_message = str(e)
                raise
            finally:
                # Log the audit event
                end_time = datetime.now(timezone.utc)
                execution_time = (end_time - start_time).total_seconds()
                
                # Try to extract entity ID from result or arguments
                entity_id = None
                if result and hasattr(result, 'get_json'):
                    response_data = result.get_json()
                    if isinstance(response_data, dict):
                        entity_id = response_data.get('id') or response_data.get(f'{entity_type}_id')
                
                metadata = {
                    'execution_time_seconds': execution_time,
                    'function_name': f.__name__,
                    'module': f.__module__
                }
                
                AuditLogger.log_event(
                    event_type=event_type,
                    event_category='API_CALL',
                    description=description or f"API call: {f.__name__}",
                    entity_type=entity_type,
                    entity_id=entity_id,
                    audit_metadata=metadata,
                    status='FAILED' if error_occurred else 'SUCCESS',
                    error_message=error_message
                )
        
        return decorated_function
    return decorator

def get_audit_logs(filters=None, page=1, per_page=50):
    """
    Get audit logs with optional filtering.
    
    Args:
        filters: Dictionary of filters (event_type, event_category, user_id, etc.)
        page: Page number
        per_page: Records per page
    """
    query = AuditLog.query
    
    if filters:
        if filters.get('event_type'):
            query = query.filter(AuditLog.event_type == filters['event_type'])
        
        if filters.get('event_category'):
            query = query.filter(AuditLog.event_category == filters['event_category'])
        
        if filters.get('user_id'):
            query = query.filter(AuditLog.user_id == filters['user_id'])
        
        if filters.get('user_email'):
            query = query.filter(AuditLog.user_email.ilike(f"%{filters['user_email']}%"))
        
        if filters.get('entity_type'):
            query = query.filter(AuditLog.entity_type == filters['entity_type'])
        
        if filters.get('entity_id'):
            query = query.filter(AuditLog.entity_id == str(filters['entity_id']))
        
        if filters.get('status'):
            query = query.filter(AuditLog.status == filters['status'])
        
        if filters.get('date_from'):
            query = query.filter(AuditLog.created_at >= filters['date_from'])
        
        if filters.get('date_to'):
            query = query.filter(AuditLog.created_at <= filters['date_to'])
    
    # Order by most recent first
    query = query.order_by(AuditLog.created_at.desc())
    
    return query.paginate(page=page, per_page=per_page, error_out=False)

def cleanup_old_audit_logs(days_to_keep=90):
    """Clean up old audit logs to prevent database bloat."""
    try:
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days_to_keep)
        
        deleted_count = AuditLog.query.filter(
            AuditLog.created_at < cutoff_date
        ).delete()
        
        db.session.commit()
        
        current_app.logger.info(f"Cleaned up {deleted_count} old audit log entries")
        return deleted_count
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Audit log cleanup failed: {str(e)}")
        return 0

