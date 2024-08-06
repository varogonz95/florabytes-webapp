import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSetupPage } from './device-setup-page.component';

describe('DeviceSetupPageComponent', () => {
  let component: DeviceSetupPage;
  let fixture: ComponentFixture<DeviceSetupPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceSetupPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceSetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
