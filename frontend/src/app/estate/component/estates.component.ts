import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {Estate, EstatesService, EstatesStore, NotificationService, User, UserStore} from "../../common";

@Component({
  selector: 'app-estates',
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstatesComponent {
  @ViewChild('estateContainer') estateContainer: ElementRef;

  public estates: Estate[] = [];
  public exhausted = true;
  public areUnseenEstates = false;

  private user: User;
  private loadingInProgress = false;

  constructor(private estatesStore: EstatesStore,
              private estatesService: EstatesService,
              private notificationService: NotificationService,
              private userStore: UserStore,
              private changeDetector: ChangeDetectorRef,
              @Inject('Window') private window: Window) {
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

  public get estatesForRender(): Estate[][] {
    const rows: Estate[][] = [[]];

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
      this.changeDetector.markForCheck();
      setTimeout(() => {
        this.loadingInProgress = false;
        if (this.estateContainer.nativeElement.scrollHeight < this.window.innerHeight) {
          this.loadMoreEstates();
        }
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
