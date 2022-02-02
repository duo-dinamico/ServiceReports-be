/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
const dbConfig = require("../../knexfile");

module.exports = require("knex")(dbConfig);
