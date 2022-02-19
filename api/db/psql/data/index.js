const ENV = process.env.NODE_ENV === "test" ? "test" : "development";

const test = require("./test");

const data = {test};

module.exports = data[ENV];
