import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription, map, retry } from 'rxjs';
import { PgotchiClientService } from '../../../../services/pgotchi-client/pgotchi-client.service';

const MaxRetries = 5;

@Component({
    selector: 'app-device-connection-step',
    templateUrl: './device-connection-step.component.html',
})
export class DeviceConnectionStepComponent implements OnDestroy {
    @Input({ required: true }) public deviceId!: string;
    
    @Output() public onClickContinue = new EventEmitter();

    public isLoading = true;

    private connectionStateSub: Subscription;

    constructor(private readonly pgotchiHttpClient: PgotchiClientService) {
        this.connectionStateSub =
            this.checkDeviceConnection()
                .subscribe(state => this.isLoading = state.toLowerCase() !== "connected");
    }

    public emitContinueClick() {
        this.onClickContinue.emit();
    }

    private checkDeviceConnection() {
        return this.pgotchiHttpClient.getDevice(this.deviceId)
            .pipe(
                map(device => device.connectionState),
                retry({ delay: 3000, count: MaxRetries, })
            );
    }

    ngOnDestroy(): void {
        this.connectionStateSub.unsubscribe();
    }
}
