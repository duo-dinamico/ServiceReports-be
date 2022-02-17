/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    test: {
        client: "pg",
        connection: {
            database: "service_reports",
            user: "sruser",
            password: "sruser",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: `${__dirname}/db/psql/migrations`,
        },
        seeds: {
            directory: `${__dirname}/db/psql/seeds`,
        },
    },
    development: {
        client: "pg",
        connection: {
            host: "postgres",
            port: 5432,
            database: "service_reports",
            user: "sruser",
            password: "sruser",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: `${__dirname}/db/psql/migrations`,
        },
        seeds: {
            directory: `${__dirname}/db/psql/seeds`,
        },
    },
    github_actions: {
        client: "pg",
        connection: {
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            database: "postgres",
            user: "postgres",
            password: "postgres",
        },
        migrations: {
            directory: `${__dirname}/db/psql/migrations`,
        },
        seeds: {
            directory: `${__dirname}/db/psql/seeds`,
        },
    },
};
