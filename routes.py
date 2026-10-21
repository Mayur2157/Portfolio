from flask import Response, render_template, request, jsonify, send_from_directory
from flask_mail import Message
from werkzeug.datastructures import MultiDict
from app import app, mail
from datetime import date
from urllib.parse import urlsplit
import json
import os
import re
import threading
import time
import logging

logger = logging.getLogger(__name__)

# Server-side contact form contract; index.html renders these as maxlength attributes.
FIELD_LIMITS = {'name': 100, 'email': 254, 'subject': 150, 'message': 5000}
EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
HONEYPOT_FIELD = 'website'

RATE_LIMIT = 5          # emails per client IP...
RATE_WINDOW = 60 * 60   # ...per hour
_hits: dict[str, list[float]] = {}
_hits_lock = threading.Lock()


def _rate_limited(ip: str) -> bool:
    """Record a send attempt from ip and report whether it is over the limit.

    Ceiling: counts live in this process's memory, so they reset on restart and are not
    shared between gunicorn workers. Upgrade path: Flask-Limiter with a Redis backend.
    """
    now = time.monotonic()
    with _hits_lock:
        if len(_hits) > 1000:
            for key in [k for k, v in _hits.items() if now - v[-1] > RATE_WINDOW]:
                del _hits[key]
        recent = [t for t in _hits.get(ip, []) if now - t < RATE_WINDOW]
        limited = len(recent) >= RATE_LIMIT
        if not limited:
            recent.append(now)
        _hits[ip] = recent
        return limited


def _is_cross_origin() -> bool:
    """True when the browser reports the form was posted from another site."""
    source = request.headers.get('Origin') or request.headers.get('Referer')
    if not source:
        return False  # Non-browser clients send neither header; the rate limit still applies.
    return urlsplit(source).netloc != request.host


def _validate_contact(form: MultiDict) -> tuple[dict[str, str], dict[str, str]]:
    """Return the cleaned fields and a field -> error message map."""
    data = {field: form.get(field, '').strip() for field in FIELD_LIMITS}
    errors = {}
    for field, limit in FIELD_LIMITS.items():
        if not data[field]:
            errors[field] = f'Please enter your {field}.'
        elif len(data[field]) > limit:
            errors[field] = f'Please keep your {field} under {limit} characters.'
    if 'email' not in errors and not EMAIL_RE.match(data['email']):
        errors['email'] = 'Please enter a valid email address, like name@example.com.'
    # The subject becomes an email header, where a line break would be rejected.
    if 'subject' not in errors and ('\r' in data['subject'] or '\n' in data['subject']):
        errors['subject'] = 'Please keep the subject on a single line.'
    return data, errors


@app.route('/')
def index() -> str:
    """Main portfolio page"""
    return render_template(
        'index.html',
        project_count=len(PROJECTS),
        field_limits=FIELD_LIMITS,
        year=date.today().year,
    )

@app.route('/contact', methods=['POST'])
def contact() -> tuple[Response, int]:
    """Handle contact form submission"""
    if _is_cross_origin():
        return jsonify({'success': False, 'message': 'Please use the form on this website.'}), 403

    thanks = {'success': True, 'message': 'Thank you for your message! I\'ll get back to you soon.'}

    # Bots fill every field, including this one that is hidden from people.
    if request.form.get(HONEYPOT_FIELD):
        return jsonify(thanks), 200

    data, errors = _validate_contact(request.form)
    if errors:
        return jsonify({
            'success': False,
            'message': 'Please fix the highlighted fields and try again.',
            'errors': errors,
        }), 400

    if _rate_limited(request.remote_addr or 'unknown'):
        return jsonify({
            'success': False,
            'message': 'You\'ve sent several messages recently. Please try again in an hour, '
                       'or email me directly.',
        }), 429

    msg = Message(
        subject=f"Portfolio Contact: {data['subject']}",
        recipients=[app.config['CONTACT_EMAIL']],
        body=f"""
New contact form submission:

Name: {data['name']}
Email: {data['email']}
Subject: {data['subject']}

Message:
{data['message']}

---
Sent from Mayur Gadekar Portfolio Website
        """.strip(),
        reply_to=data['email']
    )

    try:
        mail.send(msg)
    except Exception:
        # SMTP failures surface as several unrelated exception types. The visitor's details
        # are deliberately left out of the log.
        logger.exception('Contact form email could not be sent')
        return jsonify({
            'success': False,
            'message': 'Sorry, your message couldn\'t be sent right now. Please try again later, '
                       'or email me directly.',
        }), 500

    return jsonify(thanks), 200

