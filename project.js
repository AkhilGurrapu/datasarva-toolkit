import { loadMarkdownFile, parseMarkdownFrontMatter } from './src/utils/markdownLoader.js';

class ProjectDetail {
    constructor() {
        this.loadProject();
    }

    async loadProject() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const projectId = urlParams.get('id');
            
            if (!projectId) {
                throw new Error('No project ID specified');
            }

            const filePath = `content/projects/${projectId}.md`;
            const markdown = await loadMarkdownFile(filePath);
            const parsed = parseMarkdownFrontMatter(markdown);

            if (!parsed) {
                throw new Error('Invalid markdown format');
            }

            this.updateUI(parsed.metadata, parsed.content);
        } catch (error) {
            console.error('Error loading project:', error);
            window.location.href = 'index.html';
        }
    }

    updateUI(metadata, content) {
        // Update page title
        document.title = `${metadata.name} - DataSarva AI`;

        // Update content
        document.getElementById('project-title').textContent = metadata.name;
        document.getElementById('project-description').textContent = metadata.description;
        document.getElementById('project-author').textContent = metadata.author;
        document.getElementById('project-image').src = metadata.image;
        
        // Handle tags
        const tagsContainer = document.getElementById('project-tags');
        tagsContainer.innerHTML = `<span class="tag">${metadata.tag}</span>`;
        
        // Convert and display markdown content
        const contentElement = document.getElementById('project-content');
        contentElement.innerHTML = this.markdownToHtml(content);
    }

    markdownToHtml(markdown) {
        return markdown
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
            .replace(/- (.*)/g, '<li>$1</li>')
            .replace(/<li>.*?<\/li>/g, match => `<ul>${match}</ul>`)
            .replace(/\n/g, '<br>');
    }
}

// Initialize the project detail page
document.addEventListener('DOMContentLoaded', () => {
    new ProjectDetail();
}); 