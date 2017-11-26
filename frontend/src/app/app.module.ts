import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {EstatesRepository} from "../repository/estates.repository";
import {EstatesStore} from "../store/estates.store";
import {EstateComponent} from "./estate-list/estate.component";
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule,
  MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatTooltipModule
} from "@angular/material";
import {NgxGalleryModule} from "ngx-gallery";
import {EstateMapComponent} from "./estate-list/estate-map.component";
import {AgmCoreModule} from '@agm/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InViewportModule} from 'ng-in-viewport';
import {NavbarComponent} from "./navbar.component";
import {SidenavFilterComponent} from "./sidenav/sidenav-filter.component";
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
import {NotificationService} from "../service/notification.service";
import {FilterBooleanComponent} from "./filters/filter-types/filter-boolean.component";
import {FilterIntervalComponent} from "./filters/filter-types/filter-interval.component";
import {FilterMultiselectComponent} from "./filters/filter-types/filter-multiselect.component";
import {FilterStringComponent} from "./filters/filter-types/filter-string.component";
import {EstateAttributeDisplayPipe} from "../pipes/estate-attribute-display.pipe";
import {TagInputModule} from "ngx-chips";
import {WebsocketRepository} from "../repository/websocket.repository";
import {WebsocketEventsStore} from "../store/websocket-events.store";
import {EstateParser} from "../parsers/estate.parser";
import {FooterComponent} from "./footer.component";
import {EstateGalleryComponent} from "./estate-list/estate-gallery.component";
import {SidenavMenuComponent} from "./sidenav/sidenav-menu.component";
import {PushNotificationService} from "../service/push-notification.service";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginDialogComponent,
    RegisterDialogComponent,
    SidenavFilterComponent,
    SidenavMenuComponent,
    FilterGroupsComponent,
    FiltersComponent,
    FilterComponent,
    FilterBooleanComponent,
    FilterIntervalComponent,
    FilterMultiselectComponent,
    FilterStringComponent,
    EstatesComponent,
    EstateComponent,
    EstateMapComponent,
    EstateGalleryComponent,
    EstateAttributeDisplayPipe
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
    TagInputModule
  ],
  providers: [
    EstateParser,
    EstatesRepository,
    EstatesStore,
    UserRepository,
    UserStore,
    UserService,
    NotificationService,
    WebsocketRepository,
    WebsocketEventsStore,
    PushNotificationService
  ],
  entryComponents: [
    LoginDialogComponent,
    RegisterDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
