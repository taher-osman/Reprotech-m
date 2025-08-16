from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
import logging

# Import database and models
from src.database import db, init_db
from src.models.user import User
from src.models.customer import Customer
from src.models.animal import Animal

# Import simplified routes
from src.routes.auth_simple import auth_simple_bp

def create_simple_app():
    """Create simplified Flask application for testing"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///reprotech_simple.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'jwt-secret-change-in-production'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    
    # Enable CORS
    CORS(app, origins="*", supports_credentials=True)
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    # Register blueprints
    app.register_blueprint(auth_simple_bp, url_prefix='/api/v1/auth')
    
    # Health check endpoint
    @app.route('/api/v1/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Reprotech Simple Backend is running',
            'version': '1.0.0-simple'
        })
    
    # API info endpoint
    @app.route('/api/v1/info')
    def api_info():
        return jsonify({
            'name': 'Reprotech Simple API',
            'version': '1.0.0-simple',
            'description': 'Simplified Reprotech Backend for Testing',
            'endpoints': {
                'health': '/api/v1/health',
                'auth': '/api/v1/auth/*',
                'login': '/api/v1/auth/login',
                'register': '/api/v1/auth/register'
            }
        })
    
    # Initialize database
    with app.app_context():
        db.create_all()
        
        # Create admin user if not exists
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            admin_user = User(
                username='admin',
                email='admin@reprotech.com',
                first_name='Admin',
                last_name='User',
                role='admin',
                is_active=True
            )
            admin_user.set_password('admin123')
            db.session.add(admin_user)
            db.session.commit()
            print("Created admin user: admin/admin123")
    
    return app

if __name__ == '__main__':
    app = create_simple_app()
    print("Starting Reprotech Simple Backend...")
    print("Admin credentials: admin/admin123")
    app.run(host='0.0.0.0', port=5005, debug=True)

