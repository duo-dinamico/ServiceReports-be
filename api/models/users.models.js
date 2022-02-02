const connection = require("../db/psql/connection");

exports.fetchAllUsers = async () => {
    const users = await connection.select("id", "username", "name").from("users");

    return users;
};
