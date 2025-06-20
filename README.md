# Mayur Gadekar - AI/ML Engineer Portfolio

A modern, interactive portfolio website showcasing AI/ML expertise, projects, and professional experience.

## 🚀 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between dark and light themes
- **Interactive Charts**: Skills visualization using Chart.js
- **Real GitHub Integration**: All projects linked to actual GitHub repositories
- **Modern UI**: Glass morphism design with smooth animations
- **Contact Form**: Functional contact form with email integration
- **Resume Download**: Direct download of professional resume

## 📋 Prerequisites

Before running this project locally, ensure you have the following installed:

1. **Python 3.8 or higher**
   - Download from: https://www.python.org/downloads/
   - During installation, make sure to check "Add Python to PATH"

2. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/downloads

## 🛠️ Installation Guide

### Step 1: Download the Project

**Option A: Download ZIP**
1. Download the project files as a ZIP archive
2. Extract the ZIP file to your desired location (e.g., `C:\Projects\MayurPortfolio`)

**Option B: Clone with Git**
```bash
git clone <repository-url>
cd MayurPortfolio
```

### Step 2: Set Up Python Virtual Environment

Open Command Prompt (Windows) or Terminal (Mac/Linux) and navigate to your project directory:

```bash
# Navigate to project directory
cd C:\Projects\MayurPortfolio  # Windows
# or
cd /path/to/MayurPortfolio     # Mac/Linux

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### Step 3: Install Dependencies

With the virtual environment activated, install the required packages:

```bash
pip install flask flask-mail gunicorn requests beautifulsoup4 trafilatura
```

### Step 4: Environment Variables (Optional)

Create a `.env` file in the project root for email functionality:

```bash
# Create .env file
touch .env  # Mac/Linux
# or create manually on Windows
```

Add the following content to `.env`:

```env
SESSION_SECRET=your-secret-key-here
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
CONTACT_EMAIL=mayurgadekar2501@gmail.com
```

**Note**: Email configuration is optional. The website will work without it, but the contact form won't send emails.

### Step 5: Run the Application

Start the development server:

```bash
# Method 1: Using Flask directly
python app.py

# Method 2: Using Gunicorn (recommended)
gunicorn --bind 0.0.0.0:5000 --reload main:app
```

### Step 6: Access the Website

Open your web browser and navigate to:
```
http://localhost:5000
```

## 📁 Project Structure

```
MayurPortfolio/
├── app.py                 # Flask application setup
├── main.py               # Application entry point
├── routes.py             # Route definitions and API endpoints
├── github_scraper.py     # GitHub repository fetching script
├── templates/
│   ├── base.html         # Base template
│   └── index.html        # Main portfolio page
├── static/
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   ├── js/
│   │   ├── main.js       # Main JavaScript functionality
│   │   ├── theme.js      # Theme management
│   │   └── charts.js     # Charts configuration
│   └── assets/
│       ├── resume.pdf    # Resume file
│       └── hero-bg.svg   # Hero background
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## 🔧 Customization

### Updating Projects
To update projects with latest GitHub data:

```bash
python github_scraper.py
```

### Modifying Content
- **Personal Information**: Edit `templates/index.html`
- **Skills Data**: Modify the `get_skills()` function in `routes.py`
- **Styling**: Update `static/css/style.css`
- **Functionality**: Modify JavaScript files in `static/js/`

### Adding Email Functionality
1. Set up Gmail App Password:
   - Go to Google Account settings
   - Enable 2-Factor Authentication
   - Generate an App Password
   - Use this password in the `.env` file

2. Update environment variables in `.env` file

## 🚀 Production Deployment

### Option 1: Local Network Access
To make the website accessible on your local network:

```bash
python app.py
# or
gunicorn --bind 0.0.0.0:5000 main:app
```

Find your local IP address and access via: `http://YOUR-IP:5000`

### Option 2: Cloud Deployment
The project is ready for deployment on platforms like:
- Heroku
- Vercel
- Railway
- DigitalOcean
- AWS

## 🛠️ Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Kill process using port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <process-id> /F

# Kill process using port 5000 (Mac/Linux)
lsof -ti:5000 | xargs kill -9
```

**2. Python Not Found**
- Ensure Python is installed and added to PATH
- Try using `python3` instead of `python`

**3. Permission Denied**
- On Mac/Linux, you might need to use `sudo` for some commands
- Ensure you have write permissions in the project directory

**4. Dependencies Not Installing**
```bash
# Update pip first
python -m pip install --upgrade pip

# Then install dependencies
pip install -r requirements.txt
```

**5. Static Files Not Loading**
- Ensure you're accessing the site via `http://localhost:5000`
- Check that static files exist in the `static/` directory

## 📞 Support

If you encounter any issues:

1. Check the console output for error messages
2. Ensure all dependencies are installed correctly
3. Verify Python version compatibility
4. Check file permissions and paths

## 🎯 Next Steps

1. **Customize Content**: Update personal information, projects, and skills
2. **Add Features**: Implement blog section, testimonials, or portfolio gallery
3. **Optimize Performance**: Add caching, compress images, minify assets
4. **SEO Optimization**: Add meta tags, structured data, and sitemap
5. **Analytics**: Integrate Google Analytics or similar tracking

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Created by Mayur Gadekar**  
AI/ML Engineer | Python Developer | Data Scientist  
📧 mayurgadekar2501@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/mayur-gadekar](https://www.linkedin.com/in/mayur-gadekar-a30619319?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B2FsfVf%2F5SIqVtQHViy%2F4gA%3D%3D) | [GitHub](https://github.com/Mayur2157)
