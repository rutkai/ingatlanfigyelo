import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public footerHidden = false;

  public scrolled(event) {
    this.footerHidden = event.srcElement.scrollTop !== 0;
  }
}
