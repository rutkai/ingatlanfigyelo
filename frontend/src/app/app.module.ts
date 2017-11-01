import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {EstatesRepository} from "../repository/estates.repository";
import {EstatesStore} from "../store/estates.store";
import {EstateComponent} from "./estate.component";
import {
  MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule,
  MatProgressSpinnerModule, MatSidenavModule
} from "@angular/material";
import {NgxGalleryModule} from "ngx-gallery";
import {EstateMapComponent} from "./estate-map.component";
import {AgmCoreModule} from '@agm/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InViewportModule} from 'ng-in-viewport';
import {NavbarComponent} from "./navbar.component";
import {SidenavComponent} from "./sidenav/sidenav.component";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidenavComponent,
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
      apiKey: environment.mapsApiKey
    }),
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSidenavModule
  ],
  providers: [
    EstatesRepository,
    EstatesStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
