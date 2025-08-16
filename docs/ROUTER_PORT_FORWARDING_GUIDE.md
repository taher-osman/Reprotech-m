# 🔧 Router Port Forwarding Setup Guide

This guide will help you configure port forwarding on your router to allow external access to your Reprotech application via DuckDNS.

## 📊 Your Configuration

**Current Settings:**
- **External Domain**: `reprotech.duckdns.org`
- **External IP**: `145.82.252.38`
- **Internal IP**: `192.168.100.196` (Your Computer)
- **Port**: `5173`
- **Protocol**: `TCP`

## 🎯 Quick Setup Summary

You need to forward **external port 5173** to **internal IP 192.168.100.196:5173**

## 🌐 Step 1: Access Your Router

### Find Your Router's IP Address
```powershell
# Run this command to find your router IP
ipconfig | findstr "Default Gateway"
```

Common router IP addresses:
- `192.168.1.1`
- `192.168.0.1` 
- `192.168.100.1`
- `10.0.0.1`

### Access Router Web Interface
1. Open your web browser
2. Go to your router's IP address (e.g., `http://192.168.1.1`)
3. Login with admin credentials (often on router label)

## 🔧 Step 2: Router-Specific Instructions

### 🔵 **TP-Link Routers**
1. Go to **Advanced** → **NAT Forwarding** → **Port Forwarding**
2. Click **Add** or **+**
3. Enter the following:
   - **Service Name**: `Reprotech App`
   - **Device**: Select your computer (`192.168.100.196`)
   - **External Port**: `5173`
   - **Internal Port**: `5173`
   - **Protocol**: `TCP`
4. Click **Save**

### 🟢 **Netgear Routers**
1. Go to **Dynamic DNS** → **Port Forwarding/Port Triggering**
2. Click **Add Custom Service**
3. Enter:
   - **Service Name**: `Reprotech`
   - **Service Type**: `TCP`
   - **External Starting Port**: `5173`
   - **External Ending Port**: `5173`
   - **Internal Starting Port**: `5173`
   - **Internal Ending Port**: `5173`
   - **Internal IP**: `192.168.100.196`
4. Click **Apply**

### 🔴 **D-Link Routers**
1. Go to **Advanced** → **Port Forwarding**
2. Click **Add Rule**
3. Configure:
   - **Name**: `Reprotech App`
   - **Public Port**: `5173`
   - **Private Port**: `5173`
   - **Traffic Type**: `TCP`
   - **Private IP**: `192.168.100.196`
4. Click **Save Settings**

### 🟡 **Linksys Routers**
1. Go to **Smart Wi-Fi Tools** → **Port Range Forwarding**
2. Click **Add New Rule**
3. Set:
   - **Application Name**: `Reprotech`
   - **Start Port**: `5173`
   - **End Port**: `5173`
   - **Protocol**: `TCP`
   - **IP Address**: `192.168.100.196`
   - **Enabled**: ✅ Check
4. Click **Save**

### 🟠 **ASUS Routers**
1. Go to **WAN** → **Port Forwarding**
2. Click **Add Profile**
3. Enter:
   - **Service Name**: `Reprotech`
   - **Port Range**: `5173`
   - **Local IP**: `192.168.100.196`
   - **Local Port**: `5173`
   - **Protocol**: `TCP`
4. Click **Apply**

### ⚫ **Ubiquiti (UniFi) Routers**
1. Go to **Settings** → **Routing & Firewall** → **Port Forwarding**
2. Click **Create New Rule**
3. Configure:
   - **Name**: `Reprotech App`
   - **Enabled**: ✅
   - **From**: `WAN`
   - **Port**: `5173`
   - **Forward IP**: `192.168.100.196`
   - **Forward Port**: `5173`
   - **Protocol**: `TCP`
4. Click **Apply Changes**

## 🔍 Step 3: Generic Instructions (Any Router)

If your router brand isn't listed above, look for these sections:
- **Port Forwarding**
- **Virtual Server**
- **NAT Forwarding** 
- **Applications & Gaming**
- **Firewall** → **Port Forwarding**

