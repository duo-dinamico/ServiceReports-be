const connection = require("../db/psql/connection");

exports.fetchAllDepartments = async ({sort_by, order, department_id}) => {
    const departments = await connection
        .select(
            "departments.id",
            "departments.name",
            "departments.created_at",
            "departments.updated_at",
            "departments.deleted_at",
            connection.raw(
                "json_build_object('id',casinos.id,'name',casinos.name,'location',casinos.location) as casino"
            )
        )
        .leftJoin("casinos", "departments.casino_id", "=", "casinos.id")
        .from("departments")
        .where({"departments.deleted_at": null, "casinos.deleted_at": null})
        .modify(builder => {
            if (sort_by && order) builder.orderBy(sort_by, order);
            if (department_id) builder.where({"departments.id": department_id});
        });
    return departments;
};
