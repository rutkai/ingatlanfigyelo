import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Estate, User, UserStore} from "../../common";

@Component({
  selector: 'app-estate-card',
  templateUrl: './estate-card.component.html',
  styleUrls: ['./estate-card.component.scss']
})
export class EstateCardComponent {
  @Input() public estate: Estate;

  @ViewChild('estateCardContent') estateCardContent: ElementRef;

  public user: User;
  public imgError = false;

  constructor(userStore: UserStore) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  public get coverImg() {
    return this.estate.images.length && !this.imgError ? this.estate.images[0] : '/assets/logo.png';
  }

  public imgLoadError() {
    this.imgError = true;
  }
}
