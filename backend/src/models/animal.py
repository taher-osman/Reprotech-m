from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy import CheckConstraint, Index
import uuid
from src.database import db

class Animal(db.Model):
    """Animal model for comprehensive animal management."""
    __tablename__ = 'animals'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    animal_id = db.Column(db.String(50), unique=True, nullable=False, index=True)  # Global permanent ID (SPP-YYYY-XXXX format)
    name = db.Column(db.String(255), nullable=False, index=True)
    
    # Basic classification
    species = db.Column(db.String(50), nullable=False)
    sex = db.Column(db.String(10), nullable=False)
    date_of_birth = db.Column(db.Date)
    registration_date = db.Column(db.Date, nullable=False, default=lambda: datetime.now(timezone.utc).date())
    
    # Physical characteristics
    breed = db.Column(db.String(100))
    color = db.Column(db.String(100))
    weight = db.Column(db.Numeric(8, 2))
    height = db.Column(db.Numeric(8, 2))
    microchip = db.Column(db.String(50))
    
    # Purpose and classification
    purpose = db.Column(db.String(50))
    status = db.Column(db.String(50), default='ACTIVE')
    
    # Lineage information
    father_id = db.Column(UUID(as_uuid=True), db.ForeignKey('animals.id'))
    mother_id = db.Column(UUID(as_uuid=True), db.ForeignKey('animals.id'))
    family = db.Column(db.String(100))
    
    # Ownership and location
    owner = db.Column(db.String(255))
    customer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('customers.id'))
    current_location = db.Column(db.String(255))
    
    # Additional metadata
    notes = db.Column(db.Text)
    images = db.Column(JSON, default=[])
    qr_code = db.Column(db.String(255))
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    updated_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Soft delete
    deleted_at = db.Column(db.DateTime(timezone=True))
    deleted_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Relationships
    roles = db.relationship('AnimalRole', backref='animal', cascade='all, delete-orphan')
    internal_numbers = db.relationship('AnimalInternalNumber', backref='animal', cascade='all, delete-orphan')
    genomic_data = db.relationship('AnimalGenomicData', backref='animal', uselist=False, cascade='all, delete-orphan')
    activities = db.relationship('AnimalActivity', backref='animal', cascade='all, delete-orphan')
    # offspring = db.relationship('Animal', foreign_keys=[father_id, mother_id], remote_side=[id])  # Temporarily disabled
    
    # Constraints
    __table_args__ = (
        CheckConstraint("species IN ('BOVINE', 'EQUINE', 'CAMEL', 'OVINE', 'CAPRINE', 'SWINE')", name='check_animal_species'),
        CheckConstraint("sex IN ('MALE', 'FEMALE')", name='check_animal_sex'),
        CheckConstraint("purpose IN ('Breeding', 'Racing', 'Dairy', 'Meat', 'Show', 'Research')", name='check_animal_purpose'),
        CheckConstraint("status IN ('ACTIVE', 'INACTIVE', 'DECEASED', 'SOLD', 'TRANSFERRED')", name='check_animal_status'),
        Index('idx_animals_species_status', 'species', 'status'),
        Index('idx_animals_customer_id', 'customer_id'),
        Index('idx_animals_created_at', 'created_at'),
    )
    
    def __repr__(self):
        return f'<Animal {self.animal_id}: {self.name}>'
    
    @property
    def age(self):
        """Calculate age in years."""
        if self.date_of_birth:
            today = datetime.now(timezone.utc).date()
            return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return None
    
    @property
    def current_internal_number(self):
        """Get current active internal number."""
        return next((num for num in self.internal_numbers if num.is_active), None)
    
    @property
    def active_roles(self):
        """Get currently active roles."""
        return [role for role in self.roles if role.is_active]
    
    @property
    def father(self):
        """Get father animal."""
        if self.father_id:
            return Animal.query.get(self.father_id)
        return None
    
    @property
    def mother(self):
        """Get mother animal."""
        if self.mother_id:
            return Animal.query.get(self.mother_id)
        return None
    
    def has_role(self, role_name):
        """Check if animal has specific active role."""
        return any(role.role == role_name and role.is_active for role in self.roles)
    
    def assign_role(self, role_name, assigned_by, notes=None):
        """Assign a new role to the animal."""
        # Check if role already exists and is active
        existing_role = next((role for role in self.roles if role.role == role_name and role.is_active), None)
        if existing_role:
            return existing_role
        
        new_role = AnimalRole(
            animal_id=self.id,
            role=role_name,
            assigned_by=assigned_by,
            notes=notes
        )
        db.session.add(new_role)
        return new_role
    
    def revoke_role(self, role_name, revoked_by, notes=None):
        """Revoke an active role from the animal."""
        role = next((role for role in self.roles if role.role == role_name and role.is_active), None)
        if role:
            role.revoked_at = datetime.now(timezone.utc)
            role.revoked_by = revoked_by
            role.is_active = False
            if notes:
                role.notes = f"{role.notes}\nRevoked: {notes}" if role.notes else f"Revoked: {notes}"
        return role
    
    def assign_internal_number(self, internal_number, assigned_by, reason, notes=None):
        """Assign a new internal number."""
        # End current active internal number
        current = self.current_internal_number
        if current:
            current.ended_at = datetime.now(timezone.utc)
            current.ended_by = assigned_by
            current.is_active = False
        
        new_number = AnimalInternalNumber(
            animal_id=self.id,
            internal_number=internal_number,
            assigned_by=assigned_by,
            reason=reason,
            notes=notes
        )
        db.session.add(new_number)
        return new_number
    
    def to_dict(self, include_relationships=False):
        """Convert to dictionary."""
        data = {
            'id': str(self.id),
            'animal_id': self.animal_id,
            'name': self.name,
            'species': self.species,
            'sex': self.sex,
            'age': self.age,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'registration_date': self.registration_date.isoformat(),
            'breed': self.breed,
            'color': self.color,
            'weight': float(self.weight) if self.weight else None,
            'height': float(self.height) if self.height else None,
            'microchip': self.microchip,
            'purpose': self.purpose,
            'status': self.status,
            'father_id': str(self.father_id) if self.father_id else None,
            'mother_id': str(self.mother_id) if self.mother_id else None,
            'family': self.family,
            'owner': self.owner,
            'customer_id': str(self.customer_id) if self.customer_id else None,
            'current_location': self.current_location,
            'notes': self.notes,
            'images': self.images,
            'qr_code': self.qr_code,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_relationships:
            data.update({
                'roles': [role.to_dict() for role in self.active_roles],
                'current_internal_number': self.current_internal_number.to_dict() if self.current_internal_number else None,
                'genomic_data': self.genomic_data.to_dict() if self.genomic_data else None,
                'customer': self.customer.to_dict() if self.customer else None
            })
            
        return data

class AnimalRole(db.Model):
    """Animal role assignments for multi-role system."""
    __tablename__ = 'animal_roles'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    animal_id = db.Column(UUID(as_uuid=True), db.ForeignKey('animals.id', ondelete='CASCADE'), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    
    # Assignment tracking
    assigned_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    revoked_at = db.Column(db.DateTime(timezone=True))
    assigned_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    revoked_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Additional information
    notes = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    
    # Constraints
    __table_args__ = (
        CheckConstraint("role IN ('Donor', 'Recipient', 'Sire', 'LabSample', 'Reference')", name='check_animal_role'),
        Index('idx_animal_roles_animal_role', 'animal_id', 'role'),
    )
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'animal_id': str(self.animal_id),
            'role': self.role,
            'assigned_at': self.assigned_at.isoformat(),
            'revoked_at': self.revoked_at.isoformat() if self.revoked_at else None,
            'assigned_by': str(self.assigned_by) if self.assigned_by else None,
            'revoked_by': str(self.revoked_by) if self.revoked_by else None,
            'notes': self.notes,
            'is_active': self.is_active
        }

class AnimalInternalNumber(db.Model):
    """Internal number management for session-based identification."""
    __tablename__ = 'animal_internal_numbers'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    animal_id = db.Column(UUID(as_uuid=True), db.ForeignKey('animals.id', ondelete='CASCADE'), nullable=False)
    internal_number = db.Column(db.String(50), nullable=False)
    
    # Assignment tracking
    assigned_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    ended_at = db.Column(db.DateTime(timezone=True))
    assigned_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    ended_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Additional information
    reason = db.Column(db.String(255), nullable=False)
    notes = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    
    # Constraints
    __table_args__ = (
        Index('idx_internal_numbers_number', 'internal_number'),
        Index('idx_internal_numbers_animal', 'animal_id', 'assigned_at'),
    )
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'animal_id': str(self.animal_id),
            'internal_number': self.internal_number,
            'assigned_at': self.assigned_at.isoformat(),
            'ended_at': self.ended_at.isoformat() if self.ended_at else None,
            'assigned_by': str(self.assigned_by) if self.assigned_by else None,
            'ended_by': str(self.ended_by) if self.ended_by else None,
            'reason': self.reason,
            'notes': self.notes,
            'is_active': self.is_active
        }

