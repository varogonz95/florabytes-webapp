import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withComponentInputBinding } from '@angular/router';
import { DeviceListPage } from './pages/device-list-page/device-list.component';
import { DeviceTelemetryPage } from './pages/device-telemetry-page/device-telemetry-page.component';
import { deviceResolver } from './resolvers/device.resolver';
import { AddDevicePage } from './pages/add-device-page/add-device-page.component';

export const routeParams = {
    deviceId: 'deviceId',
}

const routes: Routes = [
    { path: '', redirectTo: '/devices', pathMatch: 'full' },
    { path: 'devices', component: DeviceListPage },
    {
        path: 'devices/:deviceId',
        component: DeviceTelemetryPage,
        resolve: {
            device: deviceResolver,
        }
    },
    { path: 'add-device', component: AddDevicePage },
    //{ path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        provideRouter(routes, withComponentInputBinding()),
    ]
})
export class AppRoutingModule { }
