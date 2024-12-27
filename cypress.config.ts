import { defineConfig } from "cypress";
import { DeviceMock, WebBluetoothMock } from "web-bluetooth-mock";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
        },
    },
});