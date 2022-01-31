const dbConfig = require("../../knexfile.js");

module.exports = require("knex")(dbConfig);
