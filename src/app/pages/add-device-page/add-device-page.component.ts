import { Component } from '@angular/core';
import { buffer } from 'rxjs';

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
