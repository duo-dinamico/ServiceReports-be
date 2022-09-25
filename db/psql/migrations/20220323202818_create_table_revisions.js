exports.up = knex =>
    Promise.all([
        knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'),
        knex.schema.createTable("revisions", table => {
            table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.uuid("service_id");
            table.foreign("service_id").references("services.id");
            table.uuid("machine_id");
            table.foreign("machine_id").references("machines.id");
            table.boolean("maintained").defaultTo(false);
            table.boolean("repaired").defaultTo(false);
            table.boolean("operational").defaultTo(false);
            table.string("comments").defaultTo(null);
            table.boolean("closed").defaultTo(false);
            table.timestamp("deleted_at").defaultTo(null);
        }),
    ]);

exports.down = knex => knex.schema.dropTable("revisions");
