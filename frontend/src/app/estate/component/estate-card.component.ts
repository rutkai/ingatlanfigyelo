import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Estate} from "../../common";

@Component({
  selector: 'app-estate-card',
  templateUrl: './estate-card.component.html',
  styleUrls: ['./estate-card.component.scss']
})
export class EstateCardComponent {
  @Input() public estate: Estate;

  @ViewChild('estateCardContent') estateCardContent: ElementRef;

  public imgError = false;

  public get coverImg() {
    return this.estate.images.length && !this.imgError ? this.estate.images[0] : '/assets/logo.png';
  }

  public imgLoadError() {
    this.imgError = true;
  }
}
