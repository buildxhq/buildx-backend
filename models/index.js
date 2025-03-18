const knex = require('../config/db');
const User = require('./User');
const Project = require('./Project');
const Bid = require('./Bid');

module.exports = {
    knex,
    User,
    Project,
    Bid
};
