import { Component, OnInit } from '@angular/core';

const MaxRetries = 10;
const ServiceGuid = /* "0742a8ea-396a-4947-9962-f2fab085854a" */ 'hid_service';
const WriteCharacteristicGuid = "0742a8ea-396a-4947-9962-f2fab085854f";

enum SetupSteps {
    ScanDevices,
    ConnectDevice,
    NetworkSetup,
    EditDeviceInfo,
    Completed,
    AdapterUnavailable,
}

export interface DeviceInfo {
    DeviceId: string;
    DeviceName: string;
    DeviceDescription?: string;
    Ssid: string
    Password?: string
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

    private gattCharacteristic: BluetoothRemoteGATTCharacteristic = null!;

    constructor() {
        this.deviceInfo = { 
            DeviceId: '', 
            DeviceName: '',
            Ssid: '' 
        };
    }

    ngOnInit(): void {
        navigator.bluetooth.getAvailability()
            .then(isBluetoothAvailable => {
                if (!isBluetoothAvailable) {
                    this.stepsSequence = [SetupSteps.AdapterUnavailable];
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
            acceptAllDevices: true,
            optionalServices: [ServiceGuid, WriteCharacteristicGuid],
        });
    }

    private async connectToGattService(device: BluetoothDevice): Promise<BluetoothRemoteGATTService> {
        if (!device?.gatt) {
            throw new Error("GATT not available.");
        }

        let retryCount = 0;
        let gattService: BluetoothRemoteGATTService = null!;
        let gattServer: BluetoothRemoteGATTServer = null!;

        while (retryCount < MaxRetries) {
            try {
                gattServer = await device.gatt.connect();
                gattService = await gattServer.getPrimaryService(ServiceGuid);
                break;
            }
            catch (err) {
                retryCount++;
                console.log(`Could not connect to primary service. Retry ${retryCount} of ${MaxRetries}...`);
            }
        }

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
        await this.gattCharacteristic.writeValueWithoutResponse(buffer);

        this.stepsSequence.unshift(SetupSteps.EditDeviceInfo);
    }

    public async editDeviceInfo() {

    }

    public goBack() {
        this.stepsSequence.shift();
    }
}
