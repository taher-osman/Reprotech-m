from datetime import datetime, timezone, date
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from src.database import db
from src.models.user import User
from src.models.animal import Animal, AnimalRole, AnimalInternalNumber, AnimalGenomicData, AnimalActivity
from src.models.customer import Customer

animals_bp = Blueprint('animals', __name__)

def get_current_user():
    """Get current authenticated user."""
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

def generate_animal_id(species):
    """Generate unique animal ID in SPP-YYYY-XXXX format."""
    import random
    import string
    
    # Species prefix mapping
    species_prefixes = {
        'BOVINE': 'BOV',
        'EQUINE': 'EQU',
        'CAMEL': 'CAM',
        'OVINE': 'OVI',
        'CAPRINE': 'CAP',
        'SWINE': 'SWI'
    }
    
    prefix = species_prefixes.get(species, 'ANI')
    year = datetime.now().year
    
    # Generate random suffix
    suffix = ''.join(random.choices(string.digits, k=4))
    
    # Format: SPP-YYYY-XXXX
    animal_id = f"{prefix}-{year}-{suffix}"
    
    # Check if already exists
    while Animal.query.filter_by(animal_id=animal_id).first():
        suffix = ''.join(random.choices(string.digits, k=4))
        animal_id = f"{prefix}-{year}-{suffix}"
    
    return animal_id

