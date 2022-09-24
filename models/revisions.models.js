const connection = require("../db/psql/connection");

const columnSelection = [
    "id",
    "service_id",
    "machine_id",
    "maintained",
    "repaired",
    "operational",
    "comments",
    "closed",
    "deleted_at",
];

exports.fetchAllRevisions = async service_id => {
    const revisions = await connection
        .select(...columnSelection)
        .from("revisions")
        .where({deleted_at: null, service_id});
    return revisions;
};

exports.fetchRevision = async (service_id, machine_id) => {
    const [revision] = await connection
        .select(...columnSelection)
        .from("revisions")
        .where({deleted_at: null, service_id, machine_id});
    return revision;
};
