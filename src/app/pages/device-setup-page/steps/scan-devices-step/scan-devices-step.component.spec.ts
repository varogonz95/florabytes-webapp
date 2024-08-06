import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanDevicesStepComponent } from './scan-devices-step.component';

describe('ScanDevicesStepComponent', () => {
  let component: ScanDevicesStepComponent;
  let fixture: ComponentFixture<ScanDevicesStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScanDevicesStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanDevicesStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
