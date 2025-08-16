# Reprotech Authentication System - Production Deployment Guide

## 🚀 **PRODUCTION-READY AUTHENTICATION PLATFORM**

### **Complete Full-Stack System Overview**
This is a comprehensive authentication and user management system built specifically for the Reprotech biotechnology platform. The system provides enterprise-grade security, role-based access control, and advanced data visualization capabilities.

---

## 📁 **SYSTEM ARCHITECTURE**

### **Backend Components** (`/reprotech-auth-backend/`)
- **Flask Application**: RESTful API server with JWT authentication
- **SQLite Database**: Complete user, role, and permission management
- **Security Layer**: Password hashing, token validation, audit logging
- **API Endpoints**: Authentication, user management, roles, audit logs

### **Frontend Components** (`/reprotech-auth-frontend/`)
- **React Application**: Modern, responsive user interface
- **Authentication Flow**: Login, logout, session management
- **Dashboard Analytics**: Real-time charts and data visualization
- **User Management**: CRUD operations with advanced filtering
- **Role-Based UI**: Dynamic interface based on user permissions

---

## 🔧 **INSTALLATION & SETUP**

### **Prerequisites**
```bash
# Required software
- Python 3.11+ (for backend)
- Node.js 20+ (for frontend)
- npm or yarn (package manager)
```

### **Backend Setup**
```bash
# Navigate to backend directory
cd /path/to/reprotech-auth-backend

# Install Python dependencies
pip install -r requirements.txt

# Initialize database
python src/init_data.py

# Start backend server
python src/main.py
# Server runs on: http://localhost:5001
```

### **Frontend Setup**
```bash
# Navigate to frontend directory
cd /path/to/reprotech-auth-frontend

# Install Node.js dependencies
npm install

# Start development server
npm run dev
# Application runs on: http://localhost:5173
```

---

## 🔐 **DEFAULT CREDENTIALS**

### **System Administrator Account**
- **Username**: `admin`
- **Password**: `Admin123!`
- **Role**: Super Administrator
- **Permissions**: Full system access

### **Security Note**
⚠️ **IMPORTANT**: Change the default password immediately after first login in production environments.

---

## 🏗️ **PRODUCTION DEPLOYMENT**

### **Backend Production Setup**
```bash
# Install production WSGI server
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 src.main:app

# Or use systemd service (recommended)
sudo systemctl enable reprotech-auth
sudo systemctl start reprotech-auth
```

### **Frontend Production Build**
```bash
# Build for production
npm run build

# Serve with nginx or Apache
# Build files will be in /dist/ directory
```

### **Environment Variables**
```bash
# Backend (.env)
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///reprotech_auth.db
JWT_SECRET_KEY=your-jwt-secret-here
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:5001/api
VITE_APP_NAME=Reprotech Authentication System
```

---

## 🔒 **SECURITY CONFIGURATION**

### **JWT Token Settings**
- **Access Token Expiry**: 1 hour (3600 seconds)
- **Refresh Token Expiry**: 30 days
- **Algorithm**: HS256
- **Auto-refresh**: Enabled

### **Password Policy**
- **Minimum Length**: 8 characters
- **Requirements**: Uppercase, lowercase, number, special character
- **Hashing**: bcrypt with salt rounds

### **API Security**
- **CORS**: Configured for specific origins
- **Rate Limiting**: Implemented on authentication endpoints
- **Input Validation**: All endpoints protected against injection
- **Audit Logging**: Complete activity tracking

---

## 👥 **USER ROLES & PERMISSIONS**

### **System Roles**
1. **Super Administrator** - Full system access and user management
2. **Administrator** - User and role management capabilities
3. **Manager** - Oversight and analytics access
4. **Researcher** - Research data and analysis access
5. **Laboratory Technician** - Lab operations and test management
6. **Veterinarian** - Clinical and animal health management
7. **Viewer** - Read-only access to assigned modules

### **Permission Categories**
- **Users**: Create, read, update, delete user accounts
- **Roles**: Manage roles and permission assignments
- **Audit**: View and export audit logs
- **Dashboard**: Access analytics and system overview
- **Module-Specific**: Granular permissions for each biotechnology module

