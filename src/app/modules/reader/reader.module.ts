import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PluralizePipe } from '@shared/pipes/pluralize.pipe';
import { FlexHeightDirective } from '@shared/directives/flex-height.directive';
import { ReaderComponent } from '@modules/reader/reader.component';
import { ReaderChoiceComponent } from './reader-choice/reader-choice.component';
import { ReaderSegmentComponent } from './reader-segment/reader-segment.component';

@NgModule({
    declarations: [
        PluralizePipe,
        ReaderComponent,
        ReaderChoiceComponent,
        FlexHeightDirective,
        ReaderSegmentComponent
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule
    ]
})
export class ReaderModule {}
