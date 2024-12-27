import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, firstValueFrom, of } from 'rxjs';
import { IAppEnvironment } from '../../providers/app-environment';
import { APP_ENVIRONMENT } from '../../providers/app-environment.provider';
import { PgotchiHttpClientService, RegisterDeviceRequest } from '../../services/pgotchi-httpclient/pgotchi-http-client.service';
// import { TelemetryHubService } from '../../services/telemetry-hub/telemetry-hub.service';

const MaxRetries = 10;

// Service and Characteristic UUIDs aliases can be found here:
// https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/modules/bluetooth/bluetooth_uuid.cc
const UserDataServiceUuid = /* "0742a8ea-396a-4947-9962-f2fab085854a" */ 'user_data'; // UUID: 0x181C
const UserControlPointUuid = /* "0742a8ea-396a-4947-9962-f2fab085854f" */ 'user_control_point'; // UUID: 0x2A9F

enum SetupSteps {
    ScanDevices,
    ConnectDevice,
    NetworkSetup,
    WaitingConnection,
    EditDeviceInfo,
    Completed,
    Error,
}

export interface WifiCredentials {
    Ssid: string
    Password?: string
}

export interface DeviceInfo {
    Id: string
    Name: string
    Description?: string
    DeviceLocation?: string
    AvatarImgUrl?: string
}

export class DeviceInfoClass implements DeviceInfo {
    Id: string;
    Name: string;
    Description?: string | undefined;
    DeviceLocation?: string | undefined;
    AvatarImgUrl?: string | undefined;

    constructor()
    constructor(id: string, name: string)
    constructor(id?: string, name?: string) {
        this.Id = id ?? '';
        this.Name = name ?? '';
    }

    public toObservable(): Observable<DeviceInfo> {
        return of(this);
    }
}

const DefaultDeviceInfo: DeviceInfo = {
    Id: '',
    Name: '',
    DeviceLocation: '',
    AvatarImgUrl: 'https://placehold.co/128x128?text=No+Avatar',
}

const DefaultWifiCredentials: WifiCredentials = {
    Ssid: '',
    Password: '',
}

@Component({
    selector: 'app-device-setup-page',
    templateUrl: './device-setup-page.component.html',
    styleUrl: './device-setup-page.component.css',
})
export class DeviceSetupPage implements OnInit {
    public SetupSteps = SetupSteps;
    public deviceInfo = DefaultDeviceInfo;
    public wifiCredentials = DefaultWifiCredentials;
    
    public isPairing$ = new BehaviorSubject(false);
    public stepsSequence$ = new BehaviorSubject(SetupSteps.ScanDevices);
    
    public connectionFailedError?: Error;
    public retryCount = 0;

    private characteristic: BluetoothRemoteGATTCharacteristic = null!;
    private readonly deviceInfoChanges$ = new Subject<Partial<DeviceInfo>>();

    constructor(
        @Inject(APP_ENVIRONMENT)
        private readonly env: IAppEnvironment,
        private readonly pgotchiHttpClient: PgotchiHttpClientService) {

        this.deviceInfoChanges$
            .subscribe(changes =>
                Object.keys(changes)
                    .forEach(key => this.deviceInfo[key] = changes[key]));
    }

    ngOnInit(): void {
        if (!this.env.bypassBluetoothAdapterCheck)
            navigator.bluetooth.getAvailability()
                .then(isBluetoothAvailable => {
                    if (!isBluetoothAvailable) {
                        this.stepsSequence$.next(SetupSteps.Error);
                    }
                })
                .catch();
    }

    public async scanAndPairDevice() {
        try {
            // Start scanning for FloraByte devices
            this.isPairing$.next(true);
            const bleDevice = await this.selectDevice();

            // Once found and selected, then set values accordingly
            this.deviceInfoChanges$.next({ Name: bleDevice.name ?? bleDevice.id });
            this.isPairing$.next(false);

            const gattService = await this.connectToGattService(bleDevice);
            this.characteristic = await gattService.getCharacteristic(UserControlPointUuid);

            const staticValue = await this.characteristic.readValue();
            const deviceId = Buffer.from(staticValue.buffer).toString('utf8');
            this.deviceInfoChanges$.next({ Id: deviceId });

            this.stepsSequence$.next(SetupSteps.NetworkSetup);
        }
        catch (reason) {
            console.log(reason);
        }
        finally {
            this.isPairing$.next(false);
        }
    }

    private async selectDevice() {
        let options: RequestDeviceOptions;
        if (this.env.simulateMobileUserAgent) {
            options = {
                acceptAllDevices: true,
                optionalServices: [UserDataServiceUuid],
            }
        }
        else {
            options = {
                filters: [{ services: [UserDataServiceUuid] }]
            }
        }
        return await navigator.bluetooth.requestDevice(options);
    }

    private async connectToGattService(device: BluetoothDevice): Promise<BluetoothRemoteGATTService> {
        if (!device?.gatt)
            throw new Error("GATT not available.");

        this.retryCount = 0;

        while (true) {
            if (this.retryCount < MaxRetries) {
                try {
                    const gattServer = await device.gatt!.connect();
                    console.log(gattServer);
                    const gattService = await gattServer.getPrimaryService(UserDataServiceUuid);
                    return gattService;
                }
                catch (err) {
                    this.retryCount++;
                    console.log(`Could not connect to primary service. Retry ${this.retryCount} of ${MaxRetries}...`);
                    console.log("Error", err);
                }
            }
            else {
                throw new Error("Could not connect to GATT Server.");
            }
        }
    }

    public async submitWifiCredentials() {
        if (!this.characteristic)
            throw new Error("GATT Write Characteristic cannot be null.");

        const { Ssid, Password } = this.wifiCredentials;
        const wifiCredentials = JSON.stringify({ Ssid, Password });
        const buffer = Buffer.from(wifiCredentials);

        await this.characteristic.writeValue(buffer);
        // this.characteristic.service.device.gatt?.disconnect();

        this.stepsSequence$.next(SetupSteps.WaitingConnection);
    }

    public async submitDeviceInfo() {
        const request: RegisterDeviceRequest = {
            deviceId: this.deviceInfo.Id,
            properties: {
                "name": this.deviceInfo.Name,
                "description": this.deviceInfo.Description,
                "location": this.deviceInfo.DeviceLocation,
                "avatarImgUrl": this.deviceInfo.AvatarImgUrl,
            }
        }
        const summary = await firstValueFrom(this.pgotchiHttpClient.createDevice(request));
        console.log(summary);

        this.stepsSequence$.next(SetupSteps.Completed);
    }

    public goBack() {
        // this.stepsSequence$.shift();
    }
}
