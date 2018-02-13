import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';

import {HttpClientModule} from "@angular/common/http";
import {EstateComponent} from "../../frontend/app/estate/component/estate.component";
import {
  MatButtonModule, MatIconModule, MatProgressBarModule, MatSnackBarModule, MatTooltipModule
} from "@angular/material";
import {MatDividerModule} from '@angular/material/divider';
import {NgxGalleryModule} from "ngx-gallery";
import {EstateMapComponent} from "../../frontend/app/estate/component/estate-map.component";
import {AgmCoreModule} from '@agm/core';
import {environment} from "../../frontend/environments/environment";
import {EstatesComponent} from "../../frontend/app/estate/component/estates.component";
import {EstateGalleryComponent} from "../../frontend/app/estate/component/estate-gallery.component";
import {CommonModule} from "../../frontend/app/common/common.module";
import {SingleEstateComponent} from "../../frontend/app/estate/component/single-estate.component";
import {EstateCardComponent} from "../../frontend/app/estate/component/estate-card.component";
import {RouterModule} from "@angular/router";


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
    NgxGalleryModule,
    RouterModule,
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
