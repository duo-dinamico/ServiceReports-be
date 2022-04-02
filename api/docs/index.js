const servers = require("./servers");

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.1",
        servers,
        info: {
            version: "1.0.0",
            title: "Service Reports",
            description: "API",
            termsOfService: "http://api_url/terms/",
            contact: {
                name: "DuoDinamico",
                email: "",
                url: "",
            },
            license: {
                name: "Apache 2.0",
                url: "https://www.apache.org/licenses/LICENSE-2.0.html",
            },
        },
    },
    apis: ["./routes/*.js", "./docs/*.yaml"],
};

module.exports = swaggerOptions;
