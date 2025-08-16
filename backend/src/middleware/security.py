import re
import json
from functools import wraps
from flask import request, jsonify, current_app, make_response
from datetime import datetime

def security_headers(f):
    """Add security headers to response."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        response = make_response(f(*args, **kwargs))
        
        # Security headers
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self'; object-src 'none'; child-src 'none'; worker-src 'none'; frame-ancestors 'none'; form-action 'self'; base-uri 'self';"
        
        # Remove server header
        response.headers.pop('Server', None)
        
        # Add custom server header
        response.headers['Server'] = 'Reprotech-API/1.0'
        
        return response
    
    return decorated_function

def validate_request(f):
    """Validate request for common security issues."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Check request size
            max_content_length = current_app.config.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024)  # 16MB
            if request.content_length and request.content_length > max_content_length:
                return jsonify({'error': 'Request too large'}), 413
            
            # Validate JSON if present
            if request.is_json:
                try:
                    data = request.get_json()
                    if data is None and request.content_length > 0:
                        return jsonify({'error': 'Invalid JSON format'}), 400
                    
                    # Check for potential JSON injection
                    if data and isinstance(data, dict):
                        if _contains_suspicious_patterns(data):
                            current_app.logger.warning(f"Suspicious request patterns detected from {request.remote_addr}")
                            return jsonify({'error': 'Invalid request format'}), 400
                
                except Exception as e:
                    return jsonify({'error': 'Invalid JSON format'}), 400
            
            # Validate query parameters
            for key, value in request.args.items():
                if _is_suspicious_parameter(key, value):
                    current_app.logger.warning(f"Suspicious query parameter from {request.remote_addr}: {key}")
                    return jsonify({'error': 'Invalid query parameters'}), 400
            
            # Check for common attack patterns in headers
            for header_name, header_value in request.headers:
                if _is_suspicious_header(header_name, header_value):
                    current_app.logger.warning(f"Suspicious header from {request.remote_addr}: {header_name}")
                    return jsonify({'error': 'Invalid request headers'}), 400
            
            return f(*args, **kwargs)
            
        except Exception as e:
            current_app.logger.error(f"Request validation error: {str(e)}")
            return jsonify({'error': 'Request validation failed'}), 400
    
    return decorated_function

def _contains_suspicious_patterns(data, depth=0):
    """Check for suspicious patterns in request data."""
    if depth > 10:  # Prevent deep recursion
        return True
    
    if isinstance(data, dict):
        for key, value in data.items():
            if _is_suspicious_string(str(key)) or _contains_suspicious_patterns(value, depth + 1):
                return True
    elif isinstance(data, list):
        for item in data:
            if _contains_suspicious_patterns(item, depth + 1):
                return True
    elif isinstance(data, str):
        return _is_suspicious_string(data)
    
    return False

def _is_suspicious_string(s):
    """Check if string contains suspicious patterns."""
    if not isinstance(s, str):
        return False
    
    # SQL injection patterns
    sql_patterns = [
        r'(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)',
        r'(--|#|/\*|\*/)',
        r'(\bOR\b.*=.*\bOR\b)',
        r'(\bAND\b.*=.*\bAND\b)',
        r'(\'.*\'.*=.*\'.*\')',
        r'(\d+.*=.*\d+)',
    ]
    
    # XSS patterns
    xss_patterns = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'<iframe[^>]*>',
        r'<object[^>]*>',
        r'<embed[^>]*>',
    ]
    
    # Command injection patterns
    command_patterns = [
        r'[;&|`$(){}[\]\\]',
        r'\b(cat|ls|pwd|whoami|id|uname|ps|netstat|wget|curl)\b',
    ]
    
    # Path traversal patterns
    path_patterns = [
        r'\.\./|\.\.\|',
        r'/etc/passwd',
        r'/proc/',
        r'\\windows\\',
    ]
    
    all_patterns = sql_patterns + xss_patterns + command_patterns + path_patterns
    
    s_lower = s.lower()
    for pattern in all_patterns:
        if re.search(pattern, s_lower, re.IGNORECASE):
            return True
    
    return False

def _is_suspicious_parameter(key, value):
    """Check if query parameter is suspicious."""
    return _is_suspicious_string(key) or _is_suspicious_string(value)

def _is_suspicious_header(name, value):
    """Check if header is suspicious."""
    # Skip common headers
    safe_headers = [
        'host', 'user-agent', 'accept', 'accept-language', 'accept-encoding',
        'connection', 'upgrade-insecure-requests', 'cache-control',
        'authorization', 'content-type', 'content-length', 'origin',
        'referer', 'x-requested-with', 'x-api-key'
    ]
    
    if name.lower() in safe_headers:
        return False
    
    return _is_suspicious_string(name) or _is_suspicious_string(value)

