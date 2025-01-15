import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceSummary } from '../../models/device-summary';
import { getDefaultPlantInfo, PlantInfo } from '../../models/plant-info';
import { PgotchiClientService } from '../../services/pgotchi-client/pgotchi-client.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-assign-plant-page',
    templateUrl: './assign-plant-page.component.html',
})
export class AssignPlantPage implements OnInit {
    private device!: DeviceSummary;
    private today = new Date();

    public maxYear = this.today.getFullYear();
    public plantInfo: PlantInfo = getDefaultPlantInfo();

    constructor(
        activatedRoute: ActivatedRoute,
        private readonly pgotchiClient: PgotchiClientService) {
        this.device = activatedRoute.snapshot.data['device'];
    }

    ngOnInit(): void {
        console.log('Device:', this.device);
    }

    public async onSubmit(): Promise<void> {
        firstValueFrom(
            this.pgotchiClient
                .updateDeviceProperties(
                    this.device.id,
                    {
                        eTag: this.device.eTag,
                        properties: { ...this.plantInfo },
                    }));
    }
}
