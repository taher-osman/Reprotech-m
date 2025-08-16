from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from src.database import db
from src.models.user import User
from src.models.biobank import BiobankStorageUnit, BiobankSample, TemperatureLog

biobank_bp = Blueprint('biobank', __name__)

def get_current_user():
    """Get current authenticated user."""
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

def generate_unit_id():
    """Generate unique storage unit ID."""
    import random
    import string
    
    year = datetime.now().year
    suffix = ''.join(random.choices(string.digits, k=4))
    unit_id = f"STU-{year}-{suffix}"
    
    while BiobankStorageUnit.query.filter_by(unit_id=unit_id).first():
        suffix = ''.join(random.choices(string.digits, k=4))
        unit_id = f"STU-{year}-{suffix}"
    
    return unit_id

def generate_sample_id():
    """Generate unique biobank sample ID."""
    import random
    import string
    
    year = datetime.now().year
    suffix = ''.join(random.choices(string.digits, k=6))
    sample_id = f"BIO-{year}-{suffix}"
    
    while BiobankSample.query.filter_by(sample_id=sample_id).first():
        suffix = ''.join(random.choices(string.digits, k=6))
        sample_id = f"BIO-{year}-{suffix}"
    
    return sample_id

# Storage Unit Management Routes
@biobank_bp.route('/storage-units', methods=['GET'])
@jwt_required()
def list_storage_units():
    """List biobank storage units with filtering and pagination."""
    try:
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        unit_type_filter = request.args.get('unit_type')
        status_filter = request.args.get('status')
        location_filter = request.args.get('location')
        
        query = BiobankStorageUnit.query
        
        if search:
            query = query.filter(
                or_(
                    BiobankStorageUnit.unit_id.ilike(f'%{search}%'),
                    BiobankStorageUnit.name.ilike(f'%{search}%'),
                    BiobankStorageUnit.location.ilike(f'%{search}%')
                )
            )
        
        if unit_type_filter:
            query = query.filter(BiobankStorageUnit.unit_type == unit_type_filter)
        
        if status_filter:
            query = query.filter(BiobankStorageUnit.status == status_filter)
        
        if location_filter:
            query = query.filter(BiobankStorageUnit.location.ilike(f'%{location_filter}%'))
        
        query = query.order_by(BiobankStorageUnit.name)
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        units = [unit.to_dict() for unit in pagination.items]
        
        return jsonify({
            'storage_units': units,
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
        current_app.logger.error(f"List storage units error: {str(e)}")
        return jsonify({'error': 'Failed to list storage units'}), 500

@biobank_bp.route('/storage-units', methods=['POST'])
@jwt_required()
def create_storage_unit():
    """Create new biobank storage unit."""
    try:
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['name', 'unit_type', 'total_capacity']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        unit_id = generate_unit_id()
        
        unit = BiobankStorageUnit(
            unit_id=unit_id,
            name=data['name'],
            unit_type=data['unit_type'],
            location=data.get('location'),
            building=data.get('building'),
            room=data.get('room'),
            total_capacity=data['total_capacity'],
            current_occupancy=data.get('current_occupancy', 0),
            target_temperature=data.get('target_temperature'),
            current_temperature=data.get('current_temperature'),
            temperature_tolerance=data.get('temperature_tolerance'),
            humidity_level=data.get('humidity_level'),
            status=data.get('status', 'OPERATIONAL'),
            temperature_alerts_enabled=data.get('temperature_alerts_enabled', True),
            capacity_alert_threshold=data.get('capacity_alert_threshold', 90.0),
            specifications=data.get('specifications', {}),
            notes=data.get('notes'),
            created_by=current_user.id
        )
        
        # Parse maintenance dates
        if data.get('last_maintenance'):
            try:
                unit.last_maintenance = datetime.fromisoformat(data['last_maintenance'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid last_maintenance format'}), 400
        
        if data.get('next_maintenance'):
            try:
                unit.next_maintenance = datetime.fromisoformat(data['next_maintenance'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid next_maintenance format'}), 400
        
        db.session.add(unit)
        db.session.commit()
        
        return jsonify({
            'message': 'Storage unit created successfully',
            'storage_unit': unit.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create storage unit error: {str(e)}")
        return jsonify({'error': 'Failed to create storage unit'}), 500

@biobank_bp.route('/storage-units/<unit_id>', methods=['GET'])
@jwt_required()
def get_storage_unit(unit_id):
    """Get storage unit details."""
    try:
        unit = BiobankStorageUnit.query.get(unit_id)
        if not unit:
            return jsonify({'error': 'Storage unit not found'}), 404
        
        include_samples = request.args.get('include_samples', 'false').lower() == 'true'
        
        return jsonify({
            'storage_unit': unit.to_dict(include_samples=include_samples)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get storage unit error: {str(e)}")
        return jsonify({'error': 'Failed to get storage unit'}), 500

@biobank_bp.route('/storage-units/<unit_id>', methods=['PUT'])
@jwt_required()
def update_storage_unit(unit_id):
    """Update storage unit information."""
    try:
        unit = BiobankStorageUnit.query.get(unit_id)
        if not unit:
            return jsonify({'error': 'Storage unit not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        updatable_fields = [
            'name', 'location', 'building', 'room', 'total_capacity',
            'target_temperature', 'current_temperature', 'temperature_tolerance',
            'humidity_level', 'status', 'temperature_alerts_enabled',
            'capacity_alert_threshold', 'specifications', 'notes'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(unit, field, data[field])
        
        # Handle maintenance dates
        if 'last_maintenance' in data and data['last_maintenance']:
            try:
                unit.last_maintenance = datetime.fromisoformat(data['last_maintenance'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid last_maintenance format'}), 400
        
        if 'next_maintenance' in data and data['next_maintenance']:
            try:
                unit.next_maintenance = datetime.fromisoformat(data['next_maintenance'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid next_maintenance format'}), 400
        
        unit.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        
        return jsonify({
            'message': 'Storage unit updated successfully',
            'storage_unit': unit.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update storage unit error: {str(e)}")
        return jsonify({'error': 'Failed to update storage unit'}), 500

@biobank_bp.route('/storage-units/<unit_id>/temperature-log', methods=['POST'])
@jwt_required()
def log_temperature(unit_id):
    """Log temperature reading for storage unit."""
    try:
        unit = BiobankStorageUnit.query.get(unit_id)
        if not unit:
            return jsonify({'error': 'Storage unit not found'}), 404
        
        data = request.get_json()
        if not data or 'temperature' not in data:
            return jsonify({'error': 'Temperature is required'}), 400
        
        temperature = data['temperature']
        humidity = data.get('humidity')
        
        # Update unit's current temperature
        unit.current_temperature = temperature
        if humidity:
            unit.humidity_level = humidity
        
        # Check if temperature is within range
        is_within_range = unit.is_temperature_in_range
        alert_triggered = not is_within_range and unit.temperature_alerts_enabled
        
        # Create temperature log
        temp_log = TemperatureLog(
            storage_unit_id=unit.id,
            temperature=temperature,
            humidity=humidity,
            is_within_range=is_within_range,
            alert_triggered=alert_triggered
        )
        
        db.session.add(temp_log)
        
        # Update unit status if temperature is out of range
        if alert_triggered:
            unit.status = 'ALARM'
        elif unit.status == 'ALARM' and is_within_range:
            unit.status = 'OPERATIONAL'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Temperature logged successfully',
            'temperature_log': temp_log.to_dict(),
            'alert_triggered': alert_triggered
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Log temperature error: {str(e)}")
        return jsonify({'error': 'Failed to log temperature'}), 500

# Sample Management Routes
@biobank_bp.route('/samples', methods=['GET'])
@jwt_required()
def list_samples():
    """List biobank samples with filtering and pagination."""
    try:
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        sample_type_filter = request.args.get('sample_type')
        status_filter = request.args.get('status')
        storage_unit_id = request.args.get('storage_unit_id')
        animal_id = request.args.get('animal_id')
        customer_id = request.args.get('customer_id')
        expiring_soon = request.args.get('expiring_soon', 'false').lower() == 'true'
        
        query = BiobankSample.query
        
        if search:
            query = query.filter(
                or_(
                    BiobankSample.sample_id.ilike(f'%{search}%'),
                    BiobankSample.sample_name.ilike(f'%{search}%'),
                    BiobankSample.container_id.ilike(f'%{search}%')
                )
            )
        
        if sample_type_filter:
            query = query.filter(BiobankSample.sample_type == sample_type_filter)
        
        if status_filter:
            query = query.filter(BiobankSample.status == status_filter)
        
        if storage_unit_id:
            query = query.filter(BiobankSample.storage_unit_id == storage_unit_id)
        
        if animal_id:
            query = query.filter(BiobankSample.animal_id == animal_id)
        
        if customer_id:
            query = query.filter(BiobankSample.customer_id == customer_id)
        
        if expiring_soon:
            # Samples expiring within 30 days
            thirty_days_from_now = datetime.now(timezone.utc) + timedelta(days=30)
            query = query.filter(
                and_(
                    BiobankSample.expiry_date.isnot(None),
                    BiobankSample.expiry_date <= thirty_days_from_now
                )
            )
        
        query = query.order_by(BiobankSample.storage_date.desc())
        
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
        current_app.logger.error(f"List biobank samples error: {str(e)}")
        return jsonify({'error': 'Failed to list samples'}), 500

@biobank_bp.route('/samples', methods=['POST'])
@jwt_required()
def create_sample():
    """Create new biobank sample."""
    try:
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['sample_type', 'storage_unit_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Verify storage unit exists and has capacity
        storage_unit = BiobankStorageUnit.query.get(data['storage_unit_id'])
        if not storage_unit:
            return jsonify({'error': 'Storage unit not found'}), 404
        
        if storage_unit.available_capacity <= 0:
            return jsonify({'error': 'Storage unit is at full capacity'}), 400
        
        sample_id = generate_sample_id()
        
        # Parse dates
        collection_date = None
        expiry_date = None
        
        if data.get('collection_date'):
            try:
                collection_date = datetime.fromisoformat(data['collection_date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid collection_date format'}), 400
        
        if data.get('expiry_date'):
            try:
                expiry_date = datetime.fromisoformat(data['expiry_date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid expiry_date format'}), 400
        
        sample = BiobankSample(
            sample_id=sample_id,
            sample_type=data['sample_type'],
            sample_name=data.get('sample_name'),
            description=data.get('description'),
            animal_id=data.get('animal_id'),
            customer_id=data.get('customer_id'),
            lab_sample_id=data.get('lab_sample_id'),
            storage_unit_id=data['storage_unit_id'],
            position=data.get('position'),
            container_type=data.get('container_type'),
            container_id=data.get('container_id'),
            volume=data.get('volume'),
            unit=data.get('unit'),
            concentration=data.get('concentration'),
            concentration_unit=data.get('concentration_unit'),
            status=data.get('status', 'STORED'),
            quality_rating=data.get('quality_rating'),
            viability_percentage=data.get('viability_percentage'),
            collection_date=collection_date,
            expiry_date=expiry_date,
            storage_conditions=data.get('storage_conditions'),
            handling_instructions=data.get('handling_instructions'),
            sample_metadata=data.get('metadata', {}),
            notes=data.get('notes'),
            created_by=current_user.id
        )
        
        db.session.add(sample)
        
        # Update storage unit occupancy
        storage_unit.add_sample(1)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Sample created successfully',
            'sample': sample.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create biobank sample error: {str(e)}")
        return jsonify({'error': 'Failed to create sample'}), 500

@biobank_bp.route('/samples/<sample_id>', methods=['GET'])
@jwt_required()
def get_sample(sample_id):
    """Get biobank sample details."""
    try:
        sample = BiobankSample.query.get(sample_id)
        if not sample:
            return jsonify({'error': 'Sample not found'}), 404
        
        return jsonify({'sample': sample.to_dict()}), 200
        
    except Exception as e:
        current_app.logger.error(f"Get biobank sample error: {str(e)}")
        return jsonify({'error': 'Failed to get sample'}), 500

@biobank_bp.route('/samples/<sample_id>/access', methods=['POST'])
@jwt_required()
def access_sample(sample_id):
    """Record sample access."""
    try:
        sample = BiobankSample.query.get(sample_id)
        if not sample:
            return jsonify({'error': 'Sample not found'}), 404
        
        current_user = get_current_user()
        sample.access_sample(current_user.id)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Sample access recorded successfully',
            'sample': sample.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Access sample error: {str(e)}")
        return jsonify({'error': 'Failed to record sample access'}), 500

@biobank_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_biobank_stats():
    """Get biobank statistics."""
    try:
        # Storage unit statistics
        total_units = BiobankStorageUnit.query.count()
        operational_units = BiobankStorageUnit.query.filter_by(status='OPERATIONAL').count()
        
        # Capacity statistics
        total_capacity = db.session.query(db.func.sum(BiobankStorageUnit.total_capacity)).scalar() or 0
        total_occupancy = db.session.query(db.func.sum(BiobankStorageUnit.current_occupancy)).scalar() or 0
        capacity_utilization = (total_occupancy / total_capacity * 100) if total_capacity > 0 else 0
        
        # Sample statistics
        total_samples = BiobankSample.query.count()
        samples_by_status = {}
        statuses = ['STORED', 'IN_USE', 'DEPLETED', 'DISCARDED', 'TRANSFERRED']
        for status in statuses:
            samples_by_status[status] = BiobankSample.query.filter_by(status=status).count()
        
        # Samples by type
        samples_by_type = {}
        sample_types = BiobankSample.query.with_entities(BiobankSample.sample_type).distinct().all()
        for sample_type in sample_types:
            if sample_type[0]:
                samples_by_type[sample_type[0]] = BiobankSample.query.filter_by(sample_type=sample_type[0]).count()
        
        # Expiring samples (within 30 days)
        thirty_days_from_now = datetime.now(timezone.utc) + timedelta(days=30)
        expiring_samples = BiobankSample.query.filter(
            and_(
                BiobankSample.expiry_date.isnot(None),
                BiobankSample.expiry_date <= thirty_days_from_now,
                BiobankSample.status == 'STORED'
            )
        ).count()
        
        return jsonify({
            'storage_units': {
                'total': total_units,
                'operational': operational_units
            },
            'capacity': {
                'total_capacity': total_capacity,
                'total_occupancy': total_occupancy,
                'utilization_percentage': round(capacity_utilization, 2)
            },
            'samples': {
                'total': total_samples,
                'by_status': samples_by_status,
                'by_type': samples_by_type,
                'expiring_soon': expiring_samples
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get biobank stats error: {str(e)}")
        return jsonify({'error': 'Failed to get biobank statistics'}), 500

