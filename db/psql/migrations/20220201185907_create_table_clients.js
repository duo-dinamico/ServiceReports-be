exports.up = knex =>
    Promise.all([
        knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'),
        knex.schema.createTable("clients", table => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.text("name").unique().defaultTo(null);
            table.text("location").defaultTo(null);
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
            table.timestamp("deleted_at").defaultTo(null);
        }),
    ]);

exports.down = knex => knex.schema.dropTable("clients");
