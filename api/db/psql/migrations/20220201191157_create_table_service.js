exports.up = knex =>
    Promise.all([
        knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'),
        knex.schema.createTable("services", table => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.uuid("user_id");
            table.foreign("user_id").references("users.id");
            table.uuid("department_id");
            table.foreign("department_id").references("departments.id");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
            table.timestamp("deleted_at").defaultTo(null);
            table.timestamp("closed_at").defaultTo(null);
            table.uuid("created_by").notNullable();
            table.uuid("updated_by").notNullable();
            table.uuid("deleted_by").defaultTo(null);
            table.uuid("closed_by").defaultTo(null);
        }),
    ]);

exports.down = knex => knex.schema.dropTable("services");
