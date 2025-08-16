# PostgreSQL Migration Guide for Reprotech Authentication System

## 🐘 **POSTGRESQL MIGRATION STRATEGY**

### **Migration Overview**
This guide provides complete instructions for migrating the Reprotech authentication system from SQLite (development) to PostgreSQL (production) while maintaining all data integrity and functionality.

---

## 📋 **PRE-MIGRATION CHECKLIST**

### **1. PostgreSQL Installation & Setup**

#### **Ubuntu/Debian Installation**
```bash
# Update package list
sudo apt update

# Install PostgreSQL and additional tools
sudo apt install postgresql postgresql-contrib postgresql-client

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
sudo systemctl status postgresql
psql --version
```

#### **Create Database and User**
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE reprotech_auth;

# Create user with password
CREATE USER reprotech_user WITH PASSWORD 'your_secure_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE reprotech_auth TO reprotech_user;
GRANT CREATE ON SCHEMA public TO reprotech_user;

# Exit PostgreSQL
\q
```

### **2. Python Dependencies**
```bash
# Navigate to backend directory
cd /path/to/reprotech-auth-backend

# Install PostgreSQL adapter
pip install psycopg2-binary

# Install migration tools
pip install alembic

# Update requirements.txt
echo "psycopg2-binary>=2.9.0" >> requirements.txt
echo "alembic>=1.8.0" >> requirements.txt
```

---

## 🔧 **MIGRATION IMPLEMENTATION**

### **1. Database Configuration Update**

#### **Create Environment Configuration**
```bash
# Create .env file in backend root
cat > /path/to/reprotech-auth-backend/.env << EOF
# Database Configuration
DATABASE_URL=postgresql://reprotech_user:your_secure_password_here@localhost:5432/reprotech_auth
SQLALCHEMY_DATABASE_URI=postgresql://reprotech_user:your_secure_password_here@localhost:5432/reprotech_auth

# Development fallback (keep SQLite for development)
DEV_DATABASE_URL=sqlite:///src/database/app.db

# Environment
ENVIRONMENT=production
DEBUG=False

# Security
SECRET_KEY=your_production_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here

# CORS
CORS_ORIGINS=https://yourdomain.com,http://localhost:5173
EOF
```

#### **Update main.py Configuration**
```python
# File: src/main.py
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration with environment support
def get_database_uri():
    """Get database URI based on environment"""
    env = os.getenv('ENVIRONMENT', 'development')
    
    if env == 'production':
        # Use PostgreSQL for production
        return os.getenv('DATABASE_URL') or os.getenv('SQLALCHEMY_DATABASE_URI')
    else:
        # Use SQLite for development
        return os.getenv('DEV_DATABASE_URL') or f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"

# Update Flask configuration
app.config['SQLALCHEMY_DATABASE_URI'] = get_database_uri()
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'reprotech_auth_secret_key_2025_secure')
```

### **2. Database Schema Migration**

#### **Initialize Alembic**
```bash
# Navigate to backend directory
cd /path/to/reprotech-auth-backend

# Initialize Alembic
alembic init migrations

# Configure alembic.ini
sed -i 's|sqlalchemy.url = .*|sqlalchemy.url = postgresql://reprotech_user:your_secure_password_here@localhost:5432/reprotech_auth|' alembic.ini
```

#### **Create Migration Script**
```python
# File: migrations/env.py
import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

# Import models
from models.auth import db

# Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set target metadata
target_metadata = db.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

#### **Generate Initial Migration**
```bash
# Create initial migration
alembic revision --autogenerate -m "Initial migration from SQLite to PostgreSQL"

# Review generated migration file
# Edit migrations/versions/xxx_initial_migration.py if needed

# Apply migration to PostgreSQL
alembic upgrade head
```

### **3. Data Migration Script**

