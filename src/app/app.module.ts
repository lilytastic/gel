import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@environments/environment';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';

import { AppComponent } from './app.component';
import { ReaderModule } from '@reader/reader.module';
import { StatusComponent } from '@status/status.component';

import { StoreModule } from '@ngrx/store';

import '@app/prototypes/string-prototypes';

import '@assets/js/ink.js';
import '@assets/js/story/story.js';
import { SharedModule } from '@shared/shared.module';
import { ScrollService } from './services/scroll.service';

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
    SharedModule,
    StoreModule.forRoot({}),
    StoreRouterConnectingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
