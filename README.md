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
pip install -r requirements.txt
```

### Step 4: Environment Variables (Optional)

The app reads its configuration from environment variables. Set them in your shell
(or in your hosting provider's settings). A `.env` file is **not** loaded automatically.

| Variable | Purpose |
|---|---|
| `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_DEFAULT_SENDER` | SMTP account used to send contact form messages |
| `CONTACT_EMAIL` | Inbox that receives contact form messages |
| `FLASK_DEBUG=1` | Development only: auto-reload and the interactive debugger. Never set in production |
| `LOG_LEVEL` | `DEBUG`, `INFO` (default), `WARNING` or `ERROR` |
| `PROXY_COUNT=1` | Set when deployed behind a reverse proxy (Heroku, Render, Nginx) so the contact form rate limit sees real visitor IPs. Leave unset locally |
| `SESSION_SECRET` | Optional; nothing is stored in the session today, so a random key is generated when unset |

```bash
# Mac/Linux
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
export FLASK_DEBUG=1

# Windows (PowerShell)
$env:MAIL_USERNAME = "your-email@gmail.com"
$env:MAIL_PASSWORD = "your-app-password"
$env:FLASK_DEBUG = "1"
```

**Note**: Email configuration is optional. The website will work without it, but the contact form won't send emails.

### Step 5: Run the Application

Start the development server:

```bash
# Method 1: Flask development server (any OS)
python main.py

# Method 2: Gunicorn, as used in production (Mac/Linux only)
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
├── app.py                 # Flask application setup and configuration
├── main.py               # Development entry point (python main.py)
├── routes.py             # Route definitions, API endpoints, projects data
├── github_scraper.py     # Refreshes github_repos.json
├── github_repos.json     # Live stars/language merged into the projects list
├── test_app.py           # Self-check: python test_app.py
├── templates/
│   ├── base.html         # Base template
│   ├── index.html        # Main portfolio page
│   ├── error.html        # 404 / 500 page
│   └── _theme_init.html  # Applies the theme before first paint
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
Project titles, descriptions and highlights live in the `PROJECTS` list in `routes.py`.
Star counts and languages are refreshed from GitHub:

```bash
python github_scraper.py   # updates github_repos.json
```

Restart the app afterwards to pick up the new data. If GitHub can't be reached, the
existing `github_repos.json` is left untouched.

### Checking Your Changes
```bash
python test_app.py
```

### Modifying Content
- **Personal Information**: Edit `templates/index.html`
- **Skills Data**: Modify the `get_skills()` function in `routes.py`
- **Projects**: Modify the `PROJECTS` list in `routes.py`
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
python main.py
# or (Mac/Linux)
gunicorn --bind 0.0.0.0:5000 main:app
```

Find your local IP address and access via: `http://YOUR-IP:5000`

### Option 2: Cloud Deployment
Set the mail variables and `PROXY_COUNT=1` in your host's settings. The `Procfile`
runs `gunicorn app:app`. The project is ready for deployment on platforms like:
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