#### **Create Data Export Script**
```python
# File: migrate_data.py
import sqlite3
import psycopg2
import json
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

def export_sqlite_data():
    """Export data from SQLite database"""
    sqlite_path = 'src/database/app.db'
    
    if not os.path.exists(sqlite_path):
        print("SQLite database not found!")
        return None
    
    conn = sqlite3.connect(sqlite_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    data = {}
    
    # Export tables in dependency order
    tables = [
        'permissions',
        'roles', 
        'role_permissions',
        'users',
        'user_roles',
        'audit_logs',
        'user_sessions'
    ]
    
    for table in tables:
        try:
            cursor.execute(f"SELECT * FROM {table}")
            rows = cursor.fetchall()
            data[table] = [dict(row) for row in rows]
            print(f"Exported {len(rows)} records from {table}")
        except sqlite3.Error as e:
            print(f"Error exporting {table}: {e}")
            data[table] = []
    
    conn.close()
    return data

def import_to_postgresql(data):
    """Import data to PostgreSQL database"""
    if not data:
        print("No data to import!")
        return
    
    # PostgreSQL connection
    pg_conn = psycopg2.connect(
        host='localhost',
        database='reprotech_auth',
        user='reprotech_user',
        password='your_secure_password_here'
    )
    pg_cursor = pg_conn.cursor()
    
    try:
        # Import in dependency order
        
        # 1. Permissions
        if data.get('permissions'):
            for perm in data['permissions']:
                pg_cursor.execute("""
                    INSERT INTO permissions (id, name, display_name, description, module, action, created_at)
                    VALUES (%(id)s, %(name)s, %(display_name)s, %(description)s, %(module)s, %(action)s, %(created_at)s)
                    ON CONFLICT (id) DO NOTHING
                """, perm)
        
        # 2. Roles
        if data.get('roles'):
            for role in data['roles']:
                pg_cursor.execute("""
                    INSERT INTO roles (id, name, display_name, description, is_system_role, created_at, updated_at)
                    VALUES (%(id)s, %(name)s, %(display_name)s, %(description)s, %(is_system_role)s, %(created_at)s, %(updated_at)s)
                    ON CONFLICT (id) DO NOTHING
                """, role)
        
        # 3. Role Permissions
        if data.get('role_permissions'):
            for rp in data['role_permissions']:
                pg_cursor.execute("""
                    INSERT INTO role_permissions (role_id, permission_id)
                    VALUES (%(role_id)s, %(permission_id)s)
                    ON CONFLICT DO NOTHING
                """, rp)
        
        # 4. Users
        if data.get('users'):
            for user in data['users']:
                pg_cursor.execute("""
                    INSERT INTO users (id, username, email, password_hash, first_name, last_name, 
                                     phone, department, employee_id, status, last_login, login_attempts,
                                     locked_until, password_reset_token, password_reset_expires,
                                     created_at, updated_at, created_by, updated_by)
                    VALUES (%(id)s, %(username)s, %(email)s, %(password_hash)s, %(first_name)s, %(last_name)s,
                           %(phone)s, %(department)s, %(employee_id)s, %(status)s, %(last_login)s, %(login_attempts)s,
                           %(locked_until)s, %(password_reset_token)s, %(password_reset_expires)s,
                           %(created_at)s, %(updated_at)s, %(created_by)s, %(updated_by)s)
                    ON CONFLICT (id) DO NOTHING
                """, user)
        
        # 5. User Roles
        if data.get('user_roles'):
            for ur in data['user_roles']:
                pg_cursor.execute("""
                    INSERT INTO user_roles (user_id, role_id)
                    VALUES (%(user_id)s, %(role_id)s)
                    ON CONFLICT DO NOTHING
                """, ur)
        
        # 6. Audit Logs
        if data.get('audit_logs'):
            for log in data['audit_logs']:
                pg_cursor.execute("""
                    INSERT INTO audit_logs (id, user_id, username, action, resource_type, resource_id,
                                          details, ip_address, user_agent, created_at)
                    VALUES (%(id)s, %(user_id)s, %(username)s, %(action)s, %(resource_type)s, %(resource_id)s,
                           %(details)s, %(ip_address)s, %(user_agent)s, %(created_at)s)
                    ON CONFLICT (id) DO NOTHING
                """, log)
        
        # 7. User Sessions (optional - may want to start fresh)
        # Skip sessions for security - users will need to re-login
        
        # Update sequences
        tables_with_sequences = ['permissions', 'roles', 'users', 'audit_logs']
        for table in tables_with_sequences:
            if data.get(table):
                max_id = max([row['id'] for row in data[table]]) if data[table] else 0
                pg_cursor.execute(f"SELECT setval('{table}_id_seq', {max_id + 1})")
        
        pg_conn.commit()
        print("Data migration completed successfully!")
        
    except Exception as e:
        pg_conn.rollback()
        print(f"Error during migration: {e}")
        raise
    finally:
        pg_cursor.close()
        pg_conn.close()

if __name__ == "__main__":
    print("Starting data migration from SQLite to PostgreSQL...")
    
    # Export from SQLite
    print("Exporting data from SQLite...")
    data = export_sqlite_data()
    
    if data:
        # Import to PostgreSQL
        print("Importing data to PostgreSQL...")
        import_to_postgresql(data)
        print("Migration completed!")
    else:
        print("No data to migrate.")
```

