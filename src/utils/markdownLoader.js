async function loadMarkdownFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Failed to load markdown file');
        return await response.text();
    } catch (error) {
        console.error('Error loading markdown:', error);
        throw error;
    }
}

function parseMarkdownFrontMatter(markdown) {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontMatterRegex);
    
    if (!match) return null;
    
    const [, frontMatter, content] = match;
    const metadata = {};
    
    // Parse front matter
    frontMatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            let value = valueParts.join(':').trim();
            // Remove quotes if present
            value = value.replace(/^["'](.*)["']$/, '$1');
            metadata[key.trim()] = value;
        }
    });
    
    return {
        metadata,
        content: content.trim()
    };
}

export { loadMarkdownFile, parseMarkdownFrontMatter }; 