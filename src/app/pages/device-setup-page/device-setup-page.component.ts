import { Component, OnInit } from '@angular/core';

const ServiceGuid = "0742a8ea-396a-4947-9962-f2fab085854a";
const WriteCharacteristicGuid = "0742a8ea-396a-4947-9962-f2fab085854f";
const ReconnectionTimeout = 1000;
const MaxReconnectionTimeout = 60000;

interface WifiInfo {
    Ssid: string
    Password?: string
}

enum SetupSteps {
    ScanDevices,
    ConnectDevice,
    NetworkSetup,
    Completed,
}

@Component({
    selector: 'app-device-setup-page',
    templateUrl: './device-setup-page.component.html',
    styleUrl: './device-setup-page.component.css',
})
export class DeviceSetupPage implements OnInit {
    public deviceName = "";
    public connectingDevice = false;
    public error: Error = null!;
    public step = SetupSteps.ScanDevices;
    public SetupSteps = SetupSteps;
    public wifiInfo: WifiInfo;

    private gattCharacteristic: BluetoothRemoteGATTCharacteristic = null!;

    constructor() {
        this.wifiInfo = { Ssid: '' };
    }

    ngOnInit(): void {
    }

    public async scanAndPairDevice() {
        this.connectingDevice = true;
        
        navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [ServiceGuid, WriteCharacteristicGuid]
        })
            .then(device => {
                this.deviceName = device.name ?? device.id
                return device.gatt?.connect() ?? Promise.reject(new Error("GATT Server not available."))
            })
            .then(gattServer => gattServer.getPrimaryService(ServiceGuid))
            .then(gattService => gattService.getCharacteristic(WriteCharacteristicGuid))
            .then(gattCharacteristic => this.gattCharacteristic = gattCharacteristic)
            .then(() => {
                this.step = SetupSteps.NetworkSetup;
            })
            .catch(reason => {
                console.log(reason);
                this.error = new Error(`Could not connect to ${this.deviceName} properly. Please try again.`);
            })
            .finally(() => {
                this.connectingDevice = false;
            });
    }

    public async submitWifiCredentials() {
        if (!this.gattCharacteristic)
            throw new Error("GATT Write Characteristic cannot be null.");

        const wifiCredentials = JSON.stringify(this.wifiInfo);
        const buffer = Buffer.from(wifiCredentials);
        await this.gattCharacteristic.writeValueWithoutResponse(buffer);
    }
}
