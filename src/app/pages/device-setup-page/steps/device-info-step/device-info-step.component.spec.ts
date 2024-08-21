import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceInfoStepComponent } from './device-info-step.component';

describe('EditDeviceInfoStepComponent', () => {
  let component: DeviceInfoStepComponent;
  let fixture: ComponentFixture<DeviceInfoStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceInfoStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceInfoStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
