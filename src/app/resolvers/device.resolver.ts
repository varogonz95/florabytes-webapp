import { ResolveFn } from '@angular/router';
import { DeviceSummary } from '../models/device-summary';
import { routeParams } from '../app-routing.module';
import { inject } from '@angular/core';
import { PgotchiHttpClientService } from '../services/pgotchi-httpclient/pgotchi-http-client.service';

export const deviceResolver: ResolveFn<DeviceSummary> = (route, _state) => {
    const deviceId = route.paramMap.get(routeParams.deviceId)!;
    const pgotchiHttpClient = inject(PgotchiHttpClientService);
    return pgotchiHttpClient.getDeviceId(deviceId)
};
