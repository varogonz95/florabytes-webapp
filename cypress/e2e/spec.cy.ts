import { DeviceMock } from "web-bluetooth-mock";

describe('template spec', () => {
    it('passes', () => {
        cy.fixture('device-setup/fixture').then(fixture => {
            const { deviceInfo, wifiCredentials } = fixture;

            cy.intercept('GET', `http://localhost:5173/Device/${deviceInfo.id}/connection-state`, { connectionState: 'Connected' });

            cy.visit('http://localhost:4200/devices/setup', {
                onBeforeLoad(win) {
                    cy.stub(win.navigator.bluetooth, 'getAvailability')
                        .returns(Promise.resolve(true));

                    cy.stub(win.navigator.bluetooth, 'requestDevice')
                        .returns(Promise.resolve(new DeviceMock("my-device", [0x18C1])));
                },
            });

            completeDeviceScanStep();
            completeNetworkStep(wifiCredentials);
        });

    })
})

function completeDeviceScanStep() {
    cy.get('#scan-btn').click();
}

function completeNetworkStep(wifiCredentials: any) {
    cy.get('#network-setup-form input[name=ssid]')
        .type(wifiCredentials.ssid);
    cy.get('#network-setup-form input[name=pwd]')
        .type(wifiCredentials.password);
    cy.get('#submit-credentials-btn').click();
}