class AnimalGenomicData(db.Model):
    """Genomic data associated with animals."""
    __tablename__ = 'animal_genomic_data'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    animal_id = db.Column(UUID(as_uuid=True), db.ForeignKey('animals.id', ondelete='CASCADE'), nullable=False, unique=True)
    
    # Genomic data flags
    has_snp_data = db.Column(db.Boolean, default=False)
    has_snp_index = db.Column(db.Boolean, default=False)
    has_bead_chip = db.Column(db.Boolean, default=False)
    has_parent_info = db.Column(db.Boolean, default=False)
    missing_parents = db.Column(db.Boolean, default=False)
    
    # Genomic metrics
    snp_count = db.Column(db.Integer, default=0)
    bead_chip_id = db.Column(db.String(100))
    file_size = db.Column(db.BigInteger)
    quality_score = db.Column(db.Numeric(5, 2))
    
    # Timestamps
    last_updated = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'animal_id': str(self.animal_id),
            'has_snp_data': self.has_snp_data,
            'has_snp_index': self.has_snp_index,
            'has_bead_chip': self.has_bead_chip,
            'has_parent_info': self.has_parent_info,
            'missing_parents': self.missing_parents,
            'snp_count': self.snp_count,
            'bead_chip_id': self.bead_chip_id,
            'file_size': self.file_size,
            'quality_score': float(self.quality_score) if self.quality_score else None,
            'last_updated': self.last_updated.isoformat(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class AnimalActivity(db.Model):
    """Activity tracking for animals."""
    __tablename__ = 'animal_activities'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    animal_id = db.Column(UUID(as_uuid=True), db.ForeignKey('animals.id', ondelete='CASCADE'), nullable=False)
    
    # Activity information
    activity_type = db.Column(db.String(50), nullable=False)
    activity_date = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    description = db.Column(db.Text)
    
    # Tracking
    performed_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    activity_metadata = db.Column(JSON, default={})
    
    # Timestamp
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Constraints
    __table_args__ = (
        Index('idx_animal_activities_animal_date', 'animal_id', 'activity_date'),
        Index('idx_animal_activities_type', 'activity_type'),
    )
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'animal_id': str(self.animal_id),
            'activity_type': self.activity_type,
            'activity_date': self.activity_date.isoformat(),
            'description': self.description,
            'performed_by': str(self.performed_by) if self.performed_by else None,
            'activity_metadata': self.activity_metadata,
            'created_at': self.created_at.isoformat()
        }

