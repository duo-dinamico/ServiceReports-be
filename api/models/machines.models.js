const Boom = require("@hapi/boom");

const connection = require("../db/psql/connection");

const columnSelection = [
    "machines.id",
    "machines.manufacturer",
    "machines.model",
    "machines.serial_number",
    "machines.created_at",
    "machines.updated_at",
    "machines.deleted_at",
];

exports.fetchAllMachines = async ({sort_by, order, machine_id, manufacturer, model}) => {
    const machines = await connection
        .select(
            ...columnSelection,
            connection.raw(
                "json_build_object('id',departments.id,'name',departments.name, 'casino', casinos.name) as department"
            )
        )
        .leftJoin("departments", "machines.department_id", "=", "departments.id")
        .leftJoin("casinos", "departments.casino_id", "=", "casinos.id")
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

exports.fetchMachine = async ({id}, model, serial_number) => {
    const [machine] = await connection
        .select(
            ...columnSelection,
            connection.raw(
                "json_build_object('id',departments.id,'name',departments.name, 'casino', casinos.name) as department"
            )
        )
        .leftJoin("departments", "machines.department_id", "=", "departments.id")
        .leftJoin("casinos", "departments.casino_id", "=", "casinos.id")
        .from("machines")
        .where({"machines.deleted_at": null, "departments.deleted_at": null})
        .modify(builder => {
            if (id) builder.where({"machines.id": id});
            if (serial_number && model)
                builder.where({"machines.model": model, "machines.serial_number": serial_number});
        });
    if (!machine && id) return Promise.reject(Boom.notFound(`"${id}" could not be found`));
    return machine;
};

exports.updateMachine = async ({id}, body) => {
    await connection
        .from("machines")
        .where({id})
        .update({...body, updated_at: new Date().toISOString()});
    return this.fetchMachine({id});
};

exports.removeMachine = async ({id}) => {
    await connection.from("machines").where({id}).update({deleted_at: new Date().toISOString()});
};

exports.addMachine = async body => {
    const [machine] = await connection
        .from("machines")
        .insert({...body, created_at: new Date().toISOString()})
        .returning("machines.id");
    return this.fetchMachine({id: machine.id});
};
