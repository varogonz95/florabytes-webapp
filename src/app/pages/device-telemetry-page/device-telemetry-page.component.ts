import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EventHubConsumerClient, Subscription as EventHubSubscription } from '@azure/event-hubs';
import { Observable, Subject, interval, map, scan } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeviceSummary, PgotchiHttpClientService } from '../../services/pgotchi-httpclient/pgotchi-http-client.service';

const MAX_RECORDS = 30;

@Component({
    selector: 'app-device-telemetry-page',
    templateUrl: './device-telemetry-page.component.html',
    styleUrl: './device-telemetry-page.component.css',
})
export class DeviceTelemetryPage implements OnInit, OnDestroy {
    @Input()
    public id: string = "";

    public device$ = new Observable<DeviceSummary>();
    public telemetryLogs$ = new Observable<SensorData[]>();
    public chartDatasets$: Observable<any>;

    private telemetrySub$ = new Subject<SensorData>();
    private readonly consumerClientSub$: EventHubSubscription;

    constructor(
        private readonly _pgotchiService: PgotchiHttpClientService) {

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

        const { negotiateEndpoint } = environment.pgotchiSignalR;
        // this.connection = new signalR.HubConnectionBuilder()
        //     .withUrl(negotiateEndpoint)
        //     .build();

        // this.connection.on("message", (...args: any[]) => {
        //     console.log("message received: ", args)
        //     var data = this.mockSensorData()
        //     this.telemetrySub$.next(data);
        // });

        // this.emitTestData();

        const { consumerGroup, connectionString, eventHubName } = environment.pgotchiIotHub.eventHub;
        const consumerClient = new EventHubConsumerClient(consumerGroup ?? "$Default", connectionString);
        this.consumerClientSub$ = consumerClient.subscribe({
            processEvents: async (events, context) => {
                console.log("Received events:")
                events.forEach(console.log);
            },
            processError: async (err, context) => {
                console.log("Process error: ", err);
            },
            processInitialize: async (context) => {
                console.log("Hello")
            }
        });
    }

    ngOnInit(): void {
        // this.connection.start()
        //     .then(() => console.log('Started connection to Device Telemetry Hub'))
        //     .catch(err => console.error('Failed connecting to Device Telemetry Hub:', err));

        this.device$ = this._pgotchiService
            .getDeviceById(this.id);
    }

    private emitTestData(inter = true) {
        if (inter)
            interval(1000)
                .subscribe(() =>
                    this.telemetrySub$.next(this.mockSensorData()))
        else
            this.telemetrySub$.next(this.mockSensorData())
    }

    private mockSensorData(): SensorData {
        return {
            $timestamp: new Date().getSeconds(),
            soilMoisture: Math.random() * 100,
            lightLevel: Math.random() * 100,
            humidity: Math.random() * 100,
        }
    }

    ngOnDestroy(): void {
        // this.connection.stop()
        this.consumerClientSub$.close()
        this.telemetrySub$.unsubscribe();
    }
}

export interface WithTimestamp {
    $timestamp: Date | string | number
}

export type SensorData = WithTimestamp | Record<string, number>