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

@Injectable({
    providedIn: 'root',
})
export class PgotchiHttpClientService {
    public readonly baseAddress: string;
    private getDevicesUrl = () => `${this.baseAddress}/Device`;
    private getDeviceByIdUrl = (deviceId: string) => `${this.getDevicesUrl()}/${deviceId}`;
    private getRegisterDeviceUrl = () => `${this.baseAddress}/Device`;

    constructor(
        private readonly httpClient: HttpClient,
        @Inject(APP_ENVIRONMENT) env: IAppEnvironment
    ) {
        this.baseAddress = env.pgotchiHttpClient.baseAddress;
    }

    public getDevices() {
        return this.httpClient
            .get(this.getDevicesUrl())
            .pipe(
                map(response => response as DeviceSummary[])
            );
    }

    public getDeviceById(deviceId: string) {
        return this.httpClient
            .get(this.getDeviceByIdUrl(deviceId))
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
                map(response => response as DeviceSummary)
            );
    }

    public registerDevice(request: RegisterDeviceRequest) {
        return this.httpClient
            .post(this.getRegisterDeviceUrl(), request)
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
                map(response => response as DeviceTwinSummary)
            );
    }
}
