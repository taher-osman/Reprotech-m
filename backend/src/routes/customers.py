from datetime import datetime, timezone
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from src.database import db
from src.models.user import User
from src.models.customer import Customer, CustomerContact, CustomerAddress

customers_bp = Blueprint('customers', __name__)

def get_current_user():
    """Get current authenticated user."""
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

def generate_customer_id():
    """Generate unique customer ID."""
    import random
    import string
    
    # Get current year
    year = datetime.now().year
    
    # Generate random suffix
    suffix = ''.join(random.choices(string.digits, k=4))
    
    # Format: CUS-YYYY-XXXX
    customer_id = f"CUS-{year}-{suffix}"
    
    # Check if already exists
    while Customer.query.filter_by(customer_id=customer_id).first():
        suffix = ''.join(random.choices(string.digits, k=4))
        customer_id = f"CUS-{year}-{suffix}"
    
    return customer_id

@customers_bp.route('', methods=['GET'])
@jwt_required()
def list_customers():
    """List customers with filtering and pagination."""
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        type_filter = request.args.get('type')
        status_filter = request.args.get('status')
        category_filter = request.args.get('category')
        
        # Build query
        query = Customer.query
        
        # Apply search filter
        if search:
            query = query.filter(
                or_(
                    Customer.name.ilike(f'%{search}%'),
                    Customer.customer_id.ilike(f'%{search}%'),
                    Customer.tax_id.ilike(f'%{search}%')
                )
            )
        
        # Apply type filter
        if type_filter:
            query = query.filter(Customer.type == type_filter)
        
        # Apply status filter
        if status_filter:
            query = query.filter(Customer.status == status_filter)
        
        # Apply category filter
        if category_filter:
            query = query.filter(Customer.category == category_filter)
        
        # Order by creation date
        query = query.order_by(Customer.created_at.desc())
        
        # Paginate
        pagination = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        customers = [customer.to_dict() for customer in pagination.items]
        
        return jsonify({
            'customers': customers,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"List customers error: {str(e)}")
        return jsonify({'error': 'Failed to list customers'}), 500

@customers_bp.route('', methods=['POST'])
@jwt_required()
def create_customer():
    """Create new customer."""
    try:
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['name', 'type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Generate customer ID
        customer_id = generate_customer_id()
        
        # Create customer
        customer = Customer(
            customer_id=customer_id,
            name=data['name'],
            type=data['type'],
            category=data.get('category', 'Standard'),
            status=data.get('status', 'Active'),
            tax_id=data.get('tax_id'),
            registration_number=data.get('registration_number'),
            industry=data.get('industry'),
            website=data.get('website'),
            credit_limit=data.get('credit_limit'),
            payment_terms=data.get('payment_terms', 30),
            discount_rate=data.get('discount_rate', 0),
            notes=data.get('notes'),
            preferences=data.get('preferences', {}),
            created_by=current_user.id
        )
        
        db.session.add(customer)
        db.session.flush()  # Get customer ID
        
        # Add contacts if provided
        contacts_data = data.get('contacts', [])
        for contact_data in contacts_data:
            contact = CustomerContact(
                customer_id=customer.id,
                first_name=contact_data.get('first_name'),
                last_name=contact_data.get('last_name'),
                title=contact_data.get('title'),
                department=contact_data.get('department'),
                email=contact_data.get('email'),
                phone=contact_data.get('phone'),
                mobile=contact_data.get('mobile'),
                is_primary=contact_data.get('is_primary', False),
                is_billing=contact_data.get('is_billing', False),
                is_technical=contact_data.get('is_technical', False),
                notes=contact_data.get('notes')
            )
            db.session.add(contact)
        
        # Add addresses if provided
        addresses_data = data.get('addresses', [])
        for address_data in addresses_data:
            address = CustomerAddress(
                customer_id=customer.id,
                type=address_data.get('type'),
                address_line1=address_data.get('address_line1'),
                address_line2=address_data.get('address_line2'),
                city=address_data.get('city'),
                state_province=address_data.get('state_province'),
                postal_code=address_data.get('postal_code'),
                country=address_data.get('country'),
                is_primary=address_data.get('is_primary', False),
                latitude=address_data.get('latitude'),
                longitude=address_data.get('longitude')
            )
            db.session.add(address)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Customer created successfully',
            'customer': customer.to_dict(include_contacts=True, include_addresses=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create customer error: {str(e)}")
        return jsonify({'error': 'Failed to create customer'}), 500

@customers_bp.route('/<customer_id>', methods=['GET'])
@jwt_required()
def get_customer(customer_id):
    """Get customer details."""
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        include_contacts = request.args.get('include_contacts', 'false').lower() == 'true'
        include_addresses = request.args.get('include_addresses', 'false').lower() == 'true'
        
        return jsonify({
            'customer': customer.to_dict(
                include_contacts=include_contacts,
                include_addresses=include_addresses
            )
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get customer error: {str(e)}")
        return jsonify({'error': 'Failed to get customer'}), 500

@customers_bp.route('/<customer_id>', methods=['PUT'])
@jwt_required()
def update_customer(customer_id):
    """Update customer information."""
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update customer fields
        updatable_fields = [
            'name', 'type', 'category', 'status', 'tax_id', 'registration_number',
            'industry', 'website', 'credit_limit', 'payment_terms', 'discount_rate',
            'notes', 'preferences'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(customer, field, data[field])
        
        customer.updated_by = current_user.id
        customer.updated_at = datetime.now(timezone.utc)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Customer updated successfully',
            'customer': customer.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update customer error: {str(e)}")
        return jsonify({'error': 'Failed to update customer'}), 500

@customers_bp.route('/<customer_id>', methods=['DELETE'])
@jwt_required()
def delete_customer(customer_id):
    """Delete customer (soft delete by changing status)."""
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        current_user = get_current_user()
        
        # Soft delete by changing status
        customer.status = 'Archived'
        customer.updated_by = current_user.id
        customer.updated_at = datetime.now(timezone.utc)
        
        db.session.commit()
        
        return jsonify({'message': 'Customer archived successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Delete customer error: {str(e)}")
        return jsonify({'error': 'Failed to archive customer'}), 500

@customers_bp.route('/<customer_id>/contacts', methods=['GET'])
@jwt_required()
def get_customer_contacts(customer_id):
    """Get customer contacts."""
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        contacts = [contact.to_dict() for contact in customer.contacts]
        
        return jsonify({'contacts': contacts}), 200
        
    except Exception as e:
        current_app.logger.error(f"Get customer contacts error: {str(e)}")
        return jsonify({'error': 'Failed to get customer contacts'}), 500

@customers_bp.route('/<customer_id>/contacts', methods=['POST'])
@jwt_required()
def add_customer_contact(customer_id):
    """Add customer contact."""
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        contact = CustomerContact(
            customer_id=customer.id,
            first_name=data['first_name'],
            last_name=data['last_name'],
            title=data.get('title'),
            department=data.get('department'),
            email=data.get('email'),
            phone=data.get('phone'),
            mobile=data.get('mobile'),
            is_primary=data.get('is_primary', False),
            is_billing=data.get('is_billing', False),
            is_technical=data.get('is_technical', False),
            notes=data.get('notes')
        )
        
        db.session.add(contact)
        db.session.commit()
        
        return jsonify({
            'message': 'Contact added successfully',
            'contact': contact.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Add customer contact error: {str(e)}")
        return jsonify({'error': 'Failed to add contact'}), 500

@customers_bp.route('/<customer_id>/contacts/<contact_id>', methods=['PUT'])
@jwt_required()
def update_customer_contact(customer_id, contact_id):
    """Update customer contact."""
    try:
        contact = CustomerContact.query.filter_by(
            id=contact_id, customer_id=customer_id
        ).first()
        
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update contact fields
        updatable_fields = [
            'first_name', 'last_name', 'title', 'department', 'email', 'phone',
            'mobile', 'is_primary', 'is_billing', 'is_technical', 'notes'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(contact, field, data[field])
        
        contact.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        
        return jsonify({
            'message': 'Contact updated successfully',
            'contact': contact.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update customer contact error: {str(e)}")
        return jsonify({'error': 'Failed to update contact'}), 500

@customers_bp.route('/<customer_id>/contacts/<contact_id>', methods=['DELETE'])
@jwt_required()
def delete_customer_contact(customer_id, contact_id):
    """Delete customer contact."""
    try:
        contact = CustomerContact.query.filter_by(
            id=contact_id, customer_id=customer_id
        ).first()
        
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404
        
        db.session.delete(contact)
        db.session.commit()
        
        return jsonify({'message': 'Contact deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Delete customer contact error: {str(e)}")
        return jsonify({'error': 'Failed to delete contact'}), 500

@customers_bp.route('/<customer_id>/addresses', methods=['GET'])
@jwt_required()
def get_customer_addresses(customer_id):
    """Get customer addresses."""
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        addresses = [address.to_dict() for address in customer.addresses]
        
        return jsonify({'addresses': addresses}), 200
        
    except Exception as e:
        current_app.logger.error(f"Get customer addresses error: {str(e)}")
        return jsonify({'error': 'Failed to get customer addresses'}), 500

@customers_bp.route('/<customer_id>/addresses', methods=['POST'])
@jwt_required()
def add_customer_address(customer_id):
    """Add customer address."""
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['type', 'address_line1', 'city', 'country']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        address = CustomerAddress(
            customer_id=customer.id,
            type=data['type'],
            address_line1=data['address_line1'],
            address_line2=data.get('address_line2'),
            city=data['city'],
            state_province=data.get('state_province'),
            postal_code=data.get('postal_code'),
            country=data['country'],
            is_primary=data.get('is_primary', False),
            latitude=data.get('latitude'),
            longitude=data.get('longitude')
        )
        
        db.session.add(address)
        db.session.commit()
        
        return jsonify({
            'message': 'Address added successfully',
            'address': address.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Add customer address error: {str(e)}")
        return jsonify({'error': 'Failed to add address'}), 500

@customers_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_customer_stats():
    """Get customer statistics."""
    try:
        total_customers = Customer.query.count()
        active_customers = Customer.query.filter_by(status='Active').count()
        
        # Customers by type
        type_stats = {}
        types = ['Individual', 'Organization', 'Research', 'Government']
        for customer_type in types:
            type_stats[customer_type] = Customer.query.filter_by(type=customer_type).count()
        
        # Customers by category
        category_stats = {}
        categories = ['Standard', 'Premium', 'VIP', 'Research']
        for category in categories:
            category_stats[category] = Customer.query.filter_by(category=category).count()
        
        return jsonify({
            'total_customers': total_customers,
            'active_customers': active_customers,
            'type_distribution': type_stats,
            'category_distribution': category_stats
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get customer stats error: {str(e)}")
        return jsonify({'error': 'Failed to get customer statistics'}), 500

