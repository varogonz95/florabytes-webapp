import { Component, Input, input } from '@angular/core';
import { DeviceSummary } from '../../services/pgotchi-httpclient/pgotchi-http-client.service';

@Component({
    selector: 'app-device-summary-card',
    templateUrl: './device-summary-card.component.html',
    styleUrl: './device-summary-card.component.css'
})
export class DeviceSummaryCardComponent {
    @Input()
    public useSkeleton = false;

    @Input()
    public device: DeviceSummary = {
        connectionState: "Unknown",
        deviceETag: "",
        id: "",
        eTag: "",
        lastActivityTime: "",
        status: "Unknown",
    }

    constructor() {

    }

    public resolveConnectionStateTagClass(connectionState: string): string {
        switch (connectionState) {
            case 'Connected':
                return 'is-success';
            case 'Disconnected':
                return 'is-warning';
            default:
                return 'is-light';
        }
    }
}
