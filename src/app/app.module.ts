import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@environments/environment';

import { AppComponent } from './app.component';
import { ReaderModule } from '@reader/reader.module';
import { StatusComponent } from '@status/status.component';

import { StoreModule } from '@ngrx/store';
import { SegmentReducer } from '@app/store/reducers/segment.reducer';

import '@app/prototypes/string-prototypes';

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
    ReaderModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot({
      segments: SegmentReducer
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
