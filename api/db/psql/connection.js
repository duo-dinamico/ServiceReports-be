const dbConfig = process.env.LOCAL ? require("../../knexfile") : null;

module.exports = require("knex")(dbConfig);
