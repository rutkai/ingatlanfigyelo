import {Component, EventEmitter, Output} from "@angular/core";
import {User, UserStore} from "../common";

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss']
})
export class SidenavMenuComponent {
  @Output() public openFilters = new EventEmitter<void>();

  public user: User;

  constructor(userStore: UserStore) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  public openFiltersSidenav() {
    this.openFilters.emit();
  }
}
