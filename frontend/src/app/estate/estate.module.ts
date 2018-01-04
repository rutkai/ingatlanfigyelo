import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';

import {HttpClientModule} from "@angular/common/http";
import {EstateComponent} from "./component/estate.component";
import {
  MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatInputModule,
  MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule
} from "@angular/material";
import {NgxGalleryModule} from "ngx-gallery";
import {EstateMapComponent} from "./component/estate-map.component";
import {AgmCoreModule} from '@agm/core';
import {InViewportModule} from 'ng-in-viewport';
import {environment} from "../../environments/environment";
import {EstatesComponent} from "./component/estates.component";
import {EstateGalleryComponent} from "./component/estate-gallery.component";
import {CommonModule} from "../common/common.module";
import {Routing} from "./estate.routing";
import {SingleEstateComponent} from "./component/single-estate.component";


@NgModule({
  declarations: [
    EstatesComponent,
    SingleEstateComponent,
    EstateComponent,
    EstateMapComponent,
    EstateGalleryComponent
  ],
  imports: [
    CommonModule,
    NgCommonModule,
    HttpClientModule,
    Routing,
    InViewportModule.forRoot(),
    NgxGalleryModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey
    }),
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
})
export class EstateModule {
}
