import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() public showSidenav = new EventEmitter();

  public sidenavButtonPressed(): void {
    this.showSidenav.emit();
  }
}
