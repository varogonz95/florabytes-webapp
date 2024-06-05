import { Component, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

export const DefaultChartOptions = {
    animation: false,
    showLine: true,
    fill: true,
}

@Component({
    standalone: true,
    selector: 'app-telemetry-chart',
    templateUrl: './telemetry-chart.component.html',
    styleUrl: './telemetry-chart.component.css',
    imports: [BaseChartDirective]
})
export class TelemetryChartComponent {
    @Input() public data: any;
    @Input() public datasets: any;
    @Input() public options: any = {};
    @Input() public type: ChartType = 'line';

    /**
     *
     */
    constructor() {
        this.options = {...this.options, ...DefaultChartOptions}
    }
}
