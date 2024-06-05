import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    public title = 'FloraBytes.WebApp';

    constructor(
        // private readonly _deviceListener: DeviceEventListenerService
    ) {
    }

    public ngOnInit(): void {
        // this._deviceListener.startListening()
    }
}
