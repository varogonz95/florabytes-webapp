import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export interface ImageSelection {
    url: string
    selected?: boolean
}

export const ImageSelectorInputs = {
    Title: 'title',
    Images: 'avatarImages',
    IsActive: 'isActive',
    ShowOnCreate: 'showOnCreate',
    CloseOnConfirm: 'closeOnConfirm',
    HasConfirmButton: 'hasConfirmButton',
    HasCancelButton: 'hasCancelButton',
    OnConfirmHandler: 'onConfirm',
    OnCancelHandler: 'onCancel',
};

@Component({
    standalone: true,
    selector: 'app-image-selector',
    styleUrl: './image-selector.component.css',
    templateUrl: './image-selector.component.html',
    imports: [
        CommonModule
    ],
})
export class ImageSelectorComponent implements OnInit {
    @Input({ alias: ImageSelectorInputs.Title })
    public title = "Select an image.";

    @Input({ alias: ImageSelectorInputs.IsActive })
    public isActive?: boolean;

    @Input({ alias: ImageSelectorInputs.Images, required: true })
    public images: ImageSelection[] = [];

    @Input({ alias: ImageSelectorInputs.ShowOnCreate })
    public showOnCreate?: boolean;

    @Input({ alias: ImageSelectorInputs.CloseOnConfirm })
    public closeOnConfirm = true;

    @Input({ alias: ImageSelectorInputs.HasConfirmButton })
    public hasConfirmButton = true;

    @Input({ alias: ImageSelectorInputs.HasCancelButton })
    public hasCancelButton = true;

    @Input({ alias: ImageSelectorInputs.OnConfirmHandler })
    public onConfirmHandler?: (image?: ImageSelection) => void;

    @Input({ alias: ImageSelectorInputs.OnCancelHandler })
    public onCancelHandler?: () => void;

    constructor() {

    }

    ngOnInit(): void {
        this.isActive = this.showOnCreate;
    }

    public toggleSelection(avatarImage: ImageSelection) {
        this.images.forEach(image => image.selected = false);
        avatarImage.selected = true;
    }

    public show() {
        this.isActive = true;
    }

    public hide() {
        this.isActive = false;
    }

    public confirmSelection() {
        if (this.onConfirmHandler) {
            const selectedImage = this.images.find(image => image.selected);
            this.onConfirmHandler(selectedImage);
        }

        if (this.closeOnConfirm)
            this.isActive = false;
    }

    public cancel() {
        this.hide();

        if (this.onCancelHandler)
            this.onCancelHandler();
    }
}
