import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {HeadUpdaterService} from "./common/service/head-updater.service";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('pageContent') pageContent: ElementRef;

  public footerHidden = false;

  public lastPosition: number = 0;

  constructor(private headUpdaterService: HeadUpdaterService,
              private renderer: Renderer2,
              public router: Router) {
  }

  public scrolled(event) {
    this.footerHidden = event.srcElement.scrollTop !== 0;
  }

  ngAfterViewInit(): void {
    this.headUpdaterService.attach(this.renderer);
    this.initScrollAfterNavigation();
  }

  private initScrollAfterNavigation() {
    this.router.events
      .filter(events => events instanceof NavigationStart || events instanceof NavigationEnd)
      .subscribe(events => {
        if (events instanceof NavigationStart && this.router.url === '/') {
          this.lastPosition = this.pageContent.nativeElement.scrollTop || 0;
        }
        if (events instanceof NavigationEnd && events.url === '/') {
          this.pageContent.nativeElement.scrollTop = this.lastPosition;
        }
      });
  }
}
