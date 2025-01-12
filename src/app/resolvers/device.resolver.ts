import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { routeParams } from '../app-routing.module';
import { DeviceSummary } from '../models/device-summary';
import { PgotchiClientService } from '../services/pgotchi-client/pgotchi-client.service';

export const deviceResolverFn: ResolveFn<DeviceSummary> = (route, _state) => {
    const pgotchiHttpClient = inject(PgotchiClientService);
    const router = inject(Router);
    const deviceId = route.paramMap.get(routeParams.deviceId);

    console.log('Device ID:', deviceId);

    return deviceId ? pgotchiHttpClient.getDevice(deviceId) : new RedirectCommand(router.createUrlTree(['/devices']));
};

export const deviceResolver = {
    device: deviceResolverFn,
}