import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment as env } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PgotchiHttpClientService {
    public readonly baseAddress;
    private getDevicesUrl = () => `${this.baseAddress}/Device`;
    private getDeviceByIdUrl = (deviceId: string) => `${this.getDevicesUrl()}/${deviceId}`;
    
    constructor(private readonly httpclient: HttpClient) {
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
}

export interface DeviceSummary {
    id: string
    eTag: string
    deviceETag: string
    status: string
    connectionState: string
    lastActivityTime: string
}
