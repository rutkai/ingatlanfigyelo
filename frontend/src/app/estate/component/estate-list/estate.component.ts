import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Estate} from "../../../common";

@Component({
  selector: 'app-estate',
  templateUrl: './estate.component.html',
  styleUrls: ['./estate.component.scss']
})
export class EstateComponent {
  @Input() public estate: Estate;

  @ViewChild('estateCardContent') estateCardContent: ElementRef;

  public loadContent = false;
  public isVisible = false;
  public estateCardContentHeight = 'auto';
  public expandDescription = false;

  public loadLazyContent(event) {
    if (event.value) {
      this.estateCardContentHeight = 'auto';
      this.isVisible = this.loadContent = true;
    } else {
      this.estateCardContentHeight =
        this.estateCardContent.nativeElement ?
        this.estateCardContent.nativeElement.offsetHeight + 'px' : 'auto';
      this.isVisible = false;
    }
  }

  public toggleDescription() {
    this.expandDescription = !this.expandDescription;
  }
}
