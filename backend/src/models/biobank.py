from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy import CheckConstraint, Index
import uuid
from src.database import db

class BiobankStorageUnit(db.Model):
    """Biobank storage unit management."""
    __tablename__ = 'biobank_storage_units'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    unit_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False)
    
    # Storage unit classification
    unit_type = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(255))
    building = db.Column(db.String(100))
    room = db.Column(db.String(100))
    
    # Capacity information
    total_capacity = db.Column(db.Integer, nullable=False)
    current_occupancy = db.Column(db.Integer, default=0)
    
    # Environmental conditions
    target_temperature = db.Column(db.Numeric(5, 2))
    current_temperature = db.Column(db.Numeric(5, 2))
    temperature_tolerance = db.Column(db.Numeric(3, 1))
    humidity_level = db.Column(db.Numeric(5, 2))
    
    # Status and monitoring
    status = db.Column(db.String(50), default='OPERATIONAL')
    last_maintenance = db.Column(db.DateTime(timezone=True))
    next_maintenance = db.Column(db.DateTime(timezone=True))
    
    # Alert settings
    temperature_alerts_enabled = db.Column(db.Boolean, default=True)
    capacity_alert_threshold = db.Column(db.Numeric(5, 2), default=90.0)  # percentage
    
    # Additional specifications
    specifications = db.Column(JSON, default={})
    notes = db.Column(db.Text)
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Relationships
    stored_samples = db.relationship('BiobankSample', backref='storage_unit')
    temperature_logs = db.relationship('TemperatureLog', backref='storage_unit', cascade='all, delete-orphan')
    
    # Constraints
    __table_args__ = (
        CheckConstraint("unit_type IN ('FREEZER', 'REFRIGERATOR', 'ROOM_TEMP', 'LIQUID_NITROGEN', 'ULTRA_LOW')", name='check_unit_type'),
        CheckConstraint("status IN ('OPERATIONAL', 'MAINTENANCE', 'OFFLINE', 'ALARM')", name='check_unit_status'),
        CheckConstraint("current_occupancy >= 0", name='check_occupancy_positive'),
        CheckConstraint("current_occupancy <= total_capacity", name='check_occupancy_capacity'),
        Index('idx_storage_units_status', 'status'),
        Index('idx_storage_units_type', 'unit_type'),
    )
    
    def __repr__(self):
        return f'<BiobankStorageUnit {self.unit_id}: {self.name}>'
    
    @property
    def capacity_percentage(self):
        """Calculate current capacity percentage."""
        if self.total_capacity > 0:
            return (self.current_occupancy / self.total_capacity) * 100
        return 0
    
    @property
    def available_capacity(self):
        """Get available capacity."""
        return self.total_capacity - self.current_occupancy
    
    @property
    def is_temperature_in_range(self):
        """Check if current temperature is within tolerance."""
        if self.current_temperature is not None and self.target_temperature is not None and self.temperature_tolerance is not None:
            return abs(self.current_temperature - self.target_temperature) <= self.temperature_tolerance
        return True
    
    @property
    def needs_capacity_alert(self):
        """Check if capacity alert is needed."""
        return self.capacity_percentage >= self.capacity_alert_threshold
    
    def add_sample(self, sample_count=1):
        """Add samples to storage unit."""
        if self.current_occupancy + sample_count <= self.total_capacity:
            self.current_occupancy += sample_count
            return True
        return False
    
    def remove_sample(self, sample_count=1):
        """Remove samples from storage unit."""
        if self.current_occupancy >= sample_count:
            self.current_occupancy -= sample_count
            return True
        return False
    
    def to_dict(self, include_samples=False):
        """Convert to dictionary."""
        data = {
            'id': str(self.id),
            'unit_id': self.unit_id,
            'name': self.name,
            'unit_type': self.unit_type,
            'location': self.location,
            'building': self.building,
            'room': self.room,
            'total_capacity': self.total_capacity,
            'current_occupancy': self.current_occupancy,
            'capacity_percentage': self.capacity_percentage,
            'available_capacity': self.available_capacity,
            'target_temperature': float(self.target_temperature) if self.target_temperature else None,
            'current_temperature': float(self.current_temperature) if self.current_temperature else None,
            'temperature_tolerance': float(self.temperature_tolerance) if self.temperature_tolerance else None,
            'humidity_level': float(self.humidity_level) if self.humidity_level else None,
            'status': self.status,
            'last_maintenance': self.last_maintenance.isoformat() if self.last_maintenance else None,
            'next_maintenance': self.next_maintenance.isoformat() if self.next_maintenance else None,
            'temperature_alerts_enabled': self.temperature_alerts_enabled,
            'capacity_alert_threshold': float(self.capacity_alert_threshold),
            'is_temperature_in_range': self.is_temperature_in_range,
            'needs_capacity_alert': self.needs_capacity_alert,
            'specifications': self.specifications,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_samples:
            data['stored_samples'] = [sample.to_dict() for sample in self.stored_samples]
            
        return data

class BiobankSample(db.Model):
    """Biobank sample storage tracking."""
    __tablename__ = 'biobank_samples'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sample_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    
    # Sample information
    sample_type = db.Column(db.String(100), nullable=False)
    sample_name = db.Column(db.String(255))
    description = db.Column(db.Text)
    
    # Source information
    animal_id = db.Column(UUID(as_uuid=True), db.ForeignKey('animals.id'))
    customer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('customers.id'))
    lab_sample_id = db.Column(UUID(as_uuid=True), db.ForeignKey('lab_samples.id'))
    
    # Storage information
    storage_unit_id = db.Column(UUID(as_uuid=True), db.ForeignKey('biobank_storage_units.id'), nullable=False)
    position = db.Column(db.String(50))  # e.g., "A1", "Rack2-Box3-Slot15"
    container_type = db.Column(db.String(50))
    container_id = db.Column(db.String(100))
    
    # Sample properties
    volume = db.Column(db.Numeric(10, 3))
    unit = db.Column(db.String(20))
    concentration = db.Column(db.Numeric(10, 4))
    concentration_unit = db.Column(db.String(20))
    
    # Status and tracking
    status = db.Column(db.String(50), default='STORED')
    quality_rating = db.Column(db.String(20))
    viability_percentage = db.Column(db.Numeric(5, 2))
    
    # Dates
    collection_date = db.Column(db.DateTime(timezone=True))
    storage_date = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    expiry_date = db.Column(db.DateTime(timezone=True))
    last_accessed = db.Column(db.DateTime(timezone=True))
    
    # Additional information
    storage_conditions = db.Column(db.Text)
    handling_instructions = db.Column(db.Text)
    sample_metadata = db.Column(JSON, default={})
    notes = db.Column(db.Text)
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    updated_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Relationships
    animal = db.relationship('Animal', backref='biobank_samples')
    customer = db.relationship('Customer', backref='biobank_samples')
    lab_sample = db.relationship('LabSample', backref='biobank_samples')
    
    # Constraints
    __table_args__ = (
        CheckConstraint("status IN ('STORED', 'IN_USE', 'DEPLETED', 'DISCARDED', 'TRANSFERRED')", name='check_sample_status'),
        CheckConstraint("quality_rating IN ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'UNKNOWN')", name='check_quality_rating'),
        Index('idx_biobank_samples_status', 'status'),
        Index('idx_biobank_samples_storage_unit', 'storage_unit_id'),
        Index('idx_biobank_samples_animal', 'animal_id'),
    )
    
    def __repr__(self):
        return f'<BiobankSample {self.sample_id}>'
    
    @property
    def is_expired(self):
        """Check if sample is expired."""
        if self.expiry_date:
            return self.expiry_date <= datetime.now(timezone.utc)
        return False
    
    @property
    def days_until_expiry(self):
        """Calculate days until expiry."""
        if self.expiry_date:
            delta = self.expiry_date - datetime.now(timezone.utc)
            return delta.days
        return None
    
    def access_sample(self, user_id):
        """Record sample access."""
        self.last_accessed = datetime.now(timezone.utc)
        self.updated_by = user_id
    
    def to_dict(self):
        """Convert to dictionary."""
        data = {
            'id': str(self.id),
            'sample_id': self.sample_id,
            'sample_type': self.sample_type,
            'sample_name': self.sample_name,
            'description': self.description,
            'animal_id': str(self.animal_id) if self.animal_id else None,
            'customer_id': str(self.customer_id) if self.customer_id else None,
            'lab_sample_id': str(self.lab_sample_id) if self.lab_sample_id else None,
            'storage_unit_id': str(self.storage_unit_id),
            'position': self.position,
            'container_type': self.container_type,
            'container_id': self.container_id,
            'volume': float(self.volume) if self.volume else None,
            'unit': self.unit,
            'concentration': float(self.concentration) if self.concentration else None,
            'concentration_unit': self.concentration_unit,
            'status': self.status,
            'quality_rating': self.quality_rating,
            'viability_percentage': float(self.viability_percentage) if self.viability_percentage else None,
            'collection_date': self.collection_date.isoformat() if self.collection_date else None,
            'storage_date': self.storage_date.isoformat(),
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'last_accessed': self.last_accessed.isoformat() if self.last_accessed else None,
            'is_expired': self.is_expired,
            'days_until_expiry': self.days_until_expiry,
            'storage_conditions': self.storage_conditions,
            'handling_instructions': self.handling_instructions,
            'sample_metadata': self.sample_metadata,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        # Include related entity information
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
            
        if self.storage_unit:
            data['storage_unit'] = {
                'unit_id': self.storage_unit.unit_id,
                'name': self.storage_unit.name,
                'unit_type': self.storage_unit.unit_type
            }
            
        return data

class TemperatureLog(db.Model):
    """Temperature monitoring logs for storage units."""
    __tablename__ = 'temperature_logs'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    storage_unit_id = db.Column(UUID(as_uuid=True), db.ForeignKey('biobank_storage_units.id', ondelete='CASCADE'), nullable=False)
    
    # Temperature data
    temperature = db.Column(db.Numeric(5, 2), nullable=False)
    humidity = db.Column(db.Numeric(5, 2))
    
    # Status
    is_within_range = db.Column(db.Boolean)
    alert_triggered = db.Column(db.Boolean, default=False)
    
    # Timestamp
    recorded_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Constraints
    __table_args__ = (
        Index('idx_temperature_logs_unit_time', 'storage_unit_id', 'recorded_at'),
    )
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'storage_unit_id': str(self.storage_unit_id),
            'temperature': float(self.temperature),
            'humidity': float(self.humidity) if self.humidity else None,
            'is_within_range': self.is_within_range,
            'alert_triggered': self.alert_triggered,
            'recorded_at': self.recorded_at.isoformat()
        }

