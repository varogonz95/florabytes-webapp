import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceListPage } from './pages/device-list-page/device-list.component';
import { DeviceSetupPage } from './pages/device-setup-page/device-setup-page.component';
import { DeviceTelemetryPage } from './pages/device-telemetry-page/device-telemetry-page.component';
import { deviceResolver } from './resolvers/device.resolver';

export const routeParams = {
    deviceId: 'deviceId',
}

const routes: Routes = [
    { path: '', redirectTo: '/devices', pathMatch: 'full' },
    {
        path: 'devices',
        children: [
            { path: '', pathMatch: 'full', component: DeviceListPage },
            { path: 'setup', pathMatch: 'full', component: DeviceSetupPage },
            {
                path: ':deviceId/telemetry',
                component: DeviceTelemetryPage,
                resolve: { device: deviceResolver, }
            },
        ]
    },
    //{ path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        // provideRouter(routes, withComponentInputBinding()),
    ]
})
export class AppRoutingModule { }
