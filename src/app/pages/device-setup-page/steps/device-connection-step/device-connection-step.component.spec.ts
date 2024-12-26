import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceConnectionStepComponent } from './device-connection-step.component';

describe('DeviceConnectionStepComponent', () => {
  let component: DeviceConnectionStepComponent;
  let fixture: ComponentFixture<DeviceConnectionStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceConnectionStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceConnectionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
