import { DeviceConnectionStepComponent }    from './steps/device-connection-step/device-connection-step.component';
import { PairDeviceStepComponent }         from './steps/pair-device-step/pair-device-step.component';

@NgModule({
    id: DeviceSetupPageModule.name,
    declarations: [
        DeviceSetupPage,
        ScanDevicesStepComponent,
        NetworkSetupStepComponent,
        DeviceInfoStepComponent,
        CompletedStepComponent,
        DeviceConnectionComponent,
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
