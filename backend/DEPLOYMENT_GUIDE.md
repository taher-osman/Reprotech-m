# Reprotech Backend Deployment Guide

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Local Development](#local-development)
5. [Production Deployment](#production-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Cloud Deployment](#cloud-deployment)
8. [Database Setup](#database-setup)
9. [Security Configuration](#security-configuration)
10. [Monitoring & Logging](#monitoring--logging)
11. [Backup & Recovery](#backup--recovery)
12. [Troubleshooting](#troubleshooting)

## Overview

This guide provides comprehensive instructions for deploying the Reprotech Backend API in various environments, from local development to production cloud deployments. The application is built with Flask and designed to be production-ready with proper security, monitoring, and scalability features.

## Prerequisites

### System Requirements

**Minimum Requirements:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB
- Network: Stable internet connection

**Recommended for Production:**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 100GB+ SSD
- Network: High-speed internet with low latency

### Software Dependencies

**Required:**
- Python 3.11 or higher
- PostgreSQL 12+ (production) or SQLite (development)
- Git
- Virtual environment (venv or virtualenv)

**Optional but Recommended:**
- Docker & Docker Compose
- Nginx (reverse proxy)
- Redis (caching and sessions)
- Systemd (service management)
- SSL certificate (Let's Encrypt)

## Environment Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd reprotech-backend

# Verify contents
ls -la
```

### 2. Python Environment

```bash
# Create virtual environment
python3.11 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

**Environment Variables:**

```env
# Application Settings
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-super-secret-key-change-this-in-production

# Database Configuration
DATABASE_URL=postgresql://reprotech_user:secure_password@localhost:5432/reprotech_db

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=2592000

# Security Settings
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
MAX_CONTENT_LENGTH=16777216

# Email Configuration (optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=INFO
```

## Local Development

### Quick Start

```bash
# Activate virtual environment
source venv/bin/activate

# Set development environment
export FLASK_ENV=development
export FLASK_DEBUG=True

# Use SQLite for development
export DATABASE_URL=sqlite:///reprotech_dev.db

# Run application
python src/main.py
```

The application will be available at `http://localhost:5000`

### Development Tools

**API Testing:**
```bash
# Health check
curl http://localhost:5000/api/v1/health

# API info
curl http://localhost:5000/api/v1/info

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**Database Management:**
```bash
# Initialize database (first time)
python -c "from src.main import app; from src.database import db; app.app_context().push(); db.create_all()"

# Reset database (development only)
rm reprotech_dev.db
python -c "from src.main import app; from src.database import db; app.app_context().push(); db.create_all()"
```

## Production Deployment

### 1. Server Preparation

**Ubuntu/Debian:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3.11 python3.11-venv python3.11-dev \
                    postgresql postgresql-contrib nginx \
                    git curl wget unzip supervisor

# Create application user
sudo useradd -m -s /bin/bash reprotech
sudo usermod -aG sudo reprotech
```

**CentOS/RHEL:**
```bash
# Update system
sudo yum update -y

# Install EPEL repository
sudo yum install -y epel-release

# Install required packages
sudo yum install -y python311 python311-pip python311-devel \
                    postgresql-server postgresql-contrib nginx \
                    git curl wget unzip supervisor

# Create application user
sudo useradd -m -s /bin/bash reprotech
sudo usermod -aG wheel reprotech
```

### 2. Application Deployment

```bash
# Switch to application user
sudo su - reprotech

# Clone repository
git clone <repository-url>
cd reprotech-backend

# Setup virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Configure environment
cp .env.example .env
nano .env  # Edit with production values

# Set proper permissions
chmod 600 .env
chmod +x src/main.py
```

### 3. Database Setup

```bash
# Switch to postgres user
sudo su - postgres

# Create database and user
createuser reprotech_user
createdb reprotech_db -O reprotech_user

# Set password
psql -c "ALTER USER reprotech_user PASSWORD 'secure_password';"

# Grant permissions
psql -c "GRANT ALL PRIVILEGES ON DATABASE reprotech_db TO reprotech_user;"

# Exit postgres user
exit

# Test connection
psql -h localhost -U reprotech_user -d reprotech_db -c "SELECT version();"
```

### 4. Initialize Database

```bash
# Switch back to reprotech user
sudo su - reprotech
cd reprotech-backend
source venv/bin/activate

# Initialize database tables
python -c "
from src.main import app
from src.database import db
with app.app_context():
    db.create_all()
    print('Database initialized successfully')
"
```

### 5. Systemd Service

Create service file:
```bash
sudo nano /etc/systemd/system/reprotech-backend.service
```

Service configuration:
```ini
[Unit]
Description=Reprotech Backend API
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=reprotech
Group=reprotech
WorkingDirectory=/home/reprotech/reprotech-backend
Environment=PATH=/home/reprotech/reprotech-backend/venv/bin
ExecStart=/home/reprotech/reprotech-backend/venv/bin/python src/main.py
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=reprotech-backend

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/home/reprotech/reprotech-backend

[Install]
WantedBy=multi-user.target
```

Enable and start service:
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable reprotech-backend

# Start service
sudo systemctl start reprotech-backend

# Check status
sudo systemctl status reprotech-backend

# View logs
sudo journalctl -u reprotech-backend -f
```

### 6. Nginx Configuration

Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/reprotech-backend
```

Nginx configuration:
```nginx
upstream reprotech_backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
    
    # Logging
    access_log /var/log/nginx/reprotech-backend.access.log;
    error_log /var/log/nginx/reprotech-backend.error.log;
    
    # Client settings
    client_max_body_size 16M;
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    location / {
        proxy_pass http://reprotech_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }
    
    # Health check endpoint (bypass rate limiting)
    location /api/v1/health {
        limit_req off;
        proxy_pass http://reprotech_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files (if any)
    location /static/ {
        alias /home/reprotech/reprotech-backend/static/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Enable site:
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/reprotech-backend /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 7. SSL Certificate

Install Let's Encrypt:
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Docker Deployment

### 1. Dockerfile

Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=src/main.py

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash reprotech
RUN chown -R reprotech:reprotech /app
USER reprotech

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/v1/health || exit 1

# Run application
CMD ["python", "src/main.py"]
```

### 2. Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: .
    container_name: reprotech-backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://reprotech:password@db:5432/reprotech_db
      - SECRET_KEY=${SECRET_KEY}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    restart: unless-stopped
    networks:
      - reprotech-network

  db:
    image: postgres:13
    container_name: reprotech-db
    environment:
      - POSTGRES_DB=reprotech_db
      - POSTGRES_USER=reprotech
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - reprotech-network

  redis:
    image: redis:7-alpine
    container_name: reprotech-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - reprotech-network

  nginx:
    image: nginx:alpine
    container_name: reprotech-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - reprotech-network

volumes:
  postgres_data:
  redis_data:

networks:
  reprotech-network:
    driver: bridge
```

### 3. Environment File for Docker

Create `.env.docker`:
```env
SECRET_KEY=your-super-secret-key-change-this
JWT_SECRET_KEY=your-jwt-secret-key-change-this
POSTGRES_PASSWORD=secure-database-password
```

### 4. Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Initialize database
docker-compose exec backend python -c "
from src.main import app
from src.database import db
with app.app_context():
    db.create_all()
    print('Database initialized')
"

# Check status
docker-compose ps

# Stop services
docker-compose down

# Update and restart
git pull
docker-compose build
docker-compose up -d
```

## Cloud Deployment

### AWS Deployment

#### 1. EC2 Instance Setup

```bash
# Launch EC2 instance (Ubuntu 22.04 LTS)
# Instance type: t3.medium or larger
# Security groups: HTTP (80), HTTPS (443), SSH (22)

# Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Follow production deployment steps above
```

#### 2. RDS Database

```bash
# Create RDS PostgreSQL instance
# Engine: PostgreSQL 13+
# Instance class: db.t3.micro or larger
# Storage: 20GB GP2 or larger
# Multi-AZ: Yes (for production)
# Backup retention: 7 days

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://username:password@rds-endpoint:5432/reprotech_db
```

#### 3. Application Load Balancer

```yaml
# ALB Configuration
Target Groups:
  - Name: reprotech-backend
  - Protocol: HTTP
  - Port: 5000
  - Health Check: /api/v1/health

Listeners:
  - Port: 80 (HTTP) -> Redirect to HTTPS
  - Port: 443 (HTTPS) -> Forward to target group

SSL Certificate:
  - Use AWS Certificate Manager
  - Domain: api.yourdomain.com
```

### Google Cloud Platform

#### 1. Compute Engine

```bash
# Create VM instance
gcloud compute instances create reprotech-backend \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --machine-type=e2-medium \
    --zone=us-central1-a \
    --tags=http-server,https-server

# Connect to instance
gcloud compute ssh reprotech-backend --zone=us-central1-a

# Follow production deployment steps
```

#### 2. Cloud SQL

```bash
# Create Cloud SQL PostgreSQL instance
gcloud sql instances create reprotech-db \
    --database-version=POSTGRES_13 \
    --tier=db-f1-micro \
    --region=us-central1

# Create database
gcloud sql databases create reprotech_db --instance=reprotech-db

# Create user
gcloud sql users create reprotech_user \
    --instance=reprotech-db \
    --password=secure_password
```

### Azure Deployment

#### 1. App Service

```bash
# Create resource group
az group create --name reprotech-rg --location eastus

# Create App Service plan
az appservice plan create \
    --name reprotech-plan \
    --resource-group reprotech-rg \
    --sku B1 \
    --is-linux

# Create web app
az webapp create \
    --resource-group reprotech-rg \
    --plan reprotech-plan \
    --name reprotech-backend \
    --runtime "PYTHON|3.11"

# Deploy code
az webapp deployment source config \
    --name reprotech-backend \
    --resource-group reprotech-rg \
    --repo-url <your-git-repo> \
    --branch main
```

#### 2. Azure Database for PostgreSQL

```bash
# Create PostgreSQL server
az postgres server create \
    --resource-group reprotech-rg \
    --name reprotech-db-server \
    --location eastus \
    --admin-user reprotech_admin \
    --admin-password SecurePassword123 \
    --sku-name GP_Gen5_2

# Create database
az postgres db create \
    --resource-group reprotech-rg \
    --server-name reprotech-db-server \
    --name reprotech_db
```

## Database Setup

### PostgreSQL Configuration

#### 1. Installation and Setup

**Ubuntu/Debian:**
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configure PostgreSQL
sudo -u postgres psql
```

**PostgreSQL Configuration:**
```sql
-- Create user
CREATE USER reprotech_user WITH PASSWORD 'secure_password';

-- Create database
CREATE DATABASE reprotech_db OWNER reprotech_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE reprotech_db TO reprotech_user;

-- Exit
\q
```

#### 2. Performance Tuning

Edit `/etc/postgresql/13/main/postgresql.conf`:
```ini
# Memory settings
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# Connection settings
max_connections = 100
listen_addresses = 'localhost'

# Logging
log_statement = 'all'
log_duration = on
log_min_duration_statement = 1000

# Checkpoint settings
checkpoint_completion_target = 0.9
wal_buffers = 16MB
```

#### 3. Backup Configuration

Create backup script:
```bash
#!/bin/bash
# /home/reprotech/backup.sh

BACKUP_DIR="/home/reprotech/backups"
DB_NAME="reprotech_db"
DB_USER="reprotech_user"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/reprotech_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/reprotech_backup_$DATE.sql

# Remove backups older than 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: reprotech_backup_$DATE.sql.gz"
```

Setup cron job:
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/reprotech/backup.sh >> /home/reprotech/backup.log 2>&1
```

### Database Migration

#### 1. Schema Updates

```python
# migration_script.py
from src.main import app
from src.database import db
from src.models import *

def migrate_database():
    with app.app_context():
        # Create new tables
        db.create_all()
        
        # Add custom migrations here
        # Example: Add new column
        # db.engine.execute('ALTER TABLE animals ADD COLUMN new_field VARCHAR(255)')
        
        print("Migration completed successfully")

if __name__ == "__main__":
    migrate_database()
```

#### 2. Data Migration

```python
# data_migration.py
from src.main import app
from src.database import db
from src.models.user import User

def migrate_data():
    with app.app_context():
        # Example: Update existing data
        users = User.query.all()
        for user in users:
            if not user.created_at:
                user.created_at = datetime.utcnow()
        
        db.session.commit()
        print(f"Updated {len(users)} user records")

if __name__ == "__main__":
    migrate_data()
```

## Security Configuration

### 1. Firewall Setup

**UFW (Ubuntu):**
```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow PostgreSQL (if external access needed)
sudo ufw allow 5432

# Check status
sudo ufw status
```

**iptables:**
```bash
# Basic iptables rules
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -j DROP

# Save rules
sudo iptables-save > /etc/iptables/rules.v4
```

### 2. SSL/TLS Configuration

**Let's Encrypt Setup:**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

**Custom Certificate:**
```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate certificate signing request
openssl req -new -key private.key -out certificate.csr

# Generate self-signed certificate (development only)
openssl x509 -req -days 365 -in certificate.csr -signkey private.key -out certificate.crt
```

### 3. Security Headers

Update Nginx configuration:
```nginx
# Security headers
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;";
```

### 4. Application Security

**Environment Variables:**
```bash
# Generate secure keys
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Set in .env
SECRET_KEY=generated-secret-key
JWT_SECRET_KEY=generated-jwt-key
```

**Rate Limiting:**
```python
# In application configuration
RATELIMIT_STORAGE_URL = "redis://localhost:6379"
RATELIMIT_DEFAULT = "100 per hour"
```

## Monitoring & Logging

### 1. Application Logging

Configure logging in `src/config.py`:
```python
import logging
from logging.handlers import RotatingFileHandler

class Config:
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE = os.environ.get('LOG_FILE', 'logs/app.log')
    
    @staticmethod
    def init_app(app):
        # File handler
        file_handler = RotatingFileHandler(
            Config.LOG_FILE, 
            maxBytes=10240000, 
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        
        # Set log level
        app.logger.setLevel(getattr(logging, Config.LOG_LEVEL))
```

### 2. System Monitoring

**Install monitoring tools:**
```bash
# Install htop, iotop, netstat
sudo apt install htop iotop net-tools

# Install system monitoring
sudo apt install prometheus-node-exporter
```

**Monitoring script:**
```bash
#!/bin/bash
# /home/reprotech/monitor.sh

# Check application status
if ! systemctl is-active --quiet reprotech-backend; then
    echo "$(date): Reprotech backend is down" >> /var/log/reprotech-monitor.log
    systemctl restart reprotech-backend
fi

# Check database connection
if ! pg_isready -h localhost -p 5432 -U reprotech_user; then
    echo "$(date): Database connection failed" >> /var/log/reprotech-monitor.log
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "$(date): Disk usage is ${DISK_USAGE}%" >> /var/log/reprotech-monitor.log
fi

# Check memory usage
MEM_USAGE=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
if (( $(echo "$MEM_USAGE > 80" | bc -l) )); then
    echo "$(date): Memory usage is ${MEM_USAGE}%" >> /var/log/reprotech-monitor.log
fi
```

### 3. Log Rotation

Configure logrotate:
```bash
sudo nano /etc/logrotate.d/reprotech-backend
```

Logrotate configuration:
```
/home/reprotech/reprotech-backend/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 reprotech reprotech
    postrotate
        systemctl reload reprotech-backend
    endscript
}
```

### 4. Health Checks

Create health check script:
```bash
#!/bin/bash
# /home/reprotech/health_check.sh

API_URL="http://localhost:5000/api/v1/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): API health check passed"
    exit 0
else
    echo "$(date): API health check failed with code $RESPONSE"
    exit 1
fi
```

Setup cron job:
```bash
# Check every 5 minutes
*/5 * * * * /home/reprotech/health_check.sh >> /var/log/health_check.log 2>&1
```

## Backup & Recovery

### 1. Database Backup

**Automated backup script:**
```bash
#!/bin/bash
# /home/reprotech/scripts/backup_database.sh

set -e

# Configuration
DB_NAME="reprotech_db"
DB_USER="reprotech_user"
BACKUP_DIR="/home/reprotech/backups/database"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/reprotech_db_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
echo "Starting database backup..."
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE
echo "Database backup completed: ${BACKUP_FILE}.gz"

# Remove old backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "Old backups cleaned up"

# Upload to cloud storage (optional)
if command -v aws &> /dev/null; then
    aws s3 cp ${BACKUP_FILE}.gz s3://your-backup-bucket/database/
    echo "Backup uploaded to S3"
fi
```

### 2. Application Backup

**Application files backup:**
```bash
#!/bin/bash
# /home/reprotech/scripts/backup_application.sh

set -e

APP_DIR="/home/reprotech/reprotech-backend"
BACKUP_DIR="/home/reprotech/backups/application"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/reprotech_app_$DATE.tar.gz"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create application backup (excluding venv and logs)
echo "Starting application backup..."
tar -czf $BACKUP_FILE \
    --exclude='venv' \
    --exclude='logs' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='.git' \
    -C $(dirname $APP_DIR) \
    $(basename $APP_DIR)

echo "Application backup completed: $BACKUP_FILE"

# Remove old backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
echo "Old application backups cleaned up"
```

### 3. Recovery Procedures

**Database recovery:**
```bash
#!/bin/bash
# /home/reprotech/scripts/restore_database.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    exit 1
fi

# Stop application
sudo systemctl stop reprotech-backend

# Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS reprotech_db;"
sudo -u postgres psql -c "CREATE DATABASE reprotech_db OWNER reprotech_user;"

# Restore database
gunzip -c $BACKUP_FILE | psql -h localhost -U reprotech_user -d reprotech_db

# Start application
sudo systemctl start reprotech-backend

echo "Database restored successfully"
```

**Application recovery:**
```bash
#!/bin/bash
# /home/reprotech/scripts/restore_application.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file.tar.gz>"
    exit 1
fi

# Stop application
sudo systemctl stop reprotech-backend

# Backup current installation
mv /home/reprotech/reprotech-backend /home/reprotech/reprotech-backend.old

# Extract backup
tar -xzf $BACKUP_FILE -C /home/reprotech/

# Restore virtual environment
cd /home/reprotech/reprotech-backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start application
sudo systemctl start reprotech-backend

echo "Application restored successfully"
```

## Troubleshooting

### Common Issues

#### 1. Application Won't Start

**Check logs:**
```bash
# System logs
sudo journalctl -u reprotech-backend -f

# Application logs
tail -f /home/reprotech/reprotech-backend/logs/app.log

# Check service status
sudo systemctl status reprotech-backend
```

**Common causes:**
- Database connection issues
- Missing environment variables
- Port conflicts
- Permission issues

#### 2. Database Connection Issues

**Test connection:**
```bash
# Test PostgreSQL connection
psql -h localhost -U reprotech_user -d reprotech_db -c "SELECT version();"

# Check PostgreSQL status
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log
```

**Fix connection issues:**
```bash
# Check pg_hba.conf
sudo nano /etc/postgresql/13/main/pg_hba.conf

# Add line for local connections
local   reprotech_db    reprotech_user                    md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### 3. High Memory Usage

**Monitor memory:**
```bash
# Check memory usage
free -h
htop

# Check application memory
ps aux | grep python

# Check for memory leaks
sudo systemctl restart reprotech-backend
```

**Optimize memory:**
```python
# In src/config.py
SQLALCHEMY_ENGINE_OPTIONS = {
    'pool_size': 10,
    'pool_recycle': 3600,
    'pool_pre_ping': True,
    'max_overflow': 20
}
```

#### 4. Slow API Responses

**Check performance:**
```bash
# Monitor API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/v1/health

# Check database performance
sudo -u postgres psql -d reprotech_db -c "
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
"
```

**Optimize performance:**
```sql
-- Add database indexes
CREATE INDEX idx_animals_customer_id ON animals(customer_id);
CREATE INDEX idx_samples_animal_id ON samples(animal_id);
CREATE INDEX idx_tests_sample_id ON tests(sample_id);
```

#### 5. SSL Certificate Issues

**Check certificate:**
```bash
# Check certificate expiry
openssl x509 -in /etc/letsencrypt/live/api.yourdomain.com/cert.pem -text -noout

# Test SSL
curl -I https://api.yourdomain.com

# Renew certificate
sudo certbot renew --dry-run
```

### Emergency Procedures

#### 1. Service Recovery

```bash
#!/bin/bash
# Emergency service restart

echo "Starting emergency recovery..."

# Stop services
sudo systemctl stop reprotech-backend
sudo systemctl stop nginx

# Check for hung processes
pkill -f "python.*main.py"

# Clear temporary files
rm -f /tmp/reprotech-*

# Start services
sudo systemctl start postgresql
sleep 5
sudo systemctl start reprotech-backend
sleep 10
sudo systemctl start nginx

# Verify services
if systemctl is-active --quiet reprotech-backend; then
    echo "Backend service recovered"
else
    echo "Backend service failed to start"
fi

if systemctl is-active --quiet nginx; then
    echo "Nginx service recovered"
else
    echo "Nginx service failed to start"
fi
```

#### 2. Database Recovery

```bash
#!/bin/bash
# Emergency database recovery

echo "Starting database recovery..."

# Stop application
sudo systemctl stop reprotech-backend

# Check database integrity
sudo -u postgres psql -d reprotech_db -c "SELECT pg_database_size('reprotech_db');"

# Vacuum and analyze
sudo -u postgres psql -d reprotech_db -c "VACUUM ANALYZE;"

# Restart PostgreSQL
sudo systemctl restart postgresql

# Start application
sudo systemctl start reprotech-backend

echo "Database recovery completed"
```

### Support Contacts

For additional support:

- **Documentation**: README.md and API_DOCUMENTATION.md
- **Issues**: Create GitHub issue with detailed description
- **Emergency**: Contact system administrator

---

This comprehensive deployment guide covers all aspects of deploying the Reprotech Backend API from development to production environments. Follow the appropriate sections based on your deployment scenario and requirements.

