# Reprotech Backend API

## Overview

The Reprotech Backend API is a comprehensive biotechnology management platform designed to handle all aspects of animal breeding, laboratory operations, genomic analysis, and biobank management. This production-ready Flask application provides a robust REST API with advanced features including authentication, role-based access control, rate limiting, security middleware, and comprehensive logging.

## Architecture

### Technology Stack

- **Backend Framework**: Flask 3.1.1 with Flask-SQLAlchemy
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: JWT with Flask-JWT-Extended
- **Security**: CORS, rate limiting, input validation, security headers
- **Documentation**: Comprehensive API documentation with examples
- **Deployment**: Production-ready with Docker support

### Core Modules

The system is organized into 7 functional groups covering 25+ modules:

1. **Authentication & User Management**
   - User registration, login, and profile management
   - Role-based access control (RBAC)
   - JWT token management with blacklisting
   - Password reset and email verification

2. **Customer Relationship Management**
   - Customer profiles and contact management
   - Service history and billing integration
   - Communication tracking and notes
   - Customer segmentation and analytics

3. **Animal Management**
   - Comprehensive animal profiles with genealogy
   - Health records and veterinary history
   - Breeding records and reproduction tracking
   - Performance metrics and analytics

4. **Laboratory Management**
   - Sample collection and tracking
   - Test protocols and procedures
   - Equipment management and calibration
   - Quality control and compliance

5. **Genomics & Intelligence**
   - SNP data analysis and storage
   - BeadChip mapping and processing
   - Genomic analysis pipelines
   - Intelligence algorithms and reporting

6. **Biobank & Sample Storage**
   - Sample storage unit management
   - Temperature monitoring and alerts
   - Sample lifecycle tracking
   - Inventory management and reporting

7. **Analytics & Dashboard**
   - Real-time metrics and KPIs
   - Custom dashboard widgets
   - Report generation and scheduling
   - Data visualization and insights

8. **Workflow Management**
   - Process automation and orchestration
   - Step-by-step workflow execution
   - Task assignment and tracking
   - Workflow templates and customization

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 12+ (for production)
- Virtual environment (recommended)

### Installation

1. **Clone and Setup**
   ```bash
   cd reprotech-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # For PostgreSQL (production)
   createdb reprotech_db
   
   # For SQLite (development) - automatic
   ```

4. **Run Application**
   ```bash
   python src/main.py
   ```

The API will be available at `http://localhost:5000`

### API Endpoints

#### Health Check
```bash
curl http://localhost:5000/api/v1/health
```

#### API Information
```bash
curl http://localhost:5000/api/v1/info
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Application environment | `development` |
| `FLASK_DEBUG` | Debug mode | `True` |
| `SECRET_KEY` | Flask secret key | Required |
| `DATABASE_URL` | Database connection string | SQLite default |
| `JWT_SECRET_KEY` | JWT signing key | Required |
| `JWT_ACCESS_TOKEN_EXPIRES` | Access token expiry (seconds) | `3600` |
| `JWT_REFRESH_TOKEN_EXPIRES` | Refresh token expiry (seconds) | `2592000` |
| `CORS_ORIGINS` | Allowed CORS origins | `*` |
| `MAX_CONTENT_LENGTH` | Max request size (bytes) | `16777216` |

### Database Configuration

#### PostgreSQL (Production)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/reprotech_db
```

#### SQLite (Development)
```env
DATABASE_URL=sqlite:///reprotech.db
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Authorization: Bearer <refresh_token>
```

### User Management Endpoints

#### List Users
```http
GET /api/v1/users?page=1&per_page=20&search=john
Authorization: Bearer <access_token>
```

#### Get User Profile
```http
GET /api/v1/users/profile
Authorization: Bearer <access_token>
```

