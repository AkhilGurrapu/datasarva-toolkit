// Project Data Module
const projectData = {
    async loadProjects() {
        // List of known project files
        const projectFiles = [
            // Add new project files here
            'content/projects/tensorflow.md',
            'content/projects/pytorch.md',
            'content/projects/researcher-agent.md',
            'content/projects/executive-ai-assistant.md'
        ];

        const projects = await Promise.all(projectFiles.map(async (file) => {
            const response = await fetch(file);
            const content = await response.text();
            
            // Parse frontmatter
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (!frontmatterMatch) return null;

            const frontmatter = {};
            frontmatterMatch[1].split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length) {
                    const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
                    frontmatter[key.trim()] = value;
                }
            });

            // Get the main content (everything after frontmatter)
            const mainContent = content.replace(/^---[\s\S]*?---/, '').trim();

            return {
                name: frontmatter.title,
                description: frontmatter.description,
                image: frontmatter.image,
                tags: frontmatter.tags ? JSON.parse(frontmatter.tags.replace(/'/g, '"')) : [],
                author: frontmatter.author,
                date: frontmatter.date,
                mdPath: file,
                content: mainContent // Store the main content
            };
        }));

        return projects.filter(p => p !== null);
    }
};

// Card UI Module
const cardUI = {
    createCard(project) {
        return `
            <a href="project.html?md=${project.mdPath}" class="project-card">
                <div class="card-image" style="background-image: url('${project.image}')">
                    <span class="tag">${Array.isArray(project.tags) ? project.tags[0] : project.tags}</span>
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
};

// Filter Module
const filterModule = {
    filterBySearch(projects, searchTerm) {
        if (!searchTerm) return projects;
        searchTerm = searchTerm.toLowerCase();
        
        return projects.filter(project => {
            // Search in title and description
            const inBasicInfo = project.name.toLowerCase().includes(searchTerm) ||
                              project.description.toLowerCase().includes(searchTerm);
            
            // Search in main content
            const inContent = project.content.toLowerCase().includes(searchTerm);
            
            // Search in author name
            const inAuthor = project.author.toLowerCase().includes(searchTerm);
            
            // Search in tags
            const inTags = Array.isArray(project.tags) && 
                          project.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            return inBasicInfo || inContent || inAuthor || inTags;
        });
    },

    filterByTag(projects, tag) {
        if (tag === 'all') return projects;
        return projects.filter(project => {
            if (Array.isArray(project.tags)) {
                return project.tags.includes(tag);
            }
            return false;
        });
    }
};

// App Controller
const app = {
    async init() {
        this.projectGrid = document.getElementById('projectGrid');
        this.searchInput = document.getElementById('searchInput');
        
        // Load projects from .md files
        this.projects = await projectData.loadProjects();
        
        this.bindEvents();
        this.updateDisplay();
    },

    bindEvents() {
        this.searchInput.addEventListener('input', () => this.updateDisplay());
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                document.querySelectorAll('.filter-btn').forEach(b => 
                    b.classList.remove('active')
                );
                // Add active class to clicked button
                e.target.classList.add('active');
                // Update display with selected filter
                this.updateDisplay(e.target.dataset.filter);
            });
        });
    },

    async updateDisplay(tag = 'all') {
        let filteredProjects = this.projects;
        
        // Apply search filter
        filteredProjects = filterModule.filterBySearch(
            filteredProjects, 
            this.searchInput.value
        );
        
        // Apply tag filter
        filteredProjects = filterModule.filterByTag(filteredProjects, tag);
        
        // Show no results message if no projects found
        if (filteredProjects.length === 0) {
            this.projectGrid.innerHTML = `
                <div class="no-results">
                    <p>No projects found matching your criteria</p>
                </div>`;
            return;
        }
        
        // Render filtered projects
        const projectsHtml = filteredProjects
            .map(project => cardUI.createCard(project))
            .join('');
        this.projectGrid.innerHTML = projectsHtml;
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => app.init());