@app.route('/download-resume')
def download_resume() -> Response:
    """Download resume PDF; a missing file raises NotFound and renders the 404 page."""
    return send_from_directory(
        os.path.join(app.root_path, 'static', 'assets'),
        'resume.pdf',
        as_attachment=True,
        download_name='Mayur Gadekar Resume.pdf',
    )

@app.route('/api/skills')
def get_skills() -> Response:
    """API endpoint for skills data"""
    skills_data = {
        'programming': {
            'Python': 95,
            'JavaScript': 85,
            'SQL': 90,
            'Java': 80,
            'C++': 75
        },
        'ml_ai': {
            'TensorFlow': 90,
            'Scikit-learn': 95,
            'PyTorch': 85,
            'OpenCV': 90,
            'NLP': 88
        },
        'cloud_tools': {
            'AWS': 85,
            'Docker': 80,
            'MLflow': 75,
            'FastAPI': 88,
            'Flask': 92
        },
        'databases': {
            'PostgreSQL': 85,
            'MongoDB': 80,
            'MySQL': 90,
            'Redis': 75,
            'Hadoop': 70
        }
    }
    return jsonify(skills_data)

PROJECTS = [
    {
        'id': 1,
        'title': 'Face Detection & Blink Detection for Liveness Verification',
        'period': 'Feb 2025',
        'description': 'Advanced computer vision system for face detection and blink detection to verify liveness in biometric authentication systems.',
        'technologies': ['Python', 'OpenCV', 'Computer Vision', 'Machine Learning', 'Biometric Authentication'],
        'category': 'computer-vision',
        'github_url': 'https://github.com/Mayur2157/Face-detection-and-blink-detection-for-liveness-verification',
        'stars': 1,
        'language': 'Python',
        'highlights': [
            'Real-time face detection algorithm',
            'Blink detection for liveness verification',
            'Biometric authentication system',
            'Computer vision implementation'
        ]
    },
    {
        'id': 2,
        'title': 'Library Management System',
        'period': 'Apr 2025',
        'description': 'A Django-based application to manage library operations efficiently, including book management, admin registration, and a student view for accessing library resources. The project is implemented with RESTful APIs using Django REST Framework (DRF).',
        'technologies': ['Python', 'Django', 'Django REST Framework', 'SQLite', 'HTML/CSS', 'Bootstrap'],
        'category': 'web-development',
        'github_url': 'https://github.com/Mayur2157/Library-Management-System',
        'stars': 1,
        'language': 'Python',
        'highlights': [
            'Complete CRUD operations for books',
            'Admin and student role management',
            'RESTful API implementation',
            'Responsive web interface'
        ]
    },
    {
        'id': 3,
        'title': 'Hand Gesture Recognition',
        'period': 'Jul 2024',
        'description': 'This project implements a real-time hand gesture recognition system using computer vision techniques and machine learning.',
        'technologies': ['Python', 'OpenCV', 'TensorFlow', 'Computer Vision', 'Deep Learning'],
        'category': 'computer-vision',
        'github_url': 'https://github.com/Mayur2157/Hand-gesture-recognition',
        'stars': 1,
        'language': 'Python',
        'highlights': [
            'Real-time gesture detection',
            'Computer vision algorithms',
            'Deep learning classification',
            'OpenCV integration'
        ]
    },
    {
        'id': 4,
        'title': 'Household Electricity Consumption Forecasting',
        'period': 'Jul 2024 – Oct 2024',
        'description': 'This project aims to predict household electricity consumption using historical data and machine learning models. It leverages various data sources, including smart meter readings and weather data, to build a forecasting model.',
        'technologies': ['Python', 'Jupyter Notebook', 'ARIMA', 'LSTM', 'Time Series Analysis', 'Pandas', 'Scikit-learn'],
        'category': 'machine-learning',
        'github_url': 'https://github.com/Mayur2157/Household-Electricity-Consumption-Forecasting',
        'stars': 2,
        'language': 'Jupyter Notebook',
        'highlights': [
            'Smart meter data integration',
            'Weather data incorporation',
            'ARIMA and LSTM models',
            'High accuracy predictions'
        ]
    },
    {
        'id': 5,
        'title': 'Google Search Analysis with Python',
        'period': 'Jul 2024 – Oct 2024',
        'description': 'This project is a web application built using Flask that allows users to perform Google searches and analyze the results. The analysis includes sentiment analysis and keyword frequency visualization using Plotly for interactive charts.',
        'technologies': ['Python', 'Flask', 'Plotly', 'NLP', 'Sentiment Analysis', 'Data Visualization'],
        'category': 'web-development',
        'github_url': 'https://github.com/Mayur2157/Google-Search-Analysis-with-Python',
        'stars': 1,
        'language': 'Python',
        'highlights': [
            'Interactive charts with Plotly',
            'Sentiment analysis implementation',
            'Real-time keyword visualization',
            'Flask web framework'
        ]
    },
    {
        'id': 6,
        'title': 'Predictive Maintenance for Industrial Equipment',
        'period': 'Aug 2024 – Oct 2024',
        'description': 'This project aims to predict equipment failures before they occur, helping to avoid downtime and improve maintenance scheduling.',
        'technologies': ['Python', 'Jupyter Notebook', 'Machine Learning', 'Pandas', 'Scikit-learn', 'Predictive Analytics'],
        'category': 'machine-learning',
        'github_url': 'https://github.com/Mayur2157/Predictive-Maintenance-for-Industrial-Equipment-Using-Machine-Learning',
        'stars': 1,
        'language': 'Jupyter Notebook',
        'highlights': [
            'Industrial sensor data analysis',
            'Predictive modelling with ML',
            'Anomaly detection algorithms',
            'Maintenance scheduling optimization'
        ]
    },
    {
        'id': 7,
        'title': 'Sports Retail Analytics & Forecasting',
        'period': 'Aug 2024 – Oct 2024',
        'description': 'The Online Sports Retail Analytics and Forecasting project aims to analyze sales data, forecast trends, and segment customers to improve revenue optimization strategies for an online sports retail store.',
        'technologies': ['Python', 'Data Analytics', 'Forecasting', 'Customer Segmentation', 'Revenue Optimization'],
        'category': 'data-science',
        'github_url': 'https://github.com/Mayur2157/Sports-Retail-Analytics-Forecasting',
        'stars': 1,
        'language': 'Python',
        'highlights': [
            'Sales data analysis',
            'Trend forecasting algorithms',
            'Customer segmentation',
            'Revenue optimization strategies'
        ]
    },
    {
        'id': 8,
        'title': 'ChurnChampion - Customer Churn Prediction',
        'period': 'Oct 2024',
        'description': 'ChurnChampion is a predictive modeling project aimed at forecasting customer churn rates. By leveraging machine learning techniques, the project identifies customers who are likely to discontinue using a service.',
        'technologies': ['Python', 'Jupyter Notebook', 'Machine Learning', 'Churn Prediction', 'Customer Analytics'],
        'category': 'machine-learning',
        'github_url': 'https://github.com/Mayur2157/-ChurnChampion-Churn-Prediction-Modeling-Project',
        'stars': 1,
        'language': 'Jupyter Notebook',
        'highlights': [
            'Customer churn prediction',
            'Machine learning algorithms',
            'Retention strategy insights',
            'Proactive customer management'
        ]
    }
]


