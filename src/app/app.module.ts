import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DeviceSummaryCardComponent } from './components/device-summary-card/device-summary-card.component';
import { MessageComponent } from './components/message/message.component';
import { NavHeaderComponent } from './components/nav-header/nav-header.component';
import { TelemetryChartStandaloneComponent } from './components/telemetry-chart/telemetry-chart-standalone.component';
import { DeviceListPage } from './pages/device-list-page/device-list.component';
import { DeviceSetupPageModule } from './pages/device-setup-page/device-setup-page.module';
import { DeviceTelemetryPage } from './pages/device-telemetry-page/device-telemetry-page.component';

const PagesModules = [
    DeviceSetupPageModule
];

const StandaloneComponents = [
    TelemetryChartStandaloneComponent
]

@NgModule({
    declarations: [
        AppComponent,
        NavHeaderComponent,
        DeviceSummaryCardComponent,
        MessageComponent,

        DeviceListPage,
        DeviceTelemetryPage,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ...PagesModules,
        ...StandaloneComponents,
    ],
    providers: [
        provideCharts(withDefaultRegisterables()),
        provideHttpClient(),
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }