#!/usr/bin/env python3
"""
Local Setup Script for Mayur Gadekar Portfolio
This script helps set up the portfolio website on your local machine.
"""

import os
import sys
import subprocess
import platform

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        print(f"   Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    return True

def create_virtual_environment():
    """Create and activate virtual environment"""
    print("\n📦 Setting up virtual environment...")
    
    if os.path.exists("venv"):
        print("   Virtual environment already exists")
        return True
    
    try:
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print("✅ Virtual environment created successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to create virtual environment")
        return False

def get_pip_command():
    """Get the correct pip command based on OS"""
    system = platform.system().lower()
    if system == "windows":
        return os.path.join("venv", "Scripts", "pip.exe")
    else:
        return os.path.join("venv", "bin", "pip")

def install_dependencies():
    """Install required dependencies"""
    print("\n📚 Installing dependencies...")
    
    pip_cmd = get_pip_command()
    
    dependencies = [
        "flask==3.0.0",
        "flask-mail==0.9.1", 
        "gunicorn==21.2.0",
        "requests==2.31.0",
        "beautifulsoup4==4.12.2",
        "trafilatura==1.6.4"
    ]
    
    try:
        # Upgrade pip first
        subprocess.run([pip_cmd, "install", "--upgrade", "pip"], check=True, capture_output=True)
        
        # Install dependencies
        for dep in dependencies:
            print(f"   Installing {dep.split('==')[0]}...")
            subprocess.run([pip_cmd, "install", dep], check=True, capture_output=True)
        
        print("✅ All dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def create_env_file():
    """Create .env file template"""
    print("\n⚙️  Creating environment configuration...")
    
    env_content = """# Flask Configuration
SESSION_SECRET=your-secret-key-change-this-in-production

# Email Configuration (Optional - for contact form)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
CONTACT_EMAIL=mayurgadekar2501@gmail.com

# Note: Email configuration is optional. 
# The website will work without it, but contact form won't send emails.
"""
    
    if not os.path.exists(".env"):
        with open(".env", "w") as f:
            f.write(env_content)
        print("✅ Created .env file template")
    else:
        print("   .env file already exists")

def get_python_command():
    """Get the correct Python command based on OS"""
    system = platform.system().lower()
    if system == "windows":
        return os.path.join("venv", "Scripts", "python.exe")
    else:
        return os.path.join("venv", "bin", "python")

def show_run_instructions():
    """Show instructions for running the application"""
    system = platform.system().lower()
    python_cmd = get_python_command()
    
    print("\n🚀 Setup Complete! Here's how to run your portfolio:")
    print("\n" + "="*60)
    
    if system == "windows":
        print("1. Activate virtual environment:")
        print("   venv\\Scripts\\activate")
    else:
        print("1. Activate virtual environment:")
        print("   source venv/bin/activate")
    
    print("\n2. Run the application:")
    print(f"   {python_cmd} app.py")
    print("   OR")
    print("   gunicorn --bind 0.0.0.0:5000 --reload main:app")
    
    print("\n3. Open your browser and visit:")
    print("   http://localhost:5000")
    
    print("\n4. To stop the server:")
    print("   Press Ctrl+C in the terminal")
    
    print("\n" + "="*60)
    print("\n📝 Additional Notes:")
    print("• The website will work without email configuration")
    print("• Edit .env file to enable contact form email functionality")
    print("• Your portfolio includes all real GitHub projects")
    print("• Resume download feature is ready to use")

def main():
    """Main setup function"""
    print("🎯 Mayur Gadekar Portfolio - Local Setup")
    print("="*50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create virtual environment
    if not create_virtual_environment():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Create environment file
    create_env_file()
    
    # Show run instructions
    show_run_instructions()
    
    print("\n✨ Portfolio setup completed successfully!")
    print("   Ready to showcase your AI/ML expertise!")

if __name__ == "__main__":
    main()