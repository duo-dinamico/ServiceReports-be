exports.up = knex =>
    Promise.all([
        knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'),
        knex.schema.createTable("machines", table => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.text("manufacturer").notNullable();
            table.text("model").notNullable();
            table.text("serial_number").notNullable();
            table.uuid("departments_id");
            table.foreign("departments_id").references("departments.id");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
            table.timestamp("deleted_at").defaultTo(null);
        }),
    ]);

exports.down = knex => knex.schema.dropTable("machines");
