import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withComponentInputBinding } from '@angular/router';
import { DeviceListPage } from './pages/device-list-page/device-list.component';
import { DeviceTelemetryPage } from './pages/device-telemetry-page/device-telemetry-page.component';

const routes: Routes = [
    { path: 'devices/:id', component: DeviceTelemetryPage },
    { path: 'devices', component: DeviceListPage },
    { path: '', redirectTo: '/devices', pathMatch: 'full' }, // redirect to `first-component`
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
