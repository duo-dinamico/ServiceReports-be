const connection = require("../db/psql/connection");

exports.fetchAllCasinos = async ({sort_by, order, casino_id}) => {
    const casinos = await connection
        .select("id", "name", "location", "created_at", "updated_at", "deleted_at")
        .from("casinos")
        .where({deleted_at: null})
        .modify(builder => {
            if (sort_by && order) builder.orderBy(sort_by, order);
            if (casino_id) builder.where({id: casino_id});
        });
    return casinos;
};
