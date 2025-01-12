import projectLoader from './projectLoader.js';

class ProjectData {
    constructor() {
        this.projects = [];
    }

    async initialize() {
        this.projects = await projectLoader.loadProjectMetadata();
    }

    getAllProjects() {
        return this.projects;
    }

    async getProjectContent(detailsFile) {
        return await projectLoader.loadProjectContent(detailsFile);
    }
}

export default new ProjectData();