import {Component, Input, OnInit} from '@angular/core';
import {MapsAPILoader} from "@agm/core";
import {Estate} from "../../../common";

declare const google: any;

@Component({
  selector: 'app-estate-map',
  templateUrl: './estate-map.component.html',
  styleUrls: ['./estate-map.component.scss']
})
export class EstateMapComponent implements OnInit {
  @Input() public estate: Estate;

  public lat = 0;
  public lng = 0;
  public showMap = false;
  public error = false;

  constructor(private mapsLoader: MapsAPILoader) {
  }

  ngOnInit(): void {
    this.mapsLoader.load().then(() => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        address: `Budapest ${this.estate.district} kerület, ${this.estate.address}`
      }, (result, status) => {
        if (status === 'OK' && result.length > 0) {
          this.lat = result[0].geometry.location.lat();
          this.lng = result[0].geometry.location.lng();
        } else {
          this.error = true;
        }
      });
    });
  }

  public loadMap() {
    if (!this.showMap) {
      this.showMap = true;
    }
  }
}
