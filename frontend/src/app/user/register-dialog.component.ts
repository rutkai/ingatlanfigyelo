import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {AbstractControl, FormControl, ValidationErrors, Validators} from "@angular/forms";

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent {
  public username = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl('', [Validators.required]);
  public password2: FormControl;

  constructor(private dialogRef: MatDialogRef<RegisterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.password2 = new FormControl('', [Validators.required, this.passwordMatchValidatorFactory(data)]);
  }

  public onSubmit() {
    this.dialogRef.close(this.data);
  }

  public onCancel() {
    this.dialogRef.close();
  }

  private passwordMatchValidatorFactory(data: any) {
    return (control: AbstractControl): ValidationErrors|null => {
      return data.password && control.value === data.password ? null : {'match': true};
    }
  }
}
