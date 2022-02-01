const {casinosData, departmentsData, machinesData, servicesData, usersData} = require("../data");

exports.seed = async knex => {
    await knex.insert(usersData).into("users");
    await knex.insert(casinosData).into("casinos");
    await knex.insert(departmentsData).into("departments");
    await knex.insert(machinesData).into("machines");
    return knex.insert(servicesData).into("services");
};
