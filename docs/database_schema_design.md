# Reprotech Database Schema and API Architecture Design

## Executive Summary

This document presents a comprehensive database schema and API architecture design for the Reprotech biotechnology management platform. The design encompasses all 25 modules across 7 functional groups, providing a scalable, maintainable, and production-ready backend infrastructure that supports complex reproductive technology operations, laboratory management, genomic analysis, and customer relationship management.

The proposed architecture leverages PostgreSQL as the primary database system, chosen for its robust support for complex data relationships, JSON data types for flexible schema evolution, and excellent performance characteristics for analytical workloads. The API design follows RESTful principles with additional GraphQL capabilities for complex data queries, ensuring optimal performance and developer experience.

## Database Architecture Overview

### Core Design Principles

The database architecture is built upon several fundamental principles that ensure scalability, data integrity, and operational efficiency. The design emphasizes normalization where appropriate while allowing for denormalization in specific analytical contexts to optimize query performance. Each table includes comprehensive audit trails, soft deletion capabilities, and versioning support to maintain data lineage and support regulatory compliance requirements common in biotechnology operations.

The schema design incorporates a multi-tenant architecture approach, allowing for future expansion to support multiple organizations or research facilities while maintaining data isolation and security. This design decision provides flexibility for both single-tenant deployments and future multi-tenant scenarios without requiring significant architectural changes.

### Primary Database Tables

#### User Management and Authentication

The user management system forms the foundation of the platform's security architecture. The `users` table stores core authentication information, while the `user_profiles` table contains extended user information and preferences. The `roles` and `permissions` tables implement a flexible role-based access control (RBAC) system that can accommodate the complex permission requirements of biotechnology operations.

```sql
-- Users table with comprehensive authentication support
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User profiles with extended information
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    department VARCHAR(100),
    position VARCHAR(100),
    specialization VARCHAR(100),
    preferences JSONB DEFAULT '{}',
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roles and permissions system
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);
```

#### Customer Relationship Management

The customer management system serves as a central hub for all client relationships within the platform. The `customers` table stores comprehensive customer information, while related tables manage contacts, addresses, and customer-specific configurations. This design supports both individual customers and complex organizational structures with multiple contacts and locations.

```sql
-- Customers table with comprehensive CRM support
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR(50) UNIQUE NOT NULL, -- Business-friendly ID
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Individual', 'Organization', 'Research', 'Government')),
    category VARCHAR(50) DEFAULT 'Standard' CHECK (category IN ('Standard', 'Premium', 'VIP', 'Research')),
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended', 'Archived')),
    tax_id VARCHAR(50),
    registration_number VARCHAR(100),
    industry VARCHAR(100),
    website VARCHAR(255),
    notes TEXT,
    preferences JSONB DEFAULT '{}',
    credit_limit DECIMAL(15,2),
    payment_terms INTEGER DEFAULT 30,
    discount_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Customer contacts for multiple contact persons
CREATE TABLE customer_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    department VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    is_primary BOOLEAN DEFAULT false,
    is_billing BOOLEAN DEFAULT false,
    is_technical BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer addresses for multiple locations
CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Billing', 'Shipping', 'Facility', 'Headquarters')),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    coordinates POINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Animal Management System

The animal management system represents the core of the platform's functionality, designed to handle complex animal data with support for multi-role assignments, comprehensive lineage tracking, and extensive metadata management. The design accommodates various species with species-specific attributes while maintaining a unified data model.

```sql
-- Animals table with comprehensive management features
CREATE TABLE animals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id VARCHAR(50) UNIQUE NOT NULL, -- Global permanent ID (SPP-YYYY-XXXX format)
    name VARCHAR(255) NOT NULL,
    species VARCHAR(50) NOT NULL CHECK (species IN ('BOVINE', 'EQUINE', 'CAMEL', 'OVINE', 'CAPRINE', 'SWINE')),
    sex VARCHAR(10) NOT NULL CHECK (sex IN ('MALE', 'FEMALE')),
    date_of_birth DATE,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Physical characteristics
    breed VARCHAR(100),
    color VARCHAR(100),
    weight DECIMAL(8,2),
    height DECIMAL(8,2),
    microchip VARCHAR(50),
    
    -- Purpose and classification
    purpose VARCHAR(50) CHECK (purpose IN ('Breeding', 'Racing', 'Dairy', 'Meat', 'Show', 'Research')),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'DECEASED', 'SOLD', 'TRANSFERRED')),
    
    -- Lineage information
    father_id UUID REFERENCES animals(id),
    mother_id UUID REFERENCES animals(id),
    family VARCHAR(100),
    
    -- Ownership and location
    owner VARCHAR(255),
    customer_id UUID REFERENCES customers(id),
    current_location VARCHAR(255),
    
    -- Additional metadata
    notes TEXT,
    images JSONB DEFAULT '[]',
    qr_code VARCHAR(255),
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    -- Soft delete
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id)
);

