import {Component, Input} from '@angular/core';
import {Estate} from "../../../common";

@Component({
  selector: 'app-estate',
  templateUrl: './estate.component.html',
  styleUrls: ['./estate.component.scss']
})
export class EstateComponent {
  @Input() public estate: Estate;

  public loadContent = false;
  public expandDescription = false;

  public loadLazyContent(event) {
    if (event.value) {
      this.loadContent = true;
    }
  }

  public toggleDescription() {
    this.expandDescription = !this.expandDescription;
  }
}
