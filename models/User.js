const knex = require('../config/db');

const createUser = async (email, password) => {
    return knex('users').insert({ email, password }).returning('*');
};

const findUserByEmail = async (email) => {
    return knex('users').where({ email }).first();
};

module.exports = { createUser, findUserByEmail };
