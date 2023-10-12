import {Component} from '@angular/core';
import {AbstractControl, FormControl, ValidationErrors, Validators} from "@angular/forms";
import {NotificationService, UserService} from "../../common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public username = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl('', [Validators.required]);
  public password2: FormControl;
  public terms: FormControl;

  constructor(private userService: UserService,
              private notificationService: NotificationService,
              private router: Router,
              private route: ActivatedRoute) {
    this.password2 = new FormControl('', [Validators.required, this.passwordMatchValidatorFactory()]);
    this.terms = new FormControl(false, [this.termsValidator()]);
  }

  public register(): void {
    if (this.username.invalid || this.password.invalid || this.terms.invalid) {
      return;
    }

    this.userService.register(this.username.value, this.password.value)
      .then(() => {
        this.notificationService.showSnackbarNotification('Sikeres regisztráció');
        return this.router.navigate(['login'], {relativeTo: this.route.parent});
      })
      .catch(() => {
        this.notificationService.showSnackbarNotification('Ez a felhasználónév már foglalt!');
      });
  }

  private passwordMatchValidatorFactory() {
    return (control: AbstractControl): ValidationErrors|null => {
      return this.password.value && control.value === this.password.value ? null : {'match': true};
    }
  }

  private termsValidator() {
    return (control: AbstractControl): ValidationErrors|null => {
      return control.value ? null : {'terms': true};
    }
  }
}
