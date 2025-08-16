# Reprotech Backend - Production Deployment Guide

**Version:** 1.0.0  
**Last Updated:** August 16, 2025  
**Author:** Manus AI

## Overview

This guide provides comprehensive instructions for deploying the Reprotech biotechnology management platform backend in production environments. The system is designed for enterprise-grade deployment with support for high availability, scalability, and security.

## Prerequisites

### System Requirements

**Minimum Hardware Requirements:**
- CPU: 2 cores (4 cores recommended)
- RAM: 4GB (8GB recommended)
- Storage: 20GB available space (SSD recommended)
- Network: Stable internet connection

**Operating System Support:**
- Ubuntu 20.04 LTS or later
- CentOS 8 or later
- Red Hat Enterprise Linux 8 or later
- Amazon Linux 2
- Docker containers (any Linux distribution)

**Software Dependencies:**
- Python 3.11 or later
- PostgreSQL 13 or later (recommended) or SQLite for development
- Redis 6.0 or later (optional but recommended)
- Nginx or Apache (for reverse proxy)
- SSL/TLS certificates (for HTTPS)

### Network Requirements

**Required Ports:**
- 5000: Flask application (internal)
- 80: HTTP (redirect to HTTPS)
- 443: HTTPS (public access)
- 5432: PostgreSQL (internal)
- 6379: Redis (internal)

**Firewall Configuration:**
- Allow inbound traffic on ports 80 and 443
- Restrict database and Redis access to application servers only
- Configure appropriate security groups for cloud deployments

## Installation Methods

### Method 1: Direct Server Installation

#### Step 1: System Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required system packages
sudo apt install -y python3.11 python3.11-venv python3.11-dev \
    postgresql postgresql-contrib redis-server nginx \
    build-essential libpq-dev git curl

# Create application user
sudo useradd -m -s /bin/bash reprotech
sudo usermod -aG sudo reprotech
```

#### Step 2: Database Setup

```bash
# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE reprotech_db;
CREATE USER reprotech_user WITH PASSWORD 'SECURE_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE reprotech_db TO reprotech_user;
ALTER USER reprotech_user CREATEDB;
\q
EOF
```

#### Step 3: Redis Configuration

```bash
# Configure Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Secure Redis (optional but recommended)
sudo sed -i 's/# requirepass foobared/requirepass REDIS_PASSWORD_HERE/' /etc/redis/redis.conf
sudo systemctl restart redis-server
```

#### Step 4: Application Deployment

```bash
# Switch to application user
sudo su - reprotech

# Clone or copy application code
git clone <repository-url> /home/reprotech/reprotech-backend
cd /home/reprotech/reprotech-backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create production environment file
cp .env.example .env
```

#### Step 5: Environment Configuration

Edit the `.env` file with production settings:

```bash
# Application Configuration
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=GENERATE_SECURE_RANDOM_KEY_HERE

# Database Configuration
DATABASE_URL=postgresql://reprotech_user:SECURE_PASSWORD_HERE@localhost:5432/reprotech_db

# JWT Configuration
JWT_SECRET_KEY=GENERATE_SECURE_JWT_KEY_HERE
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=2592000

# Redis Configuration (if using Redis)
REDIS_URL=redis://:REDIS_PASSWORD_HERE@localhost:6379/0

# Email Configuration
SMTP_SERVER=smtp.your-provider.com
SMTP_PORT=587
SMTP_USERNAME=your-email@domain.com
SMTP_PASSWORD=your-email-password
SMTP_USE_TLS=True

# Security Configuration
CORS_ORIGINS=https://your-frontend-domain.com
API_PREFIX=/api/v1
RATE_LIMIT_ENABLED=True
RATE_LIMIT_DEFAULT=100 per hour

# Monitoring Configuration
SENTRY_DSN=your-sentry-dsn-here (optional)
LOG_LEVEL=INFO
```

#### Step 6: Database Initialization

```bash
# Initialize database tables
source venv/bin/activate
python -c "
from src.main import app
from src.database import create_tables
with app.app_context():
    create_tables(app)
    print('Database initialized successfully')
"
```

#### Step 7: Application Testing

```bash
# Test application startup
source venv/bin/activate
python src/main.py

# In another terminal, test endpoints
curl http://localhost:5000/api/v1/health
curl http://localhost:5000/api/v1/info
```

### Method 2: Docker Deployment

#### Step 1: Create Dockerfile

```dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 reprotech && chown -R reprotech:reprotech /app
USER reprotech

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/v1/health || exit 1

# Start application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "src.main:app"]
```

#### Step 2: Create Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://reprotech_user:password@db:5432/reprotech_db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=reprotech_db
      - POSTGRES_USER=reprotech_user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass password
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### Step 3: Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f app
```

## Production Configuration

### Web Server Configuration (Nginx)

Create `/etc/nginx/sites-available/reprotech`:

