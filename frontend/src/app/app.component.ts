import {AfterViewInit, Component, Renderer2} from '@angular/core';
import {HeadUpdaterService} from "./common/service/head-updater.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  public footerHidden = false;

  constructor(private headUpdaterService: HeadUpdaterService, private renderer: Renderer2) {
  }

  public scrolled(event) {
    this.footerHidden = event.srcElement.scrollTop !== 0;
  }

  ngAfterViewInit(): void {
    this.headUpdaterService.attach(this.renderer);
  }
}
