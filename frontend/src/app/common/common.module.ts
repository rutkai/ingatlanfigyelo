import {ModuleWithProviders, NgModule} from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {UserRepository} from "./repository/user.repository";
import {UserStore} from "./store/user.store";
import {UserService} from "./service/user.service";
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
  ],
})
export class CommonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonModule,
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
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: CommonModule
    };
  }
}
