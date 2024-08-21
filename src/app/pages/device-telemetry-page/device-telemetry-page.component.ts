import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import * as signalR from "@microsoft/signalr";
import { Observable, Subject, map, scan } from 'rxjs';
import { IAppEnvironment } from '../../../core/providers/app-environment';
import { APP_ENVIRONMENT } from '../../../core/providers/app-environment.provider';
import { DeviceSummary } from "../../models/device-summary";

const MAX_RECORDS = 30;

@Component({
    selector: 'app-device-telemetry-page',
    templateUrl: './device-telemetry-page.component.html',
    styleUrl: './device-telemetry-page.component.css',
})
export class DeviceTelemetryPage implements OnInit, OnDestroy {
    public deviceSummary!: DeviceSummary;
    public telemetryLogs$!: Observable<SensorData[]>;
    public chartDatasets$!: Observable<any>;

    private signalRHubConnection!: signalR.HubConnection
    private readonly telemetrySub$ = new Subject<SensorData>();

    constructor(
        @Inject(APP_ENVIRONMENT)
        private readonly env: IAppEnvironment,
        private readonly _activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        const routeSnapshot = this._activatedRoute.snapshot;
        this.deviceSummary = routeSnapshot.data['device'];

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

        const { negotiateEndpoint } = this.env.pgotchiSignalR;

        this.signalRHubConnection = new signalR.HubConnectionBuilder()
            .withUrl(negotiateEndpoint, {
                headers: { 'x-user-id': this.deviceSummary.userId },
                transport: signalR.HttpTransportType.WebSockets,
            })
            .build();

        this.signalRHubConnection.on("newMessage", data => {
            console.log(data);
            data.$timestamp = new Date().getSeconds();
            this.telemetrySub$.next(data);
        })

        this.signalRHubConnection
            .start()
            .then(() => console.log("SignalR connection started"))
            .catch(err => console.error("SignalR connection failed.", err));
    }

    ngOnDestroy(): void {
        this.signalRHubConnection
            .stop()
            .then(() => console.log("SignalR connection stopped"))

        this.telemetrySub$.unsubscribe();
    }
}

export interface WithTimestamp {
    $timestamp: Date | string | number
}

export type SensorData = WithTimestamp | Record<string, number>