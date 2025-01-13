import { loadMarkdownFile, parseMarkdownFrontMatter } from './src/utils/markdownLoader.js';
import { getProjectFiles } from './src/utils/projectLoader.js';

class App {
    constructor() {
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.projects = [];
        this.init();
    }

    async init() {
        try {
            console.log('Initializing app...');
            const projectGrid = document.getElementById('projectGrid');
            
            if (!projectGrid) {
                throw new Error('Project grid element not found');
            }
            
            projectGrid.innerHTML = '<div class="loading">Loading projects...</div>';
            
            // Check project files first
            const files = await this.checkProjectFiles();
            console.log('Project files check completed:', files);
            
            await this.loadProjects();
            console.log('Projects loaded:', this.projects);
            
            this.bindEvents();
            this.renderProjects();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            const projectGrid = document.getElementById('projectGrid');
            if (projectGrid) {
                projectGrid.innerHTML = `<div class="error">Failed to load projects: ${error.message}</div>`;
            }
        }
    }

    async loadProjects() {
        try {
            const projectFiles = await getProjectFiles();
            console.log('Found project files:', projectFiles);
            
            if (!projectFiles.length) {
                console.warn('No markdown files found, using fallback data');
                this.projects = this.getFallbackProjects();
                return;
            }

            const loadedProjects = await Promise.all(
                projectFiles.map(async (filePath, index) => {
                    try {
                        console.log('Loading project:', filePath);
                        const markdown = await loadMarkdownFile(filePath);
                        const parsed = parseMarkdownFrontMatter(markdown);
                        
                        if (!parsed) {
                            console.error(`Invalid markdown format in ${filePath}`);
                            return null;
                        }

                        return {
                            id: index + 1,
                            filePath,
                            ...parsed.metadata,
                            content: parsed.content
                        };
                    } catch (error) {
                        console.error(`Error loading ${filePath}:`, error);
                        return null;
                    }
                })
            );

            // Filter out failed loads and update projects
            this.projects = loadedProjects.filter(project => project !== null);
            
            if (this.projects.length === 0) {
                console.warn('No projects could be loaded, using fallback data');
                this.projects = this.getFallbackProjects();
            }
            
            console.log('Loaded projects:', this.projects);
        } catch (error) {
            console.error('Error in loadProjects:', error);
            this.projects = this.getFallbackProjects();
            throw error;
        }
    }

    bindEvents() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderProjects();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => 
                    b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderProjects();
            });
        });
    }

    filterProjects() {
        return this.projects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(this.searchTerm) ||
                                project.description.toLowerCase().includes(this.searchTerm);
            const matchesFilter = this.currentFilter === 'all' || 
                                project.tag.toLowerCase() === this.currentFilter;
            return matchesSearch && matchesFilter;
        });
    }

    createProjectCard(project) {
        return `
            <a href="project.html?id=${project.id}" class="project-card" data-filepath="${project.filePath}">
                <div class="card-image" style="background-image: url('${project.image}')">
                    <span class="tag">${project.tag}</span>
                </div>
                <div class="card-content">
                    <h2>${project.name}</h2>
                    <p class="description">${project.description}</p>
                    <div class="author">
                        <div class="author-images">
                            <img src="assets/images/avatar.jpg" alt="Author" class="author-avatar">
                        </div>
                        <span>${project.author}</span>
                    </div>
                </div>
            </a>
        `;
    }

    renderProjects() {
        const filteredProjects = this.filterProjects();
        const projectGrid = document.getElementById('projectGrid');

        if (filteredProjects.length === 0) {
            projectGrid.innerHTML = '<div class="no-results">No matching projects found</div>';
            return;
        }

        projectGrid.innerHTML = filteredProjects
            .map(project => this.createProjectCard(project))
            .join('');
    }

    async checkProjectFiles() {
        try {
            const projectFiles = await getProjectFiles();
            console.log('Available project files:', projectFiles);
            
            const results = await Promise.all(projectFiles.map(async filePath => {
                try {
                    const response = await fetch(filePath);
                    console.log(`Checking ${filePath}:`, response.status, response.ok);
                    return { filePath, ok: response.ok, status: response.status };
                } catch (error) {
                    console.error(`Error checking ${filePath}:`, error);
                    return { filePath, ok: false, error: error.message };
                }
            }));
            
            return results;
        } catch (error) {
            console.error('Error in checkProjectFiles:', error);
            throw error;
        }
    }

    getFallbackProjects() {
        return [
            {
                id: 1,
                name: "TensorFlow",
                description: "A comprehensive open-source machine learning framework",
                image: "assets/images/tensorflow.jpg",
                tag: "AI & Data",
                author: "Akhil Gurrapu",
                content: "# TensorFlow\n\nTensorFlow is an open-source software library..."
            },
            {
                id: 2,
                name: "PyTorch",
                description: "Deep learning framework for research and production",
                image: "assets/images/pytorch.jpg",
                tag: "Tutorial",
                author: "Akhil Gurrapu",
                content: "# PyTorch\n\nPyTorch is an open source machine learning library..."
            }
        ];
    }
}

// Initialize the application with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        new App();
    } catch (error) {
        console.error('Failed to initialize application:', error);
        document.getElementById('projectGrid').innerHTML = 
            '<div class="error">Failed to initialize application. Please try again later.</div>';
    }
});