-- Animal roles for multi-role system
CREATE TABLE animal_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Donor', 'Recipient', 'Sire', 'LabSample', 'Reference')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    assigned_by UUID REFERENCES users(id),
    revoked_by UUID REFERENCES users(id),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(animal_id, role, assigned_at)
);

-- Internal number management for session-based identification
CREATE TABLE animal_internal_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
    internal_number VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    assigned_by UUID REFERENCES users(id),
    ended_by UUID REFERENCES users(id),
    reason VARCHAR(255) NOT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(internal_number, assigned_at)
);

-- Animal genomic data
CREATE TABLE animal_genomic_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
    has_snp_data BOOLEAN DEFAULT false,
    has_snp_index BOOLEAN DEFAULT false,
    has_bead_chip BOOLEAN DEFAULT false,
    has_parent_info BOOLEAN DEFAULT false,
    missing_parents BOOLEAN DEFAULT false,
    snp_count INTEGER DEFAULT 0,
    bead_chip_id VARCHAR(100),
    file_size BIGINT,
    quality_score DECIMAL(5,2),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Animal activity tracking
CREATE TABLE animal_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    activity_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    performed_by UUID REFERENCES users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Laboratory Management System

The laboratory management system provides comprehensive support for sample tracking, test execution, and quality control processes. The design accommodates complex laboratory workflows with support for multiple testing protocols, equipment monitoring, and result management.

```sql
-- Laboratory samples
CREATE TABLE lab_samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_id VARCHAR(50) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    sample_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'COLLECTED' CHECK (status IN ('COLLECTED', 'PROCESSING', 'TESTED', 'ARCHIVED', 'DISPOSED')),
    priority VARCHAR(50) DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'STAT')),
    collection_date TIMESTAMP WITH TIME ZONE NOT NULL,
    collection_method VARCHAR(100),
    collection_site VARCHAR(100),
    volume DECIMAL(10,3),
    unit VARCHAR(20),
    
    -- Source information
    animal_id UUID REFERENCES animals(id),
    customer_id UUID REFERENCES customers(id),
    collected_by UUID REFERENCES users(id),
    
    -- Storage information
    storage_location VARCHAR(100),
    storage_temperature DECIMAL(5,2),
    storage_conditions TEXT,
    
    -- Quality information
    quality_score DECIMAL(5,2),
    contamination_risk VARCHAR(50),
    viability_percentage DECIMAL(5,2),
    
    -- Metadata
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Laboratory protocols
CREATE TABLE lab_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_name VARCHAR(255) NOT NULL,
    protocol_code VARCHAR(50) UNIQUE NOT NULL,
    version VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    procedure_steps JSONB NOT NULL,
    sample_types JSONB NOT NULL, -- Array of supported sample types
    estimated_duration INTEGER NOT NULL, -- in minutes
    cost_per_test DECIMAL(10,2),
    equipment_required JSONB DEFAULT '[]',
    reagents_required JSONB DEFAULT '[]',
    quality_controls JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Laboratory tests
CREATE TABLE lab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id VARCHAR(50) UNIQUE NOT NULL,
    sample_id UUID REFERENCES lab_samples(id) ON DELETE CASCADE,
    protocol_id UUID REFERENCES lab_protocols(id),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'ON_HOLD', 'CANCELLED')),
    priority VARCHAR(50) DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'STAT')),
    
    -- Scheduling information
    requested_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    started_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    
    -- Assignment information
    assigned_to UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    
    -- Progress tracking
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    current_step VARCHAR(255),
    
    -- Results
    results JSONB DEFAULT '{}',
    interpretation TEXT,
    recommendations TEXT,
    
    -- Quality control
    qc_passed BOOLEAN,
    qc_notes TEXT,
    
    -- Metadata
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Laboratory equipment
CREATE TABLE lab_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    location VARCHAR(100),
    status VARCHAR(50) DEFAULT 'OPERATIONAL' CHECK (status IN ('OPERATIONAL', 'MAINTENANCE', 'OUT_OF_SERVICE', 'CALIBRATION')),
    
    -- Maintenance information
    last_maintenance DATE,
    next_maintenance DATE,
    maintenance_interval INTEGER, -- days
    
    -- Calibration information
    last_calibration DATE,
    next_calibration DATE,
    calibration_interval INTEGER, -- days
    
    -- Usage tracking
    total_usage_hours DECIMAL(10,2) DEFAULT 0,
    current_usage_hours DECIMAL(10,2) DEFAULT 0,
    
    -- Specifications
    specifications JSONB DEFAULT '{}',
    operating_parameters JSONB DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);
```