#### **Run Data Migration**
```bash
# Make sure PostgreSQL is running and database is created
sudo systemctl start postgresql

# Run the migration script
cd /path/to/reprotech-auth-backend
python migrate_data.py
```

---

## 🔧 **PRODUCTION CONFIGURATION**

### **1. Environment Variables**
```bash
# Production .env file
ENVIRONMENT=production
DEBUG=False

# Database
DATABASE_URL=postgresql://reprotech_user:secure_password@localhost:5432/reprotech_auth

# Security
SECRET_KEY=your_production_secret_key_256_bits_long
JWT_SECRET_KEY=your_jwt_secret_key_256_bits_long

# CORS
CORS_ORIGINS=https://yourdomain.com

# Email (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@domain.com
SMTP_PASSWORD=your_app_password

# Redis (for caching - optional)
REDIS_URL=redis://localhost:6379/0
```

### **2. PostgreSQL Production Tuning**
```sql
-- Connect to PostgreSQL as superuser
sudo -u postgres psql

-- Optimize for authentication workload
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Reload configuration
SELECT pg_reload_conf();

-- Create indexes for performance
\c reprotech_auth;

CREATE INDEX CONCURRENTLY idx_users_username ON users(username);
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_users_status ON users(status);
CREATE INDEX CONCURRENTLY idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX CONCURRENTLY idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX CONCURRENTLY idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX CONCURRENTLY idx_user_sessions_token ON user_sessions(access_token);
```

### **3. Connection Pooling**
```python
# File: src/database_config.py
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
import os

def create_database_engine():
    """Create optimized database engine for production"""
    database_url = os.getenv('DATABASE_URL')
    
    if database_url.startswith('postgresql'):
        # PostgreSQL with connection pooling
        engine = create_engine(
            database_url,
            poolclass=QueuePool,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            pool_recycle=3600,
            echo=False
        )
    else:
        # SQLite for development
        engine = create_engine(database_url, echo=False)
    
    return engine
```

---

## 🧪 **TESTING MIGRATION**

### **1. Verification Script**
```python
# File: verify_migration.py
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def verify_postgresql_migration():
    """Verify PostgreSQL migration was successful"""
    try:
        conn = psycopg2.connect(
            host='localhost',
            database='reprotech_auth',
            user='reprotech_user',
            password=os.getenv('POSTGRES_PASSWORD')
        )
        cursor = conn.cursor()
        
        # Check table existence
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = [row[0] for row in cursor.fetchall()]
        
        expected_tables = ['users', 'roles', 'permissions', 'user_roles', 
                          'role_permissions', 'audit_logs', 'user_sessions']
        
        print("Database Tables:")
        for table in expected_tables:
            if table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"✅ {table}: {count} records")
            else:
                print(f"❌ {table}: Missing")
        
        # Test authentication
        cursor.execute("SELECT username, email FROM users WHERE status = 'active'")
        users = cursor.fetchall()
        print(f"\nActive Users: {len(users)}")
        for username, email in users:
            print(f"  - {username} ({email})")
        
        cursor.close()
        conn.close()
        
        print("\n✅ PostgreSQL migration verification completed!")
        
    except Exception as e:
        print(f"❌ Migration verification failed: {e}")

if __name__ == "__main__":
    verify_postgresql_migration()
```

