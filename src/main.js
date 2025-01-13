import projectData from './modules/projectData.js';
import cardUI from './card.js';
import filterModule from './modules/filterModule.js';
import { loadMarkdownFile } from './modules/markdownLoader.js';

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
            this.initializeProjectClicks();
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

    initializeProjectClicks() {
        this.projectGrid.addEventListener('click', async (e) => {
            const projectCard = e.target.closest('.project-card');
            if (projectCard) {
                e.preventDefault();
                const projectPath = projectCard.dataset.project;
                console.log('Clicked project path:', projectPath);
                try {
                    const content = await loadMarkdownFile(projectPath);
                    this.displayProjectModal(content);
                } catch (error) {
                    console.error('Error loading project:', error);
                }
            }
        });
    }

    displayProjectModal(content) {
        let modal = document.querySelector('.modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <div class="markdown-content">
                    ${content}
                </div>
            </div>
        `;

        modal.style.display = 'block';

        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
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