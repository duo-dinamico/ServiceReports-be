const Boom = require("@hapi/boom");

const connection = require("../db/psql/connection");
const {fetchRevision} = require("./revisions.models");

const columnSelection = [
    "services.id",
    connection.raw(
        "json_build_object('id',departments.id,'name',departments.name, 'client', clients.name) as department"
    ),
    "services.created_at",
    "services.updated_at",
    "services.closed_at",
    "services.deleted_at",
    connection.raw(
        "json_build_object('id',users_created_by.id,'username',users_created_by.username, 'name', users_created_by.name) as created_by"
    ),
    connection.raw(
        "json_build_object('id',users_updated_by.id,'username',users_updated_by.username, 'name', users_updated_by.name) as updated_by"
    ),
    connection.raw(
        "json_build_object('id',users_closed_by.id,'username',users_closed_by.username, 'name', users_closed_by.name) as closed_by"
    ),
    connection.raw(
        "json_build_object('id',users_deleted_by.id,'username',users_deleted_by.username, 'name', users_deleted_by.name) as deleted_by"
    ),
];

const fetchAllServices = async ({sort_by, order, department_id, created_by, closed_by, show_deleted = false}) => {
    const services = await connection
        .select(...columnSelection)
        .leftJoin("users as users_created_by", "services.created_by", "=", "users_created_by.id")
        .leftJoin("users as users_updated_by", "services.updated_by", "=", "users_updated_by.id")
        .leftJoin("users as users_closed_by", "services.closed_by", "=", "users_closed_by.id")
        .leftJoin("users as users_deleted_by", "services.deleted_by", "=", "users_deleted_by.id")
        .leftJoin("departments", "services.department_id", "=", "departments.id")
        .leftJoin("clients", "departments.client_id", "=", "clients.id")
        .from("services")
        .modify(builder => {
            if (sort_by && order) builder.orderBy(sort_by, order);
            if (department_id) builder.where({"services.department_id": department_id});
            if (created_by) builder.where({"services.created_by": created_by});
            if (closed_by) builder.where({"services.closed_by": closed_by});
            if (show_deleted === false) builder.where({"services.deleted_at": null, "departments.deleted_at": null});
        });
    return services;
};

const fetchService = async service_id => {
    const [service] = await connection
        .select(...columnSelection)
        .leftJoin("users as users_created_by", "services.created_by", "=", "users_created_by.id")
        .leftJoin("users as users_updated_by", "services.updated_by", "=", "users_updated_by.id")
        .leftJoin("users as users_closed_by", "services.closed_by", "=", "users_closed_by.id")
        .leftJoin("users as users_deleted_by", "services.deleted_by", "=", "users_deleted_by.id")
        .leftJoin("departments", "services.department_id", "=", "departments.id")
        .leftJoin("clients", "departments.client_id", "=", "clients.id")
        .from("services")
        .where({"services.deleted_at": null, "departments.deleted_at": null})
        .modify(builder => {
            if (service_id) builder.where({"services.id": service_id});
        });
    if (!service && service_id) return Promise.reject(Boom.notFound(`"${service_id}" could not be found`));
    return service;
};

const updateService = async (service_id, body) => {
    const {user_id, closed, ...rest} = body;
    await Promise.all([
        connection
            .from("revisions")
            .where({service_id})
            .update({closed, ...rest}),
        connection
            .from("services")
            .where({id: service_id})
            .modify(builder => {
                if (closed !== undefined && closed === true) {
                    builder.update({
                        closed_at: new Date().toISOString(),
                        closed_by: user_id,
                        updated_by: user_id,
                        updated_at: new Date().toISOString(),
                    });
                } else {
                    builder.update({updated_by: user_id, updated_at: new Date().toISOString()});
                }
            }),
    ]);
};

const updateMachineRevision = async ({service_id, machine_id}, body) => {
    const {user_id, ...rest} = body;
    await Promise.all([
        connection
            .from("revisions")
            .where({service_id, machine_id})
            .update({...rest}),
        connection
            .from("services")
            .where({id: service_id})
            .update({updated_by: user_id, updated_at: new Date().toISOString()}),
    ]);
    return fetchRevision(service_id, machine_id);
};

const removeService = async ({service_id}, body) => {
    const {user_id} = body;
    await Promise.all([
        connection
            .from("services")
            .where({id: service_id})
            .update({deleted_by: user_id, deleted_at: new Date().toISOString()}),
        connection.from("revisions").where({service_id}).update({deleted_at: new Date().toISOString()}),
    ]);
};

const addServiceService = async body => {
    const {user_id, department_id} = body;
    const [service] = await connection
        .from("services")
        .insert({
            department_id,
            created_by: user_id,
            created_at: new Date().toISOString(),
            updated_by: user_id,
            updated_at: new Date().toISOString(),
        })
        .returning("services.id");
    const machines = await connection.select("id").from("machines").where({department_id});
    const data = machines.map(machine => ({
        service_id: service.id,
        machine_id: machine.id,
    }));
    await connection.from("revisions").insert(data);
    return service;
};

module.exports = {
    fetchAllServices,
    fetchService,
    updateService,
    updateMachineRevision,
    removeService,
    addServiceService,
};
