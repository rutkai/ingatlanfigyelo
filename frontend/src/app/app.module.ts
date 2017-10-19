import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {EstatesRepository} from "../repository/estates.repository";
import {EstatesStore} from "../store/estates.store";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    EstatesRepository,
    EstatesStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
