"""
Branch Management API Routes
Handles all branch-related operations including CRUD, animal assignment, and internal numbering
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
import json

branches_bp = Blueprint('branches', __name__)

# Sample data for development (will be replaced with actual database operations)
sample_branches = [
    {
        'id': 1,
        'branch_code': 'GVF001',
        'name': 'Green Valley Farm - Main Campus',
        'branch_type': 'farm',
        'status': 'active',
        'address': '1234 Green Valley Road',
        'city': 'Farmington',
        'state_province': 'Iowa',
        'country': 'United States',
        'postal_code': '52626',
        'phone': '+1-319-555-0123',
        'email': 'info@greenvalleyfarm.com',
        'website': 'www.greenvalleyfarm.com',
        'latitude': '41.2033',
        'longitude': '-91.6955',
        'established_date': '1985-03-15T00:00:00',
        'license_number': 'USDA-IA-001234',
        'license_expiry': '2025-12-31T00:00:00',
        'capacity': 1200,
        'current_occupancy': 850,
        'manager_name': 'John Anderson',
        'manager_phone': '+1-319-555-0124',
        'manager_email': 'j.anderson@greenvalleyfarm.com',
        'parent_branch_id': None,
        'customer_id': 1,
        'services_offered': json.dumps([
            'Dairy Production', 'Breeding Services', 'Artificial Insemination', 
            'Embryo Transfer', 'Health Monitoring', 'Nutrition Consulting'
        ]),
        'equipment_list': json.dumps([
            'Automated Milking System (DeLaval VMS V300)',
            'Ultrasound Equipment (Aloka SSD-500)',
            'AI Equipment', 'Feed Mixers', 'Cooling Tanks'
        ]),
        'certifications': json.dumps([
            'Organic Certified (USDA)', 'Animal Welfare Approved',
            'ISO 9001:2015', 'HACCP Certified'
        ]),
        'operational_cost_center': 'CC-GVF-001',
        'budget_allocation': '$2,500,000',
        'created_at': '2024-01-15T08:00:00',
        'updated_at': '2024-08-16T10:30:00'
    },
    {
        'id': 2,
        'branch_code': 'URC001',
        'name': 'University Research Center - Genetics Lab',
        'branch_type': 'research_center',
        'status': 'active',
        'address': '567 University Avenue',
        'city': 'Ames',
        'state_province': 'Iowa',
        'country': 'United States',
        'postal_code': '50011',
        'phone': '+1-515-555-0200',
        'email': 'genetics@university.edu',
        'website': 'www.university.edu/genetics',
        'latitude': '42.0308',
        'longitude': '-93.6319',
        'established_date': '1995-09-01T00:00:00',
        'license_number': 'USDA-IA-005678',
        'license_expiry': '2026-06-30T00:00:00',
        'capacity': 300,
        'current_occupancy': 245,
        'manager_name': 'Dr. Sarah Mitchell',
        'manager_phone': '+1-515-555-0201',
        'manager_email': 's.mitchell@university.edu',
        'parent_branch_id': None,
        'customer_id': 2,
        'services_offered': json.dumps([
            'Genomic Analysis', 'DNA Sequencing', 'Genetic Testing',
            'Research Studies', 'Breeding Value Estimation', 'Parentage Verification'
        ]),
        'equipment_list': json.dumps([
            'DNA Sequencer (Illumina NovaSeq 6000)',
            'PCR Machines', 'Centrifuges', 'Microscopes',
            'Liquid Nitrogen Storage', 'Automated Pipetting Systems'
        ]),
        'certifications': json.dumps([
            'AAALAC Accredited', 'ISO 15189:2012',
            'CLIA Certified', 'Good Laboratory Practice (GLP)'
        ]),
        'operational_cost_center': 'CC-URC-001',
        'budget_allocation': '$1,800,000',
        'created_at': '2024-02-01T09:00:00',
        'updated_at': '2024-08-16T11:15:00'
    },
    {
        'id': 3,
        'branch_code': 'EVC001',
        'name': 'Elite Veterinary Clinic - Main Branch',
        'branch_type': 'clinic',
        'status': 'active',
        'address': '890 Veterinary Drive',
        'city': 'Cedar Rapids',
        'state_province': 'Iowa',
        'country': 'United States',
        'postal_code': '52402',
        'phone': '+1-319-555-0300',
        'email': 'info@elitevet.com',
        'website': 'www.elitevet.com',
        'latitude': '41.9778',
        'longitude': '-91.6656',
        'established_date': '2018-05-20T00:00:00',
        'license_number': 'IOWA-VET-009876',
        'license_expiry': '2025-05-20T00:00:00',
        'capacity': 150,
        'current_occupancy': 125,
        'manager_name': 'Dr. Michael Rodriguez',
        'manager_phone': '+1-319-555-0301',
        'manager_email': 'm.rodriguez@elitevet.com',
        'parent_branch_id': None,
        'customer_id': 3,
        'services_offered': json.dumps([
            'Veterinary Consultations', 'Surgery', 'Emergency Care',
            'Diagnostic Imaging', 'Laboratory Services', 'Preventive Care'
        ]),
        'equipment_list': json.dumps([
            'Digital X-Ray System', 'Ultrasound (Mindray DP-50)',
            'Surgical Suite', 'Laboratory Equipment',
            'Anesthesia Machines', 'Patient Monitoring Systems'
        ]),
        'certifications': json.dumps([
            'AAHA Accredited', 'State Veterinary License',
            'DEA Registration', 'OSHA Compliant'
        ]),
        'operational_cost_center': 'CC-EVC-001',
        'budget_allocation': '$950,000',
        'created_at': '2024-03-10T10:00:00',
        'updated_at': '2024-08-16T12:00:00'
    },
    {
        'id': 4,
        'branch_code': 'ADM001',
        'name': 'Agricultural Development Ministry - Central Lab',
        'branch_type': 'laboratory',
        'status': 'active',
        'address': '1500 Government Plaza',
        'city': 'Des Moines',
        'state_province': 'Iowa',
        'country': 'United States',
        'postal_code': '50319',
        'phone': '+1-515-555-0400',
        'email': 'lab@agriculture.gov',
        'website': 'www.agriculture.gov/lab',
        'latitude': '41.5868',
        'longitude': '-93.6250',
        'established_date': '1889-07-04T00:00:00',
        'license_number': 'USDA-FED-001122',
        'license_expiry': '2027-12-31T00:00:00',
        'capacity': 2000,
        'current_occupancy': 1250,
        'manager_name': 'Dr. Jennifer Chen',
        'manager_phone': '+1-515-555-0401',
        'manager_email': 'j.chen@agriculture.gov',
        'parent_branch_id': None,
        'customer_id': 4,
        'services_offered': json.dumps([
            'Disease Surveillance', 'Food Safety Testing', 'Environmental Monitoring',
            'Genetic Analysis', 'Pathogen Detection', 'Regulatory Compliance'
        ]),
        'equipment_list': json.dumps([
            'Mass Spectrometers', 'Real-time PCR Systems',
            'Automated Sample Processors', 'Biosafety Cabinets',
            'Electron Microscopes', 'Chromatography Systems'
        ]),
        'certifications': json.dumps([
            'ISO 17025:2017', 'FDA Registered', 'USDA Approved',
            'CDC Certified', 'Government Standards Compliant'
        ]),
        'operational_cost_center': 'CC-ADM-001',
        'budget_allocation': '$5,200,000',
        'created_at': '2024-01-01T00:00:00',
        'updated_at': '2024-08-16T13:30:00'
    }
]

sample_animal_numbering = [
    {
        'id': 1,
        'branch_id': 1,
        'species': 'Bovine',
        'internal_number': 'GVF-BOV-001247',
        'animal_id': 1,
        'is_active': True,
        'number_prefix': 'GVF-BOV',
        'number_sequence': 1247,
        'number_suffix': None,
        'assigned_date': '2024-01-15T08:00:00',
        'released_date': None
    },
    {
        'id': 2,
        'branch_id': 1,
        'species': 'Bovine',
        'internal_number': 'GVF-BOV-000892',
        'animal_id': 2,
        'is_active': True,
        'number_prefix': 'GVF-BOV',
        'number_sequence': 892,
        'number_suffix': None,
        'assigned_date': '2024-02-01T09:00:00',
        'released_date': None
    },
    {
        'id': 3,
        'branch_id': 1,
        'species': 'Bovine',
        'internal_number': 'GVF-BOV-001156',
        'animal_id': 3,
        'is_active': True,
        'number_prefix': 'GVF-BOV',
        'number_sequence': 1156,
        'number_suffix': None,
        'assigned_date': '2024-03-10T10:00:00',
        'released_date': None
    }
]

@branches_bp.route('/api/branches', methods=['GET'])
def get_branches():
    """
    Get all branches with optional filtering
    Query parameters:
    - branch_type: Filter by branch type
    - status: Filter by status
    - customer_id: Filter by customer
    - search: Search in name, code, or location
    """
    try:
        # Get query parameters
        branch_type = request.args.get('branch_type')
        status = request.args.get('status')
        customer_id = request.args.get('customer_id')
        search = request.args.get('search')
        
        # Start with all branches
        branches = sample_branches.copy()
        
        # Apply filters
        if branch_type:
            branches = [b for b in branches if b['branch_type'] == branch_type]
        
        if status:
            branches = [b for b in branches if b['status'] == status]
        
        if customer_id:
            branches = [b for b in branches if b['customer_id'] == int(customer_id)]
        
        if search:
            search_lower = search.lower()
            branches = [b for b in branches if 
                       search_lower in b['name'].lower() or 
                       search_lower in b['branch_code'].lower() or
                       search_lower in (b['city'] or '').lower() or
                       search_lower in (b['address'] or '').lower()]
        
        return jsonify({
            'success': True,
            'data': branches,
            'total': len(branches),
            'message': f'Retrieved {len(branches)} branches successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to retrieve branches'
        }), 500

@branches_bp.route('/api/branches/<int:branch_id>', methods=['GET'])
def get_branch(branch_id):
    """Get a specific branch by ID"""
    try:
        branch = next((b for b in sample_branches if b['id'] == branch_id), None)
        
        if not branch:
            return jsonify({
                'success': False,
                'error': 'Branch not found',
                'message': f'Branch with ID {branch_id} does not exist'
            }), 404
        
        return jsonify({
            'success': True,
            'data': branch,
            'message': 'Branch retrieved successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to retrieve branch'
        }), 500

@branches_bp.route('/api/branches', methods=['POST'])
def create_branch():
    """Create a new branch"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['branch_code', 'name', 'branch_type']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}',
                    'message': 'Please provide all required fields'
                }), 400
        
        # Check if branch code already exists
        existing_branch = next((b for b in sample_branches if b['branch_code'] == data['branch_code']), None)
        if existing_branch:
            return jsonify({
                'success': False,
                'error': 'Branch code already exists',
                'message': f'Branch with code {data["branch_code"]} already exists'
            }), 409
        
        # Create new branch
        new_branch = {
            'id': max([b['id'] for b in sample_branches]) + 1,
            'branch_code': data['branch_code'],
            'name': data['name'],
            'branch_type': data['branch_type'],
            'status': data.get('status', 'active'),
            'address': data.get('address'),
            'city': data.get('city'),
            'state_province': data.get('state_province'),
            'country': data.get('country'),
            'postal_code': data.get('postal_code'),
            'phone': data.get('phone'),
            'email': data.get('email'),
            'website': data.get('website'),
            'latitude': data.get('latitude'),
            'longitude': data.get('longitude'),
            'established_date': data.get('established_date'),
            'license_number': data.get('license_number'),
            'license_expiry': data.get('license_expiry'),
            'capacity': data.get('capacity', 0),
            'current_occupancy': data.get('current_occupancy', 0),
            'manager_name': data.get('manager_name'),
            'manager_phone': data.get('manager_phone'),
            'manager_email': data.get('manager_email'),
            'parent_branch_id': data.get('parent_branch_id'),
            'customer_id': data.get('customer_id'),
            'services_offered': json.dumps(data.get('services_offered', [])),
            'equipment_list': json.dumps(data.get('equipment_list', [])),
            'certifications': json.dumps(data.get('certifications', [])),
            'operational_cost_center': data.get('operational_cost_center'),
            'budget_allocation': data.get('budget_allocation'),
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        sample_branches.append(new_branch)
        
        return jsonify({
            'success': True,
            'data': new_branch,
            'message': 'Branch created successfully'
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to create branch'
        }), 500

@branches_bp.route('/api/branches/<int:branch_id>', methods=['PUT'])
def update_branch(branch_id):
    """Update an existing branch"""
    try:
        data = request.get_json()
        
        # Find the branch
        branch_index = next((i for i, b in enumerate(sample_branches) if b['id'] == branch_id), None)
        if branch_index is None:
            return jsonify({
                'success': False,
                'error': 'Branch not found',
                'message': f'Branch with ID {branch_id} does not exist'
            }), 404
        
        # Update branch data
        branch = sample_branches[branch_index]
        
        # Update fields if provided
        updatable_fields = [
            'name', 'branch_type', 'status', 'address', 'city', 'state_province',
            'country', 'postal_code', 'phone', 'email', 'website', 'latitude',
            'longitude', 'established_date', 'license_number', 'license_expiry',
            'capacity', 'current_occupancy', 'manager_name', 'manager_phone',
            'manager_email', 'parent_branch_id', 'customer_id', 'operational_cost_center',
            'budget_allocation'
        ]
        
        for field in updatable_fields:
            if field in data:
                branch[field] = data[field]
        
        # Handle JSON fields
        if 'services_offered' in data:
            branch['services_offered'] = json.dumps(data['services_offered'])
        if 'equipment_list' in data:
            branch['equipment_list'] = json.dumps(data['equipment_list'])
        if 'certifications' in data:
            branch['certifications'] = json.dumps(data['certifications'])
        
        branch['updated_at'] = datetime.utcnow().isoformat()
        
        return jsonify({
            'success': True,
            'data': branch,
            'message': 'Branch updated successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to update branch'
        }), 500

@branches_bp.route('/api/branches/<int:branch_id>', methods=['DELETE'])
def delete_branch(branch_id):
    """Delete a branch (soft delete by setting status to inactive)"""
    try:
        # Find the branch
        branch_index = next((i for i, b in enumerate(sample_branches) if b['id'] == branch_id), None)
        if branch_index is None:
            return jsonify({
                'success': False,
                'error': 'Branch not found',
                'message': f'Branch with ID {branch_id} does not exist'
            }), 404
        
        # Soft delete by setting status to inactive
        sample_branches[branch_index]['status'] = 'inactive'
        sample_branches[branch_index]['updated_at'] = datetime.utcnow().isoformat()
        
        return jsonify({
            'success': True,
            'message': 'Branch deactivated successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to delete branch'
        }), 500

@branches_bp.route('/api/branches/<int:branch_id>/animals', methods=['GET'])
def get_branch_animals(branch_id):
    """Get all animals assigned to a specific branch"""
    try:
        # Check if branch exists
        branch = next((b for b in sample_branches if b['id'] == branch_id), None)
        if not branch:
            return jsonify({
                'success': False,
                'error': 'Branch not found',
                'message': f'Branch with ID {branch_id} does not exist'
            }), 404
        
        # Get animals for this branch (this would be a database query in real implementation)
        branch_animals = [
            {
                'id': 1,
                'ear_tag': 'HOL-1247',
                'name': 'Bella',
                'species': 'Bovine',
                'breed': 'Holstein',
                'internal_number': 'GVF-BOV-001247',
                'status': 'Active',
                'branch_id': branch_id
            },
            {
                'id': 2,
                'ear_tag': 'JER-0892',
                'name': 'Thunder',
                'species': 'Bovine',
                'breed': 'Jersey',
                'internal_number': 'GVF-BOV-000892',
                'status': 'Active',
                'branch_id': branch_id
            },
            {
                'id': 3,
                'ear_tag': 'ANG-1156',
                'name': 'Princess',
                'species': 'Bovine',
                'breed': 'Angus',
                'internal_number': 'GVF-BOV-001156',
                'status': 'Active',
                'branch_id': branch_id
            }
        ] if branch_id == 1 else []
        
        return jsonify({
            'success': True,
            'data': branch_animals,
            'total': len(branch_animals),
            'branch': {
                'id': branch['id'],
                'name': branch['name'],
                'branch_code': branch['branch_code']
            },
            'message': f'Retrieved {len(branch_animals)} animals for branch {branch["name"]}'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to retrieve branch animals'
        }), 500

@branches_bp.route('/api/branches/<int:branch_id>/numbering/next', methods=['GET'])
def get_next_internal_number(branch_id):
    """Get the next available internal number for a species in a branch"""
    try:
        species = request.args.get('species', 'Bovine')
        
        # Check if branch exists
        branch = next((b for b in sample_branches if b['id'] == branch_id), None)
        if not branch:
            return jsonify({
                'success': False,
                'error': 'Branch not found',
                'message': f'Branch with ID {branch_id} does not exist'
            }), 404
        
        # Get existing numbers for this branch and species
        existing_numbers = [n for n in sample_animal_numbering 
                          if n['branch_id'] == branch_id and n['species'] == species and n['is_active']]
        
        # Calculate next sequence number
        if existing_numbers:
            max_sequence = max([n['number_sequence'] for n in existing_numbers])
            next_sequence = max_sequence + 1
        else:
            next_sequence = 1
        
        # Generate prefix based on branch code and species
        branch_code = branch['branch_code']
        species_prefix = {
            'Bovine': 'BOV',
            'Equine': 'EQU',
            'Ovine': 'OVI',
            'Caprine': 'CAP',
            'Porcine': 'POR'
        }.get(species, 'UNK')
        
        prefix = f"{branch_code}-{species_prefix}"
        next_internal_number = f"{prefix}-{next_sequence:06d}"
        
        return jsonify({
            'success': True,
            'data': {
                'next_internal_number': next_internal_number,
                'prefix': prefix,
                'sequence': next_sequence,
                'species': species,
                'branch_id': branch_id,
                'branch_code': branch_code
            },
            'message': f'Next internal number generated for {species} in {branch["name"]}'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to generate next internal number'
        }), 500

@branches_bp.route('/api/branches/<int:branch_id>/numbering/assign', methods=['POST'])
def assign_internal_number(branch_id):
    """Assign an internal number to an animal"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['animal_id', 'species', 'internal_number']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}',
                    'message': 'Please provide all required fields'
                }), 400
        
        # Check if branch exists
        branch = next((b for b in sample_branches if b['id'] == branch_id), None)
        if not branch:
            return jsonify({
                'success': False,
                'error': 'Branch not found',
                'message': f'Branch with ID {branch_id} does not exist'
            }), 404
        
        # Check if internal number already exists for active animals of same species in same branch
        existing_number = next((n for n in sample_animal_numbering 
                              if n['branch_id'] == branch_id and 
                                 n['species'] == data['species'] and 
                                 n['internal_number'] == data['internal_number'] and 
                                 n['is_active']), None)
        
        if existing_number:
            return jsonify({
                'success': False,
                'error': 'Internal number already exists',
                'message': f'Internal number {data["internal_number"]} already assigned to active {data["species"]} in this branch'
            }), 409
        
        # Create new numbering record
        new_numbering = {
            'id': max([n['id'] for n in sample_animal_numbering]) + 1 if sample_animal_numbering else 1,
            'branch_id': branch_id,
            'species': data['species'],
            'internal_number': data['internal_number'],
            'animal_id': data['animal_id'],
            'is_active': True,
            'number_prefix': data.get('number_prefix'),
            'number_sequence': data.get('number_sequence'),
            'number_suffix': data.get('number_suffix'),
            'assigned_date': datetime.utcnow().isoformat(),
            'released_date': None
        }
        
        sample_animal_numbering.append(new_numbering)
        
        return jsonify({
            'success': True,
            'data': new_numbering,
            'message': f'Internal number {data["internal_number"]} assigned successfully'
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to assign internal number'
        }), 500

@branches_bp.route('/api/branches/types', methods=['GET'])
def get_branch_types():
    """Get all available branch types"""
    try:
        branch_types = [
            {'value': 'farm', 'label': 'Farm', 'description': 'Agricultural production facility'},
            {'value': 'laboratory', 'label': 'Laboratory', 'description': 'Testing and analysis facility'},
            {'value': 'clinic', 'label': 'Clinic', 'description': 'Veterinary care facility'},
            {'value': 'research_center', 'label': 'Research Center', 'description': 'Research and development facility'},
            {'value': 'processing_facility', 'label': 'Processing Facility', 'description': 'Product processing facility'},
            {'value': 'breeding_center', 'label': 'Breeding Center', 'description': 'Specialized breeding facility'},
            {'value': 'quarantine_facility', 'label': 'Quarantine Facility', 'description': 'Animal quarantine and isolation'},
            {'value': 'training_center', 'label': 'Training Center', 'description': 'Education and training facility'}
        ]
        
        return jsonify({
            'success': True,
            'data': branch_types,
            'message': 'Branch types retrieved successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to retrieve branch types'
        }), 500

@branches_bp.route('/api/branches/stats', methods=['GET'])
def get_branch_stats():
    """Get branch statistics and analytics"""
    try:
        # Calculate statistics
        total_branches = len(sample_branches)
        active_branches = len([b for b in sample_branches if b['status'] == 'active'])
        
        # Branch type distribution
        type_distribution = {}
        for branch in sample_branches:
            branch_type = branch['branch_type']
            type_distribution[branch_type] = type_distribution.get(branch_type, 0) + 1
        
        # Total capacity and occupancy
        total_capacity = sum([b.get('capacity', 0) for b in sample_branches])
        total_occupancy = sum([b.get('current_occupancy', 0) for b in sample_branches])
        occupancy_rate = (total_occupancy / total_capacity * 100) if total_capacity > 0 else 0
        
        # Geographic distribution
        country_distribution = {}
        for branch in sample_branches:
            country = branch.get('country', 'Unknown')
            country_distribution[country] = country_distribution.get(country, 0) + 1
        
        stats = {
            'total_branches': total_branches,
            'active_branches': active_branches,
            'inactive_branches': total_branches - active_branches,
            'total_capacity': total_capacity,
            'total_occupancy': total_occupancy,
            'occupancy_rate': round(occupancy_rate, 1),
            'type_distribution': type_distribution,
            'country_distribution': country_distribution,
            'average_capacity': round(total_capacity / total_branches, 0) if total_branches > 0 else 0
        }
        
        return jsonify({
            'success': True,
            'data': stats,
            'message': 'Branch statistics retrieved successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to retrieve branch statistics'
        }), 500

