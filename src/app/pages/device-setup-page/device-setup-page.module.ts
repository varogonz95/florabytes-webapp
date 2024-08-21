import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideAppEnvironment } from '../../../core/providers/app-environment.provider';
import { DeviceSetupPage } from './device-setup-page.component';
import { CompletedStepComponent } from './steps/completed-step/completed-step.component';
import { DeviceInfoStepComponent } from './steps/device-info-step/device-info-step.component';
import { NetworkSetupStepComponent } from './steps/network-setup-step/network-setup-step.component';
import { ScanDevicesStepComponent } from './steps/scan-devices-step/scan-devices-step.component';
import { ImageSelectorService } from '../../services/image-selector/image-selector.service';

@NgModule({
    id: DeviceSetupPageModule.name,
    declarations: [
        DeviceSetupPage,
        ScanDevicesStepComponent,
        NetworkSetupStepComponent,
        DeviceInfoStepComponent,
        CompletedStepComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
    ],
    exports: [
        DeviceSetupPage,
    ],
    providers: [
        provideAppEnvironment(),
        ImageSelectorService,
    ],
})
export class DeviceSetupPageModule { }
