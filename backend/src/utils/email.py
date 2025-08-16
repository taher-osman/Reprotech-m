"""
Email notification system for sending alerts and notifications.
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from datetime import datetime, timezone
from flask import current_app, render_template_string
from threading import Thread

class EmailService:
    """Email service for sending notifications."""
    
    def __init__(self, app=None):
        self.app = app
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize email service with Flask app."""
        self.app = app
        self.smtp_server = app.config.get('MAIL_SERVER', 'smtp.gmail.com')
        self.smtp_port = app.config.get('MAIL_PORT', 587)
        self.use_tls = app.config.get('MAIL_USE_TLS', True)
        self.username = app.config.get('MAIL_USERNAME')
        self.password = app.config.get('MAIL_PASSWORD')
        self.default_sender = app.config.get('MAIL_DEFAULT_SENDER', self.username)
    
    def _send_email_sync(self, to_emails, subject, body, html_body=None, attachments=None):
        """Send email synchronously."""
        try:
            if not self.username or not self.password:
                current_app.logger.warning("Email credentials not configured")
                return False
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = self.default_sender
            msg['To'] = ', '.join(to_emails) if isinstance(to_emails, list) else to_emails
            msg['Subject'] = subject
            
            # Add text body
            if body:
                text_part = MIMEText(body, 'plain')
                msg.attach(text_part)
            
            # Add HTML body
            if html_body:
                html_part = MIMEText(html_body, 'html')
                msg.attach(html_part)
            
            # Add attachments
            if attachments:
                for attachment in attachments:
                    if os.path.isfile(attachment):
                        with open(attachment, 'rb') as f:
                            part = MIMEBase('application', 'octet-stream')
                            part.set_payload(f.read())
                            encoders.encode_base64(part)
                            part.add_header(
                                'Content-Disposition',
                                f'attachment; filename= {os.path.basename(attachment)}'
                            )
                            msg.attach(part)
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            if self.use_tls:
                server.starttls()
            server.login(self.username, self.password)
            
            recipients = to_emails if isinstance(to_emails, list) else [to_emails]
            server.sendmail(self.default_sender, recipients, msg.as_string())
            server.quit()
            
            current_app.logger.info(f"Email sent successfully to {recipients}")
            return True
            
        except Exception as e:
            current_app.logger.error(f"Failed to send email: {str(e)}")
            return False
    
    def send_email_async(self, to_emails, subject, body, html_body=None, attachments=None):
        """Send email asynchronously."""
        def send_async_email(app, to_emails, subject, body, html_body, attachments):
            with app.app_context():
                self._send_email_sync(to_emails, subject, body, html_body, attachments)
        
        thread = Thread(
            target=send_async_email,
            args=(self.app, to_emails, subject, body, html_body, attachments)
        )
        thread.start()
        return thread
    
    def send_email(self, to_emails, subject, body, html_body=None, attachments=None, async_send=True):
        """Send email (async by default)."""
        if async_send:
            return self.send_email_async(to_emails, subject, body, html_body, attachments)
        else:
            return self._send_email_sync(to_emails, subject, body, html_body, attachments)

# Global email service instance
email_service = EmailService()

# Email templates
EMAIL_TEMPLATES = {
    'password_reset': {
        'subject': 'Reprotech - Password Reset Request',
        'body': '''
Hello,

You have requested a password reset for your Reprotech account.

Please use the following token to reset your password: {reset_token}

This token will expire in 1 hour.

If you did not request this password reset, please ignore this email.

Best regards,
Reprotech Team
        ''',
        'html_body': '''
<html>
<body>
    <h2>Password Reset Request</h2>
    <p>Hello,</p>
    <p>You have requested a password reset for your Reprotech account.</p>
    <p>Please use the following token to reset your password:</p>
    <p><strong>{reset_token}</strong></p>
    <p>This token will expire in 1 hour.</p>
    <p>If you did not request this password reset, please ignore this email.</p>
    <br>
    <p>Best regards,<br>Reprotech Team</p>
</body>
</html>
        '''
    },
    'welcome': {
        'subject': 'Welcome to Reprotech',
        'body': '''
Hello {user_name},

Welcome to Reprotech! Your account has been successfully created.

Your login details:
Email: {user_email}

You can now access the system and start managing your biotechnology operations.

If you have any questions, please don't hesitate to contact our support team.

Best regards,
Reprotech Team
        ''',
        'html_body': '''
<html>
<body>
    <h2>Welcome to Reprotech!</h2>
    <p>Hello {user_name},</p>
    <p>Welcome to Reprotech! Your account has been successfully created.</p>
    <p><strong>Your login details:</strong></p>
    <ul>
        <li>Email: {user_email}</li>
    </ul>
    <p>You can now access the system and start managing your biotechnology operations.</p>
    <p>If you have any questions, please don't hesitate to contact our support team.</p>
    <br>
    <p>Best regards,<br>Reprotech Team</p>
</body>
</html>
        '''
    },
    'test_completed': {
        'subject': 'Laboratory Test Completed - {test_id}',
        'body': '''
Hello,

A laboratory test has been completed:

Test ID: {test_id}
Sample ID: {sample_id}
Animal: {animal_name}
Test Type: {test_type}
Status: {status}
Completed At: {completed_at}

You can view the detailed results in the Reprotech system.

Best regards,
Reprotech Laboratory Team
        ''',
        'html_body': '''
<html>
<body>
    <h2>Laboratory Test Completed</h2>
    <p>Hello,</p>
    <p>A laboratory test has been completed:</p>
    <table border="1" cellpadding="5" cellspacing="0">
        <tr><td><strong>Test ID:</strong></td><td>{test_id}</td></tr>
        <tr><td><strong>Sample ID:</strong></td><td>{sample_id}</td></tr>
        <tr><td><strong>Animal:</strong></td><td>{animal_name}</td></tr>
        <tr><td><strong>Test Type:</strong></td><td>{test_type}</td></tr>
        <tr><td><strong>Status:</strong></td><td>{status}</td></tr>
        <tr><td><strong>Completed At:</strong></td><td>{completed_at}</td></tr>
    </table>
    <p>You can view the detailed results in the Reprotech system.</p>
    <br>
    <p>Best regards,<br>Reprotech Laboratory Team</p>
</body>
</html>
        '''
    },
    'system_alert': {
        'subject': 'Reprotech System Alert - {alert_type}',
        'body': '''
SYSTEM ALERT

Alert Type: {alert_type}
Severity: {severity}
Time: {timestamp}
Description: {description}

Details:
{details}

Please take appropriate action if required.

Reprotech System
        ''',
        'html_body': '''
<html>
<body>
    <h2 style="color: red;">SYSTEM ALERT</h2>
    <table border="1" cellpadding="5" cellspacing="0">
        <tr><td><strong>Alert Type:</strong></td><td>{alert_type}</td></tr>
        <tr><td><strong>Severity:</strong></td><td><span style="color: {severity_color};">{severity}</span></td></tr>
        <tr><td><strong>Time:</strong></td><td>{timestamp}</td></tr>
        <tr><td><strong>Description:</strong></td><td>{description}</td></tr>
    </table>
    <h3>Details:</h3>
    <pre>{details}</pre>
    <p><strong>Please take appropriate action if required.</strong></p>
    <br>
    <p>Reprotech System</p>
</body>
</html>
        '''
    }
}

