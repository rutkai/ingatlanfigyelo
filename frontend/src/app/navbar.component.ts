import {Component, EventEmitter, Output} from '@angular/core';
import {UserStore} from "../store/user.store";
import {User} from "../model/user";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() public toggleSidenav = new EventEmitter();

  public user: User;

  constructor(private userStore: UserStore) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  public sidenavButtonPressed(): void {
    this.toggleSidenav.emit();
  }
}
