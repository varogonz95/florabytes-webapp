import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription, catchError, map, retry } from 'rxjs';
import { PgotchiClientService } from '../../../../services/pgotchi-client/pgotchi-client.service';

const MaxRetries = 5;

@Component({
    selector: 'app-device-connection-step',
    template: `
    <h1 class="title">{{title}}</h1>
    <button 
        class="button is-ghost"
        [ngClass]="{'is-loading': isLoading}"
        [disabled]="isLoading">
        {{btnText}}
    </button>`,
})
export class DeviceConnectionStepComponent implements OnInit, OnDestroy {
    @Input({ required: true }) public deviceId!: string;

    @Output() public onConnected = new EventEmitter();

    public btnText = " ";
    private readonly defaultTitle = "Checking device connectivity...";
    private connectionStateSub: Subscription = null!;

    public isLoading = true;
    public title = this.defaultTitle;

    constructor(private readonly pgotchiHttpClient: PgotchiClientService) {
    }
    
    ngOnInit(): void {
        this.connectionStateSub =
            this.checkDeviceConnection()
                .subscribe(state => {
                    this.isLoading = state.toLowerCase() !== "connected";
                    this.onConnected.emit();
                });
    }

    private checkDeviceConnection() {
        return this.pgotchiHttpClient.getDevice(this.deviceId)
            .pipe(
                map(device => device.connectionState),
                retry({ delay: 3000, count: MaxRetries, }),
                catchError((error, _) => {
                    this.isLoading = false;
                    this.title = "Failed to connect to device :(";
                    this.btnText = "Try again";
                    throw error;
                })
            );
    }

    ngOnDestroy(): void {
        this.connectionStateSub.unsubscribe();
    }
}
