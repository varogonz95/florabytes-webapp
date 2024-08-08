import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetryChartStandaloneComponent } from './telemetry-chart-standalone.component';

describe('TelemetryChartComponent', () => {
  let component: TelemetryChartStandaloneComponent;
  let fixture: ComponentFixture<TelemetryChartStandaloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TelemetryChartStandaloneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TelemetryChartStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
