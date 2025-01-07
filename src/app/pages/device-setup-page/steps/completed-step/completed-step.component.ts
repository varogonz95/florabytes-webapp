import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-completed-step',
    template: `
    <h3 class="title">Device Setup Complete!</h3>
    <div class="content">
        <p>
            Your device is now setup and ready to use! <br />
            Do you want to use it on a plant?
        </p>
    </div>
    <div class="field is-grouped">
        <div class="control">
            <a [routerLink]="['/', 'devices']" class="button">No, maybe later.</a>
        </div>
        <div class="control">
            <button type="button" class="button is-link" (click)="onClickConfirmHandler()">Yes, let's assign a plant!</button>
        </div>
    </div>
    `,
})
export class CompletedStepComponent {
    @Input({ required: true }) public deviceId!: string;
    @Output() public onConfirm = new EventEmitter();

    onClickConfirmHandler() {
        this.onConfirm.emit();
    }
}
