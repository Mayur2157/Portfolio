import os
import secrets
import logging
from flask import Flask
from flask_mail import Mail
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=os.environ.get('LOG_LEVEL', 'INFO').upper())

# Create Flask app
app = Flask(__name__)
# Nothing stores data in the session, so a random per-process key is safe when none is configured.
app.secret_key = os.environ.get('SESSION_SECRET') or secrets.token_hex(32)

# Behind a reverse proxy (Heroku, Render, Nginx) set PROXY_COUNT=1 so request.remote_addr is the
# real client IP. Left at 0 otherwise, because trusting X-Forwarded-For without a proxy lets
# clients spoof their IP and bypass the contact-form rate limit.
proxy_count = int(os.environ.get('PROXY_COUNT', '0'))
if proxy_count:
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=proxy_count, x_proto=proxy_count, x_host=proxy_count)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', '587'))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', '')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', '')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@mayurgadekar.dev')
app.config['CONTACT_EMAIL'] = os.environ.get('CONTACT_EMAIL', 'mayurgadekar2501@gmail.com')

# Initialize extensions
mail = Mail(app)

# Import routes
from routes import *  # noqa: E402,F401,F403
