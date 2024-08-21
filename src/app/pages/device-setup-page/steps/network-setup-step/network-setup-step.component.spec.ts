import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSetupStepComponent } from './network-setup-step.component';

describe('NetworkSetupStepComponent', () => {
  let component: NetworkSetupStepComponent;
  let fixture: ComponentFixture<NetworkSetupStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkSetupStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkSetupStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