def send_template_email(template_name, to_emails, **kwargs):
    """Send email using a predefined template."""
    if template_name not in EMAIL_TEMPLATES:
        current_app.logger.error(f"Email template '{template_name}' not found")
        return False
    
    template = EMAIL_TEMPLATES[template_name]
    
    try:
        # Format subject
        subject = template['subject'].format(**kwargs)
        
        # Format body
        body = template['body'].format(**kwargs)
        
        # Format HTML body if available
        html_body = None
        if 'html_body' in template:
            html_body = template['html_body'].format(**kwargs)
        
        return email_service.send_email(to_emails, subject, body, html_body)
        
    except Exception as e:
        current_app.logger.error(f"Failed to send template email: {str(e)}")
        return False

def send_password_reset_email(email, reset_token):
    """Send password reset email."""
    return send_template_email(
        'password_reset',
        email,
        reset_token=reset_token
    )

def send_welcome_email(email, user_name):
    """Send welcome email to new user."""
    return send_template_email(
        'welcome',
        email,
        user_name=user_name,
        user_email=email
    )

def send_test_completion_notification(email, test_data):
    """Send test completion notification."""
    return send_template_email(
        'test_completed',
        email,
        test_id=test_data.get('test_id'),
        sample_id=test_data.get('sample_id'),
        animal_name=test_data.get('animal_name'),
        test_type=test_data.get('test_type'),
        status=test_data.get('status'),
        completed_at=test_data.get('completed_at')
    )

def send_system_alert(admin_emails, alert_type, severity, description, details=None):
    """Send system alert to administrators."""
    severity_colors = {
        'LOW': 'green',
        'MEDIUM': 'orange',
        'HIGH': 'red',
        'CRITICAL': 'darkred'
    }
    
    return send_template_email(
        'system_alert',
        admin_emails,
        alert_type=alert_type,
        severity=severity,
        severity_color=severity_colors.get(severity, 'black'),
        timestamp=datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC'),
        description=description,
        details=details or 'No additional details available'
    )

def get_admin_emails():
    """Get list of administrator email addresses."""
    try:
        from src.models.user import User
        from src.models.user import Role
        
        # Get users with admin role
        admin_role = Role.query.filter_by(name='admin').first()
        if admin_role:
            admin_users = admin_role.users
            return [user.email for user in admin_users if user.is_active]
        
        # Fallback: get all active users (if no role system)
        users = User.query.filter_by(is_active=True).limit(5).all()  # Limit to prevent spam
        return [user.email for user in users]
        
    except Exception as e:
        current_app.logger.error(f"Failed to get admin emails: {str(e)}")
        return []

def notify_admins(alert_type, severity, description, details=None):
    """Notify administrators of system events."""
    admin_emails = get_admin_emails()
    if admin_emails:
        send_system_alert(admin_emails, alert_type, severity, description, details)
    else:
        current_app.logger.warning("No admin emails found for notification")

# Email notification decorators
def notify_on_error(alert_type="SYSTEM_ERROR", severity="HIGH"):
    """Decorator to send email notification on function errors."""
    def decorator(f):
        def wrapper(*args, **kwargs):
            try:
                return f(*args, **kwargs)
            except Exception as e:
                notify_admins(
                    alert_type=alert_type,
                    severity=severity,
                    description=f"Error in {f.__name__}: {str(e)}",
                    details=f"Function: {f.__module__}.{f.__name__}\nArgs: {args}\nKwargs: {kwargs}"
                )
                raise
        return wrapper
    return decorator

