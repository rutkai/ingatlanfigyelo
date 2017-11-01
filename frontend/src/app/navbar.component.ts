import {Component, EventEmitter, Output} from '@angular/core';
import {UserStore} from "../store/user.store";
import {User} from "../model/user";
import {MatDialog, MatSnackBar} from "@angular/material";
import {LoginDialogComponent} from "./user/login-dialog.component";
import {RegisterDialogComponent} from "./user/register-dialog.component";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() public toggleSidenav = new EventEmitter();

  public user: User;

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog,
              private userStore: UserStore, private userService: UserService) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  public sidenavButtonPressed(): void {
    this.toggleSidenav.emit();
  }

  public register(): void {
    let data = {};
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      data
    });

    dialogRef.afterClosed().subscribe(data => {
      if (!data) {
        return;
      }

      this.userService.register(data.username, data.password)
        .then(() => {
          this.snackBar.open('Sikeres regisztráció', 'OK', {duration: 2000});
        })
        .catch(() => {
          this.snackBar.open('Ez a felhasználónév már foglalt!', 'OK', {duration: 2000});
        });
    });
  }

  public login(): void {
    let data = {};
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      data
    });

    dialogRef.afterClosed().subscribe(data => {
      if (!data) {
        return;
      }

      this.userStore.login(data.username, data.password)
        .then(() => {
          this.snackBar.open('Sikeres bejelentkezés', 'OK', {duration: 2000});
        })
        .catch(() => {
          this.snackBar.open('Hibás felhasználónév/jelszó', 'OK', {duration: 2000});
        });
    });
  }

  public logout(): void {
    this.userStore.logout()
      .then(() => {
        this.snackBar.open('Kijelentkezés sikeres', 'OK', {duration: 2000});
      })
      .catch(() => {
        this.snackBar.open('Váratlan hiba', 'OK', {duration: 2000});
      });
  }
}
