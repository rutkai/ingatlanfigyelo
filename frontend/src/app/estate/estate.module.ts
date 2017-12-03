import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {EstateComponent} from "./component/estate-list/estate.component";
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule,
  MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatTooltipModule
} from "@angular/material";
import {NgxGalleryModule} from "ngx-gallery";
import {EstateMapComponent} from "./component/estate-list/estate-map.component";
import {AgmCoreModule} from '@agm/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InViewportModule} from 'ng-in-viewport';
import {environment} from "../../environments/environment";
import {EstatesComponent} from "./component/estate-list/estates.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EstateGalleryComponent} from "./component/estate-list/estate-gallery.component";
import {CommonModule} from "../common/common.module";

@NgModule({
  declarations: [
    EstatesComponent,
    EstateComponent,
    EstateMapComponent,
    EstateGalleryComponent
  ],
  exports: [
    EstatesComponent
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
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    CommonModule
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: []
})
export class EstateModule {
}
