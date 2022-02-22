const {fetchUser} = require("../../models/users.models");

async function validateUser(id) {
    try {
        await fetchUser({id});
        return true;
    } catch (err) {
        return Promise.reject(err.output.payload);
    }
}

module.exports = {validateUser};
