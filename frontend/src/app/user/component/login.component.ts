import {Component} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {NotificationService, UserStore} from "../../common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public username = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl('', [Validators.required]);

  constructor(private userStore: UserStore,
              private notificationService: NotificationService,
              private router: Router) {
  }

  public login() {
    if (!this.username.value || !this.password.value) {
      return;
    }

    this.userStore.login(this.username.value, this.password.value)
      .then(() => {
        this.notificationService.showSnackbarNotification('Sikeres bejelentkezés');
        return this.router.navigateByUrl('/');
      })
      .catch(() => {
        this.notificationService.showSnackbarNotification('Hibás felhasználónév/jelszó');
      });
  }
}
