const Boom = require("@hapi/boom");

const connection = require("../db/psql/connection");

const columnSelection = [
    "services.id",
    connection.raw(
        "json_build_object('id',departments.id,'name',departments.name, 'client', clients.name) as department"
    ),
    "services.created_at",
    "services.updated_at",
    "services.closed_at",
    "services.deleted_at",
    connection.raw("json_build_object('id',users.id,'username',users.username, 'name', users.name) as created_by"),
    connection.raw("json_build_object('id',users.id,'username',users.username, 'name', users.name) as updated_by"),
    connection.raw("json_build_object('id',users.id,'username',users.username, 'name', users.name) as closed_by"),
    connection.raw("json_build_object('id',users.id,'username',users.username, 'name', users.name) as deleted_by"),
];

exports.fetchAllServices = async ({sort_by, order, department_id, created_by, closed_by}) => {
    const services = await connection
        .select(...columnSelection)
        .leftJoin("users", builder => {
            builder
                .on("users.id", "=", "services.created_by")
                .orOn("users.id", "=", "services.updated_by")
                .orOn("users.id", "=", "services.closed_by")
                .orOn("users.id", "=", "services.deleted_by");
        })
        .leftJoin("departments", "services.department_id", "=", "departments.id")
        .leftJoin("clients", "departments.client_id", "=", "clients.id")
        .from("services")
        .where({"services.deleted_at": null, "departments.deleted_at": null})
        .modify(builder => {
            if (sort_by && order) builder.orderBy(sort_by, order);
            if (department_id) builder.where({"services.department_id": department_id});
            if (created_by) builder.where({"services.created_by": created_by});
            if (closed_by) builder.where({"services.closed_by": closed_by});
        });
    return services;
};

exports.fetchService = async ({id}) => {
    const [service] = await connection
        .select(...columnSelection)
        .leftJoin("users", builder => {
            builder
                .on("users.id", "=", "services.created_by")
                .orOn("users.id", "=", "services.updated_by")
                .orOn("users.id", "=", "services.closed_by")
                .orOn("users.id", "=", "services.deleted_by");
        })
        .leftJoin("departments", "services.department_id", "=", "departments.id")
        .leftJoin("clients", "departments.client_id", "=", "clients.id")
        .from("services")
        .where({"services.deleted_at": null, "departments.deleted_at": null})
        .modify(builder => {
            if (id) builder.where({"services.id": id});
        });
    if (!service && id) return Promise.reject(Boom.notFound(`"${id}" could not be found`));
    return service;
};

exports.updateService = async ({id: service_id}, body) => {
    const {machine_id, ...rest} = body;
    await connection
        .from("revisions")
        .where({service_id, machine_id})
        .update({...rest});
    await connection.from("services").where({id: service_id}).update({updated_at: new Date().toISOString()});
    return this.fetchService({service_id});
};
