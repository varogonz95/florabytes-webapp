import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSummaryCardComponent } from './device-summary-card.component';

describe('DeviceSummaryCardComponent', () => {
    let component: DeviceSummaryCardComponent;
    let fixture: ComponentFixture<DeviceSummaryCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeviceSummaryCardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DeviceSummaryCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