#### Update User Profile
```http
PUT /api/v1/users/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

### Customer Management Endpoints

#### Create Customer
```http
POST /api/v1/customers
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "ABC Farms",
  "email": "contact@abcfarms.com",
  "phone": "+1234567890",
  "address": "123 Farm Road, City, State 12345",
  "customer_type": "Farm",
  "status": "Active"
}
```

#### List Customers
```http
GET /api/v1/customers?page=1&per_page=20&search=ABC&status=Active
Authorization: Bearer <access_token>
```

### Animal Management Endpoints

#### Create Animal
```http
POST /api/v1/animals
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Thunder",
  "species": "BOVINE",
  "sex": "Male",
  "date_of_birth": "2020-01-15",
  "breed": "Holstein",
  "color": "Black and White",
  "weight": 650.5,
  "customer_id": 1,
  "purpose": "Breeding"
}
```

#### List Animals
```http
GET /api/v1/animals?page=1&per_page=20&species=BOVINE&status=ACTIVE
Authorization: Bearer <access_token>
```

#### Get Animal Details
```http
GET /api/v1/animals/1?include_relationships=true
Authorization: Bearer <access_token>
```

### Laboratory Management Endpoints

#### Create Sample
```http
POST /api/v1/lab/samples
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "sample_type": "Blood",
  "collection_date": "2023-12-01T10:00:00Z",
  "animal_id": 1,
  "collection_method": "Venipuncture",
  "volume": 10.0,
  "unit": "ml",
  "storage_location": "Freezer A1"
}
```

#### Create Test
```http
POST /api/v1/lab/tests
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "sample_id": 1,
  "protocol_id": 1,
  "priority": "HIGH",
  "due_date": "2023-12-05T17:00:00Z"
}
```

### Genomics Endpoints

#### Create Analysis
```http
POST /api/v1/genomics/analyses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "analysis_type": "SNP_ANALYSIS",
  "analysis_name": "Holstein SNP Analysis",
  "animal_id": 1,
  "parameters": {
    "chip_type": "50K",
    "reference_genome": "ARS-UCD1.2"
  }
}
```

### Biobank Endpoints

#### Create Storage Unit
```http
POST /api/v1/biobank/storage-units
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Freezer Unit A",
  "unit_type": "FREEZER",
  "location": "Lab Room 1",
  "total_capacity": 1000,
  "target_temperature": -80.0,
  "temperature_tolerance": 5.0
}
```

### Analytics Endpoints

#### Get Dashboard Data
```http
GET /api/v1/analytics/dashboard-data
Authorization: Bearer <access_token>
```

#### Create Report
```http
POST /api/v1/analytics/reports
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Monthly Animal Report",
  "report_type": "ANIMAL_SUMMARY",
  "category": "ANIMALS",
  "parameters": {
    "date_range": "monthly",
    "include_breeding": true
  }
}
```

### Workflow Endpoints

#### Create Workflow
```http
POST /api/v1/workflows
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Sample Processing Workflow",
  "category": "LABORATORY",
  "steps": [
    {
      "name": "Sample Collection",
      "type": "MANUAL",
      "description": "Collect sample from animal"
    },
    {
      "name": "Sample Testing",
      "type": "AUTOMATED",
      "description": "Run laboratory tests"
    }
  ]
}
```

## Security Features

### Authentication & Authorization

The API implements comprehensive security measures:

- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **Role-Based Access Control**: Fine-grained permissions based on user roles
- **Token Blacklisting**: Immediate token revocation for security
- **Password Hashing**: Bcrypt with salt for secure password storage

### Security Middleware

- **Rate Limiting**: Configurable rate limits per IP, user, and endpoint
- **Input Validation**: Comprehensive request validation and sanitization
- **Security Headers**: OWASP-recommended security headers
- **CORS Protection**: Configurable cross-origin resource sharing
- **Request Logging**: Detailed audit trails for all API requests

### Data Protection

- **SQL Injection Prevention**: Parameterized queries and ORM protection
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Token-based CSRF prevention
- **Data Encryption**: Sensitive data encryption at rest and in transit

## Performance & Monitoring

### Logging

The application provides comprehensive logging:

- **Request/Response Logging**: Detailed API call tracking
- **Security Event Logging**: Security incidents and anomalies
- **Performance Monitoring**: Slow query and endpoint detection
- **Error Tracking**: Comprehensive error logging with context

### Metrics

Key performance indicators are tracked:

- **API Response Times**: Endpoint performance monitoring
- **Database Query Performance**: Slow query identification
- **Error Rates**: Application health monitoring
- **User Activity**: Authentication and usage patterns

## Development

### Project Structure

```
reprotech-backend/
├── src/
│   ├── main.py                 # Application entry point
│   ├── config.py              # Configuration management
│   ├── database.py            # Database initialization
│   ├── models/                # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py           # User and authentication models
│   │   ├── customer.py       # Customer management models
│   │   ├── animal.py         # Animal management models
│   │   ├── laboratory.py     # Laboratory models
│   │   ├── genomics.py       # Genomics and analysis models
│   │   ├── biobank.py        # Biobank and storage models
│   │   ├── analytics.py      # Analytics and reporting models
│   │   └── workflow.py       # Workflow management models
│   ├── routes/               # API route blueprints
│   │   ├── __init__.py
│   │   ├── auth.py          # Authentication routes
│   │   ├── users.py         # User management routes
│   │   ├── customers.py     # Customer management routes
│   │   ├── animals.py       # Animal management routes
│   │   ├── laboratory.py    # Laboratory routes
│   │   ├── genomics.py      # Genomics routes
│   │   ├── biobank.py       # Biobank routes
│   │   ├── analytics.py     # Analytics routes
│   │   └── workflows.py     # Workflow routes
│   └── middleware/          # Security and utility middleware
│       ├── __init__.py
│       ├── auth.py         # Authentication middleware
│       ├── rate_limiting.py # Rate limiting middleware
│       ├── security.py     # Security middleware
│       └── logging.py      # Logging middleware
├── requirements.txt         # Python dependencies
├── .env                    # Environment configuration
├── .env.example           # Environment template
└── README.md             # This documentation
```

### Adding New Features

1. **Create Model**: Add new SQLAlchemy model in `src/models/`
2. **Create Routes**: Add API endpoints in `src/routes/`
3. **Register Blueprint**: Add blueprint to `src/routes/__init__.py`
4. **Add Tests**: Create comprehensive tests
5. **Update Documentation**: Update API documentation

### Database Migrations

```bash
# Initialize migrations (first time only)
flask db init

