export const filterModule = {
    applyFilters(projects, filters) {
        let filtered = this.filterBySearch(projects, filters.searchTerm);
        filtered = this.filterByCategory(filtered, filters.category);
        filtered = this.filterByTag(filtered, filters.tag);
        return filtered;
    },

    filterBySearch(projects, searchTerm) {
        if (!searchTerm) return projects;
        searchTerm = searchTerm.toLowerCase();
        return projects.filter(project => 
            project.name.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm)
        );
    },

    filterByCategory(projects, category) {
        if (!category || category === 'all') return projects;
        return projects.filter(project => project.category === category);
    },

    filterByTag(projects, tag) {
        if (!tag || tag === 'all') return projects;
        return projects.filter(project => {
            if (tag === 'tutorial') return project.tag === 'AI Tutorial';
            if (tag === 'daily') return project.tag === 'Daily Unwind';
            if (tag === 'weekly') return project.tag === 'Weekly Unwind';
            return true;
        });
    }
};

export default filterModule;