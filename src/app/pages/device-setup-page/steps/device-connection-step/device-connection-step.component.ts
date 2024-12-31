import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, catchError, map, of, retry, startWith } from 'rxjs';
import { PgotchiHttpClientService } from '../../../../services/pgotchi-httpclient/pgotchi-http-client.service';

const MaxRetries = 5;

@Component({
    selector: 'app-device-connection-step',
    templateUrl: './device-connection-step.component.html',
    styleUrl: './device-connection-step.component.css'
})
export class DeviceConnectionStepComponent {
    
    @Input({ required: true })
    public deviceId!: string;
    public connectionState$: Observable<string>;

    @Output('onContinueClick')
    public onContinueClick$ = new EventEmitter();
    
    constructor(private readonly pgotchiHttpClient: PgotchiHttpClientService) {
        this.connectionState$ = this.checkDeviceConnection();
    }

    public emitContinueClick() {
        this.onContinueClick$.emit();
    }

    private checkDeviceConnection() {
        return this.pgotchiHttpClient.getDevice(this.deviceId)
            .pipe(
                map(device => device.connectionState),
                startWith("Checking connection..."),
                retry({ delay: 3000, count: MaxRetries, }),
                catchError(() => of("Timed out checking connection."))
            );
    }
}
