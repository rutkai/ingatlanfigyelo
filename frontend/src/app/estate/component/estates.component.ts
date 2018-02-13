import {
  AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild
} from '@angular/core';
import {
  Estate, EstatesService, EstatesStore, NavigationStore, NotificationService, User, UserStore, View
} from "../../common";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-estates',
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.scss'],
})
export class EstatesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('estatesViewbox') estatesViewbox: ElementRef;
  @ViewChild('estateContainer') estateContainer: ElementRef;

  public user: User;
  public estates: Estate[] = [];
  public estatesGrid: Estate[][] = [[]];
  public exhausted = true;
  public areUnseenEstates = false;
  public enableLoading = false;

  public views = View;

  private loadingInProgress = false;

  private subscriptions: Subscription[] = [];

  constructor(private estatesStore: EstatesStore,
              private estatesService: EstatesService,
              private notificationService: NotificationService,
              private userStore: UserStore,
              private navigationStore: NavigationStore,
              @Inject('Window') private window: Window) {
    this.subscriptions.push(this.estatesStore.estates$.subscribe((estates: Estate[]) => {
      if (!estates.length && this.estates.length) {
        this.navigationStore.position = 0;
      }

      this.estates = estates;
      this.repopulateEstatesGrid();
      this.loadInitialEstates();
    }));
    this.subscriptions.push(this.estatesStore.exhausted$.subscribe((exhausted: boolean) => {
      this.exhausted = exhausted;
    }));
    this.subscriptions.push(this.estatesStore.unseenEstates$.subscribe((unseenEstates: Estate[]) => {
      this.areUnseenEstates = !!unseenEstates.length;
    }));
    this.subscriptions.push(this.userStore.user$.subscribe((user: User) => {
      this.user = user;
      setTimeout(() => {
        this.loadInitialEstates();
      }, 100);
    }));
  }

  ngOnDestroy(): void {
    this.navigationStore.position = this.estatesViewbox.nativeElement.scrollTop;
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.enableLoading = true;
    this.loadInitialEstates();
    this.estatesViewbox.nativeElement.scrollTop = this.navigationStore.position;
  }

  public get view() {
    return this.user ? this.user.view : View.CARDS;
  }

  public scrolled(event): void {
    let bottom = event.srcElement.scrollTop + event.srcElement.clientHeight;
    let containerHeight = this.estateContainer.nativeElement.clientHeight;
    if (!this.exhausted && containerHeight && bottom > containerHeight) {
      this.loadMoreEstates();
    }
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

  private loadInitialEstates() {
    if (this.estateContainer && this.estateContainer.nativeElement.scrollHeight < this.window.innerHeight) {
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
