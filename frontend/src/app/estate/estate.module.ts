import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';

import {HttpClientModule} from "@angular/common/http";
import {EstateComponent} from "./component/estate.component";
import {
  MatButtonModule, MatIconModule, MatProgressBarModule, MatSnackBarModule, MatTooltipModule
} from "@angular/material";
import {MatDividerModule} from '@angular/material/divider';
import {NgxGalleryModule} from "ngx-gallery";
import {EstateMapComponent} from "./component/estate-map.component";
import {AgmCoreModule} from '@agm/core';
import {environment} from "../../environments/environment";
import {EstatesComponent} from "./component/estates.component";
import {EstateGalleryComponent} from "./component/estate-gallery.component";
import {CommonModule} from "../common/common.module";
import {Routing} from "./estate.routing";
import {SingleEstateComponent} from "./component/single-estate.component";
import {EstateCardComponent} from "./component/estate-card.component";


@NgModule({
  providers: [
    { provide: 'Window', useValue: window }
  ],
  declarations: [
    EstatesComponent,
    SingleEstateComponent,
    EstateComponent,
    EstateCardComponent,
    EstateMapComponent,
    EstateGalleryComponent
  ],
  imports: [
    CommonModule,
    NgCommonModule,
    HttpClientModule,
    Routing,
    NgxGalleryModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey
    }),
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
  ],
})
export class EstateModule {
}
