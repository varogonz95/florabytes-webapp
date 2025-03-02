// Angular packages
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
// Third party libraries
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
// App modules
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Components
import { DeviceSummaryCardComponent } from './components/device-summary-card/device-summary-card.component';
import { SharedComponentsModule } from './components/shared-components.module';
import { TelemetryChartStandaloneComponent } from './components/telemetry-chart/telemetry-chart-standalone.component';
// Pages
import { DeviceListPage } from './pages/device-list-page/device-list.component';
import { DeviceSetupPageModule } from './pages/device-setup-page/device-setup-page.module';
import { DeviceTelemetryPage } from './pages/device-telemetry-page/device-telemetry-page.component';
import { LoginPage } from './pages/login-page/login-page.component';
import { AssignPlantPage } from './pages/assign-plant-page/assign-plant-page.component';
import { PageNotFoundPage } from './pages/page-not-found-page/page-not-found-page.component';

const PagesModules = [
    DeviceSetupPageModule
];

const StandaloneComponents = [
    TelemetryChartStandaloneComponent
]

@NgModule({
    declarations: [
        AppComponent,
        DeviceSummaryCardComponent,

        DeviceListPage,
        DeviceTelemetryPage,
        LoginPage,
        AssignPlantPage,
        PageNotFoundPage,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        SharedComponentsModule,
        ...PagesModules,
        ...StandaloneComponents,
    ],
    providers: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideCharts(withDefaultRegisterables()),
        provideHttpClient(),
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }