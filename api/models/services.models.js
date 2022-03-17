const connection = require("../db/psql/connection");

exports.fetchAllServices = async ({sort_by, order, department_id, user_id, created_by, closed_by}) => {
    const services = await connection
        .select(
            "services.id",
            connection.raw("json_build_object('id',users.id,'username',users.username,'name',users.name) as user"),
            connection.raw(
                "json_build_object('id',departments.id,'name',departments.name, 'client', clients.name) as department"
            ),
            "services.created_at",
            "services.updated_at",
            "services.closed_at",
            "services.deleted_at",
            "services.created_by",
            "services.updated_by",
            "services.closed_by",
            "services.deleted_by"
        )
        .leftJoin("users", "services.user_id", "=", "users.id")
        .leftJoin("departments", "services.department_id", "=", "departments.id")
        .leftJoin("clients", "departments.client_id", "=", "clients.id")
        .from("services")
        .where({"services.deleted_at": null, "departments.deleted_at": null})
        .modify(builder => {
            if (sort_by && order) builder.orderBy(sort_by, order);
            if (department_id) builder.where({"services.department_id": department_id});
            if (user_id) builder.where({"services.user_id": user_id});
            if (created_by) builder.where({"services.created_by": created_by});
            if (closed_by) builder.where({"services.closed_by": closed_by});
        });
    return services;
};
