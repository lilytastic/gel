import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './routing/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ReaderModule } from '@modules/reader/reader.module';
import { StatusComponent } from '@modules/status/status.component';

import '@core/prototypes/string-prototypes';

import '@assets/js/ink.js';
import '@assets/js/story/story.js';

@NgModule({
  declarations: [
    AppComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
