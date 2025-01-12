import fixture from "../fixtures/device-setup/fixture.json";
import { CharacteristicMock, DeviceMock, GattMock, PrimaryServiceMock } from "web-bluetooth-mock";
import { stringToBuffer } from "../support/utils";

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
            // completeDeviceInfo(deviceInfo);
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
    cy.visit('http://localhost:4200/device-setup', {
        onBeforeLoad(win) {
            stubWebBLEApi(win, deviceInfo);
        },
    });
}

function stubWebBLEApi(win: Cypress.AUTWindow, deviceInfo: any) {
    cy.stub(win.navigator.bluetooth, 'getAvailability')
        .returns(Promise.resolve(true));

    const deviceMock = new DeviceMock(deviceInfo.name, ['user_data', 'user_control_point']);
    const gattServerMock = new GattMock(deviceMock);
    const gattServiceMock = new PrimaryServiceMock(deviceMock, 'user_data', true);
    const gattCharacteristicMock = new CharacteristicMock(gattServiceMock, 'user_control_point');
    const staticValue = stringToBuffer(deviceInfo.deviceId);

    cy.stub(win.navigator.bluetooth, 'requestDevice')
        .returns(Promise.resolve(deviceMock));

    cy.stub(deviceMock.gatt, 'connect')
        .returns(Promise.resolve(gattServerMock));

    cy.stub(gattServerMock, 'getPrimaryService')
        .returns(Promise.resolve(gattServiceMock));

    cy.stub(gattServiceMock, 'getCharacteristic')
        .returns(Promise.resolve(gattCharacteristicMock));

    cy.stub(gattCharacteristicMock, 'readValue')
        .returns(Promise.resolve(staticValue));
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
