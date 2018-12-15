import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluralizePipe } from './pipes/pluralize.pipe';
import { FlexHeightDirective } from './directives/flex-height.directive';
import { InkService } from './services/ink.service';
import { ThemeService } from './services/theme.service';
import { UtilityService } from './services/util.service';

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
