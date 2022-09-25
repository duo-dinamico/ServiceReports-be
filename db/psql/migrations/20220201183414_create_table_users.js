exports.up = knex =>
    Promise.all([
        knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'),
        knex.schema.createTable("users", table => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.text("username").unique().defaultTo(null);
            table.text("name").defaultTo(null);
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
            table.timestamp("deleted_at").defaultTo(null);
        }),
    ]);

exports.down = knex => knex.schema.dropTable("users");
