import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { NgModule, Injector } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdIconModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppStateModule } from './state/app-state.module';
import { HomeModule } from './pages/home/home.module';
import { FactSearchResultsModule } from './pages/fact-search-results/fact-search-results.module';
import { FactModule } from './pages/fact/fact.module';

import { AppComponent } from './app.component';
import { AuthModule, AuthService } from './features/auth';
import { CoreModule } from './core';
import { AuthHttp, authHttpProvider } from './auth-http.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpModule,

    BrowserAnimationsModule,
    MdButtonModule,
    MdIconModule,

    AppRoutingModule,
    AppStateModule,
    CoreModule,
    HomeModule,
    FactSearchResultsModule,
    FactModule,

    AuthModule
  ],
  providers: [
    AuthHttp,
    authHttpProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
