const { Client, logger } = require("camunda-external-task-client-js");

const config = {
    baseUrl: "http://192.168.1.196:8082/engine-rest",
    use: logger,
};

const client = new Client(config);

module.exports = client;
