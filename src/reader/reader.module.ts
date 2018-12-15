import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReaderComponent } from '@reader/reader.component';
import { ReaderChoiceComponent } from './reader-choice/reader-choice.component';
import { ReaderSegmentComponent } from './reader-segment/reader-segment.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    declarations: [
        ReaderComponent,
        ReaderChoiceComponent,
        ReaderSegmentComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BrowserAnimationsModule
    ]
})
export class ReaderModule {}
