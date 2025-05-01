export interface IAppEnvironment {
    maxPairingRetries?: number,
    bypassBluetoothAdapterCheck?: boolean,
    simulateMobileUserAgent?: boolean,
    firebase: {
        apiKey: string,
        authDomain: string,
        projectId: string,
        storageBucket: string,
        messagingSenderId: string,
        appId: string,
    }
    imageProvider?: {
        baseUrl: string,
        getCollectionsQueryParams?: Record<string, any>
    },
    pgotchiFuncClient: {
        baseAddress: string,
        apiKey?: string
    }
    pgotchiHttpClient: {
        baseAddress: string,
    },
    iotHub: {
        hostName: string,
        port: number,
        eventHub: {
            consumerGroup: string,
            eventHubName: string
            connectionString: string,
        }
    },
    pgotchiSignalR?: {
        negotiateEndpoint: string,
    },
}

export interface E2eAppEnvironment extends IAppEnvironment {
    stubRequests: boolean;
}
