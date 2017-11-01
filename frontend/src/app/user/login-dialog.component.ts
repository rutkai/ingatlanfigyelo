import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  public username = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl('', [Validators.required]);

  constructor(private dialogRef: MatDialogRef<LoginDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  public onSubmit() {
    this.dialogRef.close(this.data);
  }

  public onCancel() {
    this.dialogRef.close();
  }
}
