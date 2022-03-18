const Boom = require("@hapi/boom");
const {fetchUser} = require("../../models/users.models");
const {fetchClient} = require("../../models/clients.models");
const {fetchDepartment} = require("../../models/departments.models");

async function validateUserById(id) {
    try {
        await fetchUser({id});
        return true;
    } catch (err) {
        return Promise.reject(err.output.payload);
    }
}

async function validateUserByUsername(username) {
    const user = await fetchUser({}, username);
    if (user) return Promise.reject(Boom.badRequest(`"${username}" already exists`).output.payload);
    return true;
}

async function validateClientById(id) {
    try {
        await fetchClient({id});
        return true;
    } catch (err) {
        return Promise.reject(err.output.payload);
    }
}

async function validateClientByName(name) {
    const client = await fetchClient({}, name);
    if (client) return Promise.reject(Boom.badRequest(`"${name}" already exists`).output.payload);
    return true;
}

async function validateDepartmentById(id) {
    try {
        await fetchDepartment({id});
        return true;
    } catch (err) {
        return Promise.reject(err.output.payload);
    }
}

async function validateDepartmentByName(name) {
    const department = await fetchDepartment({}, name);
    if (department) return Promise.reject(Boom.badRequest(`"${name}" already exists`).output.payload);
    return true;
}

module.exports = {
    validateUserById,
    validateUserByUsername,
    validateClientById,
    validateClientByName,
    validateDepartmentByName,
    validateDepartmentById,
};
