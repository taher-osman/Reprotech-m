from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import event
from sqlalchemy.engine import Engine
import sqlite3

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def init_db(app):
    """Initialize database with the Flask app."""
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Enable foreign key constraints for SQLite
    if 'sqlite' in app.config['SQLALCHEMY_DATABASE_URI']:
        @event.listens_for(Engine, "connect")
        def set_sqlite_pragma(dbapi_connection, connection_record):
            if isinstance(dbapi_connection, sqlite3.Connection):
                cursor = dbapi_connection.cursor()
                cursor.execute("PRAGMA foreign_keys=ON")
                cursor.close()

def create_tables(app):
    """Create all database tables."""
    with app.app_context():
        # Import all models to ensure they are registered
        from src.models import (
            user, customer, animal, laboratory, 
            genomics, biobank, analytics, workflow
        )
        db.create_all()

def drop_tables(app):
    """Drop all database tables."""
    with app.app_context():
        db.drop_all()

def reset_database(app):
    """Reset the database by dropping and recreating all tables."""
    drop_tables(app)
    create_tables(app)

