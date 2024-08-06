import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeviceInfoStepComponent } from './edit-device-info-step.component';

describe('EditDeviceInfoStepComponent', () => {
  let component: EditDeviceInfoStepComponent;
  let fixture: ComponentFixture<EditDeviceInfoStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDeviceInfoStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeviceInfoStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
