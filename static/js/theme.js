// Theme Management
// The initial theme is applied before first paint by templates/_theme_init.html.
class ThemeManager {
    constructor() {
        this.theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        this.init();
    }

    init() {
        this.updateToggle();
        this.bindEvents();
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Follow the system theme until the visitor picks one explicitly
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
                if (!this.getSavedTheme()) {
                    this.setTheme(e.matches ? 'light' : 'dark');
                }
            });
        }
    }

    getSavedTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    setTheme(theme, persist = false) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        if (persist) {
            try {
                localStorage.setItem('theme', theme);
            } catch (e) {
                // Storage blocked (private mode); the choice lasts for this page view only
            }
        }
        this.updateToggle();
    }

    toggleTheme() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme, true);

        // Add smooth transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    updateToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;
        const toggleIcon = toggle.querySelector('i');
        if (toggleIcon) {
            toggleIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        toggle.setAttribute('aria-label', this.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});
