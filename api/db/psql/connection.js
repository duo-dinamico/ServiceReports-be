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
            directory: `${__dirname}/migrations`,
        },
        seeds: {
            directory: `${__dirname}/seeds`,
        },
    },
};

const productionConfig = {
    production: {
        client: "pg",
        connection: {
            host: process.env.DATABASE_URL,
        },
        migrations: {
            directory: `${__dirname}/migrations`,
        },
        seeds: {
            directory: `${__dirname}/seeds`,
        },
    },
};

let config = require("../../knexfile")[environment];

if (environment === "github_actions") {
    config = githubConfig.github_actions;
}

if (environment === "production") {
    config = productionConfig.production;
}

module.exports = require("knex")(config);
