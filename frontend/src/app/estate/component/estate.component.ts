import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Estate, EstatesService, NotificationService, User, UserStore} from "../../common";

@Component({
  selector: 'app-estate',
  templateUrl: './estate.component.html',
  styleUrls: ['./estate.component.scss']
})
export class EstateComponent {
  @Input() public estate: Estate;

  @ViewChild('estateCardContent') estateCardContent: ElementRef;

  public user: User;

  public loadContent = false;
  public isVisible = false;
  public estateCardContentHeight = 'auto';
  public expandDescription = false;

  constructor(private estatesService: EstatesService,
              private userStore: UserStore,
              private notificationService: NotificationService) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  public loadLazyContent(event) {
    if (event.value) {
      this.estateCardContentHeight = 'auto';
      this.isVisible = this.loadContent = true;
    } else {
      this.estateCardContentHeight =
        this.estateCardContent.nativeElement ?
        this.estateCardContent.nativeElement.offsetHeight + 'px' : 'auto';
      this.isVisible = false;
    }
  }

  public toggleDescription() {
    this.expandDescription = !this.expandDescription;
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
