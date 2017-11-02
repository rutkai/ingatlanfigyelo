import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {EstatesRepository} from "../repository/estates.repository";
import {EstatesStore} from "../store/estates.store";
import {EstateComponent} from "./estate-list/estate.component";
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule,
  MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSnackBarModule
} from "@angular/material";
import {NgxGalleryModule} from "ngx-gallery";
import {EstateMapComponent} from "./estate-list/estate-map.component";
import {AgmCoreModule} from '@agm/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InViewportModule} from 'ng-in-viewport';
import {NavbarComponent} from "./navbar.component";
import {SidenavComponent} from "./sidenav/sidenav.component";
import {environment} from "../environments/environment";
import {UserRepository} from "../repository/user.repository";
import {UserStore} from "../store/user.store";
import {UserService} from "../service/user.service";
import {EstatesComponent} from "./estate-list/estates.component";
import {LoginDialogComponent} from "./user/login-dialog.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterDialogComponent} from "./user/register-dialog.component";
import {FiltersComponent} from "./filters/filters.component";
import {FilterComponent} from "./filters/filter.component";
import {FilterGroupsComponent} from "./filters/filter-groups.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginDialogComponent,
    RegisterDialogComponent,
    SidenavComponent,
    FilterGroupsComponent,
    FiltersComponent,
    FilterComponent,
    EstatesComponent,
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
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [
    EstatesRepository,
    EstatesStore,
    UserRepository,
    UserStore,
    UserService
  ],
  entryComponents: [
    LoginDialogComponent,
    RegisterDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
