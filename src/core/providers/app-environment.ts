export interface IAppEnvironment {
    bypassBluetoothAdapterCheck?: boolean,
    simulateMobileUserAgent?: boolean,
    imageProvider: {
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
    pgotchiIotHub: {
        hostName: string,
        port: number,
        eventHub: {
            consumerGroup: string,
            eventHubName: string
            connectionString: string,
        }
    },
    pgotchiSignalR: {
        negotiateEndpoint: string,
    },
}