### Basic Configuration:
```
Name/Description: Reprotech App
External/WAN Port: 5173
Internal/LAN IP: 192.168.100.196
Internal/LAN Port: 5173
Protocol: TCP (or TCP/UDP)
Status: Enabled
```

## 🛡️ Step 4: Additional Security Settings

### UPnP (If Available)
- **Enable UPnP** for automatic port management
- Usually found under **Advanced** → **Network**

### Firewall Rules
Some routers require separate firewall rules:
1. Look for **Firewall** → **Access Rules**
2. Create rule allowing port 5173 TCP traffic

## ✅ Step 5: Test Your Configuration

### Internal Testing
```powershell
# Test local access
Test-NetConnection -ComputerName 192.168.100.196 -Port 5173
```

### External Testing
1. Use your mobile phone (disconnect from WiFi, use cellular)
2. Go to: `http://reprotech.duckdns.org:5173`
3. Or use online port checker: `https://www.yougetsignal.com/tools/open-ports/`

## 🔧 Troubleshooting

### ❌ **External Access Still Not Working?**

#### Check 1: Confirm Router Settings
- Verify the rule is **enabled**
- Check IP address is correct (`192.168.100.196`)
- Ensure port numbers match exactly (`5173`)

#### Check 2: Windows Firewall
```powershell
# Allow Node.js through Windows Firewall
netsh advfirewall firewall add rule name="Reprotech App" dir=in action=allow protocol=TCP localport=5173
```

#### Check 3: ISP Restrictions
Some ISPs block residential port forwarding:
- Contact your ISP to confirm
- Try different ports (8080, 8000, 3000)

#### Check 4: Double NAT
If you have multiple routers:
- Ensure port forwarding is set on the main router
- Put secondary router in **Bridge Mode**

### 🔄 **Alternative Ports**
If port 5173 doesn't work, try these common alternatives:

```powershell
# Start app on different port
.\start-reprotech-external.ps1 -Port 8080
.\start-reprotech-external.ps1 -Port 3000
.\start-reprotech-external.ps1 -Port 8000
```

Then update your router forwarding rules accordingly.

## 📱 Mobile Router Configuration

### **Android Hotspot**
Not possible - mobile hotspots don't support port forwarding

### **4G/5G Routers** 
Most support port forwarding in web interface similar to above

## 🔐 Security Best Practices

### 1. **Change Default Passwords**
- Update router admin password
- Use strong, unique passwords

### 2. **Firmware Updates**
- Keep router firmware updated
- Enable automatic updates if available

### 3. **Access Control**
- Consider IP restrictions if needed
- Monitor access logs regularly

### 4. **VPN Alternative**
For higher security, consider VPN access instead:
- Set up OpenVPN on router
- Connect via VPN for secure access

## 🎯 Quick Verification Commands

```powershell
# Check if port forwarding is working
Test-NetConnection -ComputerName reprotech.duckdns.org -Port 5173

# Check current external IP
(Invoke-RestMethod -Uri "http://ipinfo.io/ip").Trim()

# Verify DuckDNS is pointing to correct IP
nslookup reprotech.duckdns.org
```

## 📞 Common Router Login Credentials

| Router Brand | Default Username | Default Password |
|--------------|------------------|------------------|
| TP-Link      | admin            | admin            |
| Netgear      | admin            | password         |
| D-Link       | admin            | (blank)          |
| Linksys      | admin            | admin            |
| ASUS         | admin            | admin            |
| Ubiquiti     | ubnt             | ubnt             |

**⚠️ Always change default passwords!**

## 🆘 Need Help?

If you're still having issues:

1. **Check router manual** for specific port forwarding instructions
2. **Contact ISP** to confirm they allow port forwarding
3. **Try different ports** (8080, 3000, 8000)
4. **Consider cloud hosting** for production use

---

**✅ Once configured, your Reprotech app will be accessible at:**
## **http://reprotech.duckdns.org:5173**

From anywhere in the world! 🌍 