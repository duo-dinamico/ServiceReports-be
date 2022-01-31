/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
const dbConfig = process.env.LOCAL ? require("../../knexfile") : null;

module.exports = require("knex")(dbConfig);
