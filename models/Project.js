const knex = require('../config/db');

const createProject = async (name, description, ownerId) => {
    return knex('projects').insert({ name, description, owner_id: ownerId }).returning('*');
};

const getAllProjects = async () => {
    return knex('projects').select('*');
};

module.exports = { createProject, getAllProjects };

