import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedStepComponent } from './completed-step.component';

describe('CompletedStepComponent', () => {
  let component: CompletedStepComponent;
  let fixture: ComponentFixture<CompletedStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompletedStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
