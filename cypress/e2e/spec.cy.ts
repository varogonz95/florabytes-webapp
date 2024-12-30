import { DeviceMock } from "web-bluetooth-mock";

const Stubs = {
    getDevice: 'getDeviceReq',
    getConnectionState: 'getConnectionStateReq',
}
type StubRef = {
    [k in keyof typeof Stubs]: `@${k}`;
};

const stubRef: StubRef = Object.keys(Stubs).map(key => ({ [key]: `@${Stubs[key]}` })).reduce((prev, curr) => ({ ...prev, ...curr })) as StubRef;
console.log(stubRef);

describe('Device setup', () => {
    beforeEach(() => {
    });

    it('should add a new device', () => {
        cy.fixture('device-setup/fixture')
            .then(fixture => {
                const { deviceInfo, wifiCredentials } = fixture;

                cy.intercept(
                    'GET', `http://localhost:5173/Device/*`,
                    {
                        statusCode: 200,
                        body: { connectionState: 'Connected' }
                    })
                    .as(Stubs.getDevice);

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

                cy.wait(stubRef.getDevice);
            });

    });
});

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
