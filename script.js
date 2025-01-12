// Project Data Module
const projectData = {
    projects: [
        {
            name: "TensorFlow",
            description: "A comprehensive open-source machine learning framework used for building and deploying AI models at scale [3][4].",
            image: "assets/images/tensorflow.jpg",
            tag: "AI & Data",
            author: "Akhil Gurrapu"
          },
          {
            name: "PyTorch",
            description: "A popular open-source ML framework known for its dynamic computation graph and intuitive design [3][4].",
            image: "assets/images/pytorch.jpg",
            tag: "AI & Data",
            author: "Akhil Gurrapu"
          },
          {
            name: "Keras",
            description: "A high-level neural networks API written in Python, running on top of TensorFlow [3][4].",
            image: "assets/images/keras.jpg",
            tag: "AI & Data",
            author: "Akhil Gurrapu"
          },
          {
            name: "H2O.ai",
            description: "An open-source AI platform providing automated machine learning, supporting large-scale parallel computing [3].",
            image: "assets/images/h2oai.jpg",
            tag: "AI & Data",
            author: "Akhil Gurrapu"
          },
          {
            name: "Mistral AI",
            description: "Open-source AI models focusing on efficiency and accessibility, known for their smaller yet powerful architectures [3].",
            image: "assets/images/mistral-ai.jpg",
            tag: "AI & Data",
            author: "Akhil Gurrapu"
          },
          {
            name: "MindsDB",
            description: "A platform aiming to democratize machine learning by integrating ML frameworks directly into databases [9][13].",
            image: "assets/images/mindsdb.jpg",
            tag: "AI & Data",
            author: "Akhil Gurrapu"
          },
          {
            name: "OpenCV",
            description: "An open-source library for computer vision and machine learning, offering a wide range of vision algorithms [4].",
            image: "assets/images/opencv.jpg",
            tag: "AI & Data",
            author: "Akhil Gurrapu"
          }
        ]
};

// Card UI Module
const cardUI = {
    createCard(project) {
        // Create a simpler path to the markdown file
        const fileName = project.name.toLowerCase()
            .replace(/[\s\.]+/g, '')
            .replace(/\-/g, '')
            + '.md';
            
        return `
            <a href="content/projects/${fileName}" class="project-card" style="cursor: pointer;">
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
