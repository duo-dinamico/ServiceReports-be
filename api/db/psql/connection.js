/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
const environment = process.env.ENVIRONMENT || "development";
const config = require("../../knexfile.js")[environment];
module.exports = require("knex")(config);
