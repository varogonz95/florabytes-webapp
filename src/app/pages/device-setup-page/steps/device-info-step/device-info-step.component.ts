import { Component, EventEmitter, Input, Output, ViewContainerRef } from '@angular/core';
import { ImageSelection, ImageSelectorInputs } from '../../../../components/image-selector/image-selector.component';
import { ImageSelectorService } from '../../../../services/image-selector/image-selector.service';
import { DeviceInfo } from '../../device-setup-page.component';

@Component({
    selector: 'app-device-info-step',
    templateUrl: './device-info-step.component.html',
    styleUrl: './device-info-step.component.css'
})
export class DeviceInfoStepComponent {
    @Input({ required: true }) public step = 0;
    @Input() public model: DeviceInfo = null!;

    @Output() public modelChange = new EventEmitter<DeviceInfo>();
    @Output() public submit = new EventEmitter();

    public newDeviceLocation?: string;

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
                    { url: 'https://th.bing.com/th/id/OIG3.fEVX.U4BjrdP.H0xg8.j?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG3.vBnn0Mugk9Hi25eyFjyY?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG3.NDFr7kMwFiqyo2jkAOKP?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG3.lMvyjsNhJXoECdISa.li?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG4.MgFFkLREjZr7SFg9FAeC?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG4.ajWuCzwi2VpR8X_JH8sG?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG4.twGkl6eibUYBtZGWSI8j?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG4.p.6ZYM1F4DqnfYLB9icF?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG4.qlnWTEB.gDS4fGgGJZGc?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG4.EvvsJFdui3BR1nG8AI2.?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG4.5C1dvlVrcxC3qLTKSAWp?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG4.5C1dvlVrcxC3qLTKSAWp?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG4.N1KyfxcuxAb0f28YP3xW?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG3.1jirPQz.BM1ynD2vYsxy?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG3.2hZpSAdptR1ukiZ97fy4?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG3.w3PWGhZ69KDDR36OO15j?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG3.NIrifyr6QSDkcbOFYmI9?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG2.U2JgPT5gfnMFt06LPFjh?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG2.7KQtlptrQ6ZcGByjYHRB?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG2.ln4r6EUy2EKivsObqMgf?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG2.jMAekAaxTZkBeMDum3rm?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG2.eBuKPmZ36yxXp3pf.RlK?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG2.2dM8r5Ues1u5geEIuAYt?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG2.NiZInuB5KelOR_9jsWay?pid=ImgGn' },
                    { url: 'https://th.bing.com/th/id/OIG2.rz2dFkzSCJN4jZ3r3pbO?pid=ImgGn' },
                ],
            }
        });
    }

    private confirmImageSelection(image: ImageSelection){
        this.model.AvatarImgUrl = image.url;
    }
}
