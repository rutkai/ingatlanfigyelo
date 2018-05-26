import {Component, EventEmitter, OnDestroy, Output} from "@angular/core";
import {User, UserStore} from "../../common";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'app-usermenu-navicon',
  templateUrl: './navicon.component.html',
  styleUrls: ['./navicon.component.scss']
})
export class NaviconComponent implements OnDestroy {
  @Output() public toggleUsermenu = new EventEmitter();

  public readonly gravatarBaseUrl = 'https://www.gravatar.com/avatar/';

  public user: User;

  private subscriptions: Subscription[] = [];

  constructor(userStore: UserStore) {
    this.subscriptions.push(userStore.user$.subscribe((user: User) => {
      this.user = user;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  public userButton() {
    this.toggleUsermenu.emit();
  }
}