def sanitize_input(data):
    """Sanitize input data."""
    if isinstance(data, dict):
        return {key: sanitize_input(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [sanitize_input(item) for item in data]
    elif isinstance(data, str):
        # Remove potentially dangerous characters
        sanitized = re.sub(r'[<>"\';\\&|`$(){}[\]]', '', data)
        # Limit length
        return sanitized[:1000]
    else:
        return data

def require_https(f):
    """Require HTTPS for sensitive endpoints."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_secure and not current_app.debug:
            return jsonify({'error': 'HTTPS required'}), 426
        return f(*args, **kwargs)
    
    return decorated_function

def check_origin(allowed_origins=None):
    """Check request origin against allowed origins."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if allowed_origins is None:
                return f(*args, **kwargs)
            
            origin = request.headers.get('Origin')
            if origin and origin not in allowed_origins:
                current_app.logger.warning(f"Blocked request from unauthorized origin: {origin}")
                return jsonify({'error': 'Unauthorized origin'}), 403
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

def validate_content_type(allowed_types=None):
    """Validate request content type."""
    if allowed_types is None:
        allowed_types = ['application/json']
    
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if request.method in ['POST', 'PUT', 'PATCH']:
                content_type = request.content_type
                if content_type and not any(ct in content_type for ct in allowed_types):
                    return jsonify({'error': 'Unsupported content type'}), 415
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

def log_security_event(event_type, details=None):
    """Log security events."""
    event_data = {
        'timestamp': datetime.utcnow().isoformat(),
        'event_type': event_type,
        'ip_address': request.remote_addr,
        'user_agent': request.headers.get('User-Agent'),
        'endpoint': request.endpoint,
        'method': request.method,
        'details': details or {}
    }
    
    current_app.logger.warning(f"Security Event: {json.dumps(event_data)}")

def block_suspicious_ips(f):
    """Block requests from suspicious IP addresses with advanced detection."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        client_ip = request.remote_addr
        
        # Check against configured blocked IPs
        blocked_ips = current_app.config.get('BLOCKED_IPS', [])
        if client_ip in blocked_ips:
            log_security_event('blocked_ip_access', {'ip': client_ip})
            return jsonify({'error': 'Access denied'}), 403
        
        # Check for suspicious patterns
        if _is_suspicious_ip(client_ip):
            log_security_event('suspicious_ip_detected', {'ip': client_ip})
            # Optionally block or rate limit
            return jsonify({'error': 'Access temporarily restricted'}), 429
        
        # Check rate limiting per IP
        if _is_ip_rate_limited(client_ip):
            log_security_event('ip_rate_limited', {'ip': client_ip})
            return jsonify({'error': 'Too many requests from this IP'}), 429
        
        return f(*args, **kwargs)
    
    return decorated_function


def _is_suspicious_ip(ip_address):
    """Check if an IP address shows suspicious patterns."""
    import ipaddress
    
    try:
        ip = ipaddress.ip_address(ip_address)
        
        # Check for private/local IPs (generally safe)
        if ip.is_private or ip.is_loopback:
            return False
        
        # Check for known suspicious IP ranges
        suspicious_ranges = [
            # Add known malicious IP ranges here
            # Example: '192.0.2.0/24',  # RFC 5737 test range
        ]
        
        for range_str in suspicious_ranges:
            if ip in ipaddress.ip_network(range_str):
                return True
        
        # Check for Tor exit nodes (optional)
        # This would require a database of Tor exit nodes
        # if _is_tor_exit_node(ip_address):
        #     return True
        
        # Check for VPN/proxy indicators (optional)
        # This would require integration with IP intelligence services
        # if _is_vpn_or_proxy(ip_address):
        #     return True
        
        return False
        
    except ValueError:
        # Invalid IP address
        return True

def _is_ip_rate_limited(ip_address):
    """Check if an IP address has exceeded rate limits."""
    from datetime import datetime, timedelta
    
    # This is a simple in-memory rate limiting
    # In production, you might want to use Redis or a database
    
    if not hasattr(_is_ip_rate_limited, 'ip_requests'):
        _is_ip_rate_limited.ip_requests = {}
    
    now = datetime.utcnow()
    window_minutes = 5  # 5-minute window
    max_requests = 100  # Max requests per window
    
    # Clean old entries
    cutoff_time = now - timedelta(minutes=window_minutes)
    _is_ip_rate_limited.ip_requests = {
        ip: timestamps for ip, timestamps in _is_ip_rate_limited.ip_requests.items()
        if any(ts > cutoff_time for ts in timestamps)
    }
    
    # Update current IP's requests
    if ip_address not in _is_ip_rate_limited.ip_requests:
        _is_ip_rate_limited.ip_requests[ip_address] = []
    
    # Remove old timestamps for this IP
    _is_ip_rate_limited.ip_requests[ip_address] = [
        ts for ts in _is_ip_rate_limited.ip_requests[ip_address]
        if ts > cutoff_time
    ]
    
    # Add current request
    _is_ip_rate_limited.ip_requests[ip_address].append(now)
    
    # Check if rate limit exceeded
    return len(_is_ip_rate_limited.ip_requests[ip_address]) > max_requests

def add_ip_to_blocklist(ip_address, reason="Manual block"):
    """Add an IP address to the blocklist."""
    from flask import current_app
    
    blocked_ips = current_app.config.get('BLOCKED_IPS', [])
    if ip_address not in blocked_ips:
        blocked_ips.append(ip_address)
        current_app.config['BLOCKED_IPS'] = blocked_ips
        
        log_security_event('ip_blocked', {
            'ip': ip_address,
            'reason': reason
        })
        
        return True
    return False

def remove_ip_from_blocklist(ip_address):
    """Remove an IP address from the blocklist."""
    from flask import current_app
    
    blocked_ips = current_app.config.get('BLOCKED_IPS', [])
    if ip_address in blocked_ips:
        blocked_ips.remove(ip_address)
        current_app.config['BLOCKED_IPS'] = blocked_ips
        
        log_security_event('ip_unblocked', {
            'ip': ip_address
        })
        
        return True
    return False

