import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceListPage } from './device-list.component';

describe('DeviceListComponent', () => {
    let component: DeviceListPage;
    let fixture: ComponentFixture<DeviceListPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeviceListPage]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DeviceListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
