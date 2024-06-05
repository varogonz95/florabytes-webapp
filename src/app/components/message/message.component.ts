import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
    @Input() public type?: 'info' | 'link' | 'primary' | 'success' | 'warning' | 'danger'
    @Input() public isLight? = false;
    @Input() public dismissAfter? = 0;
    @Input() public closable? = true;
    @Input() public destroyOnClose? = false;

    @Output()
    public onClose = new EventEmitter<void>();

    public hidden = false;

    constructor(private ref: ElementRef) {
    }

    ngOnInit(): void {
        if (this.dismissAfter ?? 0 > 0) {
            setTimeout(() => this.ref.nativeElement.remove(), this.dismissAfter)
        }
    }

    get classObj() {
        return {
            'is-info': this.type === 'info',
            'is-link': this.type === 'link',
            'is-primary': this.type === 'primary',
            'is-success': this.type === 'success',
            'is-warning': this.type === 'warning',
            'is-danger': this.type === 'danger',
            'is-hidden': this.hidden
        }
    }

    public close() {
        this.hidden = true;
        this.onClose?.emit();

        if (this.destroyOnClose) {
            this.ref.nativeElement.remove();
        }
    }
}
