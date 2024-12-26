import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { IAppEnvironment } from '../../../../providers/app-environment';
import { APP_ENVIRONMENT } from '../../../../providers/app-environment.provider';
import { DeviceInfo } from '../../device-setup-page.component';

@Component({
    selector: 'app-pair-device-step',
    templateUrl: './pair-device-step.component.html',
})
export class PairDeviceStepComponent {
    @Input() public isConnecting = false;
    @Input() public isPairing = false;
    @Input() public retryCount: number = 0;
    @Input({required: true}) public device: DeviceInfo = null!;

    @Output() public requestScan = new EventEmitter();

    public totalRetries: number;

    public requestScanHandler() {
        this.requestScan.emit();
    }

    constructor(@Inject(APP_ENVIRONMENT) env: IAppEnvironment) {
        this.totalRetries = env.maxPairingRetries ?? -1;
    }
}
