import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getDefaultPlantInfo } from '../../models/plant-info';
import { IAppEnvironment } from '../../providers/app-environment';
import { APP_ENVIRONMENT } from '../../providers/app-environment.provider';

// Service and Characteristic UUIDs aliases can be found here:
// https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/modules/bluetooth/bluetooth_uuid.cc
const UserDataServiceUuid = /* "0742a8ea-396a-4947-9962-f2fab085854a" */ 'user_data'; // UUID: 0x181C
const UserControlPointUuid = /* "0742a8ea-396a-4947-9962-f2fab085854f" */ 'user_control_point'; // UUID: 0x2A9F
const MaxRetries = 10;

enum SetupSteps {
    ScanDevices,
    ConnectDevice,
    NetworkSetup,
    WaitingConnection,
    SetupCompleted,
    Error,
}

export interface WifiCredentials {
    ssid: string
    password?: string
}

const DefaultWifiCredentials: WifiCredentials = {
    ssid: '',
    password: '',
}

@Component({
    selector: 'app-device-setup-page',
    templateUrl: './device-setup-page.component.html',
})
export class DeviceSetupPage implements OnInit {
    public SetupSteps = SetupSteps;
    public plantInfo = getDefaultPlantInfo();
    public wifiCredentials = DefaultWifiCredentials;

    public isPairing$ = new BehaviorSubject(false);
    public stepsSequence$ = new BehaviorSubject(SetupSteps.ScanDevices);

    public connectionFailedError?: Error;
    public retryCount = 0;

    private characteristic: BluetoothRemoteGATTCharacteristic = null!;

    constructor(
        @Inject(APP_ENVIRONMENT)
        private readonly env: IAppEnvironment) { }

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
            this.isPairing$.next(false);
            
            // Connect to the selected device
            const gattService = await this.connectToGattService(bleDevice);
            const characteristic = await gattService.getCharacteristic(UserControlPointUuid);
            const staticValue = await characteristic.readValue();
            const deviceId = Buffer.from(staticValue.buffer).toString('utf8');
            console.log(deviceId);

            this.plantInfo.deviceId = deviceId;
            this.plantInfo.name = bleDevice.name ?? bleDevice.id;
            this.characteristic = characteristic;

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

        const wifiCredentials = JSON.stringify(this.wifiCredentials);
        const buffer = Buffer.from(wifiCredentials);
        await this.characteristic.writeValue(buffer);

        this.stepsSequence$.next(SetupSteps.WaitingConnection);
    }
}
