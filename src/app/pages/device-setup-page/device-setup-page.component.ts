import { Component, Inject, OnInit } from '@angular/core';
import { APP_ENVIRONMENT } from '../../../core/providers/app-environment.provider';
import { IAppEnvironment } from '../../../core/providers/app-environment';
import { PgotchiHttpClientService, RegisterDeviceRequest } from '../../services/pgotchi-httpclient/pgotchi-http-client.service';
import { firstValueFrom } from 'rxjs';

const MaxRetries = 10;
// Service and Characteristic UUIDs aliases can be found here:
// https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/modules/bluetooth/bluetooth_uuid.cc
const ServiceGuid = /* "0742a8ea-396a-4947-9962-f2fab085854a" */ 'user_data';
const WriteCharacteristicGuid = /* "0742a8ea-396a-4947-9962-f2fab085854f" */ 'user_control_point';

enum SetupSteps {
    ScanDevices,
    ConnectDevice,
    NetworkSetup,
    EditDeviceInfo,
    Completed,
    Error,
}

export interface DeviceInfo {
    DeviceId: string;
    DeviceName: string;
    DeviceDescription?: string;
    DeviceLocation?: string;
    AvatarImgUrl?: string;
    Ssid: string
    Password?: string
}

const DefaultDeviceInfo: DeviceInfo = {
    DeviceId: '',
    DeviceName: '',
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
    public stepsSequence = [SetupSteps.EditDeviceInfo];
    public SetupSteps = SetupSteps;
    public deviceInfo: DeviceInfo;

    private gattCharacteristic: BluetoothRemoteGATTCharacteristic = null!;

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
            this.deviceInfo.DeviceId = device.id;
            this.deviceInfo.DeviceName = device.name ?? device.id;

            const gattService = await this.connectToGattService(device);
            this.gattCharacteristic = await gattService.getCharacteristic(WriteCharacteristicGuid);
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
        return await navigator.bluetooth.requestDevice({
            // acceptAllDevices: true,
            // optionalServices: [ServiceGuid],
            filters: [{ services: [ServiceGuid] }]
        });
    }

    private async connectToGattService(device: BluetoothDevice): Promise<BluetoothRemoteGATTService> {
        if (!device?.gatt)
            throw new Error("GATT not available.");

        let retryCount = 0;
        let gattService: BluetoothRemoteGATTService = null!;
        let gattServer: BluetoothRemoteGATTServer = null!;

        const intervalId = setInterval(async () => {
            if (retryCount < MaxRetries) {
                try {
                    gattServer = await device.gatt!.connect();
                    gattService = await gattServer.getPrimaryService(ServiceGuid);
                }
                catch (err) {
                    retryCount++;
                    console.log(`Could not connect to primary service. Retry ${retryCount} of ${MaxRetries}...`);
                }
            }
            else {
                clearInterval(intervalId);
                throw new Error("Could not connect to GATT Server.");
            }
        }, 1000);

        if (!gattServer?.connected) {
            throw new Error("Could not connect to GATT Server.");
        }

        if (!gattService) {
            throw new Error(`Could not get primary service {${ServiceGuid}}.`);
        }

        return gattService;
    }

    public async submitWifiCredentials() {
        if (!this.gattCharacteristic)
            throw new Error("GATT Write Characteristic cannot be null.");

        const wifiCredentials = JSON.stringify(this.deviceInfo);
        const buffer = Buffer.from(wifiCredentials);

        await this.gattCharacteristic.writeValueWithResponse(buffer);

        this.gattCharacteristic.service.device.gatt?.disconnect();
        this.stepsSequence.unshift(SetupSteps.EditDeviceInfo);
    }

    public async submitDeviceInfo() {
        const request: RegisterDeviceRequest = {
            deviceId: this.deviceInfo.DeviceId ?? "simulated-device-002",
            properties: {
                "deviceName": this.deviceInfo.DeviceName,
                "deviceDescription": this.deviceInfo.DeviceDescription,
                "deviceLocation": this.deviceInfo.DeviceLocation,
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
