import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignPlantPage } from './pages/assign-plant/assign-plant-page.component';
import { DeviceListPage } from './pages/device-list/device-list.component';
import { DeviceSetupPage } from './pages/device-setup-page/device-setup-page.component';
import { DeviceTelemetryPage } from './pages/device-telemetry/device-telemetry-page.component';
import { PageNotFoundPage } from './pages/not-found/page-not-found-page.component';
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
            {
                path: ':deviceId/telemetry',
                component: DeviceTelemetryPage,
                resolve: { ...deviceResolver, }
            },
            {
                path: ':deviceId/assign-plant',
                component: AssignPlantPage,
                resolve: { ...deviceResolver, }
            },
        ]
    },
    { path: 'device-setup', component: DeviceSetupPage },
    { path: '**', component: PageNotFoundPage },  // Wildcard route for a 404 page
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        // provideRouter(routes, withComponentInputBinding()),
    ]
})
export class AppRoutingModule { }
