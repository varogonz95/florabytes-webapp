import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { APP_ENVIRONMENT } from '../../../core/providers/app-environment.provider';
import { IAppEnvironment } from '../../../environments/app-environment';
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
        private readonly httpclient: HttpClient,
        @Inject(APP_ENVIRONMENT) env: IAppEnvironment
    ) {
        this.baseAddress = env.pgotchiHttpClient.baseAddress;
    }

    public getDevices() {
        return this.httpclient
            .get(this.getDevicesUrl())
            .pipe(
                map(response => response as DeviceSummary[])
            );
    }

    public getDeviceById(deviceId: string) {
        return this.httpclient
            .get(this.getDeviceByIdUrl(deviceId))
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
                map(response => response as DeviceSummary)
            );
    }

    public async registerDevice(request: RegisterDeviceRequest) {
        return this.httpclient
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