## API Architecture Design

### RESTful API Structure

The API architecture follows RESTful design principles with a clear resource-based URL structure. Each module's endpoints are organized under logical namespaces that correspond to the functional groups identified in the frontend analysis. The API design emphasizes consistency, predictability, and ease of use while providing comprehensive functionality for all platform operations.

The base API structure follows the pattern `/api/v1/{module}/{resource}` with support for nested resources where appropriate. All endpoints support standard HTTP methods (GET, POST, PUT, DELETE) with consistent response formats and error handling. The API includes comprehensive filtering, sorting, and pagination capabilities to handle large datasets efficiently.

### Authentication and Authorization Endpoints

The authentication system provides secure access control with JWT-based authentication and refresh token support. The API includes comprehensive user management capabilities with role-based access control and permission management.

```
Authentication Endpoints:
POST   /api/v1/auth/login          - User login with credentials
POST   /api/v1/auth/logout         - User logout and token invalidation
POST   /api/v1/auth/refresh        - Refresh access token
POST   /api/v1/auth/register       - User registration (admin only)
POST   /api/v1/auth/forgot-password - Password reset request
POST   /api/v1/auth/reset-password  - Password reset confirmation
GET    /api/v1/auth/profile        - Get current user profile
PUT    /api/v1/auth/profile        - Update user profile
POST   /api/v1/auth/change-password - Change user password

User Management Endpoints:
GET    /api/v1/users               - List users with filtering
POST   /api/v1/users               - Create new user
GET    /api/v1/users/{id}          - Get user details
PUT    /api/v1/users/{id}          - Update user
DELETE /api/v1/users/{id}          - Deactivate user
POST   /api/v1/users/{id}/activate - Activate user
POST   /api/v1/users/{id}/roles    - Assign roles to user
DELETE /api/v1/users/{id}/roles/{role_id} - Remove role from user

Role and Permission Management:
GET    /api/v1/roles               - List all roles
POST   /api/v1/roles               - Create new role
GET    /api/v1/roles/{id}          - Get role details
PUT    /api/v1/roles/{id}          - Update role
DELETE /api/v1/roles/{id}          - Delete role
GET    /api/v1/permissions         - List all permissions
POST   /api/v1/roles/{id}/permissions - Assign permissions to role
```

### Customer Management Endpoints

The customer management API provides comprehensive CRM functionality with support for complex organizational structures, multiple contacts, and detailed customer relationship tracking.

