const knex = require('knex');

const knexConfig = require('../knexfile.js');

module.exports = knex(process.env.DB_ENV || knexConfig.development);