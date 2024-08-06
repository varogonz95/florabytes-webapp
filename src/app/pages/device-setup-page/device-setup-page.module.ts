import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceSetupPage } from './device-setup-page.component';
import { ScanDevicesStepComponent } from './steps/scan-devices-step/scan-devices-step.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NetworkSetupStepComponent } from './steps/network-setup-step/network-setup-step.component';
import { EditDeviceInfoStepComponent } from './steps/edit-device-info-step/edit-device-info-step.component';

@NgModule({
    declarations: [
        DeviceSetupPage,
        ScanDevicesStepComponent,
        NetworkSetupStepComponent,
        EditDeviceInfoStepComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
    ],
    exports: [
        DeviceSetupPage,
    ],
})
export class DeviceSetupPageModule { }
