import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluralizePipe } from './pipes/pluralize.pipe';
import { FlexHeightDirective } from './directives/flex-height.directive';

@NgModule({
  declarations: [
    PluralizePipe,
    FlexHeightDirective
  ],
  imports: [
    CommonModule
  ],
  providers: [
  ],
  exports: [
    PluralizePipe,
    FlexHeightDirective
  ]
})
export class SharedModule { }
