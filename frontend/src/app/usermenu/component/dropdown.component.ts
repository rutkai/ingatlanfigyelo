import {Component, OnDestroy} from "@angular/core";
import {
  EstatePool, EstatesStore, NotificationService, PushNotificationService, User, UserService, UserStore,
  View
} from "../../common";
import {Subscription} from "rxjs/internal/Subscription";
import {TimeHelper} from "../helpers/time-helper";

@Component({
  selector: 'app-usermenu-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnDestroy {
  public user: User;
  public pool: EstatePool;

  public estatePool = EstatePool;
  public views = View;

  public quietTimeStart: TimeHelper;
  public quietTimeEnd: TimeHelper;

  private subscriptions: Subscription[] = [];

  constructor(private notificationService: NotificationService,
              public pushNotificationService: PushNotificationService,
              private userStore: UserStore,
              private userService: UserService,
              private estatesStore: EstatesStore) {
    this.subscriptions.push(userStore.user$.subscribe((user: User) => {
      this.user = user;

      this.quietTimeStart = new TimeHelper(user.notificationQuietHours.start);
      this.quietTimeEnd = new TimeHelper(user.notificationQuietHours.end);
    }));
    this.subscriptions.push(estatesStore.estatePool$.subscribe((pool: EstatePool) => {
      this.pool = pool;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  public isPushNotificationsChangeable(): boolean {
    return this.pushNotificationService.isChangeable();
  }

  public isPushNotificationsEnabled(): boolean {
    return this.pushNotificationService.isEnabled();
  }

  public toggleNotifications(): void {
    if (this.pushNotificationService.isEnabled()) {
      this.pushNotificationService.disable();
    } else {
      this.pushNotificationService.enable()
        .catch(() => {
          this.notificationService.showSnackbarNotification('Engedélyezés sikertelen. Az értesítések le vannak tiltva a böngészőben.');
        });
    }
  }

  public logout(): void {
    this.userStore.logout()
      .then(() => {
        this.notificationService.showSnackbarNotification('Kijelentkezés sikeres');
      })
      .catch(() => {
        this.notificationService.showSnackbarNotification('Váratlan hiba');
      });
  }

  public setCardsView(): void {
    if (this.user.view !== View.CARDS) {
      this.userService.changeView(View.CARDS);
    }
  }

  public setInlineView(): void {
    if (this.user.view !== View.INLINE) {
      this.userService.changeView(View.INLINE);
    }
  }

  public changeEstatePool(pool: EstatePool): void {
    this.estatesStore.setEstatePool(pool);
  }

  public changeNotificationFrequency(frequency: number): void {
    this.userService.changeNotificationFrequency(frequency);
  }

  public changeQuietTime(): void {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    this.userService.changeNotificationQuietTime({
      start: {
        hours: this.quietTimeStart.hours,
        minutes: this.quietTimeStart.minutes,
        timezone
      },
      end: {
        hours: this.quietTimeEnd.hours,
        minutes: this.quietTimeEnd.minutes,
        timezone
      }
    })
  }
}
