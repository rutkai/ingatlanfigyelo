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
import {HeadUpdaterService} from "./service/head-updater.service";
import {StatsRepository} from "./repository/stats.repository";
import {StatsStore} from "./store/stats.store";
import {RemoveAccentsPipe} from "./pipes/remove-accents.pipe";

@NgModule({
  declarations: [
    EstateAttributeDisplayPipe,
    RemoveAccentsPipe
  ],
  exports: [
    EstateAttributeDisplayPipe,
    RemoveAccentsPipe
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
        StatsRepository,
        StatsStore,
        EstateParser,
        NotificationService,
        WebsocketRepository,
        WebsocketEventsStore,
        PushNotificationService,
        HeadUpdaterService
      ],
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: CommonModule
    };
  }
}
