import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluralizePipe } from './pipes/pluralize.pipe';
import { FlexHeightDirective } from './directives/flex-height.directive';
import { ReaderModule } from '@reader/reader.module';
import { ScrollIndicatorComponent } from './scroll-indicator/scroll-indicator.component';

@NgModule({
  declarations: [
    PluralizePipe,
    FlexHeightDirective,
    ScrollIndicatorComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
  ],
  exports: [
    PluralizePipe,
    FlexHeightDirective,
    ScrollIndicatorComponent
  ]
})
export class SharedModule { }
