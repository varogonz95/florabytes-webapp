import { Component } from '@angular/core';

const BTServiceGUUID = "0742a8ea-396a-4947-9962-f2fab085854a";
const BTReadStaticCharUUID = "0742a8ea-396a-4947-9962-f2fab085854f";
const MaxRetries = 10;

@Component({
    selector: 'app-add-device-page',
    templateUrl: './add-device-page.component.html',
    styleUrl: './add-device-page.component.css'
})
export class AddDevicePage {

    public selectedPort: SerialPort = null!;

    constructor() {
        navigator.serial.onconnect = (evt) => console.log(evt)
    }

    public async selectSerialPort() {
        try {
            const ports = await navigator.serial.getPorts();
            console.log('Ports: ', ports);

            if (ports.length > 0) {
                ports.forEach(async port => await port.forget())
            }

            this.selectedPort = await navigator.serial.requestPort();
            this.selectedPort.onconnect = (evt) => console.log('Connected!', evt);

            await this.selectedPort.open({
                baudRate: 115200,
                dataBits: 8,
                stopBits: 1,
                parity: 'none',
                flowControl: 'hardware',
            });

            const info = this.selectedPort.getInfo();
            console.log('Serial port Info:', info);
        }
        catch (error) {
            console.error('Error:', error)
        }
    }

    public async scanBluetooth() {
        const btAvailable = await navigator.bluetooth.getAvailability();

        if (!btAvailable) {
            alert("Bluetooth is not available");
            return;
        }

        let btDevice: BluetoothDevice = null!;

        try {
            btDevice = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                // filters: [{ services: [BTServiceGUUID] }],
                optionalServices: [BTServiceGUUID, BTReadStaticCharUUID]
            });
            console.log(btDevice);

            if (!btDevice.gatt) {
                throw Error("GATT Server is null");
            }

            console.log("Connecting...");
            const gatt = await btDevice.gatt.connect();
            console.log("Connected.")

            console.log("Getting primary service:", BTServiceGUUID);

            let service: BluetoothRemoteGATTService = null!;
            let retries = 0;
            while (++retries <= MaxRetries && service === null) {
                try {
                    service = await gatt.getPrimaryService(BTServiceGUUID);
                    console.log("Primary service: ", service);
                }
                catch (error) {
                    console.error(error);
                    console.log("Retrying service retrieval...");
                    await gatt.connect();
                    continue;
                }
            }

            if (!service) throw Error("Could not get GATT Primary Service")

            const characteristic = await service.getCharacteristic(BTReadStaticCharUUID);
            console.log(characteristic);

            console.log("Sending Wifi credentials to device");
            const ssid = prompt("Wifi SSID");
            const pwd = prompt("Wifi Password");
            const wifiCreds = JSON.stringify({ ssid, pwd });
            const buffer = Buffer.from(wifiCreds, 'utf8');
            console.log("Buffer length:", buffer.length);
            await characteristic.writeValueWithoutResponse(buffer);
        }
        catch (error) {
            console.log(error);
        }
    }

    public async sendData() {
        const writable = this.selectedPort.writable;
        const writer = writable?.getWriter();

        if (!writer) {
            throw Error("SerialWriter is null");
        }

        console.log('Sending data...')
        await writer.write(Buffer.from("Hello world!"));
        writer.releaseLock();
        console.log('Data sent!');
    }

    public async forgetDevice() {
        await this.selectedPort.close();
        await this.selectedPort.forget();
        this.selectedPort = null!;
    }
}