def _apply_github_data(projects: list[dict]) -> None:
    """Overlay stars and language from github_repos.json, refreshed by github_scraper.py."""
    path = os.path.join(app.root_path, 'github_repos.json')
    try:
        with open(path, encoding='utf-8') as f:
            repos = {repo['url']: repo for repo in json.load(f)}
    except (OSError, ValueError, KeyError, TypeError):
        logger.warning('Using built-in project stats; could not read %s', path, exc_info=True)
        return
    for project in projects:
        repo = repos.get(project['github_url'])
        if not repo:
            continue
        project['stars'] = repo.get('stars', project['stars'])
        if repo.get('language') not in (None, 'Unknown'):
            project['language'] = repo['language']


_apply_github_data(PROJECTS)


@app.route('/api/projects')
def get_projects() -> Response:
    """API endpoint for projects data"""
    return jsonify(PROJECTS)

@app.errorhandler(404)
def not_found_error(error: Exception) -> tuple[str, int]:
    return render_template(
        'error.html',
        code=404,
        title='Page not found',
        message='The page you\'re looking for doesn\'t exist or has moved.',
    ), 404

@app.errorhandler(500)
def internal_error(error: Exception) -> tuple[str, int]:
    return render_template(
        'error.html',
        code=500,
        title='Something went wrong',
        message='An unexpected error occurred. Please try again in a moment.',
    ), 500
