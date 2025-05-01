import { E2eAppEnvironment } from "../../src/app/providers/app-environment";

export const environment: E2eAppEnvironment = {
    stubRequests: true,
    maxPairingRetries: 10,
    bypassBluetoothAdapterCheck: true,
    simulateMobileUserAgent: true,
    pgotchiHttpClient: {
        baseAddress: "https://localhost:7087",
    },
    pgotchiFuncClient: {
        baseAddress: "",
        apiKey: "",
    },
    iotHub: {
        hostName: "pgotchi-dev-east-iothub.azure-devices.net",
        port: 8883,
        eventHub: {
            consumerGroup: "webclients",
            eventHubName: "iothub-ehub-pgotchi-de-58513321-ab37d9755a",
            connectionString: "Endpoint=sb://ihsuprodblres054dednamespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=lRTT7wWzMUZvRPN7Bg/ooSKitU2FMexnEAIoTPOX6M4=;EntityPath=iothub-ehub-pgotchi-de-58513321-ab37d9755a",
        }
    },
    pgotchiSignalR: {
        negotiateEndpoint: "http://localhost:7071/api",
    },
};
