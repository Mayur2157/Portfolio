// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Initialize typing animation
    initTypingAnimation();

    // Initialize smooth scrolling
    initSmoothScrolling();

    // Initialize back to top button
    initBackToTop();

    // Initialize navbar scroll effect
    initNavbarScroll();

    // Initialize contact form
    initContactForm();

    // Load projects
    loadProjects();

    // Initialize project filters
    initProjectFilters();

    // Remove loading screen
    removeLoadingScreen();

    // Initialize particle animation
    initParticleAnimation();
});

// Loading Screen
function removeLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);
}

// Typing Animation
function initTypingAnimation() {
    const options = {
        strings: [
            'AI/ML Engineer',
            'Deep Learning Specialist',
            'NLP Expert',
            'Python Developer',
            'Data Scientist',
            'MLOps Engineer'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    };

    new Typed('#typed-text', options);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        // Update active nav link
        const scrollPos = window.scrollY + 100;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            
            const response = await fetch('/contact', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification(result.message, 'success');
                contactForm.reset();
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--glass-shadow);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span><i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: 1rem;">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Load Projects
async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';
        
        projects.forEach((project, index) => {
            const projectCard = createProjectCard(project, index);
            projectsContainer.appendChild(projectCard);
        });
        
        // Refresh AOS
        AOS.refresh();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Create Project Card
function createProjectCard(project, index) {
    const col = document.createElement('div');
    col.className = 'col-lg-6 mb-4';
    col.setAttribute('data-aos', index % 2 === 0 ? 'fade-right' : 'fade-left');
    col.setAttribute('data-category', project.category);
    
    col.innerHTML = `
        <div class="glass-card project-card">
            <div class="project-header">
                <div>
                    <h4 class="project-title">${project.title}</h4>
                    <div class="project-period">${project.period}</div>
                </div>
                <div class="project-actions">
                    ${project.github_url ? `
                        <a href="${project.github_url}" target="_blank" class="github-link" title="View on GitHub" onclick="event.stopPropagation()">
                            <i class="fab fa-github"></i>
                        </a>
                    ` : ''}
                    ${project.stars ? `
                        <span class="project-stars" title="${project.stars} stars">
                            <i class="fas fa-star"></i> ${project.stars}
                        </span>
                    ` : ''}
                </div>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-meta">
                ${project.language ? `<span class="project-language"><i class="fas fa-code"></i> ${project.language}</span>` : ''}
            </div>
            <div class="project-category">${project.category}</div>
            <div class="project-details-btn" onclick="showProjectModal(${project.id})">
                <i class="fas fa-info-circle me-2"></i>View Details
            </div>
        </div>
    `;
    
    return col;
}

// Project Filters
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            const filter = this.getAttribute('data-filter');
            const projectCards = document.querySelectorAll('[data-category]');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in-up');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Project Modal
function showProjectModal(projectId) {
    fetch('/api/projects')
        .then(response => response.json())
        .then(projects => {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                const modal = document.getElementById('projectModal');
                const modalTitle = document.getElementById('projectModalTitle');
                const modalBody = document.getElementById('projectModalBody');
                
                modalTitle.textContent = project.title;
                modalBody.innerHTML = `
                    <div class="project-modal-header mb-3">
                        <div class="project-period">
                            <span class="badge bg-primary">${project.period}</span>
                        </div>
                        <div class="project-modal-actions">
                            ${project.github_url ? `
                                <a href="${project.github_url}" target="_blank" class="btn btn-outline-dark btn-sm">
                                    <i class="fab fa-github me-2"></i>View on GitHub
                                </a>
                            ` : ''}
                            ${project.stars ? `
                                <span class="project-stars ms-2">
                                    <i class="fas fa-star text-warning"></i> ${project.stars}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Technologies Used:</h6>
                            <div class="project-tech mb-3">
                                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h6>Project Details:</h6>
                            <div class="project-details mb-3">
                                ${project.language ? `<span class="detail-item"><i class="fas fa-code"></i> ${project.language}</span>` : ''}
                                <span class="detail-item"><i class="fas fa-tag"></i> ${project.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            </div>
                        </div>
                    </div>
                    <h6>Key Highlights:</h6>
                    <ul>
                        ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                `;
                
                new bootstrap.Modal(modal).show();
            }
        })
        .catch(error => console.error('Error loading project details:', error));
}

// Particle Animation
function initParticleAnimation() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;
    
    // Create floating particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.5;
            animation: float-particle ${Math.random() * 10 + 5}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        heroParticles.appendChild(particle);
    }
    
    // Add particle animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.5;
            }
            90% {
                opacity: 0.5;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
window.addEventListener('scroll', debounce(() => {
    // Handle scroll events here if needed
}, 10));
