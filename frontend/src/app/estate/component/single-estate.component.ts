import {Component, OnInit} from '@angular/core';
import {Estate, EstatesService, NotificationService, User, UserStore} from "../../common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-single-estate',
  templateUrl: './single-estate.component.html',
  styleUrls: ['./single-estate.component.scss']
})
export class SingleEstateComponent implements OnInit {
  public estate: Estate;
  public user: User;

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
