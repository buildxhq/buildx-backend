const knex = require('../config/db');

const createUser = async (email, password) => {
    return await knex('users').insert({ email, password }).returning('*');
};

const findUserByEmail = async (email) => {
    return await knex('users').where({ email }).first();
};

module.exports = { createUser, findUserByEmail };

