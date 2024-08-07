import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeviceInfo } from '../../device-setup-page.component';

@Component({
    selector: 'app-edit-device-info-step',
    templateUrl: './edit-device-info-step.component.html',
    styleUrl: './edit-device-info-step.component.css'
})
export class EditDeviceInfoStepComponent {
    @Input({ required: true }) public step = 0;
    @Input() public model: DeviceInfo = null!;

    @Output() public modelChange = new EventEmitter<DeviceInfo>();
    @Output() public submit = new EventEmitter();

    public newDeviceLocation?: string;

    public submitHandler() {
        this.submit.emit();
    }
}
