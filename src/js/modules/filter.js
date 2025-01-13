export const filterModule = {
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