// Project Data Module
const projectData = {
    async loadProjects() {
        const projectFiles = [
            '../content/projects/tensorflow.md',
            '../content/projects/pytorch.md',
            '../content/projects/researcher-agent.md'
            // Add more project files here
        ];

        const projects = await Promise.all(projectFiles.map(async (file) => {
            try {
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

                // Get the main content
                const mainContent = content.replace(/^---[\s\S]*?---/, '').trim();

                return {
                    name: frontmatter.title,
                    description: frontmatter.description,
                    image: '../' + frontmatter.image,
                    tags: frontmatter.tags ? JSON.parse(frontmatter.tags.replace(/'/g, '"')) : [],
                    category: frontmatter.category,
                    author: frontmatter.author,
                    date: frontmatter.date,
                    mdPath: file.replace('../', ''),
                    content: mainContent
                };
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
                return null;
            }
        }));

        return projects.filter(p => p !== null);
    }
};

// App Controller
const app = {
    async init() {
        this.projectGrid = document.getElementById('projectGrid');
        this.searchInput = document.getElementById('searchInput');
        
        // Get current category from page filename
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
        this.currentCategory = currentPage === 'ai-apps' ? 'AI Apps' :
                              currentPage === 'data-tools' ? 'Data Tools' :
                              currentPage === 'projects' ? 'Projects' : null;

        // Load all projects
        this.projects = await projectData.loadProjects();
        
        // Filter projects by category if on a category page
        if (this.currentCategory) {
            this.projects = this.projects.filter(project => 
                project.category === this.currentCategory
            );
        }

        this.bindEvents();
        this.updateDisplay();
    },

    bindEvents() {
        this.searchInput.addEventListener('input', () => this.updateDisplay());
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => 
                    b.classList.remove('active')
                );
                e.target.classList.add('active');
                this.updateDisplay(e.target.dataset.filter);
            });
        });
    },

    async updateDisplay(tag = 'all') {
        let filteredProjects = this.projects;
        
        // Apply search filter
        const searchTerm = this.searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredProjects = filteredProjects.filter(project => {
                return project.name.toLowerCase().includes(searchTerm) ||
                       project.description.toLowerCase().includes(searchTerm) ||
                       project.content.toLowerCase().includes(searchTerm) ||
                       project.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            });
        }
        
        // Apply tag filter
        if (tag !== 'all') {
            filteredProjects = filteredProjects.filter(project => 
                project.tags.includes(tag)
            );
        }
        
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
            .map(project => `
                <a href="../project.html?md=${project.mdPath}" class="project-card">
                    <div class="card-image" style="background-image: url('${project.image}')">
                        <span class="tag">${project.tags[0]}</span>
                    </div>
                    <div class="card-content">
                        <h2>${project.name}</h2>
                        <p class="description">${project.description}</p>
                        <div class="author">
                            <div class="author-images">
                                <img src="../assets/images/avatar.jpg" alt="Author" class="author-avatar">
                            </div>
                            <span>${project.author}</span>
                        </div>
                    </div>
                </a>
            `)
            .join('');
        
        this.projectGrid.innerHTML = projectsHtml;
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => app.init()); 