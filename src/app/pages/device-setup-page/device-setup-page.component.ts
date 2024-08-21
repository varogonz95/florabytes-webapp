import { Component, Inject, OnInit } from '@angular/core';
import { APP_ENVIRONMENT } from '../../../core/providers/app-environment.provider';
import { IAppEnvironment } from '../../../core/providers/app-environment';
import { PgotchiHttpClientService, RegisterDeviceRequest } from '../../services/pgotchi-httpclient/pgotchi-http-client.service';
import { firstValueFrom } from 'rxjs';

const MaxRetries = 10;
const RetryInterval = 3000;

// Service and Characteristic UUIDs aliases can be found here:
// https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/modules/bluetooth/bluetooth_uuid.cc
const UserDataServiceUuid = /* "0742a8ea-396a-4947-9962-f2fab085854a" */ 'user_data'; // UUID: 0x181C
const UserControlPointUuid = /* "0742a8ea-396a-4947-9962-f2fab085854f" */ 'user_control_point'; // UUID: 0x2A9F

enum SetupSteps {
    ScanDevices,
    ConnectDevice,
    NetworkSetup,
    EditDeviceInfo,
    Completed,
    Error,
}

export interface WifiCredentials {
    Ssid: string
    Password?: string
}

export interface DeviceInfo extends WifiCredentials {
    DeviceId: string
    Name: string
    Description?: string
    DeviceLocation?: string
    AvatarImgUrl?: string
}

const DefaultDeviceInfo: DeviceInfo = {
    DeviceId: '',
    Name: '',
    DeviceLocation: '',
    AvatarImgUrl: 'https://placehold.co/128x128?text=No+Avatar',
    Ssid: ''
}

@Component({
    selector: 'app-device-setup-page',
    templateUrl: './device-setup-page.component.html',
    styleUrl: './device-setup-page.component.css',
})
export class DeviceSetupPage implements OnInit {
    public connectingDevice = false;
    public stepsSequence = [SetupSteps.ScanDevices];
    public SetupSteps = SetupSteps;
    public deviceInfo: DeviceInfo;

    private characteristic: BluetoothRemoteGATTCharacteristic = null!;

    constructor(
        @Inject(APP_ENVIRONMENT)
        private readonly env: IAppEnvironment,
        private readonly pgotchiHttpClient: PgotchiHttpClientService) {
        this.deviceInfo = DefaultDeviceInfo;
    }

    ngOnInit(): void {
        if (!this.env.bypassBluetoothAdapterCheck)
            navigator.bluetooth.getAvailability()
                .then(isBluetoothAvailable => {
                    if (!isBluetoothAvailable) {
                        this.stepsSequence = [SetupSteps.Error];
                    }
                })
                .catch();
    }

    public async scanAndPairDevice() {
        this.connectingDevice = true;
        try {
            const device = await this.selectDevice();
            const gattService = await this.connectToGattService(device);
            this.characteristic = await gattService.getCharacteristic(UserControlPointUuid);

            const staticValue = await this.characteristic.readValue();
            this.deviceInfo.Name = device.name ?? device.id;
            this.deviceInfo.DeviceId = Buffer.from(staticValue.buffer).toString('utf8');

            this.stepsSequence.unshift(SetupSteps.NetworkSetup);
        }
        catch (reason) {
            console.log(reason);
        }
        finally {
            this.connectingDevice = false;
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

        let retryCount = 0;
        let gattService: BluetoothRemoteGATTService = null!;
        let gattServer: BluetoothRemoteGATTServer = null!;

        await new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                if (retryCount < MaxRetries) {
                    try {
                        gattServer = await device.gatt!.connect();
                        gattService = await gattServer.getPrimaryService(UserDataServiceUuid);
                        clearInterval(intervalId);
                        resolve(gattService);
                    }
                    catch (err) {
                        retryCount++;
                        console.log(`Could not connect to primary service. Retry ${retryCount} of ${MaxRetries}...`);
                    }
                }
                else {
                    clearInterval(intervalId);
                    reject(new Error("Could not connect to GATT Server."));
                }
            }, RetryInterval);
        })

        if (!gattServer?.connected) {
            throw new Error("Could not connect to GATT Server.");
        }

        if (!gattService) {
            throw new Error(`Could not get primary service {${UserDataServiceUuid}}.`);
        }

        return gattService;
    }

    public async submitWifiCredentials() {
        if (!this.characteristic)
            throw new Error("GATT Write Characteristic cannot be null.");

        const { Ssid, Password } = this.deviceInfo
        const wifiCredentials = `Ssid:${Ssid};Password:${Password}`;
        const buffer = Buffer.from(wifiCredentials);

        await this.characteristic.writeValueWithResponse(buffer);
        this.characteristic.service.device.gatt?.disconnect();

        this.stepsSequence.unshift(SetupSteps.EditDeviceInfo);
    }

    public async submitDeviceInfo() {
        const request: RegisterDeviceRequest = {
            deviceId: this.deviceInfo.DeviceId,
            properties: {
                "name": this.deviceInfo.Name,
                "description": this.deviceInfo.Description,
                "location": this.deviceInfo.DeviceLocation,
                "avatarImgUrl": this.deviceInfo.AvatarImgUrl,
            }
        }
        const summary = await firstValueFrom(this.pgotchiHttpClient.registerDevice(request));
        console.log(summary);

        this.stepsSequence.unshift(SetupSteps.Completed);
    }

    public goBack() {
        this.stepsSequence.shift();
    }
}
