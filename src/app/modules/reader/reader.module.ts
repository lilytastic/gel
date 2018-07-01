import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PluralizePipe } from '@shared/pipes/pluralize.pipe';
import { ReaderComponent } from '@modules/reader/reader.component';
import { ReaderChoiceComponent } from './reader-choice/reader-choice.component';

@NgModule({
    declarations: [
        PluralizePipe,
        ReaderComponent,
        ReaderChoiceComponent
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule
    ]
})
export class ReaderModule {}
