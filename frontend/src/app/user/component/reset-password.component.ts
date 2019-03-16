import {Component} from '@angular/core';
import {AbstractControl, FormControl, ValidationErrors, Validators} from "@angular/forms";
import {NotificationService, UserService} from "../../common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  public password = new FormControl('', [Validators.required]);
  public password2: FormControl;

  constructor(private userService: UserService,
              private notificationService: NotificationService,
              private router: Router,
              private route: ActivatedRoute) {
    this.password2 = new FormControl('', [Validators.required, this.passwordMatchValidatorFactory()]);
  }

  public reset(): void {
    if (this.password.invalid) {
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    const token = this.route.snapshot.paramMap.get('token');
    this.userService.resetPassword(id, this.password.value, token)
      .then(() => {
        this.notificationService.showSnackbarNotification('Sikeres jelszóváltoztatás');
        return this.router.navigate(['login'], {relativeTo: this.route.parent});
      })
      .catch(() => {
        this.notificationService.showSnackbarNotification('Hiba a jelszó változtatása közben! Kérem próbálja meg ismét.');
      });
  }

  private passwordMatchValidatorFactory() {
    return (control: AbstractControl): ValidationErrors|null => {
      return this.password.value && control.value === this.password.value ? null : {'match': true};
    }
  }
}
