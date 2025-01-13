async function getProjectFiles() {
    try {
        // List of known project files
        const knownProjects = [
            'tensorflow.md',
            'pytorch.md',
            'keras.md',
            'opencv.md',
            'h20ai.md',
            'mindsdb.md',
            'mistralai.md'
        ];
        
        const projectFiles = knownProjects.map(filename => `content/projects/${filename}`);
        
        // Check if files exist
        const existingFiles = await Promise.all(
            projectFiles.map(async (filePath) => {
                try {
                    const response = await fetch(filePath, { method: 'HEAD' });
                    return response.ok ? filePath : null;
                } catch (error) {
                    console.error(`Error checking ${filePath}:`, error);
                    return null;
                }
            })
        );
        
        // Filter out non-existent files
        const validFiles = existingFiles.filter(file => file !== null);
        
        if (validFiles.length === 0) {
            console.error('No valid project files found');
        }
        
        return validFiles;
    } catch (error) {
        console.error('Error getting project files:', error);
        return [];
    }
}

export { getProjectFiles }; 