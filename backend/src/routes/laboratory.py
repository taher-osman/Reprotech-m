from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from src.database import db
from src.models.user import User
from src.models.laboratory import LabSample, LabProtocol, LabTest, LabEquipment
from src.models.animal import Animal
from src.models.customer import Customer

laboratory_bp = Blueprint('laboratory', __name__)

def get_current_user():
    """Get current authenticated user."""
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

def generate_sample_id():
    """Generate unique sample ID."""
    import random
    import string
    
    year = datetime.now().year
    suffix = ''.join(random.choices(string.digits, k=6))
    sample_id = f"SAM-{year}-{suffix}"
    
    while LabSample.query.filter_by(sample_id=sample_id).first():
        suffix = ''.join(random.choices(string.digits, k=6))
        sample_id = f"SAM-{year}-{suffix}"
    
    return sample_id

def generate_test_id():
    """Generate unique test ID."""
    import random
    import string
    
    year = datetime.now().year
    suffix = ''.join(random.choices(string.digits, k=6))
    test_id = f"TST-{year}-{suffix}"
    
    while LabTest.query.filter_by(test_id=test_id).first():
        suffix = ''.join(random.choices(string.digits, k=6))
        test_id = f"TST-{year}-{suffix}"
    
    return test_id

# Sample Management Routes
@laboratory_bp.route('/samples', methods=['GET'])
@jwt_required()
def list_samples():
    """List lab samples with filtering and pagination."""
    try:
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        status_filter = request.args.get('status')
        sample_type_filter = request.args.get('sample_type')
        priority_filter = request.args.get('priority')
        animal_id = request.args.get('animal_id')
        customer_id = request.args.get('customer_id')
        
        query = LabSample.query
        
        if search:
            query = query.filter(
                or_(
                    LabSample.sample_id.ilike(f'%{search}%'),
                    LabSample.barcode.ilike(f'%{search}%'),
                    LabSample.sample_type.ilike(f'%{search}%')
                )
            )
        
        if status_filter:
            query = query.filter(LabSample.status == status_filter)
        
        if sample_type_filter:
            query = query.filter(LabSample.sample_type == sample_type_filter)
        
        if priority_filter:
            query = query.filter(LabSample.priority == priority_filter)
        
        if animal_id:
            query = query.filter(LabSample.animal_id == animal_id)
        
        if customer_id:
            query = query.filter(LabSample.customer_id == customer_id)
        
        query = query.order_by(LabSample.collection_date.desc())
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        samples = [sample.to_dict() for sample in pagination.items]
        
        return jsonify({
            'samples': samples,
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
        current_app.logger.error(f"List samples error: {str(e)}")
        return jsonify({'error': 'Failed to list samples'}), 500

@laboratory_bp.route('/samples', methods=['POST'])
@jwt_required()
def create_sample():
    """Create new lab sample."""
    try:
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['sample_type', 'collection_date']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        sample_id = generate_sample_id()
        
        try:
            collection_date = datetime.fromisoformat(data['collection_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid collection_date format'}), 400
        
        sample = LabSample(
            sample_id=sample_id,
            barcode=data.get('barcode'),
            sample_type=data['sample_type'],
            status=data.get('status', 'COLLECTED'),
            priority=data.get('priority', 'NORMAL'),
            collection_date=collection_date,
            collection_method=data.get('collection_method'),
            collection_site=data.get('collection_site'),
            volume=data.get('volume'),
            unit=data.get('unit'),
            animal_id=data.get('animal_id'),
            customer_id=data.get('customer_id'),
            collected_by=current_user.id,
            storage_location=data.get('storage_location'),
            storage_temperature=data.get('storage_temperature'),
            storage_conditions=data.get('storage_conditions'),
            quality_score=data.get('quality_score'),
            contamination_risk=data.get('contamination_risk'),
            viability_percentage=data.get('viability_percentage'),
            notes=data.get('notes'),
            sample_metadata=data.get('metadata', {}),
            created_by=current_user.id
        )
        
        db.session.add(sample)
        db.session.commit()
        
        return jsonify({
            'message': 'Sample created successfully',
            'sample': sample.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create sample error: {str(e)}")
        return jsonify({'error': 'Failed to create sample'}), 500

@laboratory_bp.route('/samples/<sample_id>', methods=['GET'])
@jwt_required()
def get_sample(sample_id):
    """Get sample details."""
    try:
        sample = LabSample.query.get(sample_id)
        if not sample:
            return jsonify({'error': 'Sample not found'}), 404
        
        include_tests = request.args.get('include_tests', 'false').lower() == 'true'
        
        return jsonify({
            'sample': sample.to_dict(include_tests=include_tests)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get sample error: {str(e)}")
        return jsonify({'error': 'Failed to get sample'}), 500

@laboratory_bp.route('/samples/<sample_id>', methods=['PUT'])
@jwt_required()
def update_sample(sample_id):
    """Update sample information."""
    try:
        sample = LabSample.query.get(sample_id)
        if not sample:
            return jsonify({'error': 'Sample not found'}), 404
        
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        updatable_fields = [
            'sample_type', 'status', 'priority', 'collection_method', 'collection_site',
            'volume', 'unit', 'storage_location', 'storage_temperature', 'storage_conditions',
            'quality_score', 'contamination_risk', 'viability_percentage', 'notes', 'metadata'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(sample, field, data[field])
        
        sample.updated_by = current_user.id
        sample.updated_at = datetime.now(timezone.utc)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Sample updated successfully',
            'sample': sample.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update sample error: {str(e)}")
        return jsonify({'error': 'Failed to update sample'}), 500

# Protocol Management Routes
@laboratory_bp.route('/protocols', methods=['GET'])
@jwt_required()
def list_protocols():
    """List lab protocols."""
    try:
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        category_filter = request.args.get('category')
        active_only = request.args.get('active_only', 'true').lower() == 'true'
        
        query = LabProtocol.query
        
        if search:
            query = query.filter(
                or_(
                    LabProtocol.protocol_name.ilike(f'%{search}%'),
                    LabProtocol.protocol_code.ilike(f'%{search}%')
                )
            )
        
        if category_filter:
            query = query.filter(LabProtocol.category == category_filter)
        
        if active_only:
            query = query.filter(LabProtocol.is_active == True)
        
        query = query.order_by(LabProtocol.protocol_name)
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        protocols = [protocol.to_dict() for protocol in pagination.items]
        
        return jsonify({
            'protocols': protocols,
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
        current_app.logger.error(f"List protocols error: {str(e)}")
        return jsonify({'error': 'Failed to list protocols'}), 500

@laboratory_bp.route('/protocols', methods=['POST'])
@jwt_required()
def create_protocol():
    """Create new lab protocol."""
    try:
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['protocol_name', 'protocol_code', 'category', 'procedure_steps', 'sample_types', 'estimated_duration']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if protocol code already exists
        existing_protocol = LabProtocol.query.filter_by(protocol_code=data['protocol_code']).first()
        if existing_protocol:
            return jsonify({'error': 'Protocol code already exists'}), 400
        
        protocol = LabProtocol(
            protocol_name=data['protocol_name'],
            protocol_code=data['protocol_code'],
            version=data.get('version', '1.0'),
            category=data['category'],
            description=data.get('description'),
            procedure_steps=data['procedure_steps'],
            sample_types=data['sample_types'],
            estimated_duration=data['estimated_duration'],
            cost_per_test=data.get('cost_per_test'),
            equipment_required=data.get('equipment_required', []),
            reagents_required=data.get('reagents_required', []),
            quality_controls=data.get('quality_controls', []),
            is_active=data.get('is_active', True),
            created_by=current_user.id
        )
        
        db.session.add(protocol)
        db.session.commit()
        
        return jsonify({
            'message': 'Protocol created successfully',
            'protocol': protocol.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create protocol error: {str(e)}")
        return jsonify({'error': 'Failed to create protocol'}), 500

# Test Management Routes
@laboratory_bp.route('/tests', methods=['GET'])
@jwt_required()
def list_tests():
    """List lab tests with filtering and pagination."""
    try:
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        status_filter = request.args.get('status')
        priority_filter = request.args.get('priority')
        assigned_to = request.args.get('assigned_to')
        sample_id = request.args.get('sample_id')
        
        query = LabTest.query
        
        if search:
            query = query.filter(LabTest.test_id.ilike(f'%{search}%'))
        
        if status_filter:
            query = query.filter(LabTest.status == status_filter)
        
        if priority_filter:
            query = query.filter(LabTest.priority == priority_filter)
        
        if assigned_to:
            query = query.filter(LabTest.assigned_to == assigned_to)
        
        if sample_id:
            query = query.filter(LabTest.sample_id == sample_id)
        
        query = query.order_by(LabTest.requested_date.desc())
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        tests = [test.to_dict() for test in pagination.items]
        
        return jsonify({
            'tests': tests,
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
        current_app.logger.error(f"List tests error: {str(e)}")
        return jsonify({'error': 'Failed to list tests'}), 500

@laboratory_bp.route('/tests', methods=['POST'])
@jwt_required()
def create_test():
    """Create new lab test."""
    try:
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['sample_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Verify sample exists
        sample = LabSample.query.get(data['sample_id'])
        if not sample:
            return jsonify({'error': 'Sample not found'}), 404
        
        test_id = generate_test_id()
        
        # Parse dates
        scheduled_date = None
        due_date = None
        
        if data.get('scheduled_date'):
            try:
                scheduled_date = datetime.fromisoformat(data['scheduled_date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid scheduled_date format'}), 400
        
        if data.get('due_date'):
            try:
                due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid due_date format'}), 400
        
        test = LabTest(
            test_id=test_id,
            sample_id=data['sample_id'],
            protocol_id=data.get('protocol_id'),
            status=data.get('status', 'PENDING'),
            priority=data.get('priority', 'NORMAL'),
            scheduled_date=scheduled_date,
            due_date=due_date,
            assigned_to=data.get('assigned_to'),
            notes=data.get('notes'),
            sample_metadata=data.get('metadata', {}),
            created_by=current_user.id
        )
        
        db.session.add(test)
        db.session.commit()
        
        return jsonify({
            'message': 'Test created successfully',
            'test': test.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create test error: {str(e)}")
        return jsonify({'error': 'Failed to create test'}), 500

@laboratory_bp.route('/tests/<test_id>', methods=['GET'])
@jwt_required()
def get_test(test_id):
    """Get test details."""
    try:
        test = LabTest.query.get(test_id)
        if not test:
            return jsonify({'error': 'Test not found'}), 404
        
        return jsonify({'test': test.to_dict()}), 200
        
    except Exception as e:
        current_app.logger.error(f"Get test error: {str(e)}")
        return jsonify({'error': 'Failed to get test'}), 500

@laboratory_bp.route('/tests/<test_id>/start', methods=['POST'])
@jwt_required()
def start_test(test_id):
    """Start test execution."""
    try:
        test = LabTest.query.get(test_id)
        if not test:
            return jsonify({'error': 'Test not found'}), 404
        
        current_user = get_current_user()
        
        if test.status != 'PENDING':
            return jsonify({'error': 'Test is not in pending status'}), 400
        
        test.start_test(current_user.id)
        db.session.commit()
        
        return jsonify({
            'message': 'Test started successfully',
            'test': test.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Start test error: {str(e)}")
        return jsonify({'error': 'Failed to start test'}), 500

@laboratory_bp.route('/tests/<test_id>/complete', methods=['POST'])
@jwt_required()
def complete_test(test_id):
    """Complete test execution."""
    try:
        test = LabTest.query.get(test_id)
        if not test:
            return jsonify({'error': 'Test not found'}), 404
        
        current_user = get_current_user()
        data = request.get_json() or {}
        
        if test.status != 'IN_PROGRESS':
            return jsonify({'error': 'Test is not in progress'}), 400
        
        results = data.get('results', {})
        interpretation = data.get('interpretation')
        
        test.complete_test(current_user.id, results, interpretation)
        
        # Update additional fields if provided
        if 'recommendations' in data:
            test.recommendations = data['recommendations']
        if 'qc_passed' in data:
            test.qc_passed = data['qc_passed']
        if 'qc_notes' in data:
            test.qc_notes = data['qc_notes']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Test completed successfully',
            'test': test.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Complete test error: {str(e)}")
        return jsonify({'error': 'Failed to complete test'}), 500

# Equipment Management Routes
@laboratory_bp.route('/equipment', methods=['GET'])
@jwt_required()
def list_equipment():
    """List lab equipment."""
    try:
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        type_filter = request.args.get('type')
        status_filter = request.args.get('status')
        location_filter = request.args.get('location')
        
        query = LabEquipment.query
        
        if search:
            query = query.filter(
                or_(
                    LabEquipment.equipment_id.ilike(f'%{search}%'),
                    LabEquipment.name.ilike(f'%{search}%'),
                    LabEquipment.model.ilike(f'%{search}%')
                )
            )
        
        if type_filter:
            query = query.filter(LabEquipment.type == type_filter)
        
        if status_filter:
            query = query.filter(LabEquipment.status == status_filter)
        
        if location_filter:
            query = query.filter(LabEquipment.location == location_filter)
        
        query = query.order_by(LabEquipment.name)
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        equipment = [item.to_dict() for item in pagination.items]
        
        return jsonify({
            'equipment': equipment,
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
        current_app.logger.error(f"List equipment error: {str(e)}")
        return jsonify({'error': 'Failed to list equipment'}), 500

@laboratory_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_lab_stats():
    """Get laboratory statistics."""
    try:
        # Sample statistics
        total_samples = LabSample.query.count()
        samples_by_status = {}
        statuses = ['COLLECTED', 'PROCESSING', 'TESTED', 'ARCHIVED', 'DISPOSED']
        for status in statuses:
            samples_by_status[status] = LabSample.query.filter_by(status=status).count()
        
        # Test statistics
        total_tests = LabTest.query.count()
        tests_by_status = {}
        test_statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'ON_HOLD', 'CANCELLED']
        for status in test_statuses:
            tests_by_status[status] = LabTest.query.filter_by(status=status).count()
        
        # Equipment statistics
        total_equipment = LabEquipment.query.count()
        operational_equipment = LabEquipment.query.filter_by(status='OPERATIONAL').count()
        
        return jsonify({
            'samples': {
                'total': total_samples,
                'by_status': samples_by_status
            },
            'tests': {
                'total': total_tests,
                'by_status': tests_by_status
            },
            'equipment': {
                'total': total_equipment,
                'operational': operational_equipment
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get lab stats error: {str(e)}")
        return jsonify({'error': 'Failed to get laboratory statistics'}), 500

