const Boom = require("@hapi/boom");
const connection = require("../db/psql/connection");

exports.fetchAllUsers = async ({sort_by, order, user_id}) => {
    const users = await connection
        .select("id", "username", "name", "created_at", "updated_at", "deleted_at")
        .from("users")
        .where({deleted_at: null})
        .modify(builder => {
            if (sort_by && order) builder.orderBy(sort_by, order);
            if (user_id) builder.where({id: user_id});
        });
    return users;
};

exports.removeUser = async id => {
    const user = await connection
        .from("users")
        .where({deleted_at: null, id})
        .update("deleted_at", new Date().toISOString());
    if (user === 0) return Promise.reject(Boom.notFound(`"${id}" could not be found`));
    return user;
};

exports.fetchUser = async ({id}) => {
    const [user] = await connection
        .select("id", "username", "name", "created_at", "updated_at", "deleted_at")
        .from("users")
        .where({deleted_at: null, id});
    if (!user) return Promise.reject(Boom.notFound(`"${id}" could not be found`));
    return user;
};
