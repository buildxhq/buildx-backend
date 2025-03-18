const { createProject, getAllProjects } = require('../models/Project');

const createProjectHandler = async (req, res) => {
    const { name, description } = req.body;
    const project = await createProject(name, description, req.user.id);
    res.json(project);
};

const getProjectsHandler = async (req, res) => {
    const projects = await getAllProjects();
    res.json(projects);
};

module.exports = { createProjectHandler, getProjectsHandler };
