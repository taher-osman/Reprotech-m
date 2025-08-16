from datetime import datetime, timezone, timedelta
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy import CheckConstraint, Index
import uuid
from src.database import db

class LabSample(db.Model):
    """Laboratory sample management."""
    __tablename__ = 'lab_samples'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sample_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    barcode = db.Column(db.String(100), unique=True)
    
    # Sample classification
    sample_type = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='COLLECTED')
    priority = db.Column(db.String(50), default='NORMAL')
    
    # Collection information
    collection_date = db.Column(db.DateTime(timezone=True), nullable=False)
    collection_method = db.Column(db.String(100))
    collection_site = db.Column(db.String(100))
    
    # Sample properties
    volume = db.Column(db.Numeric(10, 3))
    unit = db.Column(db.String(20))
    
    # Source information
    animal_id = db.Column(UUID(as_uuid=True), db.ForeignKey('animals.id'))
    customer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('customers.id'))
    collected_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Storage information
    storage_location = db.Column(db.String(100))
    storage_temperature = db.Column(db.Numeric(5, 2))
    storage_conditions = db.Column(db.Text)
    
    # Quality information
    quality_score = db.Column(db.Numeric(5, 2))
    contamination_risk = db.Column(db.String(50))
    viability_percentage = db.Column(db.Numeric(5, 2))
    
    # Additional information
    notes = db.Column(db.Text)
    sample_metadata = db.Column(JSON, default={})
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    updated_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Relationships
    lab_tests = db.relationship('LabTest', backref='sample', cascade='all, delete-orphan')
    animal = db.relationship('Animal', backref='lab_samples')
    customer = db.relationship('Customer', backref='lab_samples')
    
    # Constraints
    __table_args__ = (
        CheckConstraint("status IN ('COLLECTED', 'PROCESSING', 'TESTED', 'ARCHIVED', 'DISPOSED')", name='check_sample_status'),
        CheckConstraint("priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'STAT')", name='check_sample_priority'),
        Index('idx_lab_samples_status_priority', 'status', 'priority'),
        Index('idx_lab_samples_collection_date', 'collection_date'),
    )
    
    def __repr__(self):
        return f'<LabSample {self.sample_id}>'
    
    @property
    def test_count(self):
        """Get number of associated tests."""
        return len(self.lab_tests)
    
    @property
    def active_tests(self):
        """Get active tests for this sample."""
        return [test for test in self.lab_tests if test.status not in ['COMPLETED', 'CANCELLED', 'FAILED']]
    
    def to_dict(self, include_tests=False):
        """Convert to dictionary."""
        data = {
            'id': str(self.id),
            'sample_id': self.sample_id,
            'barcode': self.barcode,
            'sample_type': self.sample_type,
            'status': self.status,
            'priority': self.priority,
            'collection_date': self.collection_date.isoformat(),
            'collection_method': self.collection_method,
            'collection_site': self.collection_site,
            'volume': float(self.volume) if self.volume else None,
            'unit': self.unit,
            'animal_id': str(self.animal_id) if self.animal_id else None,
            'customer_id': str(self.customer_id) if self.customer_id else None,
            'collected_by': str(self.collected_by) if self.collected_by else None,
            'storage_location': self.storage_location,
            'storage_temperature': float(self.storage_temperature) if self.storage_temperature else None,
            'storage_conditions': self.storage_conditions,
            'quality_score': float(self.quality_score) if self.quality_score else None,
            'contamination_risk': self.contamination_risk,
            'viability_percentage': float(self.viability_percentage) if self.viability_percentage else None,
            'notes': self.notes,
            'sample_metadata': self.sample_metadata,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'test_count': self.test_count
        }
        
        if include_tests:
            data['lab_tests'] = [test.to_dict() for test in self.lab_tests]
            
        if self.animal:
            data['animal'] = {
                'animal_id': self.animal.animal_id,
                'name': self.animal.name,
                'species': self.animal.species
            }
            
        if self.customer:
            data['customer'] = {
                'customer_id': self.customer.customer_id,
                'name': self.customer.name
            }
            
        return data

