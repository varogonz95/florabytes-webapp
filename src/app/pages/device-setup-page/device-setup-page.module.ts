import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceSetupPage } from './device-setup-page.component';
import { ScanDevicesStepComponent } from './steps/scan-devices-step/scan-devices-step.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NetworkSetupStepComponent } from './steps/network-setup-step/network-setup-step.component';
import { EditDeviceInfoStepComponent } from './steps/edit-device-info-step/edit-device-info-step.component';
import { provideAppEnvironment } from '../../../core/providers/app-environment.provider';
import { CompletedStepComponent } from './steps/completed-step/completed-step.component';

@NgModule({
    declarations: [
        DeviceSetupPage,
        ScanDevicesStepComponent,
        NetworkSetupStepComponent,
        EditDeviceInfoStepComponent,
        CompletedStepComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
    ],
    providers: [
        provideAppEnvironment(),
    ],
    exports: [
        DeviceSetupPage,
    ],
})
export class DeviceSetupPageModule { }
