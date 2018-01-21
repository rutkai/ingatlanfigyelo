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

  constructor(private estatesService: EstatesService,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.estatesService.getEstate(id)
      .then(estate => {
        this.estate = estate;
      });
  }
}