class LabProtocol(db.Model):
    """Laboratory testing protocols."""
    __tablename__ = 'lab_protocols'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    protocol_name = db.Column(db.String(255), nullable=False)
    protocol_code = db.Column(db.String(50), unique=True, nullable=False)
    version = db.Column(db.String(20), nullable=False)
    
    # Protocol classification
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    
    # Protocol specifications
    procedure_steps = db.Column(JSON, nullable=False)
    sample_types = db.Column(JSON, nullable=False)  # Array of supported sample types
    estimated_duration = db.Column(db.Integer, nullable=False)  # in minutes
    cost_per_test = db.Column(db.Numeric(10, 2))
    
    # Requirements
    equipment_required = db.Column(JSON, default=[])
    reagents_required = db.Column(JSON, default=[])
    quality_controls = db.Column(JSON, default=[])
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Relationships
    lab_tests = db.relationship('LabTest', backref='protocol')
    
    def __repr__(self):
        return f'<LabProtocol {self.protocol_code}: {self.protocol_name}>'
    
    def supports_sample_type(self, sample_type):
        """Check if protocol supports given sample type."""
        return sample_type in self.sample_types
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'protocol_name': self.protocol_name,
            'protocol_code': self.protocol_code,
            'version': self.version,
            'category': self.category,
            'description': self.description,
            'procedure_steps': self.procedure_steps,
            'sample_types': self.sample_types,
            'estimated_duration': self.estimated_duration,
            'cost_per_test': float(self.cost_per_test) if self.cost_per_test else None,
            'equipment_required': self.equipment_required,
            'reagents_required': self.reagents_required,
            'quality_controls': self.quality_controls,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class LabTest(db.Model):
    """Laboratory test execution and results."""
    __tablename__ = 'lab_tests'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    test_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    sample_id = db.Column(UUID(as_uuid=True), db.ForeignKey('lab_samples.id', ondelete='CASCADE'), nullable=False)
    protocol_id = db.Column(UUID(as_uuid=True), db.ForeignKey('lab_protocols.id'))
    
    # Test status
    status = db.Column(db.String(50), default='PENDING')
    priority = db.Column(db.String(50), default='NORMAL')
    
    # Scheduling information
    requested_date = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    scheduled_date = db.Column(db.DateTime(timezone=True))
    started_date = db.Column(db.DateTime(timezone=True))
    completed_date = db.Column(db.DateTime(timezone=True))
    due_date = db.Column(db.DateTime(timezone=True))
    
    # Assignment information
    assigned_to = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    reviewed_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    approved_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Progress tracking
    progress_percentage = db.Column(db.Integer, default=0)
    current_step = db.Column(db.String(255))
    
    # Results
    results = db.Column(JSON, default={})
    interpretation = db.Column(db.Text)
    recommendations = db.Column(db.Text)
    
    # Quality control
    qc_passed = db.Column(db.Boolean)
    qc_notes = db.Column(db.Text)
    
    # Additional information
    notes = db.Column(db.Text)
    sample_metadata = db.Column(JSON, default={})
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    updated_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Constraints
    __table_args__ = (
        CheckConstraint("status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'ON_HOLD', 'CANCELLED')", name='check_test_status'),
        CheckConstraint("priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'STAT')", name='check_test_priority'),
        CheckConstraint("progress_percentage >= 0 AND progress_percentage <= 100", name='check_progress_percentage'),
        Index('idx_lab_tests_status_assigned', 'status', 'assigned_to'),
        Index('idx_lab_tests_due_date', 'due_date'),
    )
    
    def __repr__(self):
        return f'<LabTest {self.test_id}>'
    
    @property
    def estimated_completion(self):
        """Calculate estimated completion time."""
        if self.started_date and self.protocol and self.protocol.estimated_duration:
            return self.started_date + timedelta(minutes=self.protocol.estimated_duration)
        return self.due_date
    
    def start_test(self, user_id):
        """Start test execution."""
        if self.status == 'PENDING':
            self.status = 'IN_PROGRESS'
            self.started_date = datetime.now(timezone.utc)
            self.assigned_to = user_id
            self.progress_percentage = 1
    
    def complete_test(self, user_id, results=None, interpretation=None):
        """Complete test execution."""
        if self.status == 'IN_PROGRESS':
            self.status = 'COMPLETED'
            self.completed_date = datetime.now(timezone.utc)
            self.progress_percentage = 100
            self.reviewed_by = user_id
            if results:
                self.results = results
            if interpretation:
                self.interpretation = interpretation
    
    def to_dict(self):
        """Convert to dictionary."""
        data = {
            'id': str(self.id),
            'test_id': self.test_id,
            'sample_id': str(self.sample_id),
            'protocol_id': str(self.protocol_id) if self.protocol_id else None,
            'status': self.status,
            'priority': self.priority,
            'requested_date': self.requested_date.isoformat(),
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'started_date': self.started_date.isoformat() if self.started_date else None,
            'completed_date': self.completed_date.isoformat() if self.completed_date else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'assigned_to': str(self.assigned_to) if self.assigned_to else None,
            'reviewed_by': str(self.reviewed_by) if self.reviewed_by else None,
            'approved_by': str(self.approved_by) if self.approved_by else None,
            'progress_percentage': self.progress_percentage,
            'current_step': self.current_step,
            'results': self.results,
            'interpretation': self.interpretation,
            'recommendations': self.recommendations,
            'qc_passed': self.qc_passed,
            'qc_notes': self.qc_notes,
            'notes': self.notes,
            'sample_metadata': self.sample_metadata,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if self.protocol:
            data['protocol'] = {
                'protocol_name': self.protocol.protocol_name,
                'protocol_code': self.protocol.protocol_code
            }
            
        return data

class LabEquipment(db.Model):
    """Laboratory equipment management."""
    __tablename__ = 'lab_equipment'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    equipment_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False)
    
    # Equipment classification
    type = db.Column(db.String(100), nullable=False)
    manufacturer = db.Column(db.String(100))
    model = db.Column(db.String(100))
    serial_number = db.Column(db.String(100))
    location = db.Column(db.String(100))
    status = db.Column(db.String(50), default='OPERATIONAL')
    
    # Maintenance information
    last_maintenance = db.Column(db.Date)
    next_maintenance = db.Column(db.Date)
    maintenance_interval = db.Column(db.Integer)  # days
    
    # Calibration information
    last_calibration = db.Column(db.Date)
    next_calibration = db.Column(db.Date)
    calibration_interval = db.Column(db.Integer)  # days
    
    # Usage tracking
    total_usage_hours = db.Column(db.Numeric(10, 2), default=0)
    current_usage_hours = db.Column(db.Numeric(10, 2), default=0)
    
    # Specifications
    specifications = db.Column(JSON, default={})
    operating_parameters = db.Column(JSON, default={})
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Constraints
    __table_args__ = (
        CheckConstraint("status IN ('OPERATIONAL', 'MAINTENANCE', 'OUT_OF_SERVICE', 'CALIBRATION')", name='check_equipment_status'),
        Index('idx_lab_equipment_status', 'status'),
        Index('idx_lab_equipment_type', 'type'),
    )
    
    def __repr__(self):
        return f'<LabEquipment {self.equipment_id}: {self.name}>'
    
    @property
    def needs_maintenance(self):
        """Check if equipment needs maintenance."""
        if self.next_maintenance:
            return self.next_maintenance <= datetime.now(timezone.utc).date()
        return False
    
    @property
    def needs_calibration(self):
        """Check if equipment needs calibration."""
        if self.next_calibration:
            return self.next_calibration <= datetime.now(timezone.utc).date()
        return False
    
    def schedule_maintenance(self, maintenance_date, interval_days=None):
        """Schedule next maintenance."""
        self.next_maintenance = maintenance_date
        if interval_days:
            self.maintenance_interval = interval_days
    
    def schedule_calibration(self, calibration_date, interval_days=None):
        """Schedule next calibration."""
        self.next_calibration = calibration_date
        if interval_days:
            self.calibration_interval = interval_days
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'equipment_id': self.equipment_id,
            'name': self.name,
            'type': self.type,
            'manufacturer': self.manufacturer,
            'model': self.model,
            'serial_number': self.serial_number,
            'location': self.location,
            'status': self.status,
            'last_maintenance': self.last_maintenance.isoformat() if self.last_maintenance else None,
            'next_maintenance': self.next_maintenance.isoformat() if self.next_maintenance else None,
            'maintenance_interval': self.maintenance_interval,
            'last_calibration': self.last_calibration.isoformat() if self.last_calibration else None,
            'next_calibration': self.next_calibration.isoformat() if self.next_calibration else None,
            'calibration_interval': self.calibration_interval,
            'total_usage_hours': float(self.total_usage_hours) if self.total_usage_hours else None,
            'current_usage_hours': float(self.current_usage_hours) if self.current_usage_hours else None,
            'specifications': self.specifications,
            'operating_parameters': self.operating_parameters,
            'needs_maintenance': self.needs_maintenance,
            'needs_calibration': self.needs_calibration,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

