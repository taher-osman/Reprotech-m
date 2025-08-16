from datetime import datetime, timezone
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from src.database import db
from src.models.user import User
from src.models.genomics import GenomicAnalysis, SNPData, BeadChipMapping
from src.models.animal import Animal
from src.models.laboratory import LabSample

genomics_bp = Blueprint('genomics', __name__)

def get_current_user():
    """Get current authenticated user."""
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

def generate_analysis_id():
    """Generate unique analysis ID."""
    import random
    import string
    
    year = datetime.now().year
    suffix = ''.join(random.choices(string.digits, k=6))
    analysis_id = f"GEN-{year}-{suffix}"
    
    while GenomicAnalysis.query.filter_by(analysis_id=analysis_id).first():
        suffix = ''.join(random.choices(string.digits, k=6))
        analysis_id = f"GEN-{year}-{suffix}"
    
    return analysis_id

def generate_mapping_id():
    """Generate unique mapping ID."""
    import random
    import string
    
    year = datetime.now().year
    suffix = ''.join(random.choices(string.digits, k=6))
    mapping_id = f"MAP-{year}-{suffix}"
    
    while BeadChipMapping.query.filter_by(mapping_id=mapping_id).first():
        suffix = ''.join(random.choices(string.digits, k=6))
        mapping_id = f"MAP-{year}-{suffix}"
    
    return mapping_id

