import {Injectable} from "@angular/core";
import Push from "push.js";

@Injectable()
export class PushNotificationService {
  constructor() {
    if (Push.Permission.get() === Push.Permission.DEFAULT) {
      Push.Permission.request()
        .catch(() => {});
    }
  }

  public show(body: string, title = "Új ingatlan!"): void {
    if (document.hasFocus() || Push.Permission.get() !== Push.Permission.GRANTED) {
      return;
    }

    Push.create(title, {
      body,
      icon: '/assets/logo.png',
      onClick: function () {
        window.focus();
        this.close();
      }
    })
  }
}
