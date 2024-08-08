import { NgModule } from '@angular/core';
import { ImageSelectorComponent } from './image-selector/image-selector.component';
import { MessageComponent } from './message/message.component';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { CommonModule } from '@angular/common';

const SharedComponents = [
    ImageSelectorComponent,
    MessageComponent,
    NavHeaderComponent,
]

@NgModule({
    declarations: [
        ...SharedComponents
    ],
    imports:[
        CommonModule
    ],
    exports: [
        ...SharedComponents
    ]
})
export class SharedComponentsModule { }