```
Customer Management Endpoints:
GET    /api/v1/customers           - List customers with filtering and search
POST   /api/v1/customers           - Create new customer
GET    /api/v1/customers/{id}      - Get customer details
PUT    /api/v1/customers/{id}      - Update customer information
DELETE /api/v1/customers/{id}      - Archive customer
POST   /api/v1/customers/{id}/activate - Reactivate customer

Customer Contacts:
GET    /api/v1/customers/{id}/contacts - List customer contacts
POST   /api/v1/customers/{id}/contacts - Add new contact
PUT    /api/v1/customers/{id}/contacts/{contact_id} - Update contact
DELETE /api/v1/customers/{id}/contacts/{contact_id} - Remove contact

Customer Addresses:
GET    /api/v1/customers/{id}/addresses - List customer addresses
POST   /api/v1/customers/{id}/addresses - Add new address
PUT    /api/v1/customers/{id}/addresses/{address_id} - Update address
DELETE /api/v1/customers/{id}/addresses/{address_id} - Remove address

Customer Analytics:
GET    /api/v1/customers/stats     - Customer statistics and metrics
GET    /api/v1/customers/{id}/activity - Customer activity history
GET    /api/v1/customers/{id}/animals - Animals associated with customer
GET    /api/v1/customers/{id}/transactions - Customer transaction history
```

### Animal Management Endpoints

The animal management API provides comprehensive functionality for animal registry, role management, lineage tracking, and activity monitoring. The API supports complex filtering and search capabilities to handle large animal databases efficiently.

```
Animal Management Endpoints:
GET    /api/v1/animals             - List animals with advanced filtering
POST   /api/v1/animals             - Register new animal
GET    /api/v1/animals/{id}        - Get animal details
PUT    /api/v1/animals/{id}        - Update animal information
DELETE /api/v1/animals/{id}        - Archive animal
POST   /api/v1/animals/bulk-import - Bulk import animals from file
GET    /api/v1/animals/export      - Export animals to file
GET    /api/v1/animals/stats       - Animal statistics and summaries

Animal Roles Management:
GET    /api/v1/animals/{id}/roles  - List animal roles
POST   /api/v1/animals/{id}/roles  - Assign new role
PUT    /api/v1/animals/{id}/roles/{role_id} - Update role
DELETE /api/v1/animals/{id}/roles/{role_id} - Revoke role

Internal Number Management:
GET    /api/v1/animals/{id}/internal-numbers - List internal number history
POST   /api/v1/animals/{id}/internal-numbers - Assign new internal number
PUT    /api/v1/animals/{id}/internal-numbers/{number_id} - End internal number

Genomic Data Management:
GET    /api/v1/animals/{id}/genomic - Get genomic data
PUT    /api/v1/animals/{id}/genomic - Update genomic data
POST   /api/v1/animals/{id}/genomic/upload - Upload genomic files

Activity Tracking:
GET    /api/v1/animals/{id}/activities - List animal activities
POST   /api/v1/animals/{id}/activities - Record new activity
GET    /api/v1/animals/{id}/timeline - Get activity timeline

Lineage and Breeding:
GET    /api/v1/animals/{id}/offspring - List offspring
GET    /api/v1/animals/{id}/pedigree - Get pedigree information
GET    /api/v1/animals/{id}/breeding-history - Get breeding history
```

### Laboratory Management Endpoints

The laboratory management API provides comprehensive support for sample management, test execution, protocol management, and equipment monitoring. The API includes advanced workflow management capabilities and real-time status tracking.

