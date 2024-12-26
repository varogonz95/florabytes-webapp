import { CommonModule }                     from '@angular/common';
import { NgModule }                         from '@angular/core';
import { FormsModule }                      from '@angular/forms';
import { RouterModule }                     from '@angular/router';

import { SharedComponentsModule }           from '../../components/shared-components.module';
import { provideAppEnvironment }            from '../../providers/app-environment.provider';
import { ImageSelectorService }             from '../../services/image-selector/image-selector.service';

import { DeviceSetupPage }                  from './device-setup-page.component';
import { CompletedStepComponent }           from './steps/completed-step/completed-step.component';
import { DeviceConnectionStepComponent }    from './steps/device-connection-step/device-connection-step.component';
import { DeviceInfoStepComponent }          from './steps/device-info-step/device-info-step.component';
import { NetworkSetupStepComponent }        from './steps/network-setup-step/network-setup-step.component';
import { PairDeviceStepComponent }         from './steps/pair-device-step/pair-device-step.component';

@NgModule({
    declarations: [
        DeviceSetupPage,
        PairDeviceStepComponent,
        NetworkSetupStepComponent,
        DeviceInfoStepComponent,
        CompletedStepComponent,
        DeviceConnectionStepComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        SharedComponentsModule,
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
