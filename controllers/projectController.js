const { createProject, getAllProjects } = require('../models/Project');

const createProjectHandler = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: "Project name and description are required" });
        }

        const project = await createProject(name, description, req.user.id);
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Error creating project", error: error.message });
    }
};

const getProjectsHandler = async (req, res) => {
    try {
        const projects = await getAllProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving projects", error: error.message });
    }
};

module.exports = { createProjectHandler, getProjectsHandler };
