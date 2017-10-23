import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {EstatesRepository} from "../repository/estates.repository";
import {EstatesStore} from "../store/estates.store";
import {EstateComponent} from "./estate.component";
import {MatButtonModule, MatCardModule, MatExpansionModule, MatProgressSpinnerModule} from "@angular/material";
import {NgxGalleryModule} from "ngx-gallery";
import {EstateMapComponent} from "./estate-map.component";
import {AgmCoreModule} from '@agm/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InViewportModule} from 'ng-in-viewport';

@NgModule({
  declarations: [
    AppComponent,
    EstateComponent,
    EstateMapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InViewportModule.forRoot(),
    NgxGalleryModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCXsZ6qiAjyUOOY6S46qy9-R7qk1W6grGY'
    }),
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  providers: [
    EstatesRepository,
    EstatesStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
