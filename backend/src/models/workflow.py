from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy import CheckConstraint, Index
import uuid
from src.database import db

class Workflow(db.Model):
    """Workflow definition and management."""
    __tablename__ = 'workflows'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    
    # Workflow information
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100), nullable=False)
    version = db.Column(db.String(20), default='1.0')
    
    # Workflow definition
    steps = db.Column(JSON, nullable=False)  # Array of workflow steps
    transitions = db.Column(JSON, default={})  # Step transitions and conditions
    
    # Configuration
    is_template = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    auto_start = db.Column(db.Boolean, default=False)
    
    # Triggers and conditions
    trigger_conditions = db.Column(JSON, default={})
    input_parameters = db.Column(JSON, default={})
    output_parameters = db.Column(JSON, default={})
    
    # Timing
    estimated_duration_minutes = db.Column(db.Integer)
    max_duration_minutes = db.Column(db.Integer)
    
    # Access control
    allowed_roles = db.Column(JSON, default=[])
    allowed_users = db.Column(JSON, default=[])
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    updated_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Relationships
    instances = db.relationship('WorkflowInstance', backref='workflow', cascade='all, delete-orphan')
    
    # Constraints
    __table_args__ = (
        CheckConstraint("category IN ('BREEDING', 'LABORATORY', 'CLINICAL', 'GENOMIC', 'ADMINISTRATIVE')", name='check_workflow_category'),
        Index('idx_workflows_category', 'category'),
        Index('idx_workflows_active', 'is_active'),
    )
    
    def __repr__(self):
        return f'<Workflow {self.workflow_id}: {self.name}>'
    
    @property
    def step_count(self):
        """Get number of steps in workflow."""
        return len(self.steps) if self.steps else 0
    
    @property
    def active_instances_count(self):
        """Get count of active workflow instances."""
        return sum(1 for instance in self.instances if instance.status in ['RUNNING', 'PAUSED', 'WAITING'])
    
    def to_dict(self, include_instances=False):
        """Convert to dictionary."""
        data = {
            'id': str(self.id),
            'workflow_id': self.workflow_id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'version': self.version,
            'steps': self.steps,
            'transitions': self.transitions,
            'is_template': self.is_template,
            'is_active': self.is_active,
            'auto_start': self.auto_start,
            'trigger_conditions': self.trigger_conditions,
            'input_parameters': self.input_parameters,
            'output_parameters': self.output_parameters,
            'estimated_duration_minutes': self.estimated_duration_minutes,
            'max_duration_minutes': self.max_duration_minutes,
            'allowed_roles': self.allowed_roles,
            'allowed_users': self.allowed_users,
            'step_count': self.step_count,
            'active_instances_count': self.active_instances_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_instances:
            data['instances'] = [instance.to_dict() for instance in self.instances]
            
        return data

class WorkflowInstance(db.Model):
    """Workflow instance execution."""
    __tablename__ = 'workflow_instances'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instance_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    workflow_id = db.Column(UUID(as_uuid=True), db.ForeignKey('workflows.id', ondelete='CASCADE'), nullable=False)
    
    # Instance information
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    
    # Context
    context_type = db.Column(db.String(50))  # ANIMAL, SAMPLE, CUSTOMER, etc.
    context_id = db.Column(UUID(as_uuid=True))  # ID of the related entity
    
    # Status and progress
    status = db.Column(db.String(50), default='PENDING')
    current_step = db.Column(db.String(255))
    current_step_index = db.Column(db.Integer, default=0)
    progress_percentage = db.Column(db.Integer, default=0)
    
    # Timing
    started_at = db.Column(db.DateTime(timezone=True))
    completed_at = db.Column(db.DateTime(timezone=True))
    paused_at = db.Column(db.DateTime(timezone=True))
    due_date = db.Column(db.DateTime(timezone=True))
    
    # Data
    input_data = db.Column(JSON, default={})
    output_data = db.Column(JSON, default={})
    step_data = db.Column(JSON, default={})  # Data for each step
    
    # Assignment
    assigned_to = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    assigned_at = db.Column(db.DateTime(timezone=True))
    
    # Error handling
    error_message = db.Column(db.Text)
    error_step = db.Column(db.String(255))
    retry_count = db.Column(db.Integer, default=0)
    
    # Priority
    priority = db.Column(db.String(20), default='NORMAL')
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    updated_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Relationships
    step_executions = db.relationship('WorkflowStepExecution', backref='instance', cascade='all, delete-orphan')
    
    # Constraints
    __table_args__ = (
        CheckConstraint("status IN ('PENDING', 'RUNNING', 'PAUSED', 'COMPLETED', 'FAILED', 'CANCELLED', 'WAITING')", name='check_instance_status'),
        CheckConstraint("priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')", name='check_instance_priority'),
        CheckConstraint("progress_percentage >= 0 AND progress_percentage <= 100", name='check_progress_percentage'),
        Index('idx_workflow_instances_status', 'status'),
        Index('idx_workflow_instances_assigned', 'assigned_to'),
        Index('idx_workflow_instances_context', 'context_type', 'context_id'),
    )
    
    def __repr__(self):
        return f'<WorkflowInstance {self.instance_id}>'
    
    @property
    def duration_minutes(self):
        """Calculate duration in minutes."""
        if self.started_at:
            end_time = self.completed_at or datetime.now(timezone.utc)
            return int((end_time - self.started_at).total_seconds() / 60)
        return None
    
    @property
    def is_overdue(self):
        """Check if instance is overdue."""
        if self.due_date and self.status not in ['COMPLETED', 'CANCELLED']:
            return datetime.now(timezone.utc) > self.due_date
        return False
    
    def start_instance(self, user_id):
        """Start workflow instance execution."""
        if self.status == 'PENDING':
            self.status = 'RUNNING'
            self.started_at = datetime.now(timezone.utc)
            self.updated_by = user_id
            self.progress_percentage = 1
    
    def complete_instance(self, user_id, output_data=None):
        """Complete workflow instance."""
        if self.status in ['RUNNING', 'PAUSED']:
            self.status = 'COMPLETED'
            self.completed_at = datetime.now(timezone.utc)
            self.progress_percentage = 100
            self.updated_by = user_id
            if output_data:
                self.output_data = output_data
    
    def pause_instance(self, user_id, reason=None):
        """Pause workflow instance."""
        if self.status == 'RUNNING':
            self.status = 'PAUSED'
            self.paused_at = datetime.now(timezone.utc)
            self.updated_by = user_id
            if reason:
                self.error_message = reason
    
    def resume_instance(self, user_id):
        """Resume paused workflow instance."""
        if self.status == 'PAUSED':
            self.status = 'RUNNING'
            self.paused_at = None
            self.updated_by = user_id
    
    def to_dict(self, include_steps=False):
        """Convert to dictionary."""
        data = {
            'id': str(self.id),
            'instance_id': self.instance_id,
            'workflow_id': str(self.workflow_id),
            'name': self.name,
            'description': self.description,
            'context_type': self.context_type,
            'context_id': str(self.context_id) if self.context_id else None,
            'status': self.status,
            'current_step': self.current_step,
            'current_step_index': self.current_step_index,
            'progress_percentage': self.progress_percentage,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'paused_at': self.paused_at.isoformat() if self.paused_at else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'input_data': self.input_data,
            'output_data': self.output_data,
            'step_data': self.step_data,
            'assigned_to': str(self.assigned_to) if self.assigned_to else None,
            'assigned_at': self.assigned_at.isoformat() if self.assigned_at else None,
            'error_message': self.error_message,
            'error_step': self.error_step,
            'retry_count': self.retry_count,
            'priority': self.priority,
            'duration_minutes': self.duration_minutes,
            'is_overdue': self.is_overdue,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_steps:
            data['step_executions'] = [step.to_dict() for step in self.step_executions]
            
        if self.workflow:
            data['workflow'] = {
                'workflow_id': self.workflow.workflow_id,
                'name': self.workflow.name,
                'category': self.workflow.category
            }
            
        return data

class WorkflowStepExecution(db.Model):
    """Individual workflow step execution tracking."""
    __tablename__ = 'workflow_step_executions'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instance_id = db.Column(UUID(as_uuid=True), db.ForeignKey('workflow_instances.id', ondelete='CASCADE'), nullable=False)
    
    # Step information
    step_name = db.Column(db.String(255), nullable=False)
    step_index = db.Column(db.Integer, nullable=False)
    step_type = db.Column(db.String(50), nullable=False)
    
    # Status and timing
    status = db.Column(db.String(50), default='PENDING')
    started_at = db.Column(db.DateTime(timezone=True))
    completed_at = db.Column(db.DateTime(timezone=True))
    
    # Data
    input_data = db.Column(JSON, default={})
    output_data = db.Column(JSON, default={})
    
    # Assignment
    assigned_to = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Error handling
    error_message = db.Column(db.Text)
    retry_count = db.Column(db.Integer, default=0)
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Constraints
    __table_args__ = (
        CheckConstraint("status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'SKIPPED')", name='check_step_status'),
        CheckConstraint("step_type IN ('MANUAL', 'AUTOMATED', 'APPROVAL', 'NOTIFICATION', 'CONDITION')", name='check_step_type'),
        Index('idx_step_executions_instance_index', 'instance_id', 'step_index'),
        Index('idx_step_executions_status', 'status'),
    )
    
    def __repr__(self):
        return f'<WorkflowStepExecution {self.step_name}>'
    
    @property
    def duration_minutes(self):
        """Calculate step duration in minutes."""
        if self.started_at:
            end_time = self.completed_at or datetime.now(timezone.utc)
            return int((end_time - self.started_at).total_seconds() / 60)
        return None
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'instance_id': str(self.instance_id),
            'step_name': self.step_name,
            'step_index': self.step_index,
            'step_type': self.step_type,
            'status': self.status,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'input_data': self.input_data,
            'output_data': self.output_data,
            'assigned_to': str(self.assigned_to) if self.assigned_to else None,
            'error_message': self.error_message,
            'retry_count': self.retry_count,
            'duration_minutes': self.duration_minutes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

