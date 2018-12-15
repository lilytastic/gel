import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReaderComponent } from '@reader/reader.component';
import { ReaderChoiceComponent } from './reader-choice/reader-choice.component';
import { ReaderSegmentComponent } from './reader-segment/reader-segment.component';
import { SharedModule } from '@shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { ReaderReducers } from './store/reducers/segment.reducer';
import { READER_FEATURE_KEY } from './store/selectors/segment.selector';

@NgModule({
    declarations: [
        ReaderComponent,
        ReaderChoiceComponent,
        ReaderSegmentComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BrowserAnimationsModule,
        StoreModule.forFeature(READER_FEATURE_KEY, ReaderReducers)
    ]
})
export class ReaderModule {}
