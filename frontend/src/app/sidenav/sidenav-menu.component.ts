import {Component, EventEmitter, OnDestroy, Output} from "@angular/core";
import {User, UserStore} from "../common";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss']
})
export class SidenavMenuComponent implements OnDestroy {
  @Output() public openFilters = new EventEmitter<void>();

  public user: User;

  private subscriptions: Subscription[] = [];

  constructor(userStore: UserStore) {
    this.subscriptions.push(userStore.user$.subscribe(user => {
      this.user = user;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  public openFiltersSidenav() {
    this.openFilters.emit();
  }
}