---

## 📊 **MONITORING & ANALYTICS**

### **Dashboard Metrics**
- **User Statistics**: Total users, active sessions, growth trends
- **Role Distribution**: Usage analytics across different roles
- **Login Activity**: Daily/weekly login patterns and trends
- **System Health**: Service status and performance indicators

### **Audit Logging**
- **Login Events**: Successful and failed authentication attempts
- **User Actions**: Account creation, modification, deletion
- **Permission Changes**: Role assignments and permission updates
- **System Events**: Configuration changes and security events

---

## 🔧 **API DOCUMENTATION**

### **Authentication Endpoints**
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### **User Management Endpoints**
```
GET    /api/users
POST   /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}
POST   /api/users/{id}/reset-password
```

### **Role Management Endpoints**
```
GET    /api/roles
POST   /api/roles
GET    /api/roles/{id}
PUT    /api/roles/{id}
DELETE /api/roles/{id}
```

### **Audit Log Endpoints**
```
GET /api/audit-logs
GET /api/audit-logs/export
```

---

## 🚀 **DEPLOYMENT OPTIONS**

### **Option 1: Self-Hosted Server**
- Deploy on your own Linux server
- Full control and customization
- Recommended for enterprise environments

### **Option 2: Cloud Deployment**
- AWS, Google Cloud, or Azure
- Scalable and managed infrastructure
- Automatic backups and monitoring

### **Option 3: Docker Deployment**
```bash
# Build Docker images
docker build -t reprotech-auth-backend ./reprotech-auth-backend
docker build -t reprotech-auth-frontend ./reprotech-auth-frontend

# Run with Docker Compose
docker-compose up -d
```

---

## 🔄 **BACKUP & RECOVERY**

### **Database Backup**
```bash
# SQLite backup
cp reprotech_auth.db reprotech_auth_backup_$(date +%Y%m%d).db

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /path/to/reprotech_auth.db /backups/reprotech_auth_$DATE.db
```

### **Configuration Backup**
- Environment files (.env)
- SSL certificates
- Application configuration files

---

## 🛠️ **TROUBLESHOOTING**

### **Common Issues**
1. **Port Conflicts**: Ensure ports 5001 (backend) and 5173 (frontend) are available
2. **CORS Errors**: Check CORS_ORIGINS environment variable
3. **Database Permissions**: Ensure write permissions for SQLite database file
4. **Token Expiry**: Verify JWT_SECRET_KEY is consistent across restarts

### **Log Locations**
- **Backend Logs**: `/var/log/reprotech-auth/backend.log`
- **Frontend Logs**: Browser developer console
- **Audit Logs**: Database table `audit_logs`

---

## 📞 **SUPPORT & MAINTENANCE**

### **System Updates**
- Regular security patches
- Feature enhancements
- Performance optimizations
- Database migrations

### **Monitoring Recommendations**
- Set up health check endpoints
- Monitor authentication success rates
- Track user activity patterns
- Alert on security events

---

## ✅ **DEPLOYMENT CHECKLIST**

### **Pre-Deployment**
- [ ] Change default administrator password
- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Configure firewall rules
- [ ] Test all API endpoints

### **Post-Deployment**
- [ ] Verify user authentication flow
- [ ] Test role-based access control
- [ ] Confirm audit logging functionality
- [ ] Set up monitoring and alerts
- [ ] Create backup procedures

---

## 🎯 **CONCLUSION**

The Reprotech Authentication System is a production-ready, enterprise-grade solution that provides:

- **Complete Security**: JWT authentication with role-based access control
- **Professional Interface**: Modern React frontend with data visualization
- **Scalable Architecture**: RESTful API design supporting future growth
- **Comprehensive Monitoring**: Real-time analytics and audit logging
- **Easy Deployment**: Multiple deployment options with detailed documentation

**System Status**: ✅ **READY FOR PRODUCTION USE**

For deployment assistance or technical support, the system includes comprehensive error handling and logging to facilitate troubleshooting and maintenance.

