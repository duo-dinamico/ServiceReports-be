const dbConfig = process.env.LOCAL ? require("../../knexfile") : null;

console.log(process.env.LOCAL);

module.exports = require("knex")(dbConfig);
