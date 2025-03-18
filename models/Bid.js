const knex = require('../config/db');

const createBid = async (projectId, userId, amount) => {
    return knex('bids').insert({ project_id: projectId, user_id: userId, amount }).returning('*');
};

const getBidsForProject = async (projectId) => {
    return knex('bids').where({ project_id: projectId }).select('*');
};

module.exports = { createBid, getBidsForProject };