```nginx
upstream reprotech_backend {
    server 127.0.0.1:5000;
    # Add more servers for load balancing
    # server 127.0.0.1:5001;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Proxy Configuration
    location /api/ {
        proxy_pass http://reprotech_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health Check
    location /health {
        proxy_pass http://reprotech_backend/api/v1/health;
        access_log off;
    }

    # Static Files (if serving frontend)
    location / {
        root /var/www/reprotech-frontend;
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/reprotech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Process Management (Systemd)

Create `/etc/systemd/system/reprotech.service`:

```ini
[Unit]
Description=Reprotech Backend API
After=network.target postgresql.service redis.service

[Service]
Type=exec
User=reprotech
Group=reprotech
WorkingDirectory=/home/reprotech/reprotech-backend
Environment=PATH=/home/reprotech/reprotech-backend/venv/bin
ExecStart=/home/reprotech/reprotech-backend/venv/bin/gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 120 --max-requests 1000 --max-requests-jitter 100 src.main:app
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable reprotech
sudo systemctl start reprotech
sudo systemctl status reprotech
```

### SSL Certificate Setup

#### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

#### Using Custom Certificate

```bash
# Copy certificate files
sudo cp your-certificate.crt /etc/ssl/certs/reprotech.crt
sudo cp your-private.key /etc/ssl/private/reprotech.key
sudo chmod 644 /etc/ssl/certs/reprotech.crt
sudo chmod 600 /etc/ssl/private/reprotech.key
```

## Security Configuration

### Firewall Setup (UFW)

```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny direct access to application port
sudo ufw deny 5000/tcp

# Check status
sudo ufw status
```

### Database Security

```bash
# Secure PostgreSQL installation
sudo -u postgres psql << EOF
-- Remove default postgres user password
ALTER USER postgres PASSWORD 'SECURE_POSTGRES_PASSWORD';

-- Create read-only user for monitoring
CREATE USER reprotech_monitor WITH PASSWORD 'MONITOR_PASSWORD';
GRANT CONNECT ON DATABASE reprotech_db TO reprotech_monitor;
GRANT USAGE ON SCHEMA public TO reprotech_monitor;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO reprotech_monitor;
\q
EOF

# Configure PostgreSQL access
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Change 'local all all peer' to 'local all all md5'

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Application Security

Update `.env` with secure settings:

```bash
# Generate secure keys
SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
JWT_SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")

# Security settings
SECURITY_PASSWORD_SALT=$(python -c "import secrets; print(secrets.token_urlsafe(16))")
BCRYPT_LOG_ROUNDS=12
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_HTTPONLY=True
SESSION_COOKIE_SAMESITE=Lax
```

## Monitoring and Logging

### Log Configuration

Create log directory and configure rotation:

```bash
# Create log directory
sudo mkdir -p /var/log/reprotech
sudo chown reprotech:reprotech /var/log/reprotech

# Configure logrotate
sudo tee /etc/logrotate.d/reprotech << EOF
/var/log/reprotech/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 reprotech reprotech
    postrotate
        systemctl reload reprotech
    endscript
}
EOF
```

### Health Monitoring

Create monitoring script `/home/reprotech/monitor.sh`:

```bash
#!/bin/bash

# Health check script
HEALTH_URL="http://localhost:5000/api/v1/health"
LOG_FILE="/var/log/reprotech/monitor.log"

# Check application health
response=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $response -eq 200 ]; then
    echo "$(date): Application healthy" >> $LOG_FILE
else
    echo "$(date): Application unhealthy (HTTP $response)" >> $LOG_FILE
    # Send alert (configure your alerting method)
    # systemctl restart reprotech
fi

# Check disk space
disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $disk_usage -gt 80 ]; then
    echo "$(date): Disk usage high: ${disk_usage}%" >> $LOG_FILE
fi

# Check memory usage
memory_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $memory_usage -gt 80 ]; then
    echo "$(date): Memory usage high: ${memory_usage}%" >> $LOG_FILE
fi
```

Add to crontab:

```bash
# Add monitoring to crontab
crontab -e
# Add line: */5 * * * * /home/reprotech/monitor.sh
```

## Backup and Recovery

### Database Backup

Create backup script `/home/reprotech/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/home/reprotech/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="reprotech_db"
DB_USER="reprotech_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/reprotech_${DATE}.sql

# Compress backup
gzip $BACKUP_DIR/reprotech_${DATE}.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "reprotech_*.sql.gz" -mtime +30 -delete

echo "Backup completed: reprotech_${DATE}.sql.gz"
```

Schedule daily backups:

```bash
# Add to crontab
crontab -e
# Add line: 0 2 * * * /home/reprotech/backup.sh
```

### Application Backup

```bash
# Backup application code and configuration
tar -czf /home/reprotech/backups/app_$(date +%Y%m%d).tar.gz \
    /home/reprotech/reprotech-backend \
    --exclude=/home/reprotech/reprotech-backend/venv \
    --exclude=/home/reprotech/reprotech-backend/__pycache__ \
    --exclude=/home/reprotech/reprotech-backend/*.pyc
```

