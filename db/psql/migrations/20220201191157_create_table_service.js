exports.up = knex =>
    Promise.all([
        knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'),
        knex.schema.createTable("services", table => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.uuid("department_id");
            table.foreign("department_id").references("departments.id");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
            table.timestamp("deleted_at").defaultTo(null);
            table.timestamp("closed_at").defaultTo(null);
            table.uuid("created_by").notNullable();
            table.foreign("created_by").references("users.id");
            table.uuid("updated_by").notNullable();
            table.foreign("updated_by").references("users.id");
            table.uuid("deleted_by").defaultTo(null);
            table.foreign("deleted_by").references("users.id");
            table.uuid("closed_by").defaultTo(null);
            table.foreign("closed_by").references("users.id");
        }),
    ]);

exports.down = knex => knex.schema.dropTable("services");
