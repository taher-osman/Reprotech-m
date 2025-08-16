# 🌐 Reprotech External Access Setup

This guide will help you set up external access to your Reprotech application using DuckDNS for dynamic DNS management.

## 📋 Prerequisites

- Windows 10/11 with PowerShell
- Administrator privileges
- Internet connection
- DuckDNS account configured (✅ Already set up)

## 🔧 Your DuckDNS Configuration

- **Domain**: `reprotech.duckdns.org`
- **Account**: `vet.taherkamal1@gmail.com`
- **Token**: `97961382-c22e-456e-840d-0ea3fab0a35f`
- **Current IP**: `145.82.252.38`

## 🚀 Quick Start

### Step 1: Test DuckDNS Updater
```powershell
# Test the DuckDNS updater (run once)
powershell -ExecutionPolicy Bypass -File duckdns-updater.ps1
```

### Step 2: Install Automatic Updates (Optional)
```powershell
# Run as Administrator
powershell -ExecutionPolicy Bypass -File install-duckdns-service.ps1 -Install
```

### Step 3: Start External Access Server
```powershell
# Start the app with external access
powershell -ExecutionPolicy Bypass -File start-reprotech-external.ps1
```

## 📁 Files Overview

### 1. `duckdns-updater.ps1`
- Updates your DuckDNS domain with current external IP
- Logs updates to `duckdns-update.log`
- Can be run manually or automatically

### 2. `install-duckdns-service.ps1`
- Installs DuckDNS updater as Windows Scheduled Task
- Runs every 5 minutes to keep IP updated
- Requires Administrator privileges

### 3. `start-reprotech-external.ps1`
- Starts Reprotech app with external network access
- Configures Vite dev server for external connections
- Shows all access URLs

## 🔧 Service Management

### Install Auto-Update Service
```powershell
# Run as Administrator
.\install-duckdns-service.ps1 -Install
```

### Check Service Status
```powershell
.\install-duckdns-service.ps1
```

### Start/Stop Service
```powershell
.\install-duckdns-service.ps1 -Start
.\install-duckdns-service.ps1 -Stop
```

### Uninstall Service
```powershell
.\install-duckdns-service.ps1 -Uninstall
```

## 🌍 Access URLs

### Local Access
- `http://localhost:5173`
- `http://127.0.0.1:5173`

### Network Access
- `http://192.168.100.196:5173`
- `http://172.18.240.1:5173`
- `http://172.29.192.1:5173`

### External Access (DuckDNS)
- `http://reprotech.duckdns.org:5173`

## 🔒 Router Configuration

To enable external access, you need to configure port forwarding on your router:

1. **Access Router Admin Panel**
   - Usually `192.168.1.1` or `192.168.0.1`
   - Login with admin credentials

2. **Set Up Port Forwarding**
   - External Port: `5173`
   - Internal Port: `5173`
   - Internal IP: `192.168.100.196` (your computer's IP)
   - Protocol: `TCP`

3. **Common Router Settings Locations**
   - Look for "Port Forwarding", "Virtual Server", or "NAT"
   - Enable the rule and save settings

## 🔥 Windows Firewall

You may need to allow Node.js through Windows Firewall:

1. Open Windows Security → Firewall & network protection
2. Click "Allow an app through firewall"
3. Find Node.js or add it manually
4. Allow both Private and Public networks

## 📊 Command Options

### Start Server with Custom Port
```powershell
.\start-reprotech-external.ps1 -Port 8080
```

### Start Server and Update DuckDNS
```powershell
.\start-reprotech-external.ps1 -UpdateDuckDNS
```

### Start Server with Custom Host
```powershell
.\start-reprotech-external.ps1 -HostAddress "192.168.1.100"
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Stop existing Node.js processes
   - Use different port: `-Port 8080`

2. **External Access Not Working**
   - Check router port forwarding
   - Verify Windows Firewall settings
   - Ensure DuckDNS is updated

3. **DuckDNS Update Fails**
   - Check internet connection
   - Verify token is correct
   - Check DuckDNS service status

### Debug Commands

```powershell
# Check current external IP
(Invoke-RestMethod -Uri "http://ipinfo.io/ip").Trim()

# Check if port is open
Test-NetConnection -ComputerName localhost -Port 5173

# View DuckDNS logs
Get-Content duckdns-update.log -Tail 10
```

## 📝 Log Files

- `duckdns-update.log` - DuckDNS update history
- Windows Event Viewer - Scheduled task logs

## 🛡️ Security Considerations

- **Development Server**: This is a development server, not production-ready
- **Firewall**: Consider IP restrictions on your router
- **HTTPS**: Consider using HTTPS for production
- **Authentication**: Implement proper authentication for external access

## 🎯 Production Deployment

For production deployment, consider:

1. **Use Production Build**
   ```powershell
   cd reprotech-frontend
   npm run build
   ```

2. **Use Proper Web Server**
   - nginx, Apache, or IIS
   - Configure SSL/TLS certificates

3. **Database Security**
   - Use production database
   - Implement proper access controls

4. **Environment Variables**
   - Use production environment variables
   - Secure API keys and tokens

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Verify all configuration steps
3. Check log files for error messages
4. Test local access first, then network access

## 🔄 Updates

To update the DuckDNS configuration:

1. Edit `duckdns-updater.ps1`
2. Update domain, token, or other settings
3. Restart the service if installed

---

**✅ Your Reprotech app is now configured for external access!**

Access your app from anywhere at: `http://reprotech.duckdns.org:5173` 