export const cardUI = {
    createCard(project) {
        const mdPath = `content/projects/${project.name.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim()}.md`;
            
        return `
            <a href="project.html?md=${mdPath}" class="project-card">
                <div class="card-image" style="background-image: url('${project.image}')">
                    <span class="tag">${project.tag}</span>
                </div>
                <div class="card-content">
                    <h2>${project.name}</h2>
                    <div class="author">
                        <div class="author-images">
                            <img src="/assets/images/avatar.jpg" alt="Author" class="author-avatar">
                        </div>
                        <span>${project.author}</span>
                    </div>
                </div>
            </a>
        `;
    }
}; 