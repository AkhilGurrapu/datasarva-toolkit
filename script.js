// Project Data Module
const projectData = {
    projects: [
        {
            name: "RAG with Long-term Memory",
            description: "PLUS: Opensource AI layer on Playwright, Cohere's AI agents for enterprise",
            image: "assets/images/rag-ltm.jpg",
            tag: "Daily Unwind",
            author: "Shubham Saboo, +1"
        },
        {
            name: "Don't Do RAG; Do CAG",
            description: "PLUS: Open source computer use agent, Local LLM with function calling",
            image: "assets/images/cag.jpg",
            tag: "Daily Unwind",
            author: "Shubham Saboo, +1"
        },
        {
            name: "One API for RAG, Search & Recommendations",
            description: "PLUS: No-code AI automations and agents, NVIDIA's agent avatar with vision",
            image: "assets/images/unified-rag.jpg",
            tag: "Daily Unwind",
            author: "Shubham Saboo, +1"
        },
        {
            name: "Build an AI Data Visualization Agent",
            description: "Create intelligent agents for data visualization and analysis",
            image: "assets/images/viz-agent.jpg",
            tag: "AI Tutorial",
            author: "Shubham Saboo, +1"
        },
        {
            name: "RAG-as-a-Service",
            description: "Deploy and manage RAG systems at scale",
            image: "assets/images/rag-service.jpg",
            tag: "Daily Unwind",
            author: "Shubham Saboo, +1"
        },
        {
            name: "Memory Recall in AI Agents",
            description: "Implement effective memory systems for AI agents",
            image: "assets/images/memory-recall.jpg",
            tag: "Daily Unwind",
            author: "Shubham Saboo, +1"
        }
    ]
};

// Card UI Module
const cardUI = {
    createCard(project) {
        return `
            <div class="project-card">
                <div class="card-image" style="background-image: url('${project.image}')">
                    <span class="tag">${project.tag}</span>
                </div>
                <div class="card-content">
                    <h2>${project.name}</h2>
                    <p class="description">${project.description}</p>
                    <div class="author">
                        <div class="author-images">
                            <img src="assets/images/author1.jpg" alt="Author" class="author-avatar">
                            <img src="assets/images/author2.jpg" alt="Author" class="author-avatar author-avatar-offset">
                        </div>
                        <span>${project.author}</span>
                    </div>
                </div>
            </div>
        `;
    }
};

// Filter Module
const filterModule = {
    filterBySearch(projects, searchTerm) {
        if (!searchTerm) return projects;
        searchTerm = searchTerm.toLowerCase();
        return projects.filter(project => 
            project.name.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm)
        );
    },

    filterByTag(projects, tag) {
        if (tag === 'all') return projects;
        return projects.filter(project => project.tag === tag);
    }
};

// App Controller
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
        
        // Apply search filter
        filteredProjects = filterModule.filterBySearch(filteredProjects, this.searchInput.value);
        
        // Apply tag filter
        if (tag !== 'all') {
            filteredProjects = filterModule.filterByTag(filteredProjects, tag);
        }
        
        // Render filtered projects
        const projectsHtml = filteredProjects.map(project => cardUI.createCard(project)).join('');
        this.projectGrid.innerHTML = projectsHtml;
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => app.init());
