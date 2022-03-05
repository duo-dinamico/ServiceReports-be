/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
const environment = process.env.NODE_ENV || "development";
const githubConfig = {
    github_actions: {
        client: "pg",
        connection: {
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            database: process.env.DATABASE_NAME,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        },
        migrations: {
            directory: `${__dirname}/db/psql/migrations`,
        },
        seeds: {
            directory: `${__dirname}/db/psql/seeds`,
        },
    },
};
const config =
    process.env.NODE_ENV === "github_actions" ? githubConfig.github_actions : require("../../knexfile.js")[environment];
module.exports = require("knex")(config);
