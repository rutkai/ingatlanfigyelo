import {Component} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {NotificationService, UserService} from "../../common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.scss']
})
export class ForgottenPasswordComponent {
  public username = new FormControl('', [Validators.required, Validators.email]);

  constructor(private userService: UserService,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  public send() {
    if (!this.username.value) {
      return;
    }

    this.userService.sendPasswordRecovery(this.username.value)
      .then(() => {
        this.notificationService.showSnackbarNotification('Jelszó visszaállító e-mail elküldve');
        return this.router.navigate(['login'], {relativeTo: this.route.parent});
      })
      .catch(() => {
        this.notificationService.showSnackbarNotification('Hiba a küldés során!');
      });
  }
}
