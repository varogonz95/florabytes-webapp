import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-completed-step',
    styleUrl: './completed-step.component.css',
    template: `
    <h5 class="subtitle">Step 3.</h5>
    <h3 class="title">Device Setup Complete!</h3>
    <div class="content">
        <p>
            Now your device network is set up!
        </p>
    </div>
    <a [routerLink]="['devices', deviceId]" class="button is-link">Go to Device Telemetry</a>`,
})
export class CompletedStepComponent {
    @Input({ required: true }) public deviceId!: string;
}
