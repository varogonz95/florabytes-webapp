import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-device-summary-card',
    templateUrl: './device-summary-card.component.html',
    styleUrl: './device-summary-card.component.css'
})
export class DeviceSummaryCardComponent {
    @Input({}) public connectionState?: string = "Unknown";
    @Input() public deviceId?: string;
    @Input() public imgUrl?: string;
    @Input() public lastActivityTime?: string;
    @Input() public status?: string = "Unknown";
    @Input() public useSkeleton = false;

    public resolveConnectionStateClass(connectionState = "Unknown"): string {
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
