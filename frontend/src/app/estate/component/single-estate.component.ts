import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Estate, EstatesService, NotificationService, User, UserStore} from "../../common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-single-estate',
  templateUrl: './single-estate.component.html',
  styleUrls: ['./single-estate.component.scss']
})
export class SingleEstateComponent implements OnInit {
  @ViewChild('estateCardContent') estateCardContent: ElementRef;

  public estate: Estate;
  public user: User;

  public loadContent = false;
  public isVisible = false;
  public estateCardContentHeight = 'auto';
  public expandDescription = false;

  constructor(private estatesService: EstatesService,
              private userStore: UserStore,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.estatesService.getEstate(id)
      .then(estate => {
        this.estate = estate;
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