# Genomic Analysis Routes
@genomics_bp.route('/analyses', methods=['GET'])
@jwt_required()
def list_analyses():
    """List genomic analyses with filtering and pagination."""
    try:
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        analysis_type_filter = request.args.get('analysis_type')
        status_filter = request.args.get('status')
        animal_id = request.args.get('animal_id')
        
        query = GenomicAnalysis.query
        
        if search:
            query = query.filter(
                or_(
                    GenomicAnalysis.analysis_id.ilike(f'%{search}%'),
                    GenomicAnalysis.analysis_name.ilike(f'%{search}%')
                )
            )
        
        if analysis_type_filter:
            query = query.filter(GenomicAnalysis.analysis_type == analysis_type_filter)
        
        if status_filter:
            query = query.filter(GenomicAnalysis.status == status_filter)
        
        if animal_id:
            query = query.filter(GenomicAnalysis.animal_id == animal_id)
        
        query = query.order_by(GenomicAnalysis.created_at.desc())
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        analyses = [analysis.to_dict() for analysis in pagination.items]
        
        return jsonify({
            'analyses': analyses,
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
        current_app.logger.error(f"List analyses error: {str(e)}")
        return jsonify({'error': 'Failed to list analyses'}), 500

@genomics_bp.route('/analyses', methods=['POST'])
@jwt_required()
def create_analysis():
    """Create new genomic analysis."""
    try:
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['analysis_type', 'analysis_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        analysis_id = generate_analysis_id()
        
        analysis = GenomicAnalysis(
            analysis_id=analysis_id,
            analysis_type=data['analysis_type'],
            analysis_name=data['analysis_name'],
            description=data.get('description'),
            animal_id=data.get('animal_id'),
            sample_id=data.get('sample_id'),
            parameters=data.get('parameters', {}),
            algorithm_version=data.get('algorithm_version'),
            reference_genome=data.get('reference_genome'),
            status=data.get('status', 'PENDING'),
            input_files=data.get('input_files', []),
            created_by=current_user.id
        )
        
        db.session.add(analysis)
        db.session.commit()
        
        return jsonify({
            'message': 'Analysis created successfully',
            'analysis': analysis.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create analysis error: {str(e)}")
        return jsonify({'error': 'Failed to create analysis'}), 500

@genomics_bp.route('/analyses/<analysis_id>', methods=['GET'])
@jwt_required()
def get_analysis(analysis_id):
    """Get analysis details."""
    try:
        analysis = GenomicAnalysis.query.get(analysis_id)
        if not analysis:
            return jsonify({'error': 'Analysis not found'}), 404
        
        return jsonify({'analysis': analysis.to_dict()}), 200
        
    except Exception as e:
        current_app.logger.error(f"Get analysis error: {str(e)}")
        return jsonify({'error': 'Failed to get analysis'}), 500

@genomics_bp.route('/analyses/<analysis_id>/start', methods=['POST'])
@jwt_required()
def start_analysis(analysis_id):
    """Start genomic analysis."""
    try:
        analysis = GenomicAnalysis.query.get(analysis_id)
        if not analysis:
            return jsonify({'error': 'Analysis not found'}), 404
        
        current_user = get_current_user()
        
        if analysis.status != 'PENDING':
            return jsonify({'error': 'Analysis is not in pending status'}), 400
        
        analysis.status = 'RUNNING'
        analysis.started_at = datetime.now(timezone.utc)
        analysis.processed_by = current_user.id
        
        db.session.commit()
        
        return jsonify({
            'message': 'Analysis started successfully',
            'analysis': analysis.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Start analysis error: {str(e)}")
        return jsonify({'error': 'Failed to start analysis'}), 500

@genomics_bp.route('/analyses/<analysis_id>/complete', methods=['POST'])
@jwt_required()
def complete_analysis(analysis_id):
    """Complete genomic analysis."""
    try:
        analysis = GenomicAnalysis.query.get(analysis_id)
        if not analysis:
            return jsonify({'error': 'Analysis not found'}), 404
        
        data = request.get_json() or {}
        
        if analysis.status != 'RUNNING':
            return jsonify({'error': 'Analysis is not running'}), 400
        
        analysis.status = 'COMPLETED'
        analysis.completed_at = datetime.now(timezone.utc)
        
        if analysis.started_at:
            duration = (analysis.completed_at - analysis.started_at).total_seconds()
            analysis.processing_time_seconds = int(duration)
        
        if 'results' in data:
            analysis.results = data['results']
        if 'confidence_score' in data:
            analysis.confidence_score = data['confidence_score']
        if 'quality_metrics' in data:
            analysis.quality_metrics = data['quality_metrics']
        if 'output_files' in data:
            analysis.output_files = data['output_files']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Analysis completed successfully',
            'analysis': analysis.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Complete analysis error: {str(e)}")
        return jsonify({'error': 'Failed to complete analysis'}), 500

# SNP Data Routes
@genomics_bp.route('/snp-data', methods=['GET'])
@jwt_required()
def list_snp_data():
    """List SNP data with filtering and pagination."""
    try:
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        animal_id = request.args.get('animal_id')
        chromosome = request.args.get('chromosome')
        analysis_id = request.args.get('analysis_id')
        
        query = SNPData.query
        
        if animal_id:
            query = query.filter(SNPData.animal_id == animal_id)
        
        if chromosome:
            query = query.filter(SNPData.chromosome == chromosome)
        
        if analysis_id:
            query = query.filter(SNPData.analysis_id == analysis_id)
        
        query = query.order_by(SNPData.chromosome, SNPData.position)
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        snp_data = [snp.to_dict() for snp in pagination.items]
        
        return jsonify({
            'snp_data': snp_data,
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
        current_app.logger.error(f"List SNP data error: {str(e)}")
        return jsonify({'error': 'Failed to list SNP data'}), 500

@genomics_bp.route('/snp-data/bulk', methods=['POST'])
@jwt_required()
def bulk_create_snp_data():
    """Bulk create SNP data."""
    try:
        data = request.get_json()
        
        if not data or 'snp_records' not in data:
            return jsonify({'error': 'SNP records are required'}), 400
        
        snp_records = data['snp_records']
        if not isinstance(snp_records, list):
            return jsonify({'error': 'SNP records must be a list'}), 400
        
        created_records = []
        
        for record in snp_records:
            snp = SNPData(
                animal_id=record.get('animal_id'),
                chromosome=record.get('chromosome'),
                position=record.get('position'),
                snp_id=record.get('snp_id'),
                reference_allele=record.get('reference_allele'),
                alternate_allele=record.get('alternate_allele'),
                genotype=record.get('genotype'),
                quality_score=record.get('quality_score'),
                read_depth=record.get('read_depth'),
                allele_frequency=record.get('allele_frequency'),
                analysis_id=record.get('analysis_id')
            )
            db.session.add(snp)
            created_records.append(snp)
        
        db.session.commit()
        
        return jsonify({
            'message': f'Successfully created {len(created_records)} SNP records',
            'count': len(created_records)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Bulk create SNP data error: {str(e)}")
        return jsonify({'error': 'Failed to create SNP data'}), 500

# BeadChip Mapping Routes
@genomics_bp.route('/beadchip-mappings', methods=['GET'])
@jwt_required()
def list_beadchip_mappings():
    """List BeadChip mappings."""
    try:
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        chip_type_filter = request.args.get('chip_type')
        animal_id = request.args.get('animal_id')
        
        query = BeadChipMapping.query
        
        if search:
            query = query.filter(
                or_(
                    BeadChipMapping.mapping_id.ilike(f'%{search}%'),
                    BeadChipMapping.array_id.ilike(f'%{search}%')
                )
            )
        
        if chip_type_filter:
            query = query.filter(BeadChipMapping.chip_type == chip_type_filter)
        
        if animal_id:
            query = query.filter(BeadChipMapping.animal_id == animal_id)
        
        query = query.order_by(BeadChipMapping.created_at.desc())
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        mappings = [mapping.to_dict() for mapping in pagination.items]
        
        return jsonify({
            'mappings': mappings,
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
        current_app.logger.error(f"List BeadChip mappings error: {str(e)}")
        return jsonify({'error': 'Failed to list BeadChip mappings'}), 500

@genomics_bp.route('/beadchip-mappings', methods=['POST'])
@jwt_required()
def create_beadchip_mapping():
    """Create new BeadChip mapping."""
    try:
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['chip_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        mapping_id = generate_mapping_id()
        
        mapping = BeadChipMapping(
            mapping_id=mapping_id,
            chip_type=data['chip_type'],
            chip_version=data.get('chip_version'),
            array_id=data.get('array_id'),
            animal_id=data.get('animal_id'),
            sample_id=data.get('sample_id'),
            probe_mappings=data.get('probe_mappings', {}),
            intensity_data=data.get('intensity_data', {}),
            call_rate=data.get('call_rate'),
            heterozygosity_rate=data.get('heterozygosity_rate'),
            quality_score=data.get('quality_score'),
            processing_software=data.get('processing_software'),
            processing_version=data.get('processing_version'),
            raw_data_file=data.get('raw_data_file'),
            processed_data_file=data.get('processed_data_file')
        )
        
        if data.get('processed_at'):
            try:
                mapping.processed_at = datetime.fromisoformat(data['processed_at'].replace('Z', '+00:00'))
                mapping.processed_by = current_user.id
            except ValueError:
                return jsonify({'error': 'Invalid processed_at format'}), 400
        
        db.session.add(mapping)
        db.session.commit()
        
        return jsonify({
            'message': 'BeadChip mapping created successfully',
            'mapping': mapping.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create BeadChip mapping error: {str(e)}")
        return jsonify({'error': 'Failed to create BeadChip mapping'}), 500

@genomics_bp.route('/beadchip-mappings/<mapping_id>', methods=['GET'])
@jwt_required()
def get_beadchip_mapping(mapping_id):
    """Get BeadChip mapping details."""
    try:
        mapping = BeadChipMapping.query.get(mapping_id)
        if not mapping:
            return jsonify({'error': 'Mapping not found'}), 404
        
        return jsonify({'mapping': mapping.to_dict()}), 200
        
    except Exception as e:
        current_app.logger.error(f"Get BeadChip mapping error: {str(e)}")
        return jsonify({'error': 'Failed to get BeadChip mapping'}), 500

@genomics_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_genomics_stats():
    """Get genomics statistics."""
    try:
        # Analysis statistics
        total_analyses = GenomicAnalysis.query.count()
        analyses_by_status = {}
        statuses = ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED']
        for status in statuses:
            analyses_by_status[status] = GenomicAnalysis.query.filter_by(status=status).count()
        
        # Analysis types
        analyses_by_type = {}
        analysis_types = GenomicAnalysis.query.with_entities(GenomicAnalysis.analysis_type).distinct().all()
        for analysis_type in analysis_types:
            if analysis_type[0]:
                analyses_by_type[analysis_type[0]] = GenomicAnalysis.query.filter_by(analysis_type=analysis_type[0]).count()
        
        # SNP data statistics
        total_snp_records = SNPData.query.count()
        animals_with_snp_data = SNPData.query.with_entities(SNPData.animal_id).distinct().count()
        
        # BeadChip statistics
        total_beadchip_mappings = BeadChipMapping.query.count()
        beadchip_by_type = {}
        chip_types = BeadChipMapping.query.with_entities(BeadChipMapping.chip_type).distinct().all()
        for chip_type in chip_types:
            if chip_type[0]:
                beadchip_by_type[chip_type[0]] = BeadChipMapping.query.filter_by(chip_type=chip_type[0]).count()
        
        return jsonify({
            'analyses': {
                'total': total_analyses,
                'by_status': analyses_by_status,
                'by_type': analyses_by_type
            },
            'snp_data': {
                'total_records': total_snp_records,
                'animals_with_data': animals_with_snp_data
            },
            'beadchip_mappings': {
                'total': total_beadchip_mappings,
                'by_type': beadchip_by_type
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get genomics stats error: {str(e)}")
        return jsonify({'error': 'Failed to get genomics statistics'}), 500

