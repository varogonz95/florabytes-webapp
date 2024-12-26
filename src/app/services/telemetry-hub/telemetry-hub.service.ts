import { Inject } from '@angular/core';
import * as SignalR from "@microsoft/signalr";
import { IAppEnvironment } from '../../providers/app-environment';
import { APP_ENVIRONMENT } from '../../providers/app-environment.provider';
// import { Client } from "azure-iot-device";
// import { Mqtt as Protocol } from 'azure-iot-device-mqtt';
// import { Amqp as Protocol } from 'azure-iot-device-amqp';
// import { Http as Protocol } from 'azure-iot-device-Http';
// import { MqttWs as Protocol } from 'azure-iot-device-mqtt';
// import { AmqpWs as Protocol } from 'azure-iot-device-amqp';


export class TelemetryHubService {
    private readonly endpoint: string;

    constructor(@Inject(APP_ENVIRONMENT) env: IAppEnvironment) {
            this.endpoint = env.pgotchiSignalR?.negotiateEndpoint ?? "";
    }

    public getConnection(userId: string) {
        return new SignalR.HubConnectionBuilder()
            .withUrl(this.endpoint, {
                headers: { 'x-user-id': userId },
                transport: SignalR.HttpTransportType.WebSockets,
            })
            .build();
    }
}
