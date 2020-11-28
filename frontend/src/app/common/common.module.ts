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
import {NavigationStore} from "./store/navigation.store";
import {StorageService} from "./service/storage.service";
import {ServiceWorkerService} from "./service/service-worker.service";
import {PushNotificationRepository} from "./repository/push-notification.repository";
import {MobileDetectService} from "./service/mobile-detect.service";
import {MobilePushNotificationService} from "./service/mobile-push-notification.service";
import {DesktopPushNotificationService} from "./service/desktop-push-notification.service";
import {FilterFactory} from "./factory/filter.factory";
import {CitiesRepository} from "./repository/cities.repository";
import {CitiesStore} from "./store/cities.store";
import {DistrictsRepository} from "./repository/districts.repository";
import {DistrictsStore} from "./store/districts.store";
import {RegionsRepository} from "./repository/regions.repository";
import {RegionsStore} from "./store/regions.store";

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
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: CommonModule,
      providers: [
        FilterFactory,
        EstatesRepository,
        EstatesStore,
        EstatesService,
        UserRepository,
        UserStore,
        UserService,
        StatsRepository,
        StatsStore,
        CitiesRepository,
        CitiesStore,
        DistrictsRepository,
        DistrictsStore,
        RegionsRepository,
        RegionsStore,
        EstateParser,
        NotificationService,
        WebsocketRepository,
        WebsocketEventsStore,
        MobileDetectService,
        MobilePushNotificationService,
        DesktopPushNotificationService,
        PushNotificationRepository,
        PushNotificationService,
        HeadUpdaterService,
        NavigationStore,
        StorageService,
        ServiceWorkerService,
      ],
    };
  }

  static forChild(): ModuleWithProviders<any> {
    return {
      ngModule: CommonModule
    };
  }
}
