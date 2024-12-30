import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { APP_ENVIRONMENT } from '../../providers/app-environment.provider';
import { IAppEnvironment } from '../../providers/app-environment';
import { DeviceSummary, DeviceTwinSummary } from '../../models/device-summary';

export interface RegisterDeviceRequest {
    deviceId: string,
    properties?: Record<string, any>
}

export interface ConnectionStateResponse {
    connectionState: string;
}

@Injectable({
    providedIn: 'root',
})
export class PgotchiHttpClientService {
    public readonly baseAddress: string;
    private listDevicesUrl = () => `${this.baseAddress}/Device`;
    private getDeviceUrl = (deviceId: string) => `${this.listDevicesUrl()}/${deviceId}`;
    private getConnectionStateUrl = (deviceId: string) => `${this.baseAddress}/Device/${deviceId}/connection-state`;
    private createDeviceUrl = () => `${this.baseAddress}/Device`;

    constructor(
        private readonly httpClient: HttpClient,
        @Inject(APP_ENVIRONMENT) env: IAppEnvironment
    ) {
        this.baseAddress = env.pgotchiHttpClient.baseAddress;
    }

    public listDevices() {
        return this.httpClient
            .get(this.listDevicesUrl())
            .pipe(
                map(response => response as DeviceSummary[])
            );
    }

    public getDevice(deviceId: string) {
        return this.httpClient
            .get(this.getDeviceUrl(deviceId))
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
                map(response => response as DeviceSummary)
            );
    }

    public getConnectionState(deviceId: string) {
        return this.httpClient
            .get(this.getConnectionStateUrl(deviceId))
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
                map(response => response as ConnectionStateResponse)
            );
    }

    public createDevice(request: RegisterDeviceRequest) {
        return this.httpClient
            .post(this.createDeviceUrl(), request)
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
                map(response => response as DeviceTwinSummary)
            );
    }
}
