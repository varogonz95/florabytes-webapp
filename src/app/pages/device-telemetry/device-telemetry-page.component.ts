import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import * as SignalR from '@microsoft/signalr';
import { Observable, Subject, map, scan } from 'rxjs';
import { DeviceSummary } from "../../models/device-summary";
import { TelemetryHubService } from '../../services/telemetry-hub/telemetry-hub.service';

const MAX_RECORDS = 30;

@Component({
    selector: 'app-device-telemetry-page',
    templateUrl: './device-telemetry-page.component.html',
    styleUrl: './device-telemetry-page.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceTelemetryPage implements OnInit, OnDestroy {
    public device!: DeviceSummary;
    public telemetryLogs$!: Observable<SensorData[]>;
    public chartDatasets$!: Observable<any>;

    private readonly telemetrySub$ = new Subject<SensorData>();
    private telemetryHubConnection!: SignalR.HubConnection;

    constructor(
        private readonly telemetryHubService: TelemetryHubService,
        private readonly activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        const routeSnapshot = this.activatedRoute.snapshot;
        this.device = routeSnapshot.data['device'];

        this.telemetryLogs$ = this.telemetrySub$
            .pipe(
                scan((acc, curr) => [...acc, curr], [] as SensorData[]),
                map(values => values.slice(-(Math.min(values.length, MAX_RECORDS))).reverse()),
            );

        this.chartDatasets$ = this.telemetrySub$
            .pipe(
                scan((acc, curr) =>
                    Object.keys(curr)
                        .filter(key => key !== "$timestamp")
                        .map((key, i) => ({
                            label: key,
                            data: [
                                ...acc[i]?.data ?? [],
                                { x: curr.$timestamp, y: (curr as any)[key] }
                            ]
                        })),
                    [] as any[]),
                map(datasets => datasets.map((dt: { data: [] }) => {
                    const data: any[] = dt.data.slice(-(Math.min(dt.data.length, MAX_RECORDS)))
                    return {
                        ...dt,
                        data,
                        options: {
                            animations: false,
                            showLine: true,
                            fill: true,
                            scales: {
                                x: {
                                    min: Math.min(...data.map(d => d.x)),
                                    max: Math.max(...data.map(d => d.x)),
                                }
                            }
                        }
                    };
                })),
            );

        this.telemetryHubConnection = this.telemetryHubService.getConnection(this.device.userId);

        this.telemetryHubConnection.on("sendTelemetry", (args) => {
            console.log("Received data:", args);
            this.telemetrySub$.next(args);
        });

        this.telemetryHubConnection.start();
    }

    ngOnDestroy(): void {
        this.telemetrySub$.unsubscribe();
        this.telemetryHubConnection.stop();
    }
}

export interface WithTimestamp {
    $timestamp: Date | string | number
}

export type SensorData = WithTimestamp | Record<string, number>