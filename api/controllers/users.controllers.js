const {fetchAllUsers} = require("../models/users.models");

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
        .then(users => res.status(200).json({users}))
        .catch(next);
};
