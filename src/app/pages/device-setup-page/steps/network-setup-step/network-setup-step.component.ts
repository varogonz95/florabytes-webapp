import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeviceInfo } from '../../device-setup-page.component';

@Component({
    selector: 'app-network-setup-step',
    templateUrl: './network-setup-step.component.html',
    styleUrl: './network-setup-step.component.css'
})
export class NetworkSetupStepComponent {
    @Input()
    public model: DeviceInfo = null!;

    @Output()
    public modelChange = new EventEmitter<DeviceInfo>();

    @Output()
    public submit = new EventEmitter();

    public submitHandler() {
        this.submit.emit();
    }
}
