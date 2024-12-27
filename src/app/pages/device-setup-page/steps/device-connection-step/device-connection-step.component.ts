import { Component, Input } from '@angular/core';
import { Observable, iif, map, of, retry, startWith, switchMap, tap, timer } from 'rxjs';
import { PgotchiHttpClientService } from '../../../../services/pgotchi-httpclient/pgotchi-http-client.service';

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
        return timer(0, 5000)
            .pipe(
                switchMap(() => this.pgotchiHttpClient.getConnectionState(this.deviceId)),
                retry({
                    delay: (error, retryCount) =>
                        iif(() => retryCount >= 10 || error.status !== 404, of(error), timer(1000))
                            .pipe(tap(() => console.log(`Retrying connection check... Retry ${retryCount} of ${10}`)))
                }),
                tap(resp => {
                    if (resp.connectionState.toLowerCase() === "connected") {
                        console.log("Device connected!");
                        // Optionally emit a value or complete the observable here
                    }
                    else {
                        console.log("Device not connected yet...");
                    }
                }),
                map(resp => resp.connectionState),
                startWith("Checking connection...")
            );
    }
}
