import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Estate, EstatesService, EstatesStore, NotificationService, User, UserStore} from "../../common";

@Component({
  selector: 'app-estates',
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  public get estatesForRender() {
    const rows = [[]];

    for (const estate of this.estates) {
      if (rows[rows.length - 1].length === 3) {
        rows.push([]);
      }
      rows[rows.length - 1].push(estate);
    }

    return rows;
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
