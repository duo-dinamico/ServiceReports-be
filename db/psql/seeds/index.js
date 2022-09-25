const {clientsData, departmentsData, machinesData, servicesData, usersData, revisionData} = require("../data");

exports.seed = async knex => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.insert(usersData).into("users");
    await knex.insert(clientsData).into("clients");
    await knex.insert(departmentsData).into("departments");
    await knex.insert(machinesData).into("machines");
    await knex.insert(servicesData).into("services");
    return knex.insert(revisionData).into("revisions");
};