### Recovery Procedures

#### Database Recovery

```bash
# Stop application
sudo systemctl stop reprotech

# Restore database
gunzip -c /home/reprotech/backups/reprotech_YYYYMMDD_HHMMSS.sql.gz | \
    psql -h localhost -U reprotech_user -d reprotech_db

# Start application
sudo systemctl start reprotech
```

#### Application Recovery

```bash
# Stop services
sudo systemctl stop reprotech nginx

# Restore application
cd /home/reprotech
tar -xzf backups/app_YYYYMMDD.tar.gz

# Restore permissions
chown -R reprotech:reprotech reprotech-backend

# Start services
sudo systemctl start reprotech nginx
```

## Performance Optimization

### Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_animals_customer_id ON animals(customer_id);
CREATE INDEX CONCURRENTLY idx_animals_status ON animals(status);
CREATE INDEX CONCURRENTLY idx_animals_created_at ON animals(created_at);
CREATE INDEX CONCURRENTLY idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX CONCURRENTLY idx_audit_logs_user_id ON audit_logs(user_id);

-- Analyze tables for query optimization
ANALYZE;
```

### Application Optimization

Update Gunicorn configuration for better performance:

```bash
# In systemd service file, update ExecStart:
ExecStart=/home/reprotech/reprotech-backend/venv/bin/gunicorn \
    --bind 0.0.0.0:5000 \
    --workers 4 \
    --worker-class gevent \
    --worker-connections 1000 \
    --timeout 120 \
    --keepalive 5 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --preload \
    src.main:app
```

### Redis Configuration

Optimize Redis for production:

```bash
# Edit /etc/redis/redis.conf
sudo nano /etc/redis/redis.conf

# Add/modify these settings:
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

## Troubleshooting

### Common Issues

#### Application Won't Start

```bash
# Check logs
sudo journalctl -u reprotech -f

# Check configuration
source /home/reprotech/reprotech-backend/venv/bin/activate
python -c "from src.main import app; print('Config OK')"

# Check database connection
python -c "
from src.database import db
from src.main import app
with app.app_context():
    db.engine.execute('SELECT 1')
    print('Database OK')
"
```

#### Database Connection Issues

```bash
# Test database connection
psql -h localhost -U reprotech_user -d reprotech_db -c "SELECT version();"

# Check PostgreSQL status
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

#### Performance Issues

```bash
# Check system resources
htop
df -h
free -h

# Check application metrics
curl http://localhost:5000/api/v1/system/metrics

# Check database performance
sudo -u postgres psql -d reprotech_db -c "
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
"
```

### Log Analysis

```bash
# Application logs
tail -f /var/log/reprotech/app.log

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u reprotech -f
```

## Maintenance

### Regular Maintenance Tasks

#### Weekly Tasks

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Check disk space
df -h

# Check log sizes
du -sh /var/log/*

# Restart services (if needed)
sudo systemctl restart reprotech
```

#### Monthly Tasks

```bash
# Update SSL certificates
sudo certbot renew

# Database maintenance
sudo -u postgres psql -d reprotech_db -c "VACUUM ANALYZE;"

# Clean old backups
find /home/reprotech/backups -name "*.gz" -mtime +90 -delete

# Review security logs
grep "Failed password" /var/log/auth.log | tail -20
```

### Updates and Upgrades

#### Application Updates

```bash
# Backup current version
cp -r /home/reprotech/reprotech-backend /home/reprotech/reprotech-backend.backup

# Pull updates
cd /home/reprotech/reprotech-backend
git pull origin main

# Update dependencies
source venv/bin/activate
pip install -r requirements.txt

# Run database migrations (if any)
python -c "
from src.main import app
from src.database import create_tables
with app.app_context():
    create_tables(app)
"

# Restart application
sudo systemctl restart reprotech
```

#### System Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Python packages
source /home/reprotech/reprotech-backend/venv/bin/activate
pip list --outdated
pip install --upgrade package-name

# Reboot if kernel updated
sudo reboot
```

## Support and Documentation

### Additional Resources

- **API Documentation:** Available at `/api/v1/info` endpoint
- **Health Checks:** Available at `/api/v1/health` endpoint
- **System Metrics:** Available at `/api/v1/system/metrics` endpoint

### Getting Help

For deployment issues or questions:

1. Check application logs for error messages
2. Verify configuration settings
3. Test database and Redis connectivity
4. Review system resource usage
5. Consult this documentation for troubleshooting steps

### Best Practices

1. **Always backup before making changes**
2. **Test updates in staging environment first**
3. **Monitor system resources regularly**
4. **Keep security patches up to date**
5. **Use strong passwords and secure keys**
6. **Enable proper logging and monitoring**
7. **Regular database maintenance**
8. **Document any custom configurations**

This deployment guide provides comprehensive instructions for production deployment of the Reprotech backend. Follow these steps carefully and adapt configurations to your specific environment and requirements.

