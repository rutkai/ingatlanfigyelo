import {NgModule} from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule,
  MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatTooltipModule
} from "@angular/material";
import {UserRepository} from "./repository/user.repository";
import {UserStore} from "./store/user.store";
import {UserService} from "./service/user.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NotificationService} from "./service/notification.service";
import {WebsocketRepository} from "./repository/websocket.repository";
import {WebsocketEventsStore} from "./store/websocket-events.store";
import {PushNotificationService} from "./service/push-notification.service";
import {EstateParser} from "./parsers/estate.parser";
import {EstatesRepository} from "./repository/estates.repository";
import {EstatesStore} from "./store/estates.store";
import {EstateAttributeDisplayPipe} from "./pipes/estate-attribute-display.pipe";
import {EstatesService} from "./service/estates.service";

@NgModule({
  declarations: [
    EstateAttributeDisplayPipe
  ],
  exports: [
    EstateAttributeDisplayPipe
  ],
  imports: [
    HttpClientModule,
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
    MatTooltipModule
  ],
  providers: [
    EstatesRepository,
    EstatesStore,
    EstatesService,
    UserRepository,
    UserStore,
    UserService,
    EstateParser,
    NotificationService,
    WebsocketRepository,
    WebsocketEventsStore,
    PushNotificationService
  ],
  entryComponents: [
  ],
  bootstrap: []
})
export class CommonModule {
}
