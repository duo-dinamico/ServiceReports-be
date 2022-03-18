const Boom = require("@hapi/boom");

const connection = require("../db/psql/connection");

const columnSelection = ["id", "name", "location", "created_at", "updated_at", "deleted_at"];

exports.fetchAllClients = async ({sort_by, order, client_id}) => {
    const clients = await connection
        .select(columnSelection)
        .from("clients")
        .where({deleted_at: null})
        .modify(builder => {
            if (sort_by && order) builder.orderBy(sort_by, order);
            if (client_id) builder.where({id: client_id});
        });
    return clients;
};

exports.fetchClient = async ({id}, name) => {
    const [client] = await connection
        .select(columnSelection)
        .from("clients")
        .where({deleted_at: null})
        .modify(builder => {
            if (id) builder.where({id});
            if (name) builder.where({name});
        });
    if (!client && id) return Promise.reject(Boom.notFound(`"${id}" could not be found`));
    return client;
};

exports.removeClient = async ({id}) => {
    await connection.from("clients").where({id}).update({deleted_at: new Date().toISOString()});
};

exports.addClient = async body => {
    const [client] = await connection
        .from("clients")
        .insert({...body, created_at: new Date().toISOString()})
        .returning(columnSelection);
    return client;
};

exports.updateClient = async ({id}, body) => {
    const [client] = await connection
        .from("clients")
        .where({id})
        .update({...body, updated_at: new Date().toISOString()})
        .returning(columnSelection);
    return client;
};
