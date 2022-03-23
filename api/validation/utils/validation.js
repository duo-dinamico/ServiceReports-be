const Boom = require("@hapi/boom");
const {fetchUser} = require("../../models/users.models");
const {fetchClient} = require("../../models/clients.models");
const {fetchDepartment} = require("../../models/departments.models");
const {fetchMachine} = require("../../models/machines.models");
const {fetchService} = require("../../models/services.models");

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

async function validateMachineById(id) {
    try {
        await fetchMachine({id});
        return true;
    } catch (err) {
        return Promise.reject(err.output.payload);
    }
}

async function validateMachineByManufacturer(body) {
    const {model, serial_number} = body;
    const machine = await fetchMachine({}, model, serial_number);
    if (machine)
        return Promise.reject(
            Boom.badRequest(`Machine ${model} with serial number ${serial_number} already exists`).output.payload
        );
    return true;
}

async function validateServiceById(id) {
    try {
        await fetchService({id});
        return true;
    } catch (err) {
        return Promise.reject(err.output.payload);
    }
}

module.exports = {
    validateUserById,
    validateUserByUsername,
    validateClientById,
    validateClientByName,
    validateDepartmentByName,
    validateDepartmentById,
    validateMachineByManufacturer,
    validateMachineById,
    validateServiceById,
};
