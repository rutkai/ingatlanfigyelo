import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject,
  ViewChild
} from '@angular/core';
import {
  Estate, EstatesService, EstatesStore, NotificationService, User, UserService, UserStore,
  View
} from "../../common";

@Component({
  selector: 'app-estates',
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstatesComponent implements AfterViewInit {
  @ViewChild('estateContainer') estateContainer: ElementRef;

  public estates: Estate[] = [];
  public exhausted = true;
  public areUnseenEstates = false;
  public enableLoading = false;

  public views = View;

  private user: User;
  private loadingInProgress = false;

  constructor(private estatesStore: EstatesStore,
              private estatesService: EstatesService,
              private notificationService: NotificationService,
              private userStore: UserStore,
              private userService: UserService,
              private changeDetector: ChangeDetectorRef,
              @Inject('Window') private window: Window) {
    this.estatesStore.estates$.subscribe(estates => {
      this.estates = estates;
      this.changeDetector.markForCheck();
    });
    this.estatesStore.exhausted$.subscribe(exhausted => {
      this.exhausted = exhausted;
      this.changeDetector.markForCheck();
    });
    this.estatesStore.unseenEstates$.subscribe(exhausted => {
      this.areUnseenEstates = !!exhausted.length;
      this.changeDetector.markForCheck();
    });
    this.userStore.user$.subscribe(user => {
      this.user = user;
      this.changeDetector.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.enableLoading = true;
    this.loadInitialEstates();
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

  public get view() {
    return this.user ? this.user.view : View.CARDS;
  }

  public loadMoreEstates() {
    if (this.loadingInProgress || !this.enableLoading) {
      return;
    }

    this.loadingInProgress = true;
    this.estatesStore.fetchMore().then(() => {
      setTimeout(() => {
        this.loadingInProgress = false;
        this.loadInitialEstates();
      }, 100);
    });
  }

  public markAllSeen() {
    this.estatesService.markAllSeen()
      .catch(() => {
        this.notificationService.showSnackbarNotification('Hiba mentés közben');
      });
  }

  public toggleView() {
    if (this.user.view === View.CARDS) {
      this.userService.changeView(View.INLINE);
    } else {
      this.userService.changeView(View.CARDS);
    }
  }

  private loadInitialEstates() {
    if (this.estateContainer.nativeElement.scrollHeight < this.window.innerHeight) {
      this.loadMoreEstates();
    }
  }
}
