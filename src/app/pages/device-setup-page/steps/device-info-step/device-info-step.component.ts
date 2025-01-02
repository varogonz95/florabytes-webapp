import { Component, EventEmitter, Input, Output, ViewContainerRef } from '@angular/core';
import { ImageSelection, ImageSelectorInputs } from '../../../../components/image-selector/image-selector.component';
import { ImageSelectorService } from '../../../../services/image-selector/image-selector.service';
import { DeviceInfo } from '../../device-setup-page.component';

@Component({
    selector: 'app-device-info-step',
    templateUrl: './device-info-step.component.html',
})
export class DeviceInfoStepComponent {
    @Input() public model: DeviceInfo = null!;

    @Output() public modelChange = new EventEmitter<DeviceInfo>();
    @Output() public submit = new EventEmitter();

    public newDeviceLocation?: string;
    public year = new Date().getFullYear();

    constructor(
        private readonly viewContainerRef: ViewContainerRef,
        private readonly imageSelectorService: ImageSelectorService) {
    }

    public submitHandler() {
        this.submit.emit();
    }

    public async showImageSelector() {
        this.imageSelectorService.create(this.viewContainerRef, {
            inputs: {
                [ImageSelectorInputs.Title]: "Select an Avatar!",
                [ImageSelectorInputs.ShowOnCreate]: true,
                [ImageSelectorInputs.CloseOnConfirm]: true,
                [ImageSelectorInputs.OnConfirmHandler]: this.confirmImageSelection.bind(this),
                [ImageSelectorInputs.Images]: [
                    { url: 'https://th.bing.com/th/id/OIG2.eBuKPmZ36yxXp3pf.RlK?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG2.2dM8r5Ues1u5geEIuAYt?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG2.NiZInuB5KelOR_9jsWay?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG2.rz2dFkzSCJN4jZ3r3pbO?pid=ImgGn' },
                ],
            }
        });
    }

    private confirmImageSelection(image: ImageSelection) {
        this.model.avatarImgUrl = image.url;
    }
}
