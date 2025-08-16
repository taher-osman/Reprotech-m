from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy import CheckConstraint, Index
import uuid
from src.database import db

class AnalyticsMetric(db.Model):
    """Analytics metrics for dashboard and reporting."""
    __tablename__ = 'analytics_metrics'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    
    # Metric information
    metric_name = db.Column(db.String(255), nullable=False)
    metric_type = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    
    # Metric value
    value = db.Column(db.Numeric(15, 4))
    unit = db.Column(db.String(50))
    
    # Context and dimensions
    dimensions = db.Column(JSON, default={})
    filters = db.Column(JSON, default={})
    
    # Time period
    period_start = db.Column(db.DateTime(timezone=True))
    period_end = db.Column(db.DateTime(timezone=True))
    period_type = db.Column(db.String(20))  # daily, weekly, monthly, yearly
    
    # Calculation information
    calculation_method = db.Column(db.String(100))
    data_sources = db.Column(JSON, default=[])
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    last_calculated = db.Column(db.DateTime(timezone=True))
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Constraints
    __table_args__ = (
        CheckConstraint("metric_type IN ('COUNT', 'SUM', 'AVERAGE', 'PERCENTAGE', 'RATIO', 'RATE')", name='check_metric_type'),
        CheckConstraint("period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom')", name='check_period_type'),
        Index('idx_analytics_metrics_category', 'category'),
        Index('idx_analytics_metrics_period', 'period_start', 'period_end'),
    )
    
    def __repr__(self):
        return f'<AnalyticsMetric {self.metric_id}: {self.metric_name}>'
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'metric_id': self.metric_id,
            'metric_name': self.metric_name,
            'metric_type': self.metric_type,
            'category': self.category,
            'description': self.description,
            'value': float(self.value) if self.value else None,
            'unit': self.unit,
            'dimensions': self.dimensions,
            'filters': self.filters,
            'period_start': self.period_start.isoformat() if self.period_start else None,
            'period_end': self.period_end.isoformat() if self.period_end else None,
            'period_type': self.period_type,
            'calculation_method': self.calculation_method,
            'data_sources': self.data_sources,
            'is_active': self.is_active,
            'last_calculated': self.last_calculated.isoformat() if self.last_calculated else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class DashboardWidget(db.Model):
    """Dashboard widget configurations."""
    __tablename__ = 'dashboard_widgets'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    widget_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    
    # Widget information
    title = db.Column(db.String(255), nullable=False)
    widget_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    
    # Layout information
    dashboard_section = db.Column(db.String(100))
    position_x = db.Column(db.Integer, default=0)
    position_y = db.Column(db.Integer, default=0)
    width = db.Column(db.Integer, default=1)
    height = db.Column(db.Integer, default=1)
    
    # Configuration
    configuration = db.Column(JSON, default={})
    data_source = db.Column(db.String(255))
    refresh_interval = db.Column(db.Integer, default=300)  # seconds
    
    # Access control
    visibility = db.Column(db.String(50), default='PUBLIC')
    allowed_roles = db.Column(JSON, default=[])
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    last_updated = db.Column(db.DateTime(timezone=True))
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Constraints
    __table_args__ = (
        CheckConstraint("widget_type IN ('METRIC_CARD', 'CHART', 'TABLE', 'GAUGE', 'MAP', 'LIST')", name='check_widget_type'),
        CheckConstraint("visibility IN ('PUBLIC', 'PRIVATE', 'ROLE_BASED')", name='check_visibility'),
        Index('idx_dashboard_widgets_section', 'dashboard_section'),
    )
    
    def __repr__(self):
        return f'<DashboardWidget {self.widget_id}: {self.title}>'
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'widget_id': self.widget_id,
            'title': self.title,
            'widget_type': self.widget_type,
            'description': self.description,
            'dashboard_section': self.dashboard_section,
            'position_x': self.position_x,
            'position_y': self.position_y,
            'width': self.width,
            'height': self.height,
            'configuration': self.configuration,
            'data_source': self.data_source,
            'refresh_interval': self.refresh_interval,
            'visibility': self.visibility,
            'allowed_roles': self.allowed_roles,
            'is_active': self.is_active,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Report(db.Model):
    """Custom reports and analytics."""
    __tablename__ = 'reports'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    
    # Report information
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    report_type = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(100))
    
    # Report configuration
    parameters = db.Column(JSON, default={})
    filters = db.Column(JSON, default={})
    columns = db.Column(JSON, default=[])
    sorting = db.Column(JSON, default={})
    
    # Data source
    data_sources = db.Column(JSON, default=[])
    query_template = db.Column(db.Text)
    
    # Scheduling
    is_scheduled = db.Column(db.Boolean, default=False)
    schedule_frequency = db.Column(db.String(50))
    schedule_config = db.Column(JSON, default={})
    last_generated = db.Column(db.DateTime(timezone=True))
    next_generation = db.Column(db.DateTime(timezone=True))
    
    # Access control
    visibility = db.Column(db.String(50), default='PRIVATE')
    allowed_users = db.Column(JSON, default=[])
    allowed_roles = db.Column(JSON, default=[])
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    updated_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Relationships
    executions = db.relationship('ReportExecution', backref='report', cascade='all, delete-orphan')
    
    # Constraints
    __table_args__ = (
        CheckConstraint("report_type IN ('TABULAR', 'CHART', 'DASHBOARD', 'EXPORT')", name='check_report_type'),
        CheckConstraint("visibility IN ('PUBLIC', 'PRIVATE', 'SHARED')", name='check_report_visibility'),
        CheckConstraint("schedule_frequency IN ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY')", name='check_schedule_frequency'),
        Index('idx_reports_category', 'category'),
        Index('idx_reports_created_by', 'created_by'),
    )
    
    def __repr__(self):
        return f'<Report {self.report_id}: {self.title}>'
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'report_id': self.report_id,
            'title': self.title,
            'description': self.description,
            'report_type': self.report_type,
            'category': self.category,
            'parameters': self.parameters,
            'filters': self.filters,
            'columns': self.columns,
            'sorting': self.sorting,
            'data_sources': self.data_sources,
            'query_template': self.query_template,
            'is_scheduled': self.is_scheduled,
            'schedule_frequency': self.schedule_frequency,
            'schedule_config': self.schedule_config,
            'last_generated': self.last_generated.isoformat() if self.last_generated else None,
            'next_generation': self.next_generation.isoformat() if self.next_generation else None,
            'visibility': self.visibility,
            'allowed_users': self.allowed_users,
            'allowed_roles': self.allowed_roles,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class ReportExecution(db.Model):
    """Report execution history and results."""
    __tablename__ = 'report_executions'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    execution_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    report_id = db.Column(UUID(as_uuid=True), db.ForeignKey('reports.id', ondelete='CASCADE'), nullable=False)
    
    # Execution information
    status = db.Column(db.String(50), default='PENDING')
    started_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at = db.Column(db.DateTime(timezone=True))
    execution_time_seconds = db.Column(db.Integer)
    
    # Parameters used
    parameters_used = db.Column(JSON, default={})
    filters_used = db.Column(JSON, default={})
    
    # Results
    result_count = db.Column(db.Integer)
    result_data = db.Column(JSON, default={})
    output_file_path = db.Column(db.String(500))
    
    # Error information
    error_message = db.Column(db.Text)
    error_details = db.Column(JSON, default={})
    
    # Execution context
    executed_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    execution_type = db.Column(db.String(50), default='MANUAL')  # MANUAL, SCHEDULED, API
    
    # Constraints
    __table_args__ = (
        CheckConstraint("status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED')", name='check_execution_status'),
        CheckConstraint("execution_type IN ('MANUAL', 'SCHEDULED', 'API')", name='check_execution_type'),
        Index('idx_report_executions_report_status', 'report_id', 'status'),
        Index('idx_report_executions_started_at', 'started_at'),
    )
    
    def __repr__(self):
        return f'<ReportExecution {self.execution_id}>'
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'execution_id': self.execution_id,
            'report_id': str(self.report_id),
            'status': self.status,
            'started_at': self.started_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'execution_time_seconds': self.execution_time_seconds,
            'parameters_used': self.parameters_used,
            'filters_used': self.filters_used,
            'result_count': self.result_count,
            'result_data': self.result_data,
            'output_file_path': self.output_file_path,
            'error_message': self.error_message,
            'error_details': self.error_details,
            'executed_by': str(self.executed_by) if self.executed_by else None,
            'execution_type': self.execution_type
        }

