import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Estate, EstatesService, NotificationService, User, UserStore} from "../../common";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'app-estate',
  templateUrl: './estate.component.html',
  styleUrls: ['./estate.component.scss']
})
export class EstateComponent implements OnDestroy {
  @Input() public estate: Estate;
  @Input() public inline = false;

  @ViewChild('estateCardContent') estateCardContent: ElementRef;

  public user: User;

  private subscriptions: Subscription[] = [];

  constructor(private estatesService: EstatesService,
              userStore: UserStore,
              private notificationService: NotificationService) {
    this.subscriptions.push(userStore.user$.subscribe(user => {
      this.user = user;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  public hasDuplicates(): boolean {
    return Object.keys(this.estate.urls).length > 1;
  }

  public getUrlKeys(): string[] {
    return Object.keys(this.estate.urls);
  }

  public toggleFavourite() {
    this.estate.favourite = !this.estate.favourite;
    this.estatesService.updateEstateFavourite(this.estate)
      .catch(() => {
        this.estate.favourite = !this.estate.favourite;
        this.notificationService.showSnackbarNotification('Hiba mentés közben!');
      });
  }

  public toggleSeen() {
    this.estate.isSeen = !this.estate.isSeen;
    this.estatesService.updateEstateSeen(this.estate)
      .catch(() => {
        this.estate.isSeen = !this.estate.isSeen;
        this.notificationService.showSnackbarNotification('Hiba mentés közben!');
      });
  }
}
