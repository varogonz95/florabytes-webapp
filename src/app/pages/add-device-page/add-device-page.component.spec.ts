import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDevicePage } from './add-device-page.component';

describe('AddDevicePageComponent', () => {
  let component: AddDevicePage;
  let fixture: ComponentFixture<AddDevicePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDevicePage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
