const connection = require("../db/psql/connection");

exports.fetchAllUsers = async () => {
    const users = await connection
        .select("id", "username", "name", "created_at", "updated_at", "deleted_at")
        .from("users");

    return users;
};