# Create migration
flask db migrate -m "Description of changes"

# Apply migration
flask db upgrade
```

## Testing

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-cov

# Run tests
pytest

# Run with coverage
pytest --cov=src
```

### Test Structure

```
tests/
├── conftest.py              # Test configuration
├── test_auth.py            # Authentication tests
├── test_users.py           # User management tests
├── test_customers.py       # Customer management tests
├── test_animals.py         # Animal management tests
├── test_laboratory.py      # Laboratory tests
├── test_genomics.py        # Genomics tests
├── test_biobank.py         # Biobank tests
├── test_analytics.py       # Analytics tests
└── test_workflows.py       # Workflow tests
```

## Deployment

### Production Deployment

#### Using Docker

1. **Build Image**
   ```bash
   docker build -t reprotech-backend .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     --name reprotech-backend \
     -p 5000:5000 \
     -e DATABASE_URL=postgresql://user:pass@db:5432/reprotech \
     reprotech-backend
   ```

#### Using Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://reprotech:password@db:5432/reprotech_db
      - FLASK_ENV=production
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=reprotech_db
      - POSTGRES_USER=reprotech
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Manual Deployment

1. **Setup Production Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Python and PostgreSQL
   sudo apt install python3.11 python3.11-venv postgresql postgresql-contrib nginx
   
   # Create application user
   sudo useradd -m -s /bin/bash reprotech
   sudo su - reprotech
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd reprotech-backend
   
   # Setup virtual environment
   python3.11 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Configure environment
   cp .env.example .env
   # Edit .env with production values
   
   # Setup database
   createdb reprotech_db
   python src/main.py  # Creates tables
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. **Setup Systemd Service**
   ```ini
   [Unit]
   Description=Reprotech Backend API
   After=network.target
   
   [Service]
   Type=simple
   User=reprotech
   WorkingDirectory=/home/reprotech/reprotech-backend
   Environment=PATH=/home/reprotech/reprotech-backend/venv/bin
   ExecStart=/home/reprotech/reprotech-backend/venv/bin/python src/main.py
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```

### Environment-Specific Configuration

#### Development
```env
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///reprotech.db
```

#### Staging
```env
FLASK_ENV=staging
FLASK_DEBUG=False
DATABASE_URL=postgresql://user:pass@staging-db:5432/reprotech_staging
```

#### Production
```env
FLASK_ENV=production
FLASK_DEBUG=False
DATABASE_URL=postgresql://user:pass@prod-db:5432/reprotech_prod
SECRET_KEY=<strong-random-key>
JWT_SECRET_KEY=<strong-random-key>
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database exists
psql -l | grep reprotech

# Test connection
psql -h localhost -U reprotech_user -d reprotech_db
```

#### Permission Issues
```bash
# Check file permissions
ls -la src/
chmod +x src/main.py

# Check database permissions
GRANT ALL PRIVILEGES ON DATABASE reprotech_db TO reprotech_user;
```

#### Port Conflicts
```bash
# Check what's using port 5000
sudo netstat -tlnp | grep :5000
sudo lsof -i :5000

# Kill process if needed
sudo kill -9 <pid>
```

### Logging and Debugging

#### Application Logs
```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log

# View access logs
tail -f logs/access.log
```

#### Database Debugging
```bash
# Enable SQL logging
export SQLALCHEMY_ECHO=True

# Check slow queries
tail -f /var/log/postgresql/postgresql-13-main.log
```

## Contributing

### Development Setup

1. **Fork Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Make Changes**
4. **Run Tests**
   ```bash
   pytest
   ```
5. **Submit Pull Request**

### Code Standards

- **PEP 8**: Python code style guide
- **Type Hints**: Use type annotations
- **Docstrings**: Document all functions and classes
- **Tests**: Maintain 90%+ test coverage

### Commit Messages

```
feat: add new animal breeding module
fix: resolve database connection issue
docs: update API documentation
test: add genomics analysis tests
refactor: optimize query performance
```

## Support

### Documentation
- API Documentation: `/api/v1/info`
- Health Check: `/api/v1/health`
- This README: Complete setup and usage guide

### Contact
- **Author**: Manus AI
- **Version**: 1.0.0
- **License**: MIT

### Resources
- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Documentation](https://jwt.io/introduction/)

---

**Reprotech Backend API** - A comprehensive biotechnology management platform built with Flask, designed for production use with enterprise-grade security, performance, and scalability features.

