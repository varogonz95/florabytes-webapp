import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { APP_ENVIRONMENT } from '../../../../../core/providers/app-environment.provider';
import { IAppEnvironment } from '../../../../../core/providers/app-environment';

@Component({
    selector: 'app-scan-devices-step',
    templateUrl: './scan-devices-step.component.html',
    styleUrl: './scan-devices-step.component.css',
})
export class ScanDevicesStepComponent {
    @Input() public isConnecting = false;
    @Input() public isScanning = false;
    @Input() public retryCount: number = 0;
    @Input({required: true}) public deviceName: string = null!;

    @Output() public requestScan = new EventEmitter();

    public totalRetries: number = -1;

    public requestScanHandler() {
        this.requestScan.emit();
    }

    constructor(@Inject(APP_ENVIRONMENT) env: IAppEnvironment) {
        this.totalRetries = env.maxPairingRetries;
    }
}
