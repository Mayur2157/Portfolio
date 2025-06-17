from flask import render_template, request, jsonify, flash, redirect, url_for, send_from_directory
from flask_mail import Message
from app import app, mail
import os
import logging

@app.route('/')
def index():
    """Main portfolio page"""
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submission"""
    try:
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()
        
        # Validate form data
        if not all([name, email, subject, message]):
            return jsonify({
                'success': False, 
                'message': 'All fields are required.'
            }), 400
        
        # Create email message
        msg = Message(
            subject=f"Portfolio Contact: {subject}",
            recipients=[os.environ.get('CONTACT_EMAIL', 'mayurgadekar2501@gmail.com')],
            body=f"""
New contact form submission:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
Sent from Mayur Gadekar Portfolio Website
            """.strip(),
            reply_to=email
        )
        
        # Send email
        mail.send(msg)
        
        return jsonify({
            'success': True, 
            'message': 'Thank you for your message! I\'ll get back to you soon.'
        })
        
    except Exception as e:
        logging.error(f"Contact form error: {e}")
        return jsonify({
            'success': False, 
            'message': 'Sorry, there was an error sending your message. Please try again later.'
        }), 500

@app.route('/download-resume')
def download_resume():
    """Download resume PDF"""
    try:
        return send_from_directory('static/assets', 'resume.pdf', as_attachment=True)
    except FileNotFoundError:
        flash('Resume file not found.', 'error')
        return redirect(url_for('index'))

@app.route('/api/skills')
def get_skills():
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

@app.route('/api/projects')
def get_projects():
    """API endpoint for projects data"""
    projects_data = [
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
    return jsonify(projects_data)

@app.errorhandler(404)
def not_found_error(error):
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('index.html'), 500
