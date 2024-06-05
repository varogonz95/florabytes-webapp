import { Component, OnInit } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { DeviceSummary, PgotchiHttpClientService } from '../../services/pgotchi-httpclient/pgotchi-http-client.service';

@Component({
    selector: 'app-device-list',
    templateUrl: './device-list.component.html',
    styleUrl: './device-list.component.css'
})
export class DeviceListPage implements OnInit {

    public loading = true;
    public errors: Error[] = [];
    public $devices = new Observable<DeviceSummary[]>();

    constructor(private readonly _pgotchiService: PgotchiHttpClientService) {
    }

    ngOnInit(): void {
        this.$devices = this._pgotchiService
            .getDevices()
            .pipe(
                catchError((error, caught) => {
                    this.errors.push(error);
                    return throwError(() => error)
                }),
                finalize(() => this.loading = false));
    }

    public closeError() {
        console.log('Closing error message')
    }

    public reload() {
        window.location.reload()
    }
}