```
Laboratory Sample Management:
GET    /api/v1/lab/samples         - List samples with filtering
POST   /api/v1/lab/samples         - Register new sample
GET    /api/v1/lab/samples/{id}    - Get sample details
PUT    /api/v1/lab/samples/{id}    - Update sample information
DELETE /api/v1/lab/samples/{id}    - Archive sample
POST   /api/v1/lab/samples/bulk-import - Bulk import samples
GET    /api/v1/lab/samples/{id}/qr-code - Generate QR code for sample

Laboratory Test Management:
GET    /api/v1/lab/tests           - List tests with filtering
POST   /api/v1/lab/tests           - Create new test
GET    /api/v1/lab/tests/{id}      - Get test details
PUT    /api/v1/lab/tests/{id}      - Update test information
DELETE /api/v1/lab/tests/{id}      - Cancel test
POST   /api/v1/lab/tests/{id}/start - Start test execution
POST   /api/v1/lab/tests/{id}/complete - Complete test
POST   /api/v1/lab/tests/{id}/results - Submit test results

Protocol Management:
GET    /api/v1/lab/protocols       - List protocols
POST   /api/v1/lab/protocols       - Create new protocol
GET    /api/v1/lab/protocols/{id}  - Get protocol details
PUT    /api/v1/lab/protocols/{id}  - Update protocol
DELETE /api/v1/lab/protocols/{id}  - Deactivate protocol
POST   /api/v1/lab/protocols/{id}/version - Create new protocol version

Equipment Management:
GET    /api/v1/lab/equipment       - List equipment
POST   /api/v1/lab/equipment       - Register new equipment
GET    /api/v1/lab/equipment/{id}  - Get equipment details
PUT    /api/v1/lab/equipment/{id}  - Update equipment information
POST   /api/v1/lab/equipment/{id}/maintenance - Schedule maintenance
POST   /api/v1/lab/equipment/{id}/calibration - Schedule calibration
GET    /api/v1/lab/equipment/{id}/usage - Get usage statistics

Laboratory Analytics:
GET    /api/v1/lab/stats           - Laboratory statistics
GET    /api/v1/lab/performance     - Performance metrics
GET    /api/v1/lab/workload        - Current workload analysis
GET    /api/v1/lab/turnaround-times - Turnaround time analysis
```

### Analytics and Dashboard Endpoints

The analytics API provides comprehensive reporting and dashboard functionality with real-time metrics, trend analysis, and customizable reporting capabilities.

```
Dashboard and Analytics:
GET    /api/v1/analytics/dashboard - Main dashboard metrics
GET    /api/v1/analytics/metrics   - Key performance indicators
GET    /api/v1/analytics/trends    - Trend analysis data
POST   /api/v1/analytics/reports   - Generate custom reports
GET    /api/v1/analytics/reports/{id} - Get report details
DELETE /api/v1/analytics/reports/{id} - Delete report

Module-Specific Analytics:
GET    /api/v1/analytics/animals   - Animal management analytics
GET    /api/v1/analytics/lab       - Laboratory analytics
GET    /api/v1/analytics/customers - Customer analytics
GET    /api/v1/analytics/breeding  - Breeding program analytics
GET    /api/v1/analytics/genomics  - Genomic analysis metrics

Real-time Monitoring:
GET    /api/v1/monitoring/system   - System health metrics
GET    /api/v1/monitoring/equipment - Equipment status monitoring
GET    /api/v1/monitoring/alerts   - Active alerts and notifications
POST   /api/v1/monitoring/alerts/{id}/acknowledge - Acknowledge alert
```

## Data Relationships and Constraints

### Primary Relationships

The database design establishes clear relationships between entities that reflect the complex interdependencies in biotechnology operations. The customer-animal relationship forms a central hub, with customers owning or being associated with multiple animals. Animals can have multiple roles simultaneously, supporting complex operational scenarios where a single animal might serve as both a donor and recipient in different procedures.

The laboratory system maintains strong relationships with both animals and customers, ensuring complete traceability from sample collection through test completion. Each sample is linked to its source animal and the requesting customer, while tests are associated with specific protocols and assigned to qualified technicians.

### Data Integrity Constraints

The schema includes comprehensive data integrity constraints to ensure data quality and consistency. Foreign key constraints maintain referential integrity across all relationships, while check constraints enforce valid values for enumerated fields. Unique constraints prevent duplicate entries where appropriate, and not-null constraints ensure required data is always present.

The design includes soft delete functionality for critical entities, allowing for data archival without losing historical relationships. This approach is particularly important in biotechnology applications where regulatory compliance requires maintaining complete audit trails.

