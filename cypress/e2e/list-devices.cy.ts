import { E2eAppEnvironment } from "../../src/app/providers/app-environment";
import fixture from "../fixtures/device-list.json";

const {pgotchiHttpClient} = Cypress.env() as E2eAppEnvironment;

describe('List devices', () => {
    beforeEach(() => {
    });
    
    it('should load the home page successfully', () => {
        cy.intercept('GET', `${pgotchiHttpClient.baseAddress}/Device`, fixture)
        .as('getDevices');

        cy.visit('/devices');

        cy.wait('@getDevices');


    });
});