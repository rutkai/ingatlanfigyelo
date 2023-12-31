import {Component, EventEmitter, Output} from '@angular/core';
import {User, UserStore} from "./common";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() public toggleSidenav = new EventEmitter();
  @Output() public toggleUsermenu = new EventEmitter();

  public user: User;

  constructor(userStore: UserStore) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  public sidenavButtonPressed(): void {
    this.toggleSidenav.emit();
  }

  public userButtonPressed(): void {
    this.toggleUsermenu.emit();
  }
}
