import os
import sys
import os
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from datetime import datetime, timezone
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from src.config import config
from src.database import init_db, create_tables
from src.models import *  # Import all models

# Import Redis cache
from src.cache import reprotech_cache

# Import utilities
from src.utils.cache import cache
from src.utils.email import email_service
from src.utils.tasks import task_manager
from src.utils.audit import AuditLogger

# Import route blueprints
from src.routes.auth import auth_bp
from src.routes.users import users_bp
from src.routes.customers import customers_bp
from src.routes.animals import animals_bp
from src.routes.laboratory import laboratory_bp
from src.routes.genomics import genomics_bp
from src.routes.biobank import biobank_bp
from src.routes.analytics import analytics_bp
from src.routes.workflows import workflows_bp
from src.routes.system import system_bp
from src.routes.test import test_bp
from src.routes.cache_management import cache_bp

def create_app(config_name='development'):
    """Application factory pattern."""
    app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app, origins=app.config['CORS_ORIGINS'])
    jwt = JWTManager(app)
    init_db(app)
    
    # Initialize Redis cache
    reprotech_cache.init_app(app)
    
    # Initialize utilities
    cache.init_app(app)
    email_service.init_app(app)
    task_manager.init_app(app)
    
    # JWT token blacklist checker
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        from src.models.user import TokenBlacklist
        jti = jwt_payload['jti']
        return TokenBlacklist.is_jti_blacklisted(jti)
    
    # Register API blueprints
    api_prefix = app.config['API_PREFIX']
    
    app.register_blueprint(auth_bp, url_prefix=f'{api_prefix}/auth')
    app.register_blueprint(users_bp, url_prefix=f'{api_prefix}/users')
    app.register_blueprint(customers_bp, url_prefix=f'{api_prefix}/customers')
    app.register_blueprint(animals_bp, url_prefix=f'{api_prefix}/animals')
    app.register_blueprint(laboratory_bp, url_prefix=f'{api_prefix}/lab')
    app.register_blueprint(genomics_bp, url_prefix=f'{api_prefix}/genomics')
    app.register_blueprint(biobank_bp, url_prefix=f'{api_prefix}/biobank')
    app.register_blueprint(analytics_bp, url_prefix=f'{api_prefix}/analytics')
    app.register_blueprint(workflows_bp, url_prefix=f'{api_prefix}/workflows')
    app.register_blueprint(system_bp, url_prefix=f'{api_prefix}/system')
    app.register_blueprint(test_bp, url_prefix=f'{api_prefix}/test')
    app.register_blueprint(cache_bp, url_prefix=f'{api_prefix}/cache')
    
    # Create database tables
    with app.app_context():
        create_tables(app)
        # Log system startup after app context is available
        AuditLogger.log_system_event('SYSTEM_STARTUP', 'Application started successfully')
    
    # Health check endpoint
    @app.route(f'{api_prefix}/health')
    def health_check():
        """Health check endpoint."""
        return jsonify({
            'status': 'healthy',
            'version': '1.0.0',
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
    
    # API info endpoint
    @app.route(f'{api_prefix}/info')
    def api_info():
        """API information endpoint."""
        return jsonify({
            'name': 'Reprotech API',
            'version': '1.0.0',
            'description': 'Comprehensive biotechnology management platform API',
            'modules': [
                'Authentication & User Management',
                'Customer Relationship Management',
                'Animal Management',
                'Laboratory Management',
                'Genomics & Intelligence',
                'Biobank & Sample Storage',
                'Analytics & Dashboard',
                'Workflow Management'
            ],
            'endpoints': {
                'auth': f'{api_prefix}/auth',
                'users': f'{api_prefix}/users',
                'customers': f'{api_prefix}/customers',
                'animals': f'{api_prefix}/animals',
                'laboratory': f'{api_prefix}/lab',
                'genomics': f'{api_prefix}/genomics',
                'biobank': f'{api_prefix}/biobank',
                'analytics': f'{api_prefix}/analytics',
                'workflows': f'{api_prefix}/workflows'
            }
        })
    
    # Frontend serving routes
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        """Serve frontend application."""
        static_folder_path = app.static_folder
        if static_folder_path is None:
            return jsonify({'error': 'Static folder not configured'}), 404

        if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
            return send_from_directory(static_folder_path, path)
        else:
            index_path = os.path.join(static_folder_path, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(static_folder_path, 'index.html')
            else:
                return jsonify({
                    'message': 'Reprotech API Server',
                    'status': 'running',
                    'api_info': f'{api_prefix}/info',
                    'health_check': f'{api_prefix}/health'
                })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized'}), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden'}), 403
    
    return app

# Create the application instance
app = create_app(os.environ.get('FLASK_ENV', 'development'))

if __name__ == '__main__':
    from datetime import datetime, timezone
    
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"🚀 Starting Reprotech API Server...")
    print(f"📊 Environment: {os.environ.get('FLASK_ENV', 'development')}")
    print(f"🌐 Server: http://0.0.0.0:{port}")
    print(f"🔗 API Base: {app.config['API_PREFIX']}")
    print(f"📋 API Info: http://0.0.0.0:{port}{app.config['API_PREFIX']}/info")
    print(f"❤️  Health Check: http://0.0.0.0:{port}{app.config['API_PREFIX']}/health")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
