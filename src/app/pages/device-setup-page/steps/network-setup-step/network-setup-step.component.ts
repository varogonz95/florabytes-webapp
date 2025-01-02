import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WifiCredentials } from '../../device-setup-page.component';

@Component({
    selector: 'app-network-setup-step',
    templateUrl: './network-setup-step.component.html',
})
export class NetworkSetupStepComponent {
    @Input()
    public wifi: WifiCredentials = null!;

    @Output()
    public modelChange = new EventEmitter<WifiCredentials>();

    @Output()
    public submit = new EventEmitter();

    public submitHandler() {
        this.submit.emit();
    }
}
