from .auth import auth_bp
from .users import users_bp
from .customers import customers_bp
from .animals import animals_bp
from .laboratory import laboratory_bp
from .genomics import genomics_bp
from .biobank import biobank_bp
from .analytics import analytics_bp
from .workflows import workflows_bp

def register_blueprints(app):
    """Register all blueprint routes with the Flask app."""
    
    # Authentication routes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # User management routes
    app.register_blueprint(users_bp, url_prefix='/api/users')
    
    # Customer management routes
    app.register_blueprint(customers_bp, url_prefix='/api/customers')
    
    # Animal management routes
    app.register_blueprint(animals_bp, url_prefix='/api/animals')
    
    # Laboratory management routes
    app.register_blueprint(laboratory_bp, url_prefix='/api/laboratory')
    
    # Genomics and intelligence routes
    app.register_blueprint(genomics_bp, url_prefix='/api/genomics')
    
    # Biobank and sample storage routes
    app.register_blueprint(biobank_bp, url_prefix='/api/biobank')
    
    # Analytics and dashboard routes
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    
    # Workflow management routes
    app.register_blueprint(workflows_bp, url_prefix='/api/workflows')