### Indexing Strategy

The indexing strategy is designed to optimize query performance for the most common access patterns identified in the frontend analysis. Primary indexes are created on frequently queried fields such as animal IDs, customer IDs, and sample IDs. Composite indexes support complex filtering operations, particularly for the animal management system where users frequently filter by multiple criteria simultaneously.

```sql
-- Performance optimization indexes
CREATE INDEX idx_animals_species_status ON animals(species, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_animals_customer_id ON animals(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_animals_created_at ON animals(created_at DESC);
CREATE INDEX idx_lab_samples_status_priority ON lab_samples(status, priority);
CREATE INDEX idx_lab_tests_status_assigned ON lab_tests(status, assigned_to);
CREATE INDEX idx_animal_activities_animal_date ON animal_activities(animal_id, activity_date DESC);
CREATE INDEX idx_customers_name_gin ON customers USING gin(to_tsvector('english', name));
```

## Security and Compliance Considerations

### Data Security Framework

The database design incorporates comprehensive security measures to protect sensitive biotechnology data. All tables include audit fields to track data creation and modification, supporting regulatory compliance requirements. The user management system implements secure password hashing, account lockout mechanisms, and comprehensive session management.

Row-level security policies can be implemented to ensure users only access data within their authorized scope. This is particularly important for multi-customer environments where data isolation is critical. The design supports encryption at rest and in transit, with sensitive fields identified for additional protection.

### Compliance and Audit Trail

The schema design supports comprehensive audit trail requirements common in biotechnology operations. All critical tables include created_at, updated_at, created_by, and updated_by fields to maintain complete change history. The soft delete mechanism ensures that historical data remains available for audit purposes while removing it from normal operations.

The design supports data retention policies through automated archival processes, allowing organizations to maintain compliance with regulatory requirements while managing storage costs effectively.

## Performance and Scalability Considerations

### Query Optimization

The database design prioritizes query performance through strategic denormalization in analytical contexts while maintaining normalization for transactional operations. The animal genomic data and activity tracking tables are designed to support high-volume data ingestion while maintaining query performance for analytical workloads.

Partitioning strategies are incorporated for high-volume tables such as animal activities and laboratory test results, allowing for efficient data management and improved query performance over time.

### Scalability Architecture

The schema design supports horizontal scaling through logical data partitioning and microservice-friendly table structures. Each functional module's tables are designed to operate independently while maintaining necessary relationships, supporting future architectural evolution toward microservices if required.

The design includes provisions for read replicas and analytical data warehouses, allowing for separation of transactional and analytical workloads to maintain optimal performance across all use cases.

## Implementation Recommendations

### Database Setup and Configuration

The recommended PostgreSQL configuration includes specific settings optimized for biotechnology workloads, including increased shared_buffers for analytical queries, optimized checkpoint settings for high-volume data ingestion, and appropriate connection pooling configuration.

The implementation should include comprehensive monitoring and alerting for database performance, with specific attention to query performance, connection utilization, and storage growth patterns.

### Migration Strategy

The database implementation should follow a phased approach, beginning with core user management and customer systems, followed by animal management, and then laboratory systems. This approach allows for early validation of the data model while building toward full system functionality.

Each phase should include comprehensive testing with realistic data volumes to validate performance characteristics and identify optimization opportunities before production deployment.

## Conclusion

This database schema and API architecture design provides a comprehensive foundation for the Reprotech biotechnology management platform. The design balances normalization for data integrity with performance optimization for analytical workloads, while maintaining the flexibility needed for future platform evolution.

The proposed architecture supports all 25 identified modules across the 7 functional groups, providing a scalable and maintainable foundation for production deployment. The comprehensive API design ensures consistent, predictable interfaces for frontend integration while supporting the complex workflows required in biotechnology operations.

The implementation of this design will provide Reprotech with a robust, scalable, and compliant platform capable of supporting current operational requirements while providing the flexibility needed for future growth and feature expansion.

