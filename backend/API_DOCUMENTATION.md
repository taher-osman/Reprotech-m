# Reprotech API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Pagination](#pagination)
6. [API Endpoints](#api-endpoints)
   - [Authentication & User Management](#authentication--user-management)
   - [Customer Management](#customer-management)
   - [Animal Management](#animal-management)
   - [Laboratory Management](#laboratory-management)
   - [Genomics & Intelligence](#genomics--intelligence)
   - [Biobank & Sample Storage](#biobank--sample-storage)
   - [Analytics & Dashboard](#analytics--dashboard)
   - [Workflow Management](#workflow-management)

## Overview

The Reprotech API is a RESTful web service that provides comprehensive biotechnology management capabilities. All API endpoints return JSON responses and use standard HTTP status codes.

**Base URL**: `http://localhost:5000/api/v1`

**Content Type**: `application/json`

**Authentication**: JWT Bearer Token

## Authentication

### JWT Token Structure

The API uses JSON Web Tokens (JWT) for authentication. Tokens are provided in two types:

- **Access Token**: Short-lived token for API access (1 hour default)
- **Refresh Token**: Long-lived token for obtaining new access tokens (30 days default)

### Authorization Header

Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Lifecycle

1. **Login**: Obtain access and refresh tokens
2. **API Calls**: Use access token for authenticated requests
3. **Token Refresh**: Use refresh token to obtain new access token
4. **Logout**: Blacklist tokens to prevent further use

## Error Handling

### Standard HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

### Error Response Format

```json
{
  "error": "Error message",
  "details": {
    "field": "Specific field error"
  },
  "timestamp": "2023-12-01T10:00:00Z"
}
```

## Rate Limiting

### Rate Limit Headers

All responses include rate limiting headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701432000
```

### Rate Limit Tiers

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 5 requests | 5 minutes |
| General API | 100 requests | 1 hour |
| User-specific | 1000 requests | 1 hour |
| API Key | 10000 requests | 1 hour |

## Pagination

### Query Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `page` | Page number (1-based) | 1 |
| `per_page` | Items per page (max 100) | 20 |
| `search` | Search query string | - |

### Response Format

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

## API Endpoints

### Authentication & User Management

#### Register User

Create a new user account.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "role": "user"
}
```

**Response** (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "is_active": true,
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

#### Login

Authenticate user and obtain tokens.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user"
  }
}
```

#### Refresh Token

Obtain new access token using refresh token.

**Endpoint**: `POST /auth/refresh`

**Headers**: `Authorization: Bearer <refresh_token>`

**Response** (200):
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Logout

Blacklist current tokens.

**Endpoint**: `POST /auth/logout`

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

#### Get User Profile

Get current user's profile information.

**Endpoint**: `GET /users/profile`

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "role": "user",
    "is_active": true,
    "last_login": "2023-12-01T10:00:00Z",
    "created_at": "2023-11-01T10:00:00Z"
  }
}
```

#### Update User Profile

Update current user's profile information.

**Endpoint**: `PUT /users/profile`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+1234567890"
}
```

**Response** (200):
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Smith",
    "phone": "+1234567890",
    "updated_at": "2023-12-01T10:00:00Z"
  }
}
```

#### List Users

List all users (admin only).

**Endpoint**: `GET /users`

**Headers**: `Authorization: Bearer <access_token>`

**Query Parameters**:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20, max: 100)
- `search`: Search by name or email
- `role`: Filter by role
- `is_active`: Filter by active status

**Response** (200):
```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user",
      "is_active": true,
      "last_login": "2023-12-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 1,
    "pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

### Customer Management

#### Create Customer

Create a new customer record.

**Endpoint**: `POST /customers`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "name": "ABC Farms",
  "email": "contact@abcfarms.com",
  "phone": "+1234567890",
  "address": "123 Farm Road, City, State 12345",
  "customer_type": "Farm",
  "status": "Active",
  "contact_person": "Jane Smith",
  "notes": "Large dairy operation"
}
```

**Response** (201):
```json
{
  "message": "Customer created successfully",
  "customer": {
    "id": 1,
    "name": "ABC Farms",
    "email": "contact@abcfarms.com",
    "phone": "+1234567890",
    "address": "123 Farm Road, City, State 12345",
    "customer_type": "Farm",
    "status": "Active",
    "contact_person": "Jane Smith",
    "notes": "Large dairy operation",
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

#### List Customers

List customers with filtering and pagination.

**Endpoint**: `GET /customers`

**Headers**: `Authorization: Bearer <access_token>`

**Query Parameters**:
- `page`: Page number
- `per_page`: Items per page
- `search`: Search by name, email, or contact person
- `customer_type`: Filter by customer type
- `status`: Filter by status

**Response** (200):
```json
{
  "customers": [
    {
      "id": 1,
      "name": "ABC Farms",
      "email": "contact@abcfarms.com",
      "phone": "+1234567890",
      "customer_type": "Farm",
      "status": "Active",
      "contact_person": "Jane Smith",
      "created_at": "2023-12-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 1,
    "pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

#### Get Customer Details

Get detailed customer information.

**Endpoint**: `GET /customers/{customer_id}`

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "customer": {
    "id": 1,
    "name": "ABC Farms",
    "email": "contact@abcfarms.com",
    "phone": "+1234567890",
    "address": "123 Farm Road, City, State 12345",
    "customer_type": "Farm",
    "status": "Active",
    "contact_person": "Jane Smith",
    "notes": "Large dairy operation",
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-01T10:00:00Z"
  }
}
```

#### Update Customer

Update customer information.

**Endpoint**: `PUT /customers/{customer_id}`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "name": "ABC Dairy Farms",
  "phone": "+1234567891",
  "status": "Active",
  "notes": "Updated contact information"
}
```

**Response** (200):
```json
{
  "message": "Customer updated successfully",
  "customer": {
    "id": 1,
    "name": "ABC Dairy Farms",
    "phone": "+1234567891",
    "status": "Active",
    "notes": "Updated contact information",
    "updated_at": "2023-12-01T11:00:00Z"
  }
}
```

### Animal Management

#### Create Animal

Register a new animal in the system.

**Endpoint**: `POST /animals`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "name": "Thunder",
  "species": "BOVINE",
  "sex": "Male",
  "date_of_birth": "2020-01-15",
  "breed": "Holstein",
  "color": "Black and White",
  "weight": 650.5,
  "height": 145.0,
  "microchip": "982000123456789",
  "purpose": "Breeding",
  "status": "ACTIVE",
  "customer_id": 1,
  "current_location": "Pasture A",
  "notes": "Excellent breeding bull"
}
```

**Response** (201):
```json
{
  "message": "Animal created successfully",
  "animal": {
    "id": 1,
    "animal_id": "BOV-2023-1234",
    "name": "Thunder",
    "species": "BOVINE",
    "sex": "Male",
    "date_of_birth": "2020-01-15",
    "breed": "Holstein",
    "color": "Black and White",
    "weight": 650.5,
    "height": 145.0,
    "microchip": "982000123456789",
    "purpose": "Breeding",
    "status": "ACTIVE",
    "customer_id": 1,
    "current_location": "Pasture A",
    "notes": "Excellent breeding bull",
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

#### List Animals

List animals with filtering and pagination.

**Endpoint**: `GET /animals`

**Headers**: `Authorization: Bearer <access_token>`

**Query Parameters**:
- `page`: Page number
- `per_page`: Items per page
- `search`: Search by name, animal_id, or microchip
- `species`: Filter by species
- `status`: Filter by status
- `purpose`: Filter by purpose
- `customer_id`: Filter by customer
- `has_genomic_data`: Filter animals with genomic data

**Response** (200):
```json
{
  "animals": [
    {
      "id": 1,
      "animal_id": "BOV-2023-1234",
      "name": "Thunder",
      "species": "BOVINE",
      "sex": "Male",
      "breed": "Holstein",
      "status": "ACTIVE",
      "customer_id": 1,
      "created_at": "2023-12-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 1,
    "pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

#### Get Animal Details

Get detailed animal information including relationships.

**Endpoint**: `GET /animals/{animal_id}`

**Headers**: `Authorization: Bearer <access_token>`

**Query Parameters**:
- `include_relationships`: Include parent/offspring relationships

**Response** (200):
```json
{
  "animal": {
    "id": 1,
    "animal_id": "BOV-2023-1234",
    "name": "Thunder",
    "species": "BOVINE",
    "sex": "Male",
    "date_of_birth": "2020-01-15",
    "breed": "Holstein",
    "color": "Black and White",
    "weight": 650.5,
    "height": 145.0,
    "microchip": "982000123456789",
    "purpose": "Breeding",
    "status": "ACTIVE",
    "customer_id": 1,
    "current_location": "Pasture A",
    "notes": "Excellent breeding bull",
    "father": null,
    "mother": null,
    "offspring": [],
    "roles": [],
    "internal_numbers": [],
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

#### Assign Animal Role

Assign a role to an animal (e.g., breeding bull, donor cow).

**Endpoint**: `POST /animals/{animal_id}/roles`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "role": "breeding_bull",
  "notes": "Assigned as primary breeding bull for herd"
}
```

**Response** (201):
```json
{
  "message": "Role assigned successfully",
  "role": {
    "id": 1,
    "animal_id": 1,
    "role": "breeding_bull",
    "assigned_date": "2023-12-01T10:00:00Z",
    "is_active": true,
    "notes": "Assigned as primary breeding bull for herd"
  }
}
```

#### Add Animal Activity

Record an activity or event for an animal.

**Endpoint**: `POST /animals/{animal_id}/activities`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "activity_type": "health_check",
  "description": "Routine health examination",
  "activity_date": "2023-12-01T14:00:00Z",
  "metadata": {
    "temperature": 38.5,
    "weight": 655.0,
    "notes": "Animal in good health"
  }
}
```

**Response** (201):
```json
{
  "message": "Activity added successfully",
  "activity": {
    "id": 1,
    "animal_id": 1,
    "activity_type": "health_check",
    "description": "Routine health examination",
    "activity_date": "2023-12-01T14:00:00Z",
    "performed_by": 1,
    "activity_metadata": {
      "temperature": 38.5,
      "weight": 655.0,
      "notes": "Animal in good health"
    },
    "created_at": "2023-12-01T15:00:00Z"
  }
}
```

### Laboratory Management

#### Create Sample

Create a new laboratory sample.

**Endpoint**: `POST /lab/samples`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "sample_type": "Blood",
  "collection_date": "2023-12-01T10:00:00Z",
  "animal_id": 1,
  "customer_id": 1,
  "collection_method": "Venipuncture",
  "collection_site": "Jugular vein",
  "volume": 10.0,
  "unit": "ml",
  "storage_location": "Freezer A1",
  "storage_temperature": -20.0,
  "priority": "NORMAL",
  "notes": "Sample for genetic analysis"
}
```

**Response** (201):
```json
{
  "message": "Sample created successfully",
  "sample": {
    "id": 1,
    "sample_id": "SAM-2023-123456",
    "sample_type": "Blood",
    "status": "COLLECTED",
    "collection_date": "2023-12-01T10:00:00Z",
    "animal_id": 1,
    "customer_id": 1,
    "collection_method": "Venipuncture",
    "volume": 10.0,
    "unit": "ml",
    "storage_location": "Freezer A1",
    "priority": "NORMAL",
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

#### Create Test

Create a new laboratory test.

**Endpoint**: `POST /lab/tests`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "sample_id": 1,
  "protocol_id": 1,
  "priority": "HIGH",
  "scheduled_date": "2023-12-02T09:00:00Z",
  "due_date": "2023-12-05T17:00:00Z",
  "assigned_to": 2,
  "notes": "Rush analysis required"
}
```

**Response** (201):
```json
{
  "message": "Test created successfully",
  "test": {
    "id": 1,
    "test_id": "TST-2023-123456",
    "sample_id": 1,
    "protocol_id": 1,
    "status": "PENDING",
    "priority": "HIGH",
    "scheduled_date": "2023-12-02T09:00:00Z",
    "due_date": "2023-12-05T17:00:00Z",
    "assigned_to": 2,
    "notes": "Rush analysis required",
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

#### Start Test

Start execution of a laboratory test.

**Endpoint**: `POST /lab/tests/{test_id}/start`

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "message": "Test started successfully",
  "test": {
    "id": 1,
    "test_id": "TST-2023-123456",
    "status": "IN_PROGRESS",
    "started_at": "2023-12-02T09:00:00Z",
    "started_by": 2
  }
}
```

#### Complete Test

Complete a laboratory test with results.

**Endpoint**: `POST /lab/tests/{test_id}/complete`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "results": {
    "genetic_markers": ["A1", "B2", "C3"],
    "quality_score": 95.5,
    "concentration": 125.3
  },
  "interpretation": "Normal genetic profile detected",
  "recommendations": "No further action required",
  "qc_passed": true,
  "qc_notes": "All quality controls passed"
}
```

**Response** (200):
```json
{
  "message": "Test completed successfully",
  "test": {
    "id": 1,
    "test_id": "TST-2023-123456",
    "status": "COMPLETED",
    "completed_at": "2023-12-02T15:30:00Z",
    "results": {
      "genetic_markers": ["A1", "B2", "C3"],
      "quality_score": 95.5,
      "concentration": 125.3
    },
    "interpretation": "Normal genetic profile detected",
    "qc_passed": true
  }
}
```

#### Create Protocol

Create a new laboratory protocol.

**Endpoint**: `POST /lab/protocols`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "protocol_name": "SNP Genotyping Protocol",
  "protocol_code": "SNP-001",
  "version": "1.0",
  "category": "GENOMICS",
  "description": "Standard protocol for SNP genotyping analysis",
  "procedure_steps": [
    {
      "step": 1,
      "description": "DNA extraction from sample",
      "duration_minutes": 60
    },
    {
      "step": 2,
      "description": "PCR amplification",
      "duration_minutes": 120
    },
    {
      "step": 3,
      "description": "Genotype calling",
      "duration_minutes": 30
    }
  ],
  "sample_types": ["Blood", "Tissue", "Hair"],
  "estimated_duration": 210,
  "cost_per_test": 150.00,
  "equipment_required": ["PCR Machine", "Centrifuge", "Pipettes"],
  "reagents_required": ["DNA Extraction Kit", "PCR Master Mix"]
}
```

**Response** (201):
```json
{
  "message": "Protocol created successfully",
  "protocol": {
    "id": 1,
    "protocol_name": "SNP Genotyping Protocol",
    "protocol_code": "SNP-001",
    "version": "1.0",
    "category": "GENOMICS",
    "description": "Standard protocol for SNP genotyping analysis",
    "estimated_duration": 210,
    "cost_per_test": 150.00,
    "is_active": true,
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

### Genomics & Intelligence

#### Create Genomic Analysis

Create a new genomic analysis job.

**Endpoint**: `POST /genomics/analyses`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "analysis_type": "SNP_ANALYSIS",
  "analysis_name": "Holstein SNP Analysis - Thunder",
  "description": "Comprehensive SNP analysis for breeding evaluation",
  "animal_id": 1,
  "sample_id": 1,
  "parameters": {
    "chip_type": "50K",
    "reference_genome": "ARS-UCD1.2",
    "quality_threshold": 0.95,
    "maf_threshold": 0.05
  },
  "algorithm_version": "v2.1.0",
  "input_files": [
    "/data/samples/sample_001.vcf",
    "/data/reference/bovine_50k.map"
  ]
}
```

**Response** (201):
```json
{
  "message": "Analysis created successfully",
  "analysis": {
    "id": 1,
    "analysis_id": "GEN-2023-123456",
    "analysis_type": "SNP_ANALYSIS",
    "analysis_name": "Holstein SNP Analysis - Thunder",
    "status": "PENDING",
    "animal_id": 1,
    "sample_id": 1,
    "parameters": {
      "chip_type": "50K",
      "reference_genome": "ARS-UCD1.2",
      "quality_threshold": 0.95,
      "maf_threshold": 0.05
    },
    "algorithm_version": "v2.1.0",
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

#### Start Analysis

Start execution of a genomic analysis.

**Endpoint**: `POST /genomics/analyses/{analysis_id}/start`

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "message": "Analysis started successfully",
  "analysis": {
    "id": 1,
    "analysis_id": "GEN-2023-123456",
    "status": "RUNNING",
    "started_at": "2023-12-01T11:00:00Z",
    "processed_by": 1
  }
}
```

#### Complete Analysis

Complete a genomic analysis with results.

**Endpoint**: `POST /genomics/analyses/{analysis_id}/complete`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "results": {
    "total_snps": 54609,
    "passed_qc": 52341,
    "call_rate": 0.958,
    "heterozygosity": 0.342,
    "breeding_values": {
      "milk_yield": 1250,
      "protein_content": 3.45,
      "fat_content": 3.78
    }
  },
  "confidence_score": 0.95,
  "quality_metrics": {
    "sample_quality": "EXCELLENT",
    "analysis_quality": "HIGH",
    "data_completeness": 0.958
  },
  "output_files": [
    "/results/analysis_001_summary.pdf",
    "/results/analysis_001_snps.vcf",
    "/results/analysis_001_report.html"
  ]
}
```

**Response** (200):
```json
{
  "message": "Analysis completed successfully",
  "analysis": {
    "id": 1,
    "analysis_id": "GEN-2023-123456",
    "status": "COMPLETED",
    "completed_at": "2023-12-01T14:30:00Z",
    "processing_time_seconds": 12600,
    "results": {
      "total_snps": 54609,
      "passed_qc": 52341,
      "call_rate": 0.958,
      "breeding_values": {
        "milk_yield": 1250,
        "protein_content": 3.45,
        "fat_content": 3.78
      }
    },
    "confidence_score": 0.95
  }
}
```

#### Bulk Create SNP Data

Create multiple SNP records in bulk.

**Endpoint**: `POST /genomics/snp-data/bulk`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "snp_records": [
    {
      "animal_id": 1,
      "chromosome": "1",
      "position": 123456,
      "snp_id": "rs123456789",
      "reference_allele": "A",
      "alternate_allele": "G",
      "genotype": "AG",
      "quality_score": 95.5,
      "read_depth": 25,
      "allele_frequency": 0.35,
      "analysis_id": 1
    },
    {
      "animal_id": 1,
      "chromosome": "1",
      "position": 234567,
      "snp_id": "rs234567890",
      "reference_allele": "C",
      "alternate_allele": "T",
      "genotype": "CC",
      "quality_score": 98.2,
      "read_depth": 30,
      "allele_frequency": 0.65,
      "analysis_id": 1
    }
  ]
}
```

**Response** (201):
```json
{
  "message": "Successfully created 2 SNP records",
  "count": 2
}
```

### Biobank & Sample Storage

#### Create Storage Unit

Create a new biobank storage unit.

**Endpoint**: `POST /biobank/storage-units`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "name": "Ultra-Low Freezer A",
  "unit_type": "FREEZER",
  "location": "Laboratory Room 1",
  "building": "Main Lab Building",
  "room": "101",
  "total_capacity": 1000,
  "target_temperature": -80.0,
  "temperature_tolerance": 5.0,
  "humidity_level": 45.0,
  "temperature_alerts_enabled": true,
  "capacity_alert_threshold": 90.0,
  "specifications": {
    "manufacturer": "Thermo Scientific",
    "model": "TSX Series",
    "serial_number": "TSX123456",
    "installation_date": "2023-01-15"
  },
  "notes": "Primary storage for genetic samples"
}
```

**Response** (201):
```json
{
  "message": "Storage unit created successfully",
  "storage_unit": {
    "id": 1,
    "unit_id": "STU-2023-1234",
    "name": "Ultra-Low Freezer A",
    "unit_type": "FREEZER",
    "location": "Laboratory Room 1",
    "total_capacity": 1000,
    "current_occupancy": 0,
    "available_capacity": 1000,
    "target_temperature": -80.0,
    "current_temperature": -79.5,
    "status": "OPERATIONAL",
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

#### Create Biobank Sample

Store a sample in the biobank.

**Endpoint**: `POST /biobank/samples`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "sample_type": "DNA",
  "sample_name": "Thunder DNA Extract",
  "description": "High-quality DNA extract for genomic analysis",
  "animal_id": 1,
  "customer_id": 1,
  "lab_sample_id": 1,
  "storage_unit_id": 1,
  "position": "A1-001",
  "container_type": "Cryovial",
  "container_id": "CV-001234",
  "volume": 500.0,
  "unit": "μl",
  "concentration": 125.5,
  "concentration_unit": "ng/μl",
  "quality_rating": "EXCELLENT",
  "viability_percentage": 98.5,
  "collection_date": "2023-12-01T10:00:00Z",
  "expiry_date": "2025-12-01T10:00:00Z",
  "storage_conditions": "Store at -80°C, avoid freeze-thaw cycles",
  "handling_instructions": "Thaw on ice before use",
  "notes": "Extracted using standard protocol"
}
```

**Response** (201):
```json
{
  "message": "Sample created successfully",
  "sample": {
    "id": 1,
    "sample_id": "BIO-2023-123456",
    "sample_type": "DNA",
    "sample_name": "Thunder DNA Extract",
    "status": "STORED",
    "animal_id": 1,
    "storage_unit_id": 1,
    "position": "A1-001",
    "container_type": "Cryovial",
    "volume": 500.0,
    "concentration": 125.5,
    "quality_rating": "EXCELLENT",
    "storage_date": "2023-12-01T10:00:00Z",
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

#### Log Temperature Reading

Record temperature reading for a storage unit.

**Endpoint**: `POST /biobank/storage-units/{unit_id}/temperature-log`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "temperature": -79.8,
  "humidity": 44.5
}
```

**Response** (201):
```json
{
  "message": "Temperature logged successfully",
  "temperature_log": {
    "id": 1,
    "storage_unit_id": 1,
    "temperature": -79.8,
    "humidity": 44.5,
    "is_within_range": true,
    "alert_triggered": false,
    "recorded_at": "2023-12-01T10:00:00Z"
  },
  "alert_triggered": false
}
```

### Analytics & Dashboard

#### Get Dashboard Data

Get comprehensive dashboard statistics.

**Endpoint**: `GET /analytics/dashboard-data`

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "statistics": {
    "animals": {
      "total": 1250,
      "active": 1180
    },
    "customers": {
      "total": 45,
      "active": 42
    },
    "laboratory": {
      "samples": 3420,
      "tests": 2890,
      "pending_tests": 125
    },
    "biobank": {
      "samples": 5680,
      "storage_units": 12
    }
  },
  "recent_activities": [
    {
      "id": 1,
      "type": "animal_created",
      "description": "New animal registered: Thunder (BOV-2023-1234)",
      "timestamp": "2023-12-01T10:00:00Z",
      "user": "John Doe"
    },
    {
      "id": 2,
      "type": "test_completed",
      "description": "Genomic analysis completed for sample SAM-2023-123456",
      "timestamp": "2023-12-01T09:30:00Z",
      "user": "Lab Technician"
    }
  ],
  "generated_at": "2023-12-01T15:00:00Z"
}
```

#### Create Dashboard Widget

Create a new dashboard widget.

**Endpoint**: `POST /analytics/widgets`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "title": "Active Animals by Species",
  "widget_type": "PIE_CHART",
  "description": "Distribution of active animals by species",
  "dashboard_section": "main",
  "position_x": 0,
  "position_y": 0,
  "width": 2,
  "height": 2,
  "configuration": {
    "data_source": "animals",
    "group_by": "species",
    "filter": {
      "status": "ACTIVE"
    },
    "colors": ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]
  },
  "refresh_interval": 300,
  "visibility": "PUBLIC"
}
```

**Response** (201):
```json
{
  "message": "Widget created successfully",
  "widget": {
    "id": 1,
    "widget_id": "widget-abc12345",
    "title": "Active Animals by Species",
    "widget_type": "PIE_CHART",
    "dashboard_section": "main",
    "position_x": 0,
    "position_y": 0,
    "width": 2,
    "height": 2,
    "refresh_interval": 300,
    "visibility": "PUBLIC",
    "is_active": true,
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

#### Execute Report

Execute a report and get results.

**Endpoint**: `POST /analytics/reports/{report_id}/execute`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "parameters": {
    "date_range": "last_30_days",
    "species": "BOVINE",
    "include_inactive": false
  },
  "filters": {
    "customer_id": 1,
    "status": "ACTIVE"
  }
}
```

**Response** (200):
```json
{
  "message": "Report executed successfully",
  "execution": {
    "execution_id": "EXE-2023-123456",
    "report_id": 1,
    "status": "COMPLETED",
    "executed_at": "2023-12-01T10:00:00Z",
    "completed_at": "2023-12-01T10:02:30Z",
    "execution_time_seconds": 150,
    "result_count": 125
  },
  "results": {
    "data": [
      {
        "animal_id": "BOV-2023-1234",
        "name": "Thunder",
        "breed": "Holstein",
        "age_months": 47,
        "weight": 650.5,
        "breeding_value": 1250
      }
    ],
    "summary": {
      "total_animals": 125,
      "average_age": 38.5,
      "average_weight": 580.2,
      "average_breeding_value": 1180
    }
  }
}
```

### Workflow Management

#### Create Workflow

Create a new workflow template.

**Endpoint**: `POST /workflows`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "name": "Sample Processing Workflow",
  "description": "Standard workflow for processing genetic samples",
  "category": "LABORATORY",
  "version": "1.0",
  "steps": [
    {
      "name": "Sample Reception",
      "type": "MANUAL",
      "description": "Receive and log sample",
      "estimated_duration": 15,
      "required_role": "lab_technician"
    },
    {
      "name": "Quality Check",
      "type": "MANUAL",
      "description": "Perform initial quality assessment",
      "estimated_duration": 30,
      "required_role": "lab_technician"
    },
    {
      "name": "DNA Extraction",
      "type": "AUTOMATED",
      "description": "Extract DNA using automated system",
      "estimated_duration": 120,
      "equipment": ["DNA Extractor"]
    },
    {
      "name": "Quality Control",
      "type": "MANUAL",
      "description": "Verify DNA quality and concentration",
      "estimated_duration": 45,
      "required_role": "lab_technician"
    }
  ],
  "transitions": {
    "Sample Reception": "Quality Check",
    "Quality Check": "DNA Extraction",
    "DNA Extraction": "Quality Control"
  },
  "is_template": true,
  "estimated_duration_minutes": 210,
  "max_duration_minutes": 300,
  "allowed_roles": ["lab_technician", "lab_manager"],
  "input_parameters": {
    "sample_id": "required",
    "priority": "optional",
    "special_instructions": "optional"
  },
  "output_parameters": {
    "dna_concentration": "number",
    "quality_score": "number",
    "storage_location": "string"
  }
}
```

**Response** (201):
```json
{
  "message": "Workflow created successfully",
  "workflow": {
    "id": 1,
    "workflow_id": "WF-2023-1234",
    "name": "Sample Processing Workflow",
    "category": "LABORATORY",
    "version": "1.0",
    "is_template": true,
    "is_active": true,
    "estimated_duration_minutes": 210,
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

#### Create Workflow Instance

Create and start a workflow instance.

**Endpoint**: `POST /workflows/instances`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "workflow_id": 1,
  "name": "Process Sample SAM-2023-123456",
  "description": "Processing genetic sample from Thunder",
  "context_type": "SAMPLE",
  "context_id": "1",
  "due_date": "2023-12-05T17:00:00Z",
  "input_data": {
    "sample_id": 1,
    "priority": "HIGH",
    "special_instructions": "Rush processing required"
  },
  "assigned_to": 2,
  "priority": "HIGH"
}
```

**Response** (201):
```json
{
  "message": "Workflow instance created successfully",
  "instance": {
    "id": 1,
    "instance_id": "WFI-2023-123456",
    "workflow_id": 1,
    "name": "Process Sample SAM-2023-123456",
    "status": "PENDING",
    "context_type": "SAMPLE",
    "context_id": "1",
    "due_date": "2023-12-05T17:00:00Z",
    "assigned_to": 2,
    "priority": "HIGH",
    "progress_percentage": 0,
    "created_at": "2023-12-01T10:00:00Z"
  }
}
```

#### Start Workflow Instance

Start execution of a workflow instance.

**Endpoint**: `POST /workflows/instances/{instance_id}/start`

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "message": "Instance started successfully",
  "instance": {
    "id": 1,
    "instance_id": "WFI-2023-123456",
    "status": "RUNNING",
    "started_at": "2023-12-01T11:00:00Z",
    "current_step": "Sample Reception",
    "current_step_index": 0,
    "progress_percentage": 0
  }
}
```

#### Complete Workflow Step

Complete a step in a workflow instance.

**Endpoint**: `POST /workflows/instances/{instance_id}/steps/{step_id}/complete`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "output_data": {
    "sample_received": true,
    "condition": "EXCELLENT",
    "notes": "Sample in perfect condition, no issues detected"
  }
}
```

**Response** (200):
```json
{
  "message": "Step completed successfully",
  "step": {
    "id": 1,
    "step_name": "Sample Reception",
    "status": "COMPLETED",
    "completed_at": "2023-12-01T11:15:00Z",
    "output_data": {
      "sample_received": true,
      "condition": "EXCELLENT",
      "notes": "Sample in perfect condition, no issues detected"
    }
  },
  "instance": {
    "id": 1,
    "current_step": "Quality Check",
    "current_step_index": 1,
    "progress_percentage": 25
  }
}
```

## Error Examples

### Validation Error (422)

```json
{
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  },
  "timestamp": "2023-12-01T10:00:00Z"
}
```

### Authentication Error (401)

```json
{
  "error": "Token has expired",
  "timestamp": "2023-12-01T10:00:00Z"
}
```

### Permission Error (403)

```json
{
  "error": "Insufficient permissions",
  "required_roles": ["admin", "lab_manager"],
  "user_roles": ["user"],
  "timestamp": "2023-12-01T10:00:00Z"
}
```

### Rate Limit Error (429)

```json
{
  "error": "Rate limit exceeded",
  "message": "Maximum 100 requests per 1 hour",
  "retry_after": 3600,
  "timestamp": "2023-12-01T10:00:00Z"
}
```

---

This comprehensive API documentation covers all major endpoints and functionality of the Reprotech biotechnology management platform. For additional support or questions, please refer to the main README.md file or contact the development team.

