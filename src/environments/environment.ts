import { IAppEnvironment } from "../app/providers/app-environment";

export const environment: IAppEnvironment = {
    bypassBluetoothAdapterCheck: false,
    firebase: {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
    },
    pgotchiHttpClient: {
        baseAddress: "",
    },
    pgotchiFuncClient: {
        baseAddress: "",
        apiKey: "",
    },
    iotHub: {
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
    }
};
