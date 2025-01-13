import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
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

export interface UpdateDevicePropertiesRequest {
    eTag: string;
    properties: Record<string, any>;
}

function route(urlTemplate: string, ...args: string[]) {
    const env = inject(APP_ENVIRONMENT);
    if (!env) {
        throw new Error('APP_ENVIRONMENT not provided');
    }
    const baseAddress = env.pgotchiHttpClient.baseAddress;
    return `${baseAddress}/${args.reduce((prev, curr) => prev.replace('*', curr), urlTemplate)}`;
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
            .get(route(Routes.ListDevices))
            .pipe(
                map(response => response as DeviceSummary[])
            );
    }

    public getDevice(deviceId: string) {
        return this.httpClient
            .get(route(Routes.GetDevice, deviceId))
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
            .get(route(Routes.GetConnectionState, deviceId))
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
            .post(route(Routes.CreateDevice), request)
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
                map(response => response as DeviceTwinSummary)
            );
    }

    public updateDeviceProperties(deviceId: string, request: UpdateDevicePropertiesRequest) {
        return this.httpClient
            .patch(route(Routes.UpdateDevice, deviceId), request)
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
                map(response => response as DeviceTwinSummary)
            );
    }
}
