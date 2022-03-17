const Boom = require("@hapi/boom");

const connection = require("../db/psql/connection");

const columnSelection = [
    "departments.id",
    "departments.name",
    "departments.created_at",
    "departments.updated_at",
    "departments.deleted_at",
];

exports.fetchAllDepartments = async ({sort_by, order, department_id}) => {
    const departments = await connection
        .select(
            ...columnSelection,
            connection.raw(
                "json_build_object('id',clients.id,'name',clients.name,'location',clients.location) as client"
            )
        )
        .leftJoin("clients", "departments.client_id", "=", "clients.id")
        .from("departments")
        .where({"departments.deleted_at": null, "clients.deleted_at": null})
        .modify(builder => {
            if (sort_by && order) builder.orderBy(sort_by, order);
            if (department_id) builder.where({"departments.id": department_id});
        });
    return departments;
};

exports.fetchDepartment = async ({id}, name) => {
    const [department] = await connection
        .select(
            ...columnSelection,
            connection.raw(
                "json_build_object('id',clients.id,'name',clients.name,'location',clients.location) as client"
            )
        )
        .leftJoin("clients", "departments.client_id", "=", "clients.id")
        .from("departments")
        .where({"departments.deleted_at": null})
        .modify(builder => {
            if (id) builder.where({"departments.id": id});
            if (name) builder.where({"departments.name": name});
        });
    if (!department && id) return Promise.reject(Boom.notFound(`"${id}" could not be found`));
    return department;
};

exports.updateDepartment = async ({id}, body) => {
    await connection
        .from("departments")
        .where({id})
        .update({...body, updated_at: new Date().toISOString()});
    return this.fetchDepartment({id});
};

exports.removeDepartment = async ({id}) => {
    await connection.from("departments").where({id}).update({deleted_at: new Date().toISOString()});
};

exports.addDepartment = async body => {
    const [department] = await connection
        .from("departments")
        .insert({...body, created_at: new Date().toISOString()})
        .returning("departments.id");
    return this.fetchDepartment({id: department.id});
};
