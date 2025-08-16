#!/usr/bin/env python3
"""
Reprotech Backend with Branch Management
Production-ready Flask API with branch management capabilities
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from datetime import datetime, timedelta
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins="*")

# Configuration
app.config['SECRET_KEY'] = 'reprotech-production-key-2024'
app.config['DEBUG'] = False

# Sample production data
ANIMALS_DATA = [
    {
        "id": "HOL-1247",
        "name": "Bella",
        "breed": "Holstein",
        "age": "3y 5mo",
        "weight": 650,
        "customer": "Green Valley Farm",
        "health_status": "Healthy",
        "last_check": "2024-08-15",
        "microchip": "982000123456789",
        "breeding_value": 85.2,
        "genomic_accuracy": 92.1,
        "branch_id": 1,
        "internal_number": "GVF-BOV-001247"
    },
    {
        "id": "JER-0892", 
        "name": "Thunder",
        "breed": "Jersey",
        "age": "3y 9mo",
        "weight": 750,
        "customer": "Sunrise Ranch",
        "health_status": "Healthy",
        "last_check": "2024-08-14",
        "microchip": "982000987654321",
        "breeding_value": 92.1,
        "genomic_accuracy": 94.8,
        "branch_id": 1,
        "internal_number": "GVF-BOV-000892"
    },
    {
        "id": "ANG-1156",
        "name": "Princess", 
        "breed": "Angus",
        "age": "2y 7mo",
        "weight": 580,
        "customer": "Mountain View Dairy",
        "health_status": "Treatment",
        "last_check": "2024-08-16",
        "microchip": "982000456789123",
        "breeding_value": 78.9,
        "genomic_accuracy": 88.3,
        "branch_id": 1,
        "internal_number": "GVF-BOV-001156"
    }
]

# Dashboard statistics
DASHBOARD_STATS = {
    "total_animals": 1247,
    "active_procedures": 89,
    "success_rate": 94.2,
    "revenue": 2400000,
    "animals_change": 12,
    "procedures_change": 5,
    "success_change": 2.1,
    "revenue_change": 18
}

# Branch data
BRANCHES_DATA = [
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

# API Routes
@app.route('/')
def home():
    """API Health Check"""
    return jsonify({
        "message": "Reprotech Backend API - Production Ready with Branch Management",
        "version": "1.0.0",
        "status": "operational",
        "features": ["Branch Management", "Animal Assignment", "Internal Numbering"],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/dashboard/stats')
def dashboard_stats():
    """Dashboard Statistics"""
    return jsonify(DASHBOARD_STATS)

@app.route('/api/animals')
def get_animals():
    """Get all animals"""
    return jsonify(ANIMALS_DATA)

@app.route('/api/animals/<animal_id>')
def get_animal(animal_id):
    """Get specific animal"""
    animal = next((a for a in ANIMALS_DATA if a['id'] == animal_id), None)
    if animal:
        return jsonify(animal)
    return jsonify({"error": "Animal not found"}), 404

# Branch Management API Routes
@app.route('/api/branches', methods=['GET'])
def get_branches():
    """Get all branches with optional filtering"""
    try:
        # Get query parameters
        branch_type = request.args.get('branch_type')
        status = request.args.get('status')
        customer_id = request.args.get('customer_id')
        search = request.args.get('search')
        
        # Start with all branches
        branches = BRANCHES_DATA.copy()
        
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

@app.route('/api/branches/<int:branch_id>', methods=['GET'])
def get_branch(branch_id):
    """Get a specific branch by ID"""
    try:
        branch = next((b for b in BRANCHES_DATA if b['id'] == branch_id), None)
        
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

@app.route('/api/branches/<int:branch_id>/animals', methods=['GET'])
def get_branch_animals(branch_id):
    """Get all animals assigned to a specific branch"""
    try:
        # Check if branch exists
        branch = next((b for b in BRANCHES_DATA if b['id'] == branch_id), None)
        if not branch:
            return jsonify({
                'success': False,
                'error': 'Branch not found',
                'message': f'Branch with ID {branch_id} does not exist'
            }), 404
        
        # Get animals for this branch
        branch_animals = [animal for animal in ANIMALS_DATA if animal.get('branch_id') == branch_id]
        
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

@app.route('/api/branches/types', methods=['GET'])
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

@app.route('/api/branches/stats', methods=['GET'])
def get_branch_stats():
    """Get branch statistics and analytics"""
    try:
        # Calculate statistics
        total_branches = len(BRANCHES_DATA)
        active_branches = len([b for b in BRANCHES_DATA if b['status'] == 'active'])
        
        # Branch type distribution
        type_distribution = {}
        for branch in BRANCHES_DATA:
            branch_type = branch['branch_type']
            type_distribution[branch_type] = type_distribution.get(branch_type, 0) + 1
        
        # Total capacity and occupancy
        total_capacity = sum([b.get('capacity', 0) for b in BRANCHES_DATA])
        total_occupancy = sum([b.get('current_occupancy', 0) for b in BRANCHES_DATA])
        occupancy_rate = (total_occupancy / total_capacity * 100) if total_capacity > 0 else 0
        
        # Geographic distribution
        country_distribution = {}
        for branch in BRANCHES_DATA:
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

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("🚀 Starting Reprotech Backend API with Branch Management...")
    print("🏢 Branch management endpoints available")
    print("📊 Production-ready endpoints available")
    print("🔗 CORS enabled for frontend integration")
    print("💾 Sample production data loaded")
    print("🌐 Server running on http://0.0.0.0:5555")
    
    app.run(
        host='0.0.0.0',
        port=5555,
        debug=False,
        threaded=True
    )

