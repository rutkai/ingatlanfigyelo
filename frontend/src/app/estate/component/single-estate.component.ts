import {Component, OnInit} from '@angular/core';
import {Estate, EstatesService} from "../../common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-single-estate',
  templateUrl: './single-estate.component.html',
  styleUrls: ['./single-estate.component.scss']
})
export class SingleEstateComponent implements OnInit {
  public estate: Estate;

  constructor(private estatesService: EstatesService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.estatesService.getEstate(id)
      .then(estate => {
        this.estate = estate;
      });
  }
}
