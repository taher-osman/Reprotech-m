"""
Branch Management Model
Handles farms, laboratories, clinics, research centers and other branch types
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class BranchType(enum.Enum):
    FARM = "farm"
    LABORATORY = "laboratory"
    CLINIC = "clinic"
    RESEARCH_CENTER = "research_center"
    PROCESSING_FACILITY = "processing_facility"
    BREEDING_CENTER = "breeding_center"
    QUARANTINE_FACILITY = "quarantine_facility"
    TRAINING_CENTER = "training_center"

class BranchStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    MAINTENANCE = "maintenance"

class Branch(Base):
    __tablename__ = 'branches'
    
    # Primary identification
    id = Column(Integer, primary_key=True, autoincrement=True)
    branch_code = Column(String(20), unique=True, nullable=False)  # Unique branch identifier
    name = Column(String(255), nullable=False)
    branch_type = Column(Enum(BranchType), nullable=False)
    status = Column(Enum(BranchStatus), default=BranchStatus.ACTIVE)
    
    # Location and contact information
    address = Column(Text)
    city = Column(String(100))
    state_province = Column(String(100))
    country = Column(String(100))
    postal_code = Column(String(20))
    phone = Column(String(50))
    email = Column(String(255))
    website = Column(String(255))
    
    # Geographic coordinates
    latitude = Column(String(50))
    longitude = Column(String(50))
    
    # Operational details
    established_date = Column(DateTime)
    license_number = Column(String(100))
    license_expiry = Column(DateTime)
    capacity = Column(Integer)  # Maximum animal capacity
    current_occupancy = Column(Integer, default=0)
    
    # Management information
    manager_name = Column(String(255))
    manager_phone = Column(String(50))
    manager_email = Column(String(255))
    
    # Organizational relationships
    parent_branch_id = Column(Integer, ForeignKey('branches.id'), nullable=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=True)
    
    # Operational capabilities
    services_offered = Column(Text)  # JSON string of services
    equipment_list = Column(Text)    # JSON string of equipment
    certifications = Column(Text)    # JSON string of certifications
    
    # Financial information
    operational_cost_center = Column(String(50))
    budget_allocation = Column(String(50))
    
    # System metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey('users.id'))
    updated_by = Column(Integer, ForeignKey('users.id'))
    
    # Relationships
    parent_branch = relationship("Branch", remote_side=[id], backref="sub_branches")
    customer = relationship("Customer", backref="branches")
    animals = relationship("Animal", backref="branch")
    users = relationship("User", backref="branch")
    
    def __repr__(self):
        return f"<Branch(id={self.id}, code='{self.branch_code}', name='{self.name}', type='{self.branch_type.value}')>"
    
    def to_dict(self):
        """Convert branch object to dictionary for API responses"""
        return {
            'id': self.id,
            'branch_code': self.branch_code,
            'name': self.name,
            'branch_type': self.branch_type.value,
            'status': self.status.value,
            'address': self.address,
            'city': self.city,
            'state_province': self.state_province,
            'country': self.country,
            'postal_code': self.postal_code,
            'phone': self.phone,
            'email': self.email,
            'website': self.website,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'established_date': self.established_date.isoformat() if self.established_date else None,
            'license_number': self.license_number,
            'license_expiry': self.license_expiry.isoformat() if self.license_expiry else None,
            'capacity': self.capacity,
            'current_occupancy': self.current_occupancy,
            'manager_name': self.manager_name,
            'manager_phone': self.manager_phone,
            'manager_email': self.manager_email,
            'parent_branch_id': self.parent_branch_id,
            'customer_id': self.customer_id,
            'services_offered': self.services_offered,
            'equipment_list': self.equipment_list,
            'certifications': self.certifications,
            'operational_cost_center': self.operational_cost_center,
            'budget_allocation': self.budget_allocation,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class AnimalNumbering(Base):
    """
    Manages internal numbering system for animals per branch and species
    Ensures no duplicate internal numbers for active animals of same species in same branch
    """
    __tablename__ = 'animal_numbering'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    branch_id = Column(Integer, ForeignKey('branches.id'), nullable=False)
    species = Column(String(50), nullable=False)
    internal_number = Column(String(50), nullable=False)
    animal_id = Column(Integer, ForeignKey('animals.id'), nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Numbering metadata
    number_prefix = Column(String(10))  # e.g., "BOV", "EQU", "OVI"
    number_sequence = Column(Integer)   # Sequential number part
    number_suffix = Column(String(10))  # Optional suffix
    
    # System metadata
    assigned_date = Column(DateTime, default=datetime.utcnow)
    released_date = Column(DateTime, nullable=True)
    created_by = Column(Integer, ForeignKey('users.id'))
    
    # Unique constraint: no duplicate internal numbers for active animals of same species in same branch
    __table_args__ = (
        UniqueConstraint('branch_id', 'species', 'internal_number', 'is_active', 
                        name='unique_active_internal_number_per_branch_species'),
    )
    
    # Relationships
    branch = relationship("Branch", backref="animal_numbers")
    animal = relationship("Animal", backref="numbering_record")
    
    def __repr__(self):
        return f"<AnimalNumbering(branch_id={self.branch_id}, species='{self.species}', number='{self.internal_number}')>"
    
    def to_dict(self):
        return {
            'id': self.id,
            'branch_id': self.branch_id,
            'species': self.species,
            'internal_number': self.internal_number,
            'animal_id': self.animal_id,
            'is_active': self.is_active,
            'number_prefix': self.number_prefix,
            'number_sequence': self.number_sequence,
            'number_suffix': self.number_suffix,
            'assigned_date': self.assigned_date.isoformat() if self.assigned_date else None,
            'released_date': self.released_date.isoformat() if self.released_date else None
        }

class BranchService(Base):
    """
    Defines services offered by each branch
    """
    __tablename__ = 'branch_services'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    branch_id = Column(Integer, ForeignKey('branches.id'), nullable=False)
    service_name = Column(String(255), nullable=False)
    service_category = Column(String(100))  # e.g., "Reproduction", "Health", "Genetics"
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    cost_per_service = Column(String(50))
    
    # Service metadata
    equipment_required = Column(Text)  # JSON string
    staff_required = Column(Text)      # JSON string
    duration_minutes = Column(Integer)
    
    # System metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    branch = relationship("Branch", backref="services")
    
    def to_dict(self):
        return {
            'id': self.id,
            'branch_id': self.branch_id,
            'service_name': self.service_name,
            'service_category': self.service_category,
            'description': self.description,
            'is_active': self.is_active,
            'cost_per_service': self.cost_per_service,
            'equipment_required': self.equipment_required,
            'staff_required': self.staff_required,
            'duration_minutes': self.duration_minutes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class BranchEquipment(Base):
    """
    Equipment inventory for each branch
    """
    __tablename__ = 'branch_equipment'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    branch_id = Column(Integer, ForeignKey('branches.id'), nullable=False)
    equipment_name = Column(String(255), nullable=False)
    equipment_type = Column(String(100))
    manufacturer = Column(String(255))
    model = Column(String(255))
    serial_number = Column(String(255))
    
    # Equipment status and maintenance
    status = Column(String(50), default="operational")  # operational, maintenance, out_of_service
    purchase_date = Column(DateTime)
    warranty_expiry = Column(DateTime)
    last_maintenance = Column(DateTime)
    next_maintenance = Column(DateTime)
    
    # Location within branch
    location = Column(String(255))
    room_number = Column(String(50))
    
    # System metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    branch = relationship("Branch", backref="equipment")
    
    def to_dict(self):
        return {
            'id': self.id,
            'branch_id': self.branch_id,
            'equipment_name': self.equipment_name,
            'equipment_type': self.equipment_type,
            'manufacturer': self.manufacturer,
            'model': self.model,
            'serial_number': self.serial_number,
            'status': self.status,
            'purchase_date': self.purchase_date.isoformat() if self.purchase_date else None,
            'warranty_expiry': self.warranty_expiry.isoformat() if self.warranty_expiry else None,
            'last_maintenance': self.last_maintenance.isoformat() if self.last_maintenance else None,
            'next_maintenance': self.next_maintenance.isoformat() if self.next_maintenance else None,
            'location': self.location,
            'room_number': self.room_number,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

