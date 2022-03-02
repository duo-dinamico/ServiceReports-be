const Boom = require("@hapi/boom");
const {fetchUser} = require("../../models/users.models");
const {fetchCasino} = require("../../models/casinos.models");

async function validateUserById(id) {
    try {
        await fetchUser({id});
        return true;
    } catch (err) {
        return Promise.reject(err.output.payload);
    }
}

async function validateUserByUsername(username) {
    try {
        const user = await fetchUser({}, username);
        if (user) return Promise.reject(Boom.badRequest(`"${username}" already exists`).output.payload);
        return true;
    } catch (err) {
        return Promise.reject(err.output.payload);
    }
}

async function validateCasinoById(id) {
    try {
        await fetchCasino({id});
        return true;
    } catch (err) {
        return Promise.reject(err.output.payload);
    }
}

module.exports = {validateUserById, validateUserByUsername, validateCasinoById};
