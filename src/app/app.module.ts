import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './/app-routing.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from './app.component';
import { ReaderComponent } from '@modules/reader/reader.component';
import { StatusComponent } from '@modules/status/status.component';

import '@core/prototypes/string-prototypes';
import { PluralizePipe } from './shared/pipes/pluralize.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ReaderComponent,
    StatusComponent,
    PluralizePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
