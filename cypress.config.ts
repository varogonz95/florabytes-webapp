import { defineConfig } from 'cypress'
import { environment } from './cypress/environments/e2e'

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:4200',
        env: environment,
    },
    component: {
        devServer: {
            framework: 'angular',
            bundler: 'webpack',
        },
        specPattern: '**/*.cy.ts'
    }
})