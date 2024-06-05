import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceTelemetryPage } from './device-telemetry-page.component';


describe('DeviceTelemetryPage', () => {
    let component: DeviceTelemetryPage;
    let fixture: ComponentFixture<DeviceTelemetryPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeviceTelemetryPage]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DeviceTelemetryPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
