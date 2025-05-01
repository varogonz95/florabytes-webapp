// login-page.component.ts
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
    selector: 'app-login-page',
    template: `
    <div class="container is-max-desktop">
      <div class="columns is-centered">
        <div class="column is-half">
          <div class="card">
            <div class="card-content">
              <form (ngSubmit)="loginWithGoogle()">
                <div class="field is-grouped is-grouped-centered">
                  <div class="control">
                    <button class="button is-primary" type="submit">
                      <img src="assets/google-logo.svg" alt="Google Logo"> Login with Google
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .card {
        margin-top: 10rem;
    }
    img {
      margin-right: 0.5rem;
      height: 1.5rem;
    }
  `]
})
export class LoginPage {
    constructor(private readonly auth: AngularFireAuth) { }

    loginWithGoogle() {
        this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
}

/*
```

```html
<!-- Add the google logo to the assets folder -->
<!-- assets/google-logo.svg -->
```

```typescript
// Add the following imports to your app.module.ts
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
// ... other imports

// Add to imports array
imports: [
    // ... other imports
    AngularFireModule.initializeApp(environment.firebase), // Replace environment.firebase with your config
    AngularFireAuthModule
],
```


```json
// Add Firebase configuration to environment.ts
// environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  }
};

// environment.prod.ts
export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  }
};
```

You need to replace the placeholders in the firebase config with your actual values.  Also, make sure you have installed the necessary packages:

```bash
npm install firebase @angular/fire @angular/fire/compat
*/