export function createCard(project) {
    const markdownPath = `content/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}.md`;
    
    return `
        <a href="#" class="project-card" data-project="${markdownPath}">
            <div class="card-image" style="background-image: url('${project.image}')">
                <span class="tag">${project.category || project.tag}</span>
            </div>
            <div class="card-content">
                <div>
                    <h2>${project.name || project.title}</h2>
                    <p class="description">${project.description}</p>
                </div>
                <div class="author">
                    <div class="author-images">
                        <img src="assets/images/avatar.png" alt="Author" class="author-avatar">
                    </div>
                    <span>${project.author || 'Akhil Gurrapu'}</span>
                </div>
            </div>
        </a>
    `;
}