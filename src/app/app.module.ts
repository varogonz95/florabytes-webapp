import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DeviceSummaryCardComponent } from './components/device-summary-card/device-summary-card.component';
import { NavHeaderComponent } from './components/nav-header/nav-header.component';
import { DeviceListPage } from './pages/device-list-page/device-list.component';
import { DeviceTelemetryPage } from './pages/device-telemetry-page/device-telemetry-page.component';
import { TelemetryChartComponent } from './components/telemetry-chart/telemetry-chart.component';
import { MessageComponent } from './components/message/message.component';

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
    HttpClientModule,
    TelemetryChartComponent,
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
