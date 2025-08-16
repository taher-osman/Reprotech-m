from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy import CheckConstraint
import uuid
from src.database import db

class Customer(db.Model):
    """Customer model for CRM functionality."""
    __tablename__ = 'customers'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False, index=True)
    
    # Customer classification
    type = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), default='Standard')
    status = db.Column(db.String(50), default='Active')
    
    # Business information
    tax_id = db.Column(db.String(50))
    registration_number = db.Column(db.String(100))
    industry = db.Column(db.String(100))
    website = db.Column(db.String(255))
    
    # Financial information
    credit_limit = db.Column(db.Numeric(15, 2))
    payment_terms = db.Column(db.Integer, default=30)
    discount_rate = db.Column(db.Numeric(5, 2), default=0)
    
    # Additional information
    notes = db.Column(db.Text)
    preferences = db.Column(JSON, default={})
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    updated_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Relationships
    contacts = db.relationship('CustomerContact', backref='customer', cascade='all, delete-orphan')
    addresses = db.relationship('CustomerAddress', backref='customer', cascade='all, delete-orphan')
    animals = db.relationship('Animal', backref='customer')
    
    # Constraints
    __table_args__ = (
        CheckConstraint("type IN ('Individual', 'Organization', 'Research', 'Government')", name='check_customer_type'),
        CheckConstraint("category IN ('Standard', 'Premium', 'VIP', 'Research')", name='check_customer_category'),
        CheckConstraint("status IN ('Active', 'Inactive', 'Suspended', 'Archived')", name='check_customer_status'),
    )
    
    def __repr__(self):
        return f'<Customer {self.customer_id}: {self.name}>'
    
    @property
    def primary_contact(self):
        """Get primary contact."""
        return next((contact for contact in self.contacts if contact.is_primary), None)
    
    @property
    def primary_address(self):
        """Get primary address."""
        return next((address for address in self.addresses if address.is_primary), None)
    
    def get_contact_by_type(self, contact_type):
        """Get contact by type (billing, technical, etc.)."""
        type_mapping = {
            'billing': lambda c: c.is_billing,
            'technical': lambda c: c.is_technical,
            'primary': lambda c: c.is_primary
        }
        
        if contact_type in type_mapping:
            return next((contact for contact in self.contacts if type_mapping[contact_type](contact)), None)
        return None
    
    def get_address_by_type(self, address_type):
        """Get address by type."""
        return next((addr for addr in self.addresses if addr.type.lower() == address_type.lower()), None)
    
    def to_dict(self, include_contacts=False, include_addresses=False):
        """Convert to dictionary."""
        data = {
            'id': str(self.id),
            'customer_id': self.customer_id,
            'name': self.name,
            'type': self.type,
            'category': self.category,
            'status': self.status,
            'tax_id': self.tax_id,
            'registration_number': self.registration_number,
            'industry': self.industry,
            'website': self.website,
            'credit_limit': float(self.credit_limit) if self.credit_limit else None,
            'payment_terms': self.payment_terms,
            'discount_rate': float(self.discount_rate) if self.discount_rate else None,
            'notes': self.notes,
            'preferences': self.preferences,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_contacts:
            data['contacts'] = [contact.to_dict() for contact in self.contacts]
            
        if include_addresses:
            data['addresses'] = [address.to_dict() for address in self.addresses]
            
        return data

class CustomerContact(db.Model):
    """Customer contact information."""
    __tablename__ = 'customer_contacts'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('customers.id', ondelete='CASCADE'), nullable=False)
    
    # Personal information
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100))
    department = db.Column(db.String(100))
    
    # Contact information
    email = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    mobile = db.Column(db.String(20))
    
    # Contact type flags
    is_primary = db.Column(db.Boolean, default=False)
    is_billing = db.Column(db.Boolean, default=False)
    is_technical = db.Column(db.Boolean, default=False)
    
    # Additional information
    notes = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    @property
    def full_name(self):
        """Get full name."""
        return f"{self.first_name} {self.last_name}"
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'customer_id': str(self.customer_id),
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'title': self.title,
            'department': self.department,
            'email': self.email,
            'phone': self.phone,
            'mobile': self.mobile,
            'is_primary': self.is_primary,
            'is_billing': self.is_billing,
            'is_technical': self.is_technical,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class CustomerAddress(db.Model):
    """Customer address information."""
    __tablename__ = 'customer_addresses'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('customers.id', ondelete='CASCADE'), nullable=False)
    
    # Address type
    type = db.Column(db.String(50), nullable=False)
    
    # Address components
    address_line1 = db.Column(db.String(255), nullable=False)
    address_line2 = db.Column(db.String(255))
    city = db.Column(db.String(100), nullable=False)
    state_province = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    country = db.Column(db.String(100), nullable=False)
    
    # Flags
    is_primary = db.Column(db.Boolean, default=False)
    
    # Geographic coordinates
    latitude = db.Column(db.Numeric(10, 8))
    longitude = db.Column(db.Numeric(11, 8))
    
    # Timestamps
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Constraints
    __table_args__ = (
        CheckConstraint("type IN ('Billing', 'Shipping', 'Facility', 'Headquarters')", name='check_address_type'),
    )
    
    @property
    def formatted_address(self):
        """Get formatted address string."""
        parts = [self.address_line1]
        if self.address_line2:
            parts.append(self.address_line2)
        parts.append(f"{self.city}, {self.state_province} {self.postal_code}")
        parts.append(self.country)
        return '\n'.join(parts)
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'customer_id': str(self.customer_id),
            'type': self.type,
            'address_line1': self.address_line1,
            'address_line2': self.address_line2,
            'city': self.city,
            'state_province': self.state_province,
            'postal_code': self.postal_code,
            'country': self.country,
            'is_primary': self.is_primary,
            'latitude': float(self.latitude) if self.latitude else None,
            'longitude': float(self.longitude) if self.longitude else None,
            'formatted_address': self.formatted_address,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

