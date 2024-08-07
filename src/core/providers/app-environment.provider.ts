import { InjectionToken, EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { IAppEnvironment } from "../../environments/app-environment";
import { environment } from "../../environments/environment";

export const APP_ENVIRONMENT = new InjectionToken<IAppEnvironment>('APP_ENVIRONMENT');

export function provideAppEnvironment(): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: APP_ENVIRONMENT,
            useValue: environment
        }
    ])
}