const connection = require("../db/psql/connection");

exports.fetchAllMachines = async ({sort_by, order, machine_id, manufacturer, model}) => {
    const machines = await connection
        .select(
            "machines.id",
            "machines.manufacturer",
            "machines.model",
            "machines.serial_number",
            "machines.created_at",
            "machines.updated_at",
            "machines.deleted_at",
            connection.raw(
                "json_build_object('id',departments.id,'name',departments.name, 'client', clients.name) as department"
            )
        )
        .leftJoin("departments", "machines.department_id", "=", "departments.id")
        .leftJoin("clients", "departments.client_id", "=", "clients.id")
        .from("machines")
        .where({"machines.deleted_at": null, "departments.deleted_at": null})
        .modify(builder => {
            if (sort_by && order) builder.orderBy(sort_by, order);
            if (manufacturer) builder.where({"machines.manufacturer": manufacturer});
            if (model) builder.where({"machines.model": model});
            if (machine_id) builder.where({"machines.id": machine_id});
        });
    return machines;
};
