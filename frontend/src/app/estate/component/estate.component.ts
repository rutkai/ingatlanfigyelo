import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Estate, EstatesService, User, UserStore} from "../../common";

@Component({
  selector: 'app-estate',
  templateUrl: './estate.component.html',
  styleUrls: ['./estate.component.scss']
})
export class EstateComponent {
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
