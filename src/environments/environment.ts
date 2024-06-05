export const environment = {
    pgotchiHttpClient: {
        baseAddress: "http://localhost:5173",
    },
    pgotchiIotHub: {
        hostName: "pgotchi-dev-east-iothub.azure-devices.net",
        port: 8883,
        eventHub: {
            consumerGroup: "webclients",
            eventHubName: "",
            connectionString: "",
        }
    },
    pgotchiSignalR: {
        negotiateEndpoint: "https://pgotchi-dev-east.service.signalr.net/api",
    },
};
