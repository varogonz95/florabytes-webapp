import { Component, OnInit } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { DeviceTwinSummary } from '../../models/device-summary';
import { PgotchiClientService } from '../../services/pgotchi-client/pgotchi-client.service';

@Component({
    selector: 'app-device-list',
    templateUrl: './device-list.component.html',
})
export class DeviceListPage implements OnInit {

    public loading = true;
    public errors: Error[] = [];
    public $devices = new Observable<DeviceTwinSummary[]>();

    constructor(private readonly _pgotchiService: PgotchiClientService) {
    }

    ngOnInit(): void {
        this.fetchDevices();
    }

    private fetchDevices() {
        this.$devices = this._pgotchiService
            .listDevices()
            .pipe(
                catchError((error, _caught) => {
                    this.errors.push(error);
                    return throwError(() => error);
                }),
                finalize(() => this.loading = false));
    }

    public closeError() {
        console.log('Closing error message')
    }

    public reload() {
        this.loading = true;
        this.fetchDevices();
    }
}
