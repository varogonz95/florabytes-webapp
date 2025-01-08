import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { DeviceSummary } from '../../models/device-summary';
import { getDefaultPlantInfo, PlantInfo } from '../../models/plant-info';

@Component({
    selector: 'app-assign-plant-page',
    templateUrl: './assign-plant-page.component.html',
    styleUrl: './assign-plant-page.component.css'
})
export class AssignPlantPage implements OnInit {
    private device!: DeviceSummary;
    private today = new Date();

    public maxYear = this.today.getFullYear();
    public plantInfo: PlantInfo = getDefaultPlantInfo();

    constructor(activatedRouteSnapshot: ActivatedRouteSnapshot) {
        this.device = activatedRouteSnapshot.data['device'];
    }

    ngOnInit(): void {
        console.log('Device:', this.device);
    }

    public onSubmit(): void {

    }
}
