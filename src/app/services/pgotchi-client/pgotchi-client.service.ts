import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { DeviceSummary, DeviceTwinSummary } from '../../models/device-summary';
import { IAppEnvironment } from '../../providers/app-environment';
import { APP_ENVIRONMENT } from '../../providers/app-environment.provider';

export interface RegisterDeviceRequest {
    deviceId: string,
    properties?: Record<string, any>
}

export interface ConnectionStateResponse {
    connectionState: string;
}

export interface UpdateDevicePropertiesRequest {
    eTag: string;
    properties: Record<string, any>;
}

const Routes = {
    CreateDevice: 'Device',
    GetConnectionState: 'Device/*/connection-state',
    GetDevice: 'Device/*',
    ListDevices: 'Device',
    UpdateDevice: 'Device/*',
};

@Injectable({
    providedIn: 'root',
})
export class PgotchiClientService {
    public readonly baseAddress: string;

    constructor(
        private readonly httpClient: HttpClient,
        @Inject(APP_ENVIRONMENT) env: IAppEnvironment
    ) {
        this.baseAddress = env.pgotchiHttpClient.baseAddress;
    }

    public listDevices() {
        return this.httpClient
            .get<DeviceSummary[]>(
                this.route(Routes.ListDevices));
    }

    public getDevice(deviceId: string) {
        return this.httpClient
            .get<DeviceSummary>(
                this.route(Routes.GetDevice, deviceId))
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
            );
    }

    public getConnectionState(deviceId: string) {
        return this.httpClient
            .get<ConnectionStateResponse>(
                this.route(Routes.GetConnectionState, deviceId))
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
            );
    }

    public createDevice(request: RegisterDeviceRequest) {
        return this.httpClient
            .post<DeviceTwinSummary>(
                this.route(Routes.CreateDevice), request)
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
            );
    }

    public updateDeviceProperties(deviceId: string, request: UpdateDevicePropertiesRequest) {
        return this.httpClient
            .put<DeviceTwinSummary>(
                this.route(Routes.UpdateDevice, deviceId), request)
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
            );
    }

    private route(urlTemplate: string, ...args: string[]) {
        return `${this.baseAddress}/${args.reduce((prev, curr) => prev.replace('*', curr), urlTemplate)}`;
    }
}
