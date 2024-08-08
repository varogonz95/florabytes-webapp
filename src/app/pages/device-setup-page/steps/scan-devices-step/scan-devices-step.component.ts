import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-scan-devices-step',
    templateUrl: './scan-devices-step.component.html',
    styleUrl: './scan-devices-step.component.css',
})
export class ScanDevicesStepComponent {
    @Output()
    public requestScan = new EventEmitter();

    @Input()
    public isConnecting = false;

    public requestScanHandler() {
        this.requestScan.emit();
    }
}
