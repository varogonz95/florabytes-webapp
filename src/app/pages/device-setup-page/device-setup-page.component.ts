import { Component, OnInit } from '@angular/core';

const ServiceGuid = "0742a8ea-396a-4947-9962-f2fab085854a";
const WriteCharacteristicGuid = "0742a8ea-396a-4947-9962-f2fab085854f";

interface DeviceInfo {
    DeviceName: string;
    Ssid: string
    Password?: string
}

enum SetupSteps {
    ScanDevices,
    ConnectDevice,
    NetworkSetup,
    Completed,
    AdapterUnavailable,
}

@Component({
    selector: 'app-device-setup-page',
    templateUrl: './device-setup-page.component.html',
    styleUrl: './device-setup-page.component.css',
})
export class DeviceSetupPage implements OnInit {
    public connectingDevice = false;
    // public step = SetupSteps.ScanDevices;
    public stepsSequence = [SetupSteps.ScanDevices];
    public SetupSteps = SetupSteps;
    public deviceInfo: DeviceInfo;

    private gattCharacteristic: BluetoothRemoteGATTCharacteristic = null!;

    constructor() {
        this.deviceInfo = { DeviceName: '', Ssid: '' };
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

    public scanAndPairDevice() {
        this.connectingDevice = true;

        navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [ServiceGuid, WriteCharacteristicGuid]
        })
            .then(device => {
                this.deviceInfo.DeviceName = device.name ?? device.id
                return device.gatt?.connect() ?? Promise.reject(new Error("GATT Server not available."))
            })
            .then(gattServer => {
                return new Promise((resolve, reject) => {
                    const maxRetries = 10;
                    let retryCount = 0;
                    const intervalId = setInterval(async () => {
                        gattServer.getPrimaryService(ServiceGuid)
                            .then(x => {
                                clearInterval(intervalId);
                                return resolve(x);
                            })
                            .catch(err => {
                                console.log(`Could not connect to primary service. Retry ${retryCount} of ${maxRetries}...`);
                                if (++retryCount >= maxRetries) {
                                    clearInterval(intervalId);
                                    return reject(new Error("Could not get primary service."));
                                }
                            });
                    }, 3000);
                }) as Promise<BluetoothRemoteGATTService>
            })
            .then(gattService => gattService.getCharacteristic(WriteCharacteristicGuid))
            .then(gattCharacteristic => this.gattCharacteristic = gattCharacteristic)
            .then(() => {
                this.stepsSequence.unshift(SetupSteps.NetworkSetup);
            })
            .catch(reason => {
                console.log(reason);
            })
            .finally(() => {
                this.connectingDevice = false;
            });
    }

    public async submitWifiCredentials() {
        // if (!this.gattCharacteristic)
        //     throw new Error("GATT Write Characteristic cannot be null.");

        const wifiCredentials = JSON.stringify(this.deviceInfo);
        const buffer = Buffer.from(wifiCredentials);
        await this.gattCharacteristic.writeValueWithoutResponse(buffer);

        this.stepsSequence.unshift(SetupSteps.Completed);

        console.log(this.stepsSequence);
    }

    public goBack() {
        this.stepsSequence.shift();
    }
}