### **2. Run Verification**
```bash
# Verify migration
python verify_migration.py

# Test application startup
ENVIRONMENT=production python src/main.py

# Test authentication endpoint
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin123!"}'
```

---

## 🚀 **DEPLOYMENT INSTRUCTIONS**

### **1. Production Deployment with PostgreSQL**
```bash
# 1. Install PostgreSQL on production server
sudo apt update
sudo apt install postgresql postgresql-contrib

# 2. Create production database
sudo -u postgres createdb reprotech_auth
sudo -u postgres createuser reprotech_user

# 3. Set password and permissions
sudo -u postgres psql -c "ALTER USER reprotech_user PASSWORD 'secure_production_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE reprotech_auth TO reprotech_user;"

# 4. Deploy application
git clone your-repo
cd reprotech-auth-backend
pip install -r requirements.txt

# 5. Set environment variables
export ENVIRONMENT=production
export DATABASE_URL=postgresql://reprotech_user:secure_password@localhost:5432/reprotech_auth

# 6. Run migrations
alembic upgrade head

# 7. Initialize data
python src/init_data.py

# 8. Start application
gunicorn -w 4 -b 0.0.0.0:5001 src.main:app
```

### **2. Docker Deployment**
```dockerfile
# Dockerfile
FROM python:3.11-slim

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5001", "src.main:app"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: reprotech_auth
      POSTGRES_USER: reprotech_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  auth-backend:
    build: .
    environment:
      DATABASE_URL: postgresql://reprotech_user:secure_password@postgres:5432/reprotech_auth
      ENVIRONMENT: production
    ports:
      - "5001:5001"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

---

## 📋 **MIGRATION CHECKLIST**

### **Pre-Migration**
- [ ] PostgreSQL installed and configured
- [ ] Database and user created
- [ ] Python dependencies installed
- [ ] Environment variables configured
- [ ] Backup of SQLite database created

### **Migration Process**
- [ ] Alembic initialized and configured
- [ ] Database schema migrated
- [ ] Data export from SQLite completed
- [ ] Data import to PostgreSQL completed
- [ ] Sequences updated correctly

### **Post-Migration**
- [ ] Migration verification script passed
- [ ] Application starts successfully
- [ ] Authentication endpoints working
- [ ] All API endpoints functional
- [ ] Performance indexes created
- [ ] Production configuration applied

### **Production Deployment**
- [ ] SSL/TLS certificates configured
- [ ] Firewall rules configured
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Load balancer configured (if needed)

---

## 🎯 **BENEFITS OF POSTGRESQL MIGRATION**

### **Performance Improvements**
- **Concurrent Users**: Unlimited concurrent connections
- **Query Performance**: Advanced query optimizer
- **Indexing**: Sophisticated indexing strategies
- **Caching**: Built-in query result caching

### **Reliability & Scalability**
- **ACID Compliance**: Full transaction support
- **Crash Recovery**: Automatic recovery mechanisms
- **Replication**: Master-slave replication support
- **Partitioning**: Table partitioning for large datasets

### **Advanced Features**
- **JSON Support**: Native JSON data type and operations
- **Full-Text Search**: Built-in search capabilities
- **Extensions**: PostGIS, pg_stat_statements, etc.
- **Custom Functions**: PL/pgSQL and other languages

**The PostgreSQL migration provides a robust, scalable foundation for the Reprotech authentication system in production environments.**

