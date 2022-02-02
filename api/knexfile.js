const ENV = process.env.NODE_ENV || "test";

const dbConfig = {
    test: {
        client: "pg",
        migrations: {
            directory: "./db/psql/migrations",
        },
        connection: {
            database: "service_reports",
            user: "sruser",
            password: "sruser",
        },
        seeds: {
            directory: "./db/psql/seeds",
        },
    },
};

module.exports = dbConfig[ENV];
