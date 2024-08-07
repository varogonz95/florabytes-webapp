import { IAppEnvironment } from "./app-environment";

export const environment: IAppEnvironment = {
    bypassBluetoothAdapterCheck: false,
    pgotchiHttpClient: {
        baseAddress: "",
    },
    pgotchiFuncClient: {
        baseAddress: "",
        apiKey: "",
    },
    pgotchiIotHub: {
        hostName: "",
        port: 8883,
        eventHub: {
            consumerGroup: "webclients",
            eventHubName: "",
            connectionString: "",
        }
    },
    pgotchiSignalR: {
        negotiateEndpoint: "",
    },
};
