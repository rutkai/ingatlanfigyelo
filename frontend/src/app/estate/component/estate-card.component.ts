import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Estate, EstatesService, User, UserStore} from "../../common";

@Component({
  selector: 'app-estate-card',
  templateUrl: './estate-card.component.html',
  styleUrls: ['./estate-card.component.scss']
})
export class EstateCardComponent {
  @Input() public estate: Estate;

  @ViewChild('estateCardContent') estateCardContent: ElementRef;

  public user: User;

  constructor(private estatesService: EstatesService,
              private userStore: UserStore) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }
}
