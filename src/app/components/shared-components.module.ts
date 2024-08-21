import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MessageComponent } from './message/message.component';
import { NavHeaderComponent } from './nav-header/nav-header.component';

const SharedComponents = [
    // ImageSelectorComponent,
    MessageComponent,
    NavHeaderComponent,
]

@NgModule({
    declarations: [
        ...SharedComponents
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ...SharedComponents
    ]
})
export class SharedComponentsModule { }
