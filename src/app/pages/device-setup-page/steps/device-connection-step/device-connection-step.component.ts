import { Component, Input } from '@angular/core';
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

    constructor(private readonly pgotchiHttpClient: PgotchiHttpClientService) {
        this.connectionState$ = this.checkDeviceConnection();
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
