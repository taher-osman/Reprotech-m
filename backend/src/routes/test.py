from flask import Blueprint, jsonify, request
from src.database import db
from src.models.animal import Animal
from src.models.customer import Customer
from src.models.analytics import AnalyticsMetric
from datetime import datetime
import random
import string
import uuid

test_bp = Blueprint('test', __name__)

@test_bp.route('/animals', methods=['GET'])
def test_animals():
    """Test endpoint for animals without authentication."""
    try:
        animals = Animal.query.filter(Animal.deleted_at.is_(None)).limit(10).all()
        
        animals_data = []
        for animal in animals:
            animals_data.append({
                'id': str(animal.id),
                'animal_id': animal.animal_id,
                'name': animal.name,
                'species': animal.species,
                'breed': animal.breed,
                'sex': animal.sex,
                'status': animal.status,
                'weight': float(animal.weight) if animal.weight else None,
                'current_location': animal.current_location,
                'microchip': animal.microchip,
                'created_at': animal.created_at.isoformat()
            })
        
        return jsonify({
            'animals': animals_data,
            'total': len(animals_data),
            'message': 'Test endpoint - no authentication required'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@test_bp.route('/customers', methods=['GET'])
def test_customers():
    """Test endpoint for customers without authentication."""
    try:
        customers = Customer.query.limit(10).all()
        
        customers_data = []
        for customer in customers:
            customers_data.append({
                'id': str(customer.id),
                'customer_id': customer.customer_id,
                'name': customer.name,
                'type': customer.type,  # Fixed: use 'type' instead of 'customer_type'
                'category': customer.category,
                'status': customer.status,
                'created_at': customer.created_at.isoformat()
            })
        
        return jsonify({
            'customers': customers_data,
            'total': len(customers_data),
            'message': 'Test endpoint - no authentication required'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@test_bp.route('/analytics', methods=['GET'])
def test_analytics():
    """Test endpoint for analytics without authentication."""
    try:
        # Get real counts from database
        animal_count = Animal.query.filter(Animal.deleted_at.is_(None)).count()
        customer_count = Customer.query.count()
        
        # Get analytics metrics
        metrics = AnalyticsMetric.query.all()
        metrics_data = [metric.to_dict() for metric in metrics]
        
        return jsonify({
            'real_counts': {
                'animals': animal_count,
                'customers': customer_count
            },
            'metrics': metrics_data,
            'message': 'Test endpoint - real database counts'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@test_bp.route('/status', methods=['GET'])
def test_status():
    """Test endpoint to check database connectivity."""
    try:
        # Test database connection
        animal_count = Animal.query.count()
        customer_count = Customer.query.count()
        
        return jsonify({
            'database_connected': True,
            'tables_accessible': True,
            'counts': {
                'animals': animal_count,
                'customers': customer_count
            },
            'message': 'Database connectivity test successful'
        }), 200
        
    except Exception as e:
        return jsonify({
            'database_connected': False,
            'error': str(e)
        }), 500



def generate_test_animal_id(species, breed):
    """Generate unique animal ID for testing."""
    # Use breed prefix if available, otherwise species
    if breed:
        prefix = breed[:3].upper()
    else:
        species_prefixes = {
            'BOVINE': 'BOV',
            'EQUINE': 'EQU', 
            'OVINE': 'OVI',
            'CAPRINE': 'CAP'
        }
        prefix = species_prefixes.get(species, 'ANI')
    
    year = datetime.now().year
    suffix = ''.join(random.choices(string.digits, k=4))
    animal_id = f"{prefix}-{year}-{suffix}"
    
    # Check if already exists
    while Animal.query.filter_by(animal_id=animal_id).first():
        suffix = ''.join(random.choices(string.digits, k=4))
        animal_id = f"{prefix}-{year}-{suffix}"
    
    return animal_id

@test_bp.route('/animals', methods=['POST'])
def test_create_animal():
    """Test endpoint for creating animals without authentication."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['name', 'species', 'sex']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Generate animal ID if not provided
        animal_id = data.get('animal_id')
        if not animal_id:
            animal_id = generate_test_animal_id(data['species'], data.get('breed'))
        
        # Parse date of birth
        date_of_birth = None
        if data.get('date_of_birth'):
            try:
                date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid date format for date_of_birth. Use YYYY-MM-DD'}), 400
        
        # Convert customer_id to UUID if provided
        customer_id = None
        if data.get('customer_id'):
            try:
                customer_id = uuid.UUID(data['customer_id'])
            except ValueError:
                return jsonify({'error': 'Invalid customer_id format'}), 400
        
        # Create animal
        animal = Animal(
            animal_id=animal_id,
            name=data['name'],
            species=data['species'],
            sex=data['sex'],
            date_of_birth=date_of_birth,
            breed=data.get('breed'),
            weight=data.get('weight'),
            microchip=data.get('microchip'),
            purpose=data.get('purpose'),
            status=data.get('status', 'ACTIVE'),
            customer_id=customer_id,
            current_location=data.get('current_location'),
            notes=data.get('notes')
        )
        
        db.session.add(animal)
        db.session.commit()
        
        return jsonify({
            'message': 'Animal created successfully',
            'animal': {
                'id': str(animal.id),
                'animal_id': animal.animal_id,
                'name': animal.name,
                'species': animal.species,
                'breed': animal.breed,
                'sex': animal.sex,
                'status': animal.status,
                'weight': float(animal.weight) if animal.weight else None,
                'current_location': animal.current_location,
                'microchip': animal.microchip,
                'customer_id': animal.customer_id,
                'created_at': animal.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create animal: {str(e)}'}), 500



@test_bp.route('/animals/<animal_id>', methods=['GET'])
def test_get_animal(animal_id):
    """Test endpoint for getting single animal without authentication."""
    try:
        animal = None
        
        # Try to find by UUID first
        try:
            animal_uuid = uuid.UUID(animal_id)
            animal = Animal.query.filter_by(id=animal_uuid).first()
        except ValueError:
            # If not a valid UUID, try by animal_id string
            animal = Animal.query.filter_by(animal_id=animal_id).first()
        
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        # Get customer information if available
        customer_name = "Unknown Customer"
        if animal.customer_id:
            customer = Customer.query.get(animal.customer_id)
            if customer:
                customer_name = customer.name
        
        animal_data = {
            'id': str(animal.id),
            'animal_id': animal.animal_id,
            'name': animal.name,
            'species': animal.species,
            'breed': animal.breed,
            'sex': animal.sex,
            'status': animal.status,
            'weight': float(animal.weight) if animal.weight else None,
            'current_location': animal.current_location,
            'microchip': animal.microchip,
            'customer_id': str(animal.customer_id) if animal.customer_id else None,
            'customer_name': customer_name,
            'date_of_birth': animal.date_of_birth.isoformat() if animal.date_of_birth else None,
            'purpose': animal.purpose,
            'notes': animal.notes,
            'created_at': animal.created_at.isoformat()
        }
        
        return jsonify({
            'animal': animal_data,
            'message': 'Test endpoint - single animal retrieved'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get animal: {str(e)}'}), 500

