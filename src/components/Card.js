const Card = {
    create(project) {
        const htmlFile = project.detailsFile.replace('.md', '.html');
        
        return `
            <a href="project_details/${htmlFile}" class="project-card">
                <div class="card-image" style="background-image: url('${project.image}')">
                    <span class="tag">${project.tag}</span>
                </div>
                <div class="card-content">
                    <h2>${project.name}</h2>
                    <p>${project.description}</p>
                    <div class="author">
                        <img src="assets/images/avatar.jpg" alt="Author" class="author-avatar">
                        <span>${project.author}</span>
                    </div>
                </div>
            </a>
        `;
    },

    renderGrid(projects, container) {
        container.innerHTML = projects
            .map(project => this.create(project))
            .join('');
    }
};

export default Card;