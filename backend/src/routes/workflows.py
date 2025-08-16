from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from src.database import db
from src.models.user import User
from src.models.workflow import Workflow, WorkflowInstance, WorkflowStepExecution

workflows_bp = Blueprint('workflows', __name__)

def get_current_user():
    """Get current authenticated user."""
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

def generate_workflow_id():
    """Generate unique workflow ID."""
    import random
    import string
    
    year = datetime.now().year
    suffix = ''.join(random.choices(string.digits, k=4))
    workflow_id = f"WF-{year}-{suffix}"
    
    while Workflow.query.filter_by(workflow_id=workflow_id).first():
        suffix = ''.join(random.choices(string.digits, k=4))
        workflow_id = f"WF-{year}-{suffix}"
    
    return workflow_id

def generate_instance_id():
    """Generate unique workflow instance ID."""
    import random
    import string
    
    year = datetime.now().year
    suffix = ''.join(random.choices(string.digits, k=6))
    instance_id = f"WFI-{year}-{suffix}"
    
    while WorkflowInstance.query.filter_by(instance_id=instance_id).first():
        suffix = ''.join(random.choices(string.digits, k=6))
        instance_id = f"WFI-{year}-{suffix}"
    
    return instance_id

# Workflow Definition Routes
@workflows_bp.route('', methods=['GET'])
@jwt_required()
def list_workflows():
    """List workflows with filtering and pagination."""
    try:
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        category_filter = request.args.get('category')
        active_only = request.args.get('active_only', 'true').lower() == 'true'
        templates_only = request.args.get('templates_only', 'false').lower() == 'true'
        
        query = Workflow.query
        
        if search:
            query = query.filter(
                or_(
                    Workflow.workflow_id.ilike(f'%{search}%'),
                    Workflow.name.ilike(f'%{search}%')
                )
            )
        
        if category_filter:
            query = query.filter(Workflow.category == category_filter)
        
        if active_only:
            query = query.filter(Workflow.is_active == True)
        
        if templates_only:
            query = query.filter(Workflow.is_template == True)
        
        query = query.order_by(Workflow.category, Workflow.name)
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        workflows = [workflow.to_dict() for workflow in pagination.items]
        
        return jsonify({
            'workflows': workflows,
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
        current_app.logger.error(f"List workflows error: {str(e)}")
        return jsonify({'error': 'Failed to list workflows'}), 500

@workflows_bp.route('', methods=['POST'])
@jwt_required()
def create_workflow():
    """Create new workflow."""
    try:
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['name', 'category', 'steps']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        workflow_id = generate_workflow_id()
        
        workflow = Workflow(
            workflow_id=workflow_id,
            name=data['name'],
            description=data.get('description'),
            category=data['category'],
            version=data.get('version', '1.0'),
            steps=data['steps'],
            transitions=data.get('transitions', {}),
            is_template=data.get('is_template', False),
            is_active=data.get('is_active', True),
            auto_start=data.get('auto_start', False),
            trigger_conditions=data.get('trigger_conditions', {}),
            input_parameters=data.get('input_parameters', {}),
            output_parameters=data.get('output_parameters', {}),
            estimated_duration_minutes=data.get('estimated_duration_minutes'),
            max_duration_minutes=data.get('max_duration_minutes'),
            allowed_roles=data.get('allowed_roles', []),
            allowed_users=data.get('allowed_users', []),
            created_by=current_user.id
        )
        
        db.session.add(workflow)
        db.session.commit()
        
        return jsonify({
            'message': 'Workflow created successfully',
            'workflow': workflow.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create workflow error: {str(e)}")
        return jsonify({'error': 'Failed to create workflow'}), 500

@workflows_bp.route('/<workflow_id>', methods=['GET'])
@jwt_required()
def get_workflow(workflow_id):
    """Get workflow details."""
    try:
        workflow = Workflow.query.get(workflow_id)
        if not workflow:
            return jsonify({'error': 'Workflow not found'}), 404
        
        include_instances = request.args.get('include_instances', 'false').lower() == 'true'
        
        return jsonify({
            'workflow': workflow.to_dict(include_instances=include_instances)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get workflow error: {str(e)}")
        return jsonify({'error': 'Failed to get workflow'}), 500

@workflows_bp.route('/<workflow_id>', methods=['PUT'])
@jwt_required()
def update_workflow(workflow_id):
    """Update workflow definition."""
    try:
        workflow = Workflow.query.get(workflow_id)
        if not workflow:
            return jsonify({'error': 'Workflow not found'}), 404
        
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        updatable_fields = [
            'name', 'description', 'steps', 'transitions', 'is_active', 'auto_start',
            'trigger_conditions', 'input_parameters', 'output_parameters',
            'estimated_duration_minutes', 'max_duration_minutes', 'allowed_roles', 'allowed_users'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(workflow, field, data[field])
        
        workflow.updated_by = current_user.id
        workflow.updated_at = datetime.now(timezone.utc)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Workflow updated successfully',
            'workflow': workflow.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update workflow error: {str(e)}")
        return jsonify({'error': 'Failed to update workflow'}), 500

# Workflow Instance Routes
@workflows_bp.route('/instances', methods=['GET'])
@jwt_required()
def list_instances():
    """List workflow instances with filtering and pagination."""
    try:
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        search = request.args.get('search', '').strip()
        status_filter = request.args.get('status')
        workflow_id = request.args.get('workflow_id')
        assigned_to = request.args.get('assigned_to')
        context_type = request.args.get('context_type')
        context_id = request.args.get('context_id')
        overdue_only = request.args.get('overdue_only', 'false').lower() == 'true'
        
        query = WorkflowInstance.query
        
        if search:
            query = query.filter(
                or_(
                    WorkflowInstance.instance_id.ilike(f'%{search}%'),
                    WorkflowInstance.name.ilike(f'%{search}%')
                )
            )
        
        if status_filter:
            query = query.filter(WorkflowInstance.status == status_filter)
        
        if workflow_id:
            query = query.filter(WorkflowInstance.workflow_id == workflow_id)
        
        if assigned_to:
            query = query.filter(WorkflowInstance.assigned_to == assigned_to)
        
        if context_type:
            query = query.filter(WorkflowInstance.context_type == context_type)
        
        if context_id:
            query = query.filter(WorkflowInstance.context_id == context_id)
        
        if overdue_only:
            now = datetime.now(timezone.utc)
            query = query.filter(
                and_(
                    WorkflowInstance.due_date.isnot(None),
                    WorkflowInstance.due_date < now,
                    WorkflowInstance.status.in_(['RUNNING', 'PAUSED', 'WAITING'])
                )
            )
        
        query = query.order_by(WorkflowInstance.created_at.desc())
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        instances = [instance.to_dict() for instance in pagination.items]
        
        return jsonify({
            'instances': instances,
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
        current_app.logger.error(f"List instances error: {str(e)}")
        return jsonify({'error': 'Failed to list instances'}), 500

@workflows_bp.route('/instances', methods=['POST'])
@jwt_required()
def create_instance():
    """Create new workflow instance."""
    try:
        current_user = get_current_user()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['workflow_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Verify workflow exists
        workflow = Workflow.query.get(data['workflow_id'])
        if not workflow:
            return jsonify({'error': 'Workflow not found'}), 404
        
        if not workflow.is_active:
            return jsonify({'error': 'Workflow is not active'}), 400
        
        instance_id = generate_instance_id()
        
        # Parse due date
        due_date = None
        if data.get('due_date'):
            try:
                due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid due_date format'}), 400
        
        instance = WorkflowInstance(
            instance_id=instance_id,
            workflow_id=data['workflow_id'],
            name=data.get('name'),
            description=data.get('description'),
            context_type=data.get('context_type'),
            context_id=data.get('context_id'),
            status=data.get('status', 'PENDING'),
            due_date=due_date,
            input_data=data.get('input_data', {}),
            assigned_to=data.get('assigned_to'),
            priority=data.get('priority', 'NORMAL'),
            created_by=current_user.id
        )
        
        db.session.add(instance)
        db.session.flush()
        
        # Create step executions based on workflow steps
        for i, step in enumerate(workflow.steps):
            step_execution = WorkflowStepExecution(
                instance_id=instance.id,
                step_name=step.get('name', f'Step {i+1}'),
                step_index=i,
                step_type=step.get('type', 'MANUAL'),
                input_data=step.get('input_data', {}),
                assigned_to=step.get('assigned_to') or data.get('assigned_to')
            )
            db.session.add(step_execution)
        
        # Auto-start if configured
        if workflow.auto_start:
            instance.start_instance(current_user.id)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Workflow instance created successfully',
            'instance': instance.to_dict(include_steps=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create instance error: {str(e)}")
        return jsonify({'error': 'Failed to create instance'}), 500

@workflows_bp.route('/instances/<instance_id>', methods=['GET'])
@jwt_required()
def get_instance(instance_id):
    """Get workflow instance details."""
    try:
        instance = WorkflowInstance.query.get(instance_id)
        if not instance:
            return jsonify({'error': 'Instance not found'}), 404
        
        include_steps = request.args.get('include_steps', 'false').lower() == 'true'
        
        return jsonify({
            'instance': instance.to_dict(include_steps=include_steps)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get instance error: {str(e)}")
        return jsonify({'error': 'Failed to get instance'}), 500

@workflows_bp.route('/instances/<instance_id>/start', methods=['POST'])
@jwt_required()
def start_instance(instance_id):
    """Start workflow instance."""
    try:
        instance = WorkflowInstance.query.get(instance_id)
        if not instance:
            return jsonify({'error': 'Instance not found'}), 404
        
        current_user = get_current_user()
        
        if instance.status != 'PENDING':
            return jsonify({'error': 'Instance is not in pending status'}), 400
        
        instance.start_instance(current_user.id)
        
        # Start first step if exists
        first_step = WorkflowStepExecution.query.filter_by(
            instance_id=instance.id, step_index=0
        ).first()
        
        if first_step:
            first_step.status = 'RUNNING'
            first_step.started_at = datetime.now(timezone.utc)
            instance.current_step = first_step.step_name
            instance.current_step_index = 0
        
        db.session.commit()
        
        return jsonify({
            'message': 'Instance started successfully',
            'instance': instance.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Start instance error: {str(e)}")
        return jsonify({'error': 'Failed to start instance'}), 500

@workflows_bp.route('/instances/<instance_id>/complete', methods=['POST'])
@jwt_required()
def complete_instance(instance_id):
    """Complete workflow instance."""
    try:
        instance = WorkflowInstance.query.get(instance_id)
        if not instance:
            return jsonify({'error': 'Instance not found'}), 404
        
        current_user = get_current_user()
        data = request.get_json() or {}
        
        if instance.status not in ['RUNNING', 'PAUSED']:
            return jsonify({'error': 'Instance is not running or paused'}), 400
        
        output_data = data.get('output_data', {})
        instance.complete_instance(current_user.id, output_data)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Instance completed successfully',
            'instance': instance.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Complete instance error: {str(e)}")
        return jsonify({'error': 'Failed to complete instance'}), 500

@workflows_bp.route('/instances/<instance_id>/pause', methods=['POST'])
@jwt_required()
def pause_instance(instance_id):
    """Pause workflow instance."""
    try:
        instance = WorkflowInstance.query.get(instance_id)
        if not instance:
            return jsonify({'error': 'Instance not found'}), 404
        
        current_user = get_current_user()
        data = request.get_json() or {}
        reason = data.get('reason')
        
        if instance.status != 'RUNNING':
            return jsonify({'error': 'Instance is not running'}), 400
        
        instance.pause_instance(current_user.id, reason)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Instance paused successfully',
            'instance': instance.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Pause instance error: {str(e)}")
        return jsonify({'error': 'Failed to pause instance'}), 500

@workflows_bp.route('/instances/<instance_id>/resume', methods=['POST'])
@jwt_required()
def resume_instance(instance_id):
    """Resume paused workflow instance."""
    try:
        instance = WorkflowInstance.query.get(instance_id)
        if not instance:
            return jsonify({'error': 'Instance not found'}), 404
        
        current_user = get_current_user()
        
        if instance.status != 'PAUSED':
            return jsonify({'error': 'Instance is not paused'}), 400
        
        instance.resume_instance(current_user.id)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Instance resumed successfully',
            'instance': instance.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Resume instance error: {str(e)}")
        return jsonify({'error': 'Failed to resume instance'}), 500

@workflows_bp.route('/instances/<instance_id>/steps/<step_id>/complete', methods=['POST'])
@jwt_required()
def complete_step(instance_id, step_id):
    """Complete workflow step."""
    try:
        step = WorkflowStepExecution.query.filter_by(
            id=step_id, instance_id=instance_id
        ).first()
        
        if not step:
            return jsonify({'error': 'Step not found'}), 404
        
        current_user = get_current_user()
        data = request.get_json() or {}
        
        if step.status != 'RUNNING':
            return jsonify({'error': 'Step is not running'}), 400
        
        step.status = 'COMPLETED'
        step.completed_at = datetime.now(timezone.utc)
        step.output_data = data.get('output_data', {})
        
        # Update instance progress
        instance = step.instance
        total_steps = len(instance.workflow.steps)
        completed_steps = WorkflowStepExecution.query.filter_by(
            instance_id=instance.id, status='COMPLETED'
        ).count()
        
        instance.progress_percentage = int((completed_steps / total_steps) * 100)
        
        # Check if this was the last step
        if completed_steps == total_steps:
            instance.complete_instance(current_user.id, data.get('output_data', {}))
        else:
            # Start next step if exists
            next_step = WorkflowStepExecution.query.filter_by(
                instance_id=instance.id, step_index=step.step_index + 1
            ).first()
            
            if next_step:
                next_step.status = 'RUNNING'
                next_step.started_at = datetime.now(timezone.utc)
                instance.current_step = next_step.step_name
                instance.current_step_index = next_step.step_index
        
        db.session.commit()
        
        return jsonify({
            'message': 'Step completed successfully',
            'step': step.to_dict(),
            'instance': instance.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Complete step error: {str(e)}")
        return jsonify({'error': 'Failed to complete step'}), 500

@workflows_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_workflow_stats():
    """Get workflow statistics."""
    try:
        # Workflow statistics
        total_workflows = Workflow.query.count()
        active_workflows = Workflow.query.filter_by(is_active=True).count()
        template_workflows = Workflow.query.filter_by(is_template=True).count()
        
        # Instance statistics
        total_instances = WorkflowInstance.query.count()
        instances_by_status = {}
        statuses = ['PENDING', 'RUNNING', 'PAUSED', 'COMPLETED', 'FAILED', 'CANCELLED', 'WAITING']
        for status in statuses:
            instances_by_status[status] = WorkflowInstance.query.filter_by(status=status).count()
        
        # Overdue instances
        now = datetime.now(timezone.utc)
        overdue_instances = WorkflowInstance.query.filter(
            and_(
                WorkflowInstance.due_date.isnot(None),
                WorkflowInstance.due_date < now,
                WorkflowInstance.status.in_(['RUNNING', 'PAUSED', 'WAITING'])
            )
        ).count()
        
        # Workflows by category
        workflows_by_category = {}
        categories = ['BREEDING', 'LABORATORY', 'CLINICAL', 'GENOMIC', 'ADMINISTRATIVE']
        for category in categories:
            workflows_by_category[category] = Workflow.query.filter_by(category=category).count()
        
        return jsonify({
            'workflows': {
                'total': total_workflows,
                'active': active_workflows,
                'templates': template_workflows,
                'by_category': workflows_by_category
            },
            'instances': {
                'total': total_instances,
                'by_status': instances_by_status,
                'overdue': overdue_instances
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get workflow stats error: {str(e)}")
        return jsonify({'error': 'Failed to get workflow statistics'}), 500

