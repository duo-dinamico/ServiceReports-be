const connection = require("../db/psql/connection");

exports.fetchAllUsers = async ({sort_by, order}) => {
    const users = await connection
        .select("id", "username", "name", "created_at", "updated_at", "deleted_at")
        .from("users")
        .where({deleted_at: null})
        .modify(builder => {
            if (sort_by && order) builder.orderBy(sort_by, order);
        });
    return users;
};
