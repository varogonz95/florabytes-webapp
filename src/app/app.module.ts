import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DeviceSummaryCardComponent } from './components/device-summary-card/device-summary-card.component';
import { MessageComponent } from './components/message/message.component';
import { NavHeaderComponent } from './components/nav-header/nav-header.component';
import { TelemetryChartComponent } from './components/telemetry-chart/telemetry-chart.component';
import { DeviceListPage } from './pages/device-list-page/device-list.component';
// import { DeviceSetupPage } from './pages/device-setup-page/device-setup-page.component';
import { DeviceSetupPageModule } from './pages/device-setup-page/device-setup-page.module';
import { DeviceTelemetryPage } from './pages/device-telemetry-page/device-telemetry-page.component';

@NgModule({
    declarations: [
        AppComponent,
        NavHeaderComponent,
        DeviceSummaryCardComponent,
        MessageComponent,
        
        DeviceListPage,
        DeviceTelemetryPage,
        // DeviceSetupPage,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        TelemetryChartComponent,
        DeviceSetupPageModule,
    ],
    providers: [
        provideCharts(withDefaultRegisterables()),
        provideHttpClient(withInterceptorsFromDi())
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
