const ENV = process.env.NODE_ENV;

const test = require("./test");

const data = {test, github_actions: test, production: test};

module.exports = data[ENV];
