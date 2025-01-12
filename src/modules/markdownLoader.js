export async function loadProjectMetadata() {
    try {
        const response = await fetch('/content/projects/index.json');
        const projectList = await response.json();
        
        const projects = await Promise.all(
            projectList.map(async (filename) => {
                const response = await fetch(`/content/projects/${filename}`);
                const markdown = await response.text();
                return parseMarkdownMetadata(markdown);
            })
        );
        
        return projects;
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

function parseMarkdownMetadata(markdown) {
    const metadataRegex = /^---\n([\s\S]*?)\n---/;
    const match = markdown.match(metadataRegex);
    
    if (!match) return null;
    
    const metadata = {};
    const metadataStr = match[1];
    
    metadataStr.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            const value = valueParts.join(':').trim().replace(/^"(.*)"$/, '$1');
            metadata[key.trim()] = value;
        }
    });
    
    return metadata;
}

export async function loadMarkdownFile(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdown = await response.text();
        
        // Remove the frontmatter and get only the content
        const content = markdown.replace(/^---[\s\S]*?---/, '').trim();
        
        // Basic markdown to HTML conversion (you might want to use a proper markdown parser)
        const html = convertMarkdownToHTML(content);
        
        return html;
    } catch (error) {
        console.error('Error loading markdown:', error);
        throw error;
    }
}

function convertMarkdownToHTML(markdown) {
    return markdown
        // Convert headers
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        // Convert links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        // Convert lists
        .replace(/^\- (.+)/gm, '<li>$1</li>')
        // Wrap lists in ul
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        // Convert paragraphs
        .replace(/^(?!<[h|u|l])(.*$)/gm, '<p>$1</p>')
        // Clean up empty paragraphs
        .replace(/<p><\/p>/g, '');
} 