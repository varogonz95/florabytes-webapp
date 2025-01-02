import fixture from "../fixtures/device-setup/fixture.json";
import { DeviceMock } from "web-bluetooth-mock";

const Stubs = {
    getDevice: 'getDeviceReq',
    getConnectionState: 'getConnectionStateReq',
    createDevice: 'createDeviceReq',
}
type StubRef = {
    [k in keyof typeof Stubs]: `@${k}`;
};

const stubRef: StubRef = Object.keys(Stubs).map(key => ({ [key]: `@${Stubs[key]}` })).reduce((prev, curr) => ({ ...prev, ...curr })) as StubRef;
console.log(stubRef);

context('Add new Device', () => {
    describe('Happy path', () => {
        const { deviceInfo, wifiCredentials } = fixture;

        before(() => {
            visitPage(deviceInfo);
        });

        it('should add a new device', () => {
            addInterceptors(deviceInfo);

            completeDeviceScanStep();
            completeNetworkStep(wifiCredentials);
            completeDeviceConnection();
            completeDeviceInfo(deviceInfo);
        });
    });
});

function addInterceptors(deviceInfo: any) {
    cy.intercept(
        'GET', `http://localhost:5173/Device/*`,
        {
            delay: 2000,
            statusCode: 200,
            body: deviceInfo,
        })
        .as(Stubs.getDevice);

    cy.intercept(
        'POST', `http://localhost:5173/Device`,
        { statusCode: 200, })
        .as(Stubs.createDevice);
}

function visitPage(deviceInfo: any) {
    cy.visit('http://localhost:4200/devices/setup', {
        onBeforeLoad(win) {
            cy.stub(win.navigator.bluetooth, 'getAvailability')
                .returns(Promise.resolve(true));

            cy.stub(win.navigator.bluetooth, 'requestDevice')
                .returns(Promise.resolve(new DeviceMock(deviceInfo.name, ['user_data', 'user_control_point'])));
        },
    });
}

function completeDeviceScanStep() {
    cy.get('#scan-btn').click();
}

function completeNetworkStep(wifiCredentials: any) {
    cy.get('#network-setup-form')
        .within(_ => {
            cy.get('input[name=ssid]')
                .type(wifiCredentials.ssid);
            cy.get('input[name=pwd]')
                .type(wifiCredentials.password);
            cy.root().submit();
        });
}

function completeDeviceConnection() {
    cy.wait(stubRef.getDevice);
    cy.get('[data-id=connectivity-btn]').click();
}

function completeDeviceInfo(deviceInfo: any) {
    cy.get('#device-info-form')
        .within(_ => {
            cy.get('input[name=deviceName]')
                .clear()
                .type(deviceInfo.name);
            cy.get('input[name=deviceDescription]')
                .clear()
                .type(deviceInfo.description);
            // cy.root().submit();
        })
        .wait(stubRef.createDevice);
}
