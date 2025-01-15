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
            @if (confirmRoute) {
                <a data-cy-id="assignPlantBtn" class="button is-link" [routerLink]="confirmRoute">Yes, let's assign a plant!</a>
            }
            @else {
                <button type="button" class="button is-link" (click)="onConfirmHandler()">Yes, let's assign a plant!</button>
            }
        </div>
    </div>
    `,
})
export class CompletedStepComponent {
    @Input() public confirmRoute!: string[];

    @Output() public onConfirm = new EventEmitter();

    onConfirmHandler() {
        this.onConfirm.emit();
    }
}
