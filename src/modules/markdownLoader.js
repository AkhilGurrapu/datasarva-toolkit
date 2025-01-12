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