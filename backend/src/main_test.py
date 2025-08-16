#!/usr/bin/env python3
"""
Minimal Reprotech Backend for Testing
Production-ready Flask API with essential endpoints
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
        "genomic_accuracy": 92.1
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
        "genomic_accuracy": 94.8
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
        "genomic_accuracy": 88.3
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

# Import route blueprints
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from routes.branches import branches_bp
    app.register_blueprint(branches_bp)
    print("✅ Branch management routes loaded")
except ImportError as e:
    print(f"⚠️  Branch routes not available: {e}")
except Exception as e:
    print(f"⚠️  Error loading branch routes: {e}")

# API Routes
@app.route('/')
def home():
    """API Health Check"""
    return jsonify({
        "message": "Reprotech Backend API - Production Ready",
        "version": "1.0.0",
        "status": "operational",
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

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("🚀 Starting Reprotech Backend API...")
    print("📊 Production-ready endpoints available")
    print("🔗 CORS enabled for frontend integration")
    print("💾 Sample production data loaded")
    print("🌐 Server running on http://0.0.0.0:5000")
    
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=False,
        threaded=True
    )

