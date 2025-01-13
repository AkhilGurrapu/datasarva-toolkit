import { projectData } from './modules/projectData.js';
import { cardUI } from './modules/cardUI.js';
import { filterModule } from './modules/filter.js';

const app = {
    init() {
        this.projectGrid = document.getElementById('projectGrid');
        this.searchInput = document.getElementById('searchInput');
        
        this.bindEvents();
        this.updateDisplay();
    },

    bindEvents() {
        this.searchInput.addEventListener('input', () => this.updateDisplay());
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateDisplay(e.target.dataset.filter);
            });
        });
    },

    updateDisplay(tag = 'all') {
        let filteredProjects = projectData.projects;
        filteredProjects = filterModule.filterBySearch(filteredProjects, this.searchInput.value);
        
        if (tag !== 'all') {
            filteredProjects = filterModule.filterByTag(filteredProjects, tag);
        }
        
        this.projectGrid.innerHTML = filteredProjects.map(project => 
            cardUI.createCard(project)).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => app.init()); 