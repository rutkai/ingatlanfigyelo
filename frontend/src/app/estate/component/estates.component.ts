import {Component} from '@angular/core';
import {Estate, EstatesService, EstatesStore, NotificationService, User, UserStore} from "../../common";

@Component({
  selector: 'app-estates',
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.scss']
})
export class EstatesComponent {
  public estates: Estate[] = [];
  public exhausted = true;
  public areUnseenEstates = false;

  private user: User;
  private loadingInProgress = false;

  constructor(private estatesStore: EstatesStore,
              private estatesService: EstatesService,
              private notificationService: NotificationService,
              private userStore: UserStore) {
    this.estatesStore.estates$.subscribe(estates => {
      this.estates = estates;
    });
    this.estatesStore.exhausted$.subscribe(exhausted => {
      this.exhausted = exhausted;
    });
    this.estatesStore.unseenEstates$.subscribe(exhausted => {
      this.areUnseenEstates = !!exhausted.length;
    });
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  public loadMoreEstates() {
    if (this.loadingInProgress) {
      return;
    }

    this.loadingInProgress = true;
    this.estatesStore.fetchMore().then(() => {
      setTimeout(() => {
        this.loadingInProgress = false;
      }, 100);
    });
  }

  public markAllSeen() {
    this.estatesService.markAllSeen()
      .catch(() => {
        this.notificationService.showSnackbarNotification('Hiba mentés közben');
      });
  }
}
