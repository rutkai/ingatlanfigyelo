import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Estate, EstatesService, NotificationService} from "../../common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-estate-card',
  templateUrl: './estate-card.component.html',
  styleUrls: ['./estate-card.component.scss']
})
export class EstateCardComponent {
  @Input() public estate: Estate;

  @ViewChild('estateCardContent') estateCardContent: ElementRef;

  public imgError = false;

  constructor(private router: Router,
              private estatesService: EstatesService,
              private notificationService: NotificationService) {
  }

  public get coverImg() {
    return this.estate.images.length && !this.imgError ? this.estate.images[0] : 'assets/logo.png';
  }

  public imgLoadError() {
    this.imgError = true;
  }

  public openEstate() {
    this.router.navigate(['estate', this.estate.id]);
  }

  public toggleSeenFavorite(event) {
    event.stopPropagation();

    if (this.estate.favourite) {
      this.estate.favourite = false;
      this.estatesService.updateEstateFavourite(this.estate)
        .catch(() => {
          this.estate.favourite = true;
          this.notificationService.showSnackbarNotification('Hiba mentés közben!');
        });
    }

    this.estate.isSeen = !this.estate.isSeen;
    this.estatesService.updateEstateSeen(this.estate)
      .catch(() => {
        this.estate.isSeen = !this.estate.isSeen;
        this.notificationService.showSnackbarNotification('Hiba mentés közben!');
      });
  }
}
