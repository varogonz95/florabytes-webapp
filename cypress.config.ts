import { defineConfig } from 'cypress'
import { environment } from './src/environments/environment.e2e'

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