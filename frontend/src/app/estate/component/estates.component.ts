import {
  AfterContentInit, Component, ElementRef, Inject, ViewChild
} from '@angular/core';
import {
  Estate, EstatesService, EstatesStore, NavigationStore, NotificationService, User, UserStore,
  View
} from "../../common";

@Component({
  selector: 'app-estates',
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.scss'],
})
export class EstatesComponent implements AfterContentInit {
  @ViewChild('estateContainer') estateContainer: ElementRef;

  public estates: Estate[] = [];
  public estatesGrid: Estate[][] = [[]];
  public exhausted = true;
  public areUnseenEstates = false;
  public enableLoading = false;

  public views = View;

  private user: User;
  private loadingInProgress = false;

  constructor(private estatesStore: EstatesStore,
              private estatesService: EstatesService,
              private notificationService: NotificationService,
              private navigationStore: NavigationStore,
              private userStore: UserStore,
              @Inject('Window') private window: Window) {
    this.estatesStore.estates$.subscribe(estates => {
      this.estates = estates;
      this.repopulateEstatesGrid();
    });
    this.estatesStore.exhausted$.subscribe(exhausted => {
      this.exhausted = exhausted;
    });
    this.estatesStore.unseenEstates$.subscribe(exhausted => {
      this.areUnseenEstates = !!exhausted.length;
    });
    this.userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.enableLoading = true;
      this.loadInitialEstates();
    }, 100);
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
