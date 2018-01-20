import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Estate, EstatesService, NotificationService, User, UserStore} from "../../common";

@Component({
  selector: 'app-estate',
  templateUrl: './estate.component.html',
  styleUrls: ['./estate.component.scss']
})
export class EstateComponent {
  @Input() public estate: Estate;
  @Input() public inline = false;

  @ViewChild('estateCardContent') estateCardContent: ElementRef;

  public user: User;

  constructor(private estatesService: EstatesService,
              private userStore: UserStore,
              private notificationService: NotificationService) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
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
