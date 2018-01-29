import {
  AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild
} from '@angular/core';
import {
  Estate, EstatesService, EstatesStore, NavigationStore, NotificationService, PositionData, ScrollPositionStore, User,
  UserStore, View
} from "../../common";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-estates',
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.scss'],
})
export class EstatesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('estateContainer') estateContainer: ElementRef;

  public estates: Estate[] = [];
  public estatesGrid: Estate[][] = [[]];
  public exhausted = true;
  public areUnseenEstates = false;
  public enableLoading = false;

  public views = View;

  private user: User;
  private loadingInProgress = false;
  private containerHeight = 0;

  private subscriptions: Subscription[] = [];

  constructor(private estatesStore: EstatesStore,
              private estatesService: EstatesService,
              private notificationService: NotificationService,
              private navigationStore: NavigationStore,
              private userStore: UserStore,
              scrollPositionStore: ScrollPositionStore,
              @Inject('Window') private window: Window) {
    this.subscriptions.push(this.estatesStore.estates$.subscribe((estates: Estate[]) => {
      this.estates = estates;
      this.repopulateEstatesGrid();
    }));
    this.subscriptions.push(this.estatesStore.exhausted$.subscribe((exhausted: boolean) => {
      this.exhausted = exhausted;
    }));
    this.subscriptions.push(this.estatesStore.unseenEstates$.subscribe((unseenEstates: Estate[]) => {
      this.areUnseenEstates = !!unseenEstates.length;
    }));
    this.subscriptions.push(this.userStore.user$.subscribe((user: User) => {
      this.user = user;
    }));
    this.subscriptions.push(scrollPositionStore.position$.subscribe((position: PositionData) => {
      if (!this.exhausted && this.containerHeight && position.bottom > this.containerHeight) {
        this.loadMoreEstates();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.enableLoading = true;
    this.containerHeight = this.estateContainer.nativeElement.clientHeight;
    this.loadInitialEstates();
    this.navigationStore.restorePosition();
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
        this.containerHeight = this.estateContainer.nativeElement.clientHeight;
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

  private loadInitialEstates() {
    if (this.estateContainer.nativeElement.scrollHeight < this.window.innerHeight) {
      this.loadMoreEstates();
    }
  }

  private repopulateEstatesGrid() {
    const rows: Estate[][] = [[]];
    for (const estate of this.estates) {
      if (rows[rows.length - 1].length === 3) {
        rows.push([]);
      }
      rows[rows.length - 1].push(estate);
    }

    this.estatesGrid = rows;
  }
}
