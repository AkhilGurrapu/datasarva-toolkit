import projectData from './modules/projectData.js';
import cardUI from './components/card.js';
import filterModule from './modules/filterModule.js';

class App {
    constructor() {
        this.projectGrid = null;
        this.searchInput = null;
        this.categoryFilter = null;
        this.debug = false;
    }

    async init() {
        this.projectGrid = document.getElementById('projectGrid');
        this.searchInput = document.getElementById('searchInput');
        this.categoryFilter = document.getElementById('categoryFilter');
        
        if (!this.projectGrid) {
            console.error('Project grid element not found!');
            return;
        }

        this.projectGrid.innerHTML = '<div class="loading">Loading projects...</div>';
        
        try {
            await projectData.initialize();
            const projects = projectData.getAllProjects();
            
            if (this.debug) {
                document.getElementById('debug').style.display = 'block';
                document.getElementById('debugContent').textContent = 
                    JSON.stringify({ projects }, null, 2);
            }

            if (!projects || projects.length === 0) {
                this.projectGrid.innerHTML = '<div class="error">No projects available.</div>';
                return;
            }

            this.bindEvents();
            this.updateDisplay();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.projectGrid.innerHTML = `<div class="error">Failed to load projects: ${error.message}</div>`;
        }
    }

    bindEvents() {
        this.searchInput?.addEventListener('input', () => this.updateDisplay());
        this.categoryFilter?.addEventListener('change', () => this.updateDisplay());
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateDisplay(e.target.dataset.filter);
            });
        });
    }

    updateDisplay(tag = 'all') {
        const projects = projectData.getAllProjects();
        if (projects.length === 0) {
            this.projectGrid.innerHTML = '<div class="no-projects">No projects found</div>';
            return;
        }

        const filteredProjects = filterModule.applyFilters(
            projects,
            {
                searchTerm: this.searchInput?.value || '',
                category: this.categoryFilter?.value || 'all',
                tag
            }
        );
        
        if (filteredProjects.length === 0) {
            this.projectGrid.innerHTML = '<div class="no-results">No matching projects found</div>';
            return;
        }
        
        cardUI.renderCards(filteredProjects, this.projectGrid);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init().catch(error => {
        console.error('Failed to initialize app:', error);
        document.getElementById('projectGrid').innerHTML = 
            `<div class="error">Failed to initialize application: ${error.message}</div>`;
    });
});