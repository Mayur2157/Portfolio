// Charts Configuration and Initialization
class SkillsCharts {
    constructor() {
        this.charts = {};
        this.skillsData = null;
        this.chartColors = {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            accent: '#06b6d4',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444'
        };
        this.init();
    }

    async init() {
        await this.loadSkillsData();
        this.initCharts();
        this.bindEvents();
    }

    async loadSkillsData() {
        try {
            const response = await fetch('/api/skills');
            this.skillsData = await response.json();
        } catch (error) {
            console.error('Error loading skills data:', error);
            // Fallback data
            this.skillsData = {
                programming: { Python: 95, JavaScript: 85, SQL: 90, Java: 80, 'C++': 75 },
                ml_ai: { TensorFlow: 90, 'Scikit-learn': 95, PyTorch: 85, OpenCV: 90, NLP: 88 },
                cloud_tools: { AWS: 85, Docker: 80, MLflow: 75, FastAPI: 88, Flask: 92 },
                databases: { PostgreSQL: 85, MongoDB: 80, MySQL: 90, Redis: 75, Hadoop: 70 }
            };
        }
    }

    bindEvents() {
        // Update charts when theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.updateChartsTheme();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    initCharts() {
        if (!this.skillsData) return;

        // Programming Languages Chart
        this.createPolarChart('programmingChart', this.skillsData.programming);
        
        // ML & AI Chart
        this.createBarChart('mlChart', this.skillsData.ml_ai);
        
        // Cloud & Tools Chart
        this.createDoughnutChart('cloudChart', this.skillsData.cloud_tools);
        
        // Databases Chart
        this.createRadarChart('databaseChart', this.skillsData.databases);
    }

    createPolarChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = Object.keys(data);
        const values = Object.values(data);
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        this.chartColors.primary + '80',
                        this.chartColors.secondary + '80',
                        this.chartColors.accent + '80',
                        this.chartColors.success + '80',
                        this.chartColors.warning + '80'
                    ],
                    borderColor: [
                        this.chartColors.primary,
                        this.chartColors.secondary,
                        this.chartColors.accent,
                        this.chartColors.success,
                        this.chartColors.warning
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: this.getTextColor(),
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: this.getTextColor(),
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: this.getBorderColor()
                        },
                        angleLines: {
                            color: this.getBorderColor()
                        }
                    }
                }
            }
        });
    }

    createBarChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = Object.keys(data);
        const values = Object.values(data);
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: this.chartColors.primary + '80',
                    borderColor: this.chartColors.primary,
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: this.getTextColor(),
                            maxRotation: 45
                        },
                        grid: {
                            color: this.getBorderColor()
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: this.getTextColor()
                        },
                        grid: {
                            color: this.getBorderColor()
                        }
                    }
                }
            }
        });
    }

    createDoughnutChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = Object.keys(data);
        const values = Object.values(data);
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        this.chartColors.primary + '80',
                        this.chartColors.secondary + '80',
                        this.chartColors.accent + '80',
                        this.chartColors.success + '80',
                        this.chartColors.warning + '80'
                    ],
                    borderColor: [
                        this.chartColors.primary,
                        this.chartColors.secondary,
                        this.chartColors.accent,
                        this.chartColors.success,
                        this.chartColors.warning
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: this.getTextColor(),
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    createRadarChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = Object.keys(data);
        const values = Object.values(data);
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Proficiency',
                    data: values,
                    backgroundColor: this.chartColors.accent + '20',
                    borderColor: this.chartColors.accent,
                    borderWidth: 2,
                    pointBackgroundColor: this.chartColors.accent,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: this.getTextColor(),
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: this.getBorderColor()
                        },
                        angleLines: {
                            color: this.getBorderColor()
                        },
                        pointLabels: {
                            color: this.getTextColor(),
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    updateChartsTheme() {
        Object.values(this.charts).forEach(chart => {
            // Update text colors
            if (chart.options.plugins?.legend?.labels) {
                chart.options.plugins.legend.labels.color = this.getTextColor();
            }
            
            // Update scale colors
            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach(scale => {
                    if (scale.ticks) {
                        scale.ticks.color = this.getTextColor();
                    }
                    if (scale.grid) {
                        scale.grid.color = this.getBorderColor();
                    }
                    if (scale.angleLines) {
                        scale.angleLines.color = this.getBorderColor();
                    }
                    if (scale.pointLabels) {
                        scale.pointLabels.color = this.getTextColor();
                    }
                });
            }
            
            chart.update();
        });
    }

    getTextColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'dark' ? '#ffffff' : '#1e293b';
    }

    getBorderColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Delay chart initialization to ensure DOM is fully ready
    setTimeout(() => {
        new SkillsCharts();
    }, 500);
});
