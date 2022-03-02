const Boom = require("@hapi/boom");
const connection = require("../db/psql/connection");

const columnSelection = ["id", "username", "name", "created_at", "updated_at", "deleted_at"];

exports.fetchAllUsers = async ({sort_by, order, user_id}) => {
    const users = await connection
        .select(columnSelection)
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

exports.fetchUser = async ({id: user_id}, username) => {
    const [user] = await connection
        .select(columnSelection)
        .from("users")
        .where({deleted_at: null})
        .modify(builder => {
            if (user_id) builder.where({id: user_id});
            if (username) builder.where({username});
        });
    if (!user && user_id) return Promise.reject(Boom.notFound(`"${user_id}" could not be found`));
    return user;
};

exports.updateUser = async (id, body) => {
    const [user] = await connection
        .from("users")
        .where({deleted_at: null, id})
        .update({...body, updated_at: new Date().toISOString()})
        .returning(columnSelection);
    return user;
};

exports.addUser = async body => {
    const [user] = await connection
        .from("users")
        .insert({...body, created_at: new Date().toISOString()})
        .returning(columnSelection);
    return user;
};
