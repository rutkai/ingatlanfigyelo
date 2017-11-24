import {Component, Input} from '@angular/core';
import {Estate} from "../../model/estate";

@Component({
  selector: 'app-estate',
  templateUrl: './estate.component.html',
  styleUrls: ['./estate.component.scss']
})
export class EstateComponent {
  @Input() public estate: Estate;

  public loadContent = false;

  public loadLazyContent(event) {
    if (event.value) {
      this.loadContent = true;
    }
  }
}