@animals_bp.route('', methods=['GET'])
@jwt_required()
def list_animals():
    """List animals with filtering and pagination."""
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        species_filter = request.args.get('species')
        status_filter = request.args.get('status')
        purpose_filter = request.args.get('purpose')
        customer_id = request.args.get('customer_id')
        has_genomic_data = request.args.get('has_genomic_data')
        
        # Build query
        query = Animal.query.filter(Animal.deleted_at.is_(None))  # Exclude soft deleted
        
        # Apply search filter
        if search:
            query = query.filter(
                or_(
                    Animal.name.ilike(f'%{search}%'),
                    Animal.animal_id.ilike(f'%{search}%'),
                    Animal.microchip.ilike(f'%{search}%'),
                    Animal.owner.ilike(f'%{search}%')
                )
            )
        
        # Apply species filter
        if species_filter:
            query = query.filter(Animal.species == species_filter)
        
        # Apply status filter
        if status_filter:
            query = query.filter(Animal.status == status_filter)
        
        # Apply purpose filter
        if purpose_filter:
            query = query.filter(Animal.purpose == purpose_filter)
        
        # Apply customer filter
        if customer_id:
            query = query.filter(Animal.customer_id == customer_id)
        
        # Apply genomic data filter
        if has_genomic_data == 'true':
            query = query.join(AnimalGenomicData).filter(AnimalGenomicData.has_snp_data == True)
        elif has_genomic_data == 'false':
            query = query.outerjoin(AnimalGenomicData).filter(AnimalGenomicData.id.is_(None))
        
        # Order by creation date
        query = query.order_by(Animal.created_at.desc())
        
        # Paginate
        pagination = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        animals = [animal.to_dict() for animal in pagination.items]
        
        return jsonify({
            'animals': animals,
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
        current_app.logger.error(f"List animals error: {str(e)}")
        return jsonify({'error': 'Failed to list animals'}), 500

@animals_bp.route('', methods=['POST'])
@jwt_required()
def create_animal():
    """Create new animal."""
    try:
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['name', 'species', 'sex']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Generate animal ID
        animal_id = generate_animal_id(data['species'])
        
        # Parse date of birth
        date_of_birth = None
        if data.get('date_of_birth'):
            try:
                date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid date format for date_of_birth. Use YYYY-MM-DD'}), 400
        
        # Create animal
        animal = Animal(
            animal_id=animal_id,
            name=data['name'],
            species=data['species'],
            sex=data['sex'],
            date_of_birth=date_of_birth,
            breed=data.get('breed'),
            color=data.get('color'),
            weight=data.get('weight'),
            height=data.get('height'),
            microchip=data.get('microchip'),
            purpose=data.get('purpose'),
            status=data.get('status', 'ACTIVE'),
            father_id=data.get('father_id'),
            mother_id=data.get('mother_id'),
            family=data.get('family'),
            owner=data.get('owner'),
            customer_id=data.get('customer_id'),
            current_location=data.get('current_location'),
            notes=data.get('notes'),
            images=data.get('images', []),
            created_by=current_user.id
        )
        
        db.session.add(animal)
        db.session.flush()  # Get animal ID
        
        # Create genomic data record if specified
        if data.get('create_genomic_data', False):
            genomic_data = AnimalGenomicData(
                animal_id=animal.id,
                has_snp_data=data.get('has_snp_data', False),
                has_snp_index=data.get('has_snp_index', False),
                has_bead_chip=data.get('has_bead_chip', False),
                has_parent_info=data.get('has_parent_info', False),
                missing_parents=data.get('missing_parents', False)
            )
            db.session.add(genomic_data)
        
        # Assign initial roles if provided
        initial_roles = data.get('roles', [])
        for role_name in initial_roles:
            animal.assign_role(role_name, current_user.id, f"Initial assignment during creation")
        
        # Assign initial internal number if provided
        internal_number = data.get('internal_number')
        if internal_number:
            animal.assign_internal_number(
                internal_number, 
                current_user.id, 
                "Initial assignment during creation"
            )
        
        db.session.commit()
        
        return jsonify({
            'message': 'Animal created successfully',
            'animal': animal.to_dict(include_relationships=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create animal error: {str(e)}")
        return jsonify({'error': 'Failed to create animal'}), 500

@animals_bp.route('/<animal_id>', methods=['GET'])
@jwt_required()
def get_animal(animal_id):
    """Get animal details."""
    try:
        animal = Animal.query.filter_by(id=animal_id, deleted_at=None).first()
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        include_relationships = request.args.get('include_relationships', 'false').lower() == 'true'
        
        return jsonify({
            'animal': animal.to_dict(include_relationships=include_relationships)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get animal error: {str(e)}")
        return jsonify({'error': 'Failed to get animal'}), 500

@animals_bp.route('/<animal_id>', methods=['PUT'])
@jwt_required()
def update_animal(animal_id):
    """Update animal information."""
    try:
        animal = Animal.query.filter_by(id=animal_id, deleted_at=None).first()
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update animal fields
        updatable_fields = [
            'name', 'breed', 'color', 'weight', 'height', 'microchip', 'purpose',
            'status', 'family', 'owner', 'customer_id', 'current_location', 'notes', 'images'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(animal, field, data[field])
        
        # Handle date of birth separately
        if 'date_of_birth' in data and data['date_of_birth']:
            try:
                animal.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid date format for date_of_birth. Use YYYY-MM-DD'}), 400
        
        # Handle parent relationships
        if 'father_id' in data:
            animal.father_id = data['father_id']
        if 'mother_id' in data:
            animal.mother_id = data['mother_id']
        
        animal.updated_by = current_user.id
        animal.updated_at = datetime.now(timezone.utc)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Animal updated successfully',
            'animal': animal.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update animal error: {str(e)}")
        return jsonify({'error': 'Failed to update animal'}), 500

@animals_bp.route('/<animal_id>', methods=['DELETE'])
@jwt_required()
def delete_animal(animal_id):
    """Delete animal (soft delete)."""
    try:
        animal = Animal.query.filter_by(id=animal_id, deleted_at=None).first()
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        current_user = get_current_user()
        
        # Soft delete
        animal.deleted_at = datetime.now(timezone.utc)
        animal.deleted_by = current_user.id
        animal.status = 'INACTIVE'
        
        db.session.commit()
        
        return jsonify({'message': 'Animal deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Delete animal error: {str(e)}")
        return jsonify({'error': 'Failed to delete animal'}), 500

@animals_bp.route('/<animal_id>/roles', methods=['GET'])
@jwt_required()
def get_animal_roles(animal_id):
    """Get animal roles."""
    try:
        animal = Animal.query.filter_by(id=animal_id, deleted_at=None).first()
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        roles = [role.to_dict() for role in animal.roles]
        
        return jsonify({'roles': roles}), 200
        
    except Exception as e:
        current_app.logger.error(f"Get animal roles error: {str(e)}")
        return jsonify({'error': 'Failed to get animal roles'}), 500

@animals_bp.route('/<animal_id>/roles', methods=['POST'])
@jwt_required()
def assign_animal_role(animal_id):
    """Assign role to animal."""
    try:
        animal = Animal.query.filter_by(id=animal_id, deleted_at=None).first()
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        current_user = get_current_user()
        data = request.get_json()
        
        if not data or not data.get('role'):
            return jsonify({'error': 'Role is required'}), 400
        
        role_name = data['role']
        notes = data.get('notes')
        
        # Check if role already exists and is active
        if animal.has_role(role_name):
            return jsonify({'error': 'Animal already has this active role'}), 400
        
        role = animal.assign_role(role_name, current_user.id, notes)
        db.session.commit()
        
        return jsonify({
            'message': 'Role assigned successfully',
            'role': role.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Assign animal role error: {str(e)}")
        return jsonify({'error': 'Failed to assign role'}), 500

@animals_bp.route('/<animal_id>/roles/<role_name>', methods=['DELETE'])
@jwt_required()
def revoke_animal_role(animal_id, role_name):
    """Revoke role from animal."""
    try:
        animal = Animal.query.filter_by(id=animal_id, deleted_at=None).first()
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        current_user = get_current_user()
        data = request.get_json() or {}
        notes = data.get('notes')
        
        role = animal.revoke_role(role_name, current_user.id, notes)
        if not role:
            return jsonify({'error': 'Animal does not have this active role'}), 400
        
        db.session.commit()
        
        return jsonify({'message': 'Role revoked successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Revoke animal role error: {str(e)}")
        return jsonify({'error': 'Failed to revoke role'}), 500

@animals_bp.route('/<animal_id>/internal-numbers', methods=['GET'])
@jwt_required()
def get_animal_internal_numbers(animal_id):
    """Get animal internal numbers."""
    try:
        animal = Animal.query.filter_by(id=animal_id, deleted_at=None).first()
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        numbers = [num.to_dict() for num in animal.internal_numbers]
        
        return jsonify({'internal_numbers': numbers}), 200
        
    except Exception as e:
        current_app.logger.error(f"Get animal internal numbers error: {str(e)}")
        return jsonify({'error': 'Failed to get internal numbers'}), 500

@animals_bp.route('/<animal_id>/internal-numbers', methods=['POST'])
@jwt_required()
def assign_internal_number(animal_id):
    """Assign internal number to animal."""
    try:
        animal = Animal.query.filter_by(id=animal_id, deleted_at=None).first()
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        current_user = get_current_user()
        data = request.get_json()
        
        if not data or not data.get('internal_number') or not data.get('reason'):
            return jsonify({'error': 'Internal number and reason are required'}), 400
        
        internal_number = data['internal_number']
        reason = data['reason']
        notes = data.get('notes')
        
        number = animal.assign_internal_number(internal_number, current_user.id, reason, notes)
        db.session.commit()
        
        return jsonify({
            'message': 'Internal number assigned successfully',
            'internal_number': number.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Assign internal number error: {str(e)}")
        return jsonify({'error': 'Failed to assign internal number'}), 500

@animals_bp.route('/<animal_id>/activities', methods=['GET'])
@jwt_required()
def get_animal_activities(animal_id):
    """Get animal activities."""
    try:
        animal = Animal.query.filter_by(id=animal_id, deleted_at=None).first()
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        
        pagination = AnimalActivity.query.filter_by(animal_id=animal_id)\
            .order_by(AnimalActivity.activity_date.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        activities = [activity.to_dict() for activity in pagination.items]
        
        return jsonify({
            'activities': activities,
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
        current_app.logger.error(f"Get animal activities error: {str(e)}")
        return jsonify({'error': 'Failed to get animal activities'}), 500

@animals_bp.route('/<animal_id>/activities', methods=['POST'])
@jwt_required()
def add_animal_activity(animal_id):
    """Add animal activity."""
    try:
        animal = Animal.query.filter_by(id=animal_id, deleted_at=None).first()
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        current_user = get_current_user()
        data = request.get_json()
        
        if not data or not data.get('activity_type'):
            return jsonify({'error': 'Activity type is required'}), 400
        
        activity = AnimalActivity(
            animal_id=animal.id,
            activity_type=data['activity_type'],
            description=data.get('description'),
            performed_by=current_user.id,
            activity_metadata=data.get('metadata', {})
        )
        
        if data.get('activity_date'):
            try:
                activity.activity_date = datetime.fromisoformat(data['activity_date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid activity_date format'}), 400
        
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({
            'message': 'Activity added successfully',
            'activity': activity.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Add animal activity error: {str(e)}")
        return jsonify({'error': 'Failed to add activity'}), 500

@animals_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_animal_stats():
    """Get animal statistics."""
    try:
        total_animals = Animal.query.filter(Animal.deleted_at.is_(None)).count()
        active_animals = Animal.query.filter_by(status='ACTIVE', deleted_at=None).count()
        
        # Animals by species
        species_stats = {}
        species_list = ['BOVINE', 'EQUINE', 'CAMEL', 'OVINE', 'CAPRINE', 'SWINE']
        for species in species_list:
            species_stats[species] = Animal.query.filter_by(species=species, deleted_at=None).count()
        
        # Animals by purpose
        purpose_stats = {}
        purposes = ['Breeding', 'Racing', 'Dairy', 'Meat', 'Show', 'Research']
        for purpose in purposes:
            purpose_stats[purpose] = Animal.query.filter_by(purpose=purpose, deleted_at=None).count()
        
        # Animals with genomic data
        with_genomic_data = Animal.query.join(AnimalGenomicData)\
            .filter(Animal.deleted_at.is_(None), AnimalGenomicData.has_snp_data == True).count()
        
        return jsonify({
            'total_animals': total_animals,
            'active_animals': active_animals,
            'species_distribution': species_stats,
            'purpose_distribution': purpose_stats,
            'with_genomic_data': with_genomic_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get animal stats error: {str(e)}")
        return jsonify({'error': 'Failed to get animal statistics'}), 500


# Export/Import functionality
@animals_bp.route('/export', methods=['GET'])
@jwt_required()
def export_animals():
    """Export animals data to CSV."""
    try:
        import csv
        import io
        from flask import make_response
        
        # Get query parameters for filtering
        customer_id = request.args.get('customer_id')
        species = request.args.get('species')
        status = request.args.get('status')
        
        # Build query
        query = Animal.query.filter(Animal.deleted_at.is_(None))
        
        if customer_id:
            query = query.filter(Animal.customer_id == customer_id)
        if species:
            query = query.filter(Animal.species == species)
        if status:
            query = query.filter(Animal.status == status)
        
        animals = query.all()
        
        # Create CSV content
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'Animal ID', 'Name', 'Species', 'Breed', 'Sex', 'Date of Birth',
            'Weight', 'Height', 'Status', 'Purpose', 'Customer Name',
            'Registration Number', 'Microchip ID', 'Created At'
        ])
        
        # Write data
        for animal in animals:
            writer.writerow([
                animal.animal_id,
                animal.name,
                animal.species,
                animal.breed,
                animal.sex,
                animal.date_of_birth.isoformat() if animal.date_of_birth else '',
                animal.weight,
                animal.height,
                animal.status,
                animal.purpose,
                animal.customer.name if animal.customer else '',
                animal.registration_number,
                animal.microchip_id,
                animal.created_at.isoformat() if animal.created_at else ''
            ])
        
        # Create response
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=animals_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        
        return response
        
    except Exception as e:
        current_app.logger.error(f"Export animals error: {str(e)}")
        return jsonify({'error': 'Failed to export animals data'}), 500

@animals_bp.route('/import', methods=['POST'])
@jwt_required()
def import_animals():
    """Import animals data from CSV."""
    try:
        import csv
        import io
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'File must be a CSV'}), 400
        
        # Read CSV content
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.DictReader(stream)
        
        imported_count = 0
        errors = []
        
        for row_num, row in enumerate(csv_input, start=2):
            try:
                # Validate required fields
                if not row.get('Animal ID') or not row.get('Name'):
                    errors.append(f"Row {row_num}: Animal ID and Name are required")
                    continue
                
                # Check if animal already exists
                existing_animal = Animal.query.filter_by(animal_id=row['Animal ID']).first()
                if existing_animal:
                    errors.append(f"Row {row_num}: Animal with ID {row['Animal ID']} already exists")
                    continue
                
                # Find customer if specified
                customer = None
                if row.get('Customer Name'):
                    from src.models.customer import Customer
                    customer = Customer.query.filter_by(name=row['Customer Name']).first()
                    if not customer:
                        errors.append(f"Row {row_num}: Customer '{row['Customer Name']}' not found")
                        continue
                
                # Create animal
                animal = Animal(
                    animal_id=row['Animal ID'],
                    name=row['Name'],
                    species=row.get('Species', ''),
                    breed=row.get('Breed', ''),
                    sex=row.get('Sex', ''),
                    weight=float(row['Weight']) if row.get('Weight') else None,
                    height=float(row['Height']) if row.get('Height') else None,
                    status=row.get('Status', 'ACTIVE'),
                    purpose=row.get('Purpose', ''),
                    registration_number=row.get('Registration Number', ''),
                    microchip_id=row.get('Microchip ID', ''),
                    customer_id=customer.id if customer else None,
                    created_by=get_jwt_identity()
                )
                
                # Parse date of birth if provided
                if row.get('Date of Birth'):
                    try:
                        from datetime import datetime
                        animal.date_of_birth = datetime.fromisoformat(row['Date of Birth']).date()
                    except ValueError:
                        errors.append(f"Row {row_num}: Invalid date format for Date of Birth")
                        continue
                
                db.session.add(animal)
                imported_count += 1
                
            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
        
        if imported_count > 0:
            db.session.commit()
        
        return jsonify({
            'message': f'Import completed. {imported_count} animals imported.',
            'imported_count': imported_count,
            'errors': errors
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Import animals error: {str(e)}")
        return jsonify({'error': 'Failed to import animals data'}), 500

@animals_bp.route('/bulk-update', methods=['PUT'])
@jwt_required()
def bulk_update_animals():
    """Bulk update animals."""
    try:
        data = request.get_json()
        if not data or 'animal_ids' not in data or 'updates' not in data:
            return jsonify({'error': 'Animal IDs and updates are required'}), 400
        
        animal_ids = data['animal_ids']
        updates = data['updates']
        
        if not isinstance(animal_ids, list) or not animal_ids:
            return jsonify({'error': 'Animal IDs must be a non-empty list'}), 400
        
        # Find animals
        animals = Animal.query.filter(
            Animal.id.in_(animal_ids),
            Animal.deleted_at.is_(None)
        ).all()
        
        if not animals:
            return jsonify({'error': 'No animals found with provided IDs'}), 404
        
        updated_count = 0
        
        # Apply updates
        for animal in animals:
            for field, value in updates.items():
                if hasattr(animal, field) and field not in ['id', 'animal_id', 'created_at', 'created_by']:
                    setattr(animal, field, value)
            
            animal.updated_by = get_jwt_identity()
            animal.updated_at = datetime.now(timezone.utc)
            updated_count += 1
        
        db.session.commit()
        
        return jsonify({
            'message': f'{updated_count} animals updated successfully',
            'updated_count': updated_count
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Bulk update animals error: {str(e)}")
        return jsonify({'error': 'Failed to bulk update animals'}), 500

@animals_bp.route('/bulk-delete', methods=['DELETE'])
@jwt_required()
def bulk_delete_animals():
    """Bulk delete (soft delete) animals."""
    try:
        data = request.get_json()
        if not data or 'animal_ids' not in data:
            return jsonify({'error': 'Animal IDs are required'}), 400
        
        animal_ids = data['animal_ids']
        
        if not isinstance(animal_ids, list) or not animal_ids:
            return jsonify({'error': 'Animal IDs must be a non-empty list'}), 400
        
        # Find animals
        animals = Animal.query.filter(
            Animal.id.in_(animal_ids),
            Animal.deleted_at.is_(None)
        ).all()
        
        if not animals:
            return jsonify({'error': 'No animals found with provided IDs'}), 404
        
        deleted_count = 0
        
        # Soft delete animals
        for animal in animals:
            animal.deleted_at = datetime.now(timezone.utc)
            animal.updated_by = get_jwt_identity()
            animal.updated_at = datetime.now(timezone.utc)
            deleted_count += 1
        
        db.session.commit()
        
        return jsonify({
            'message': f'{deleted_count} animals deleted successfully',
            'deleted_count': deleted_count
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Bulk delete animals error: {str(e)}")
        return jsonify({'error': 'Failed to bulk delete animals'}), 500


@animals_bp.route('/advanced-search', methods=['POST'])
@jwt_required()
def advanced_search_animals():
    """Advanced search for animals with multiple criteria."""
    try:
        data = request.get_json() or {}
        
        # Build base query
        query = Animal.query.filter(Animal.deleted_at.is_(None))
        
        # Apply filters
        if data.get('animal_id'):
            query = query.filter(Animal.animal_id.ilike(f"%{data['animal_id']}%"))
        
        if data.get('name'):
            query = query.filter(Animal.name.ilike(f"%{data['name']}%"))
        
        if data.get('species'):
            if isinstance(data['species'], list):
                query = query.filter(Animal.species.in_(data['species']))
            else:
                query = query.filter(Animal.species == data['species'])
        
        if data.get('breed'):
            query = query.filter(Animal.breed.ilike(f"%{data['breed']}%"))
        
        if data.get('sex'):
            if isinstance(data['sex'], list):
                query = query.filter(Animal.sex.in_(data['sex']))
            else:
                query = query.filter(Animal.sex == data['sex'])
        
        if data.get('status'):
            if isinstance(data['status'], list):
                query = query.filter(Animal.status.in_(data['status']))
            else:
                query = query.filter(Animal.status == data['status'])
        
        if data.get('customer_id'):
            query = query.filter(Animal.customer_id == data['customer_id'])
        
        if data.get('customer_name'):
            from src.models.customer import Customer
            query = query.join(Customer).filter(Customer.name.ilike(f"%{data['customer_name']}%"))
        
        # Weight range filter
        if data.get('weight_min'):
            query = query.filter(Animal.weight >= data['weight_min'])
        if data.get('weight_max'):
            query = query.filter(Animal.weight <= data['weight_max'])
        
        # Age range filter (if date_of_birth exists)
        if data.get('age_min_months') or data.get('age_max_months'):
            from datetime import date, timedelta
            today = date.today()
            
            if data.get('age_min_months'):
                max_birth_date = today - timedelta(days=data['age_min_months'] * 30)
                query = query.filter(Animal.date_of_birth <= max_birth_date)
            
            if data.get('age_max_months'):
                min_birth_date = today - timedelta(days=data['age_max_months'] * 30)
                query = query.filter(Animal.date_of_birth >= min_birth_date)
        
        # Date range filters
        if data.get('created_after'):
            created_after = datetime.fromisoformat(data['created_after'].replace('Z', '+00:00'))
            query = query.filter(Animal.created_at >= created_after)
        
        if data.get('created_before'):
            created_before = datetime.fromisoformat(data['created_before'].replace('Z', '+00:00'))
            query = query.filter(Animal.created_at <= created_before)
        
        # Purpose filter
        if data.get('purpose'):
            query = query.filter(Animal.purpose.ilike(f"%{data['purpose']}%"))
        
        # Registration number filter
        if data.get('registration_number'):
            query = query.filter(Animal.registration_number.ilike(f"%{data['registration_number']}%"))
        
        # Microchip ID filter
        if data.get('microchip_id'):
            query = query.filter(Animal.microchip_id.ilike(f"%{data['microchip_id']}%"))
        
        # Has genomic data filter
        if data.get('has_genomic_data') is not None:
            from src.models.genomics import GenomicAnalysis
            if data['has_genomic_data']:
                query = query.join(GenomicAnalysis, Animal.id == GenomicAnalysis.animal_id)
            else:
                query = query.outerjoin(GenomicAnalysis, Animal.id == GenomicAnalysis.animal_id).filter(GenomicAnalysis.id.is_(None))
        
        # Has lab samples filter
        if data.get('has_lab_samples') is not None:
            from src.models.laboratory import LabSample
            if data['has_lab_samples']:
                query = query.join(LabSample, Animal.id == LabSample.animal_id)
            else:
                query = query.outerjoin(LabSample, Animal.id == LabSample.animal_id).filter(LabSample.id.is_(None))
        
        # Sorting
        sort_by = data.get('sort_by', 'created_at')
        sort_order = data.get('sort_order', 'desc')
        
        if hasattr(Animal, sort_by):
            if sort_order.lower() == 'asc':
                query = query.order_by(getattr(Animal, sort_by).asc())
            else:
                query = query.order_by(getattr(Animal, sort_by).desc())
        
        # Pagination
        page = data.get('page', 1)
        per_page = min(data.get('per_page', 20), 100)  # Max 100 per page
        
        animals_paginated = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        # Build response
        animals_data = []
        for animal in animals_paginated.items:
            animal_dict = animal.to_dict()
            
            # Add computed fields
            if animal.date_of_birth:
                from datetime import date
                today = date.today()
                age_days = (today - animal.date_of_birth).days
                animal_dict['age_months'] = round(age_days / 30.44, 1)  # Average days per month
                animal_dict['age_years'] = round(age_days / 365.25, 1)  # Average days per year
            
            # Add relationship counts
            from src.models.laboratory import LabSample
            from src.models.genomics import GenomicAnalysis
            from src.models.biobank import BiobankSample
            
            animal_dict['lab_samples_count'] = LabSample.query.filter_by(animal_id=animal.id).count()
            animal_dict['genomic_analyses_count'] = GenomicAnalysis.query.filter_by(animal_id=animal.id).count()
            animal_dict['biobank_samples_count'] = BiobankSample.query.filter_by(animal_id=animal.id).count()
            
            animals_data.append(animal_dict)
        
        return jsonify({
            'animals': animals_data,
            'pagination': {
                'page': animals_paginated.page,
                'per_page': animals_paginated.per_page,
                'total': animals_paginated.total,
                'pages': animals_paginated.pages,
                'has_next': animals_paginated.has_next,
                'has_prev': animals_paginated.has_prev
            },
            'search_criteria': data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Advanced search animals error: {str(e)}")
        return jsonify({'error': 'Failed to perform advanced search'}), 500

