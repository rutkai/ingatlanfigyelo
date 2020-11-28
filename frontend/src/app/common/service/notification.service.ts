import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";

@Injectable()
export class NotificationService {
  private snackBarConfig: MatSnackBarConfig;

  constructor(private snackBar: MatSnackBar) {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.duration = 2500;
    this.snackBarConfig.verticalPosition = 'top';
  }

  public showSnackbarNotification(message: string, buttonText = 'Ok') {
    this.snackBar.open(message, buttonText, this.snackBarConfig);
  }
}
