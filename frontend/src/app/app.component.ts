import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {HeadUpdaterService} from "./common/service/head-updater.service";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {EstatesStore, NavigationStore} from "./common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('pageContent') pageContent: ElementRef;

  public footerHidden = false;

  constructor(private headUpdaterService: HeadUpdaterService,
              private navigationStore: NavigationStore,
              private renderer: Renderer2,
              private router: Router) {
  }

  public scrolled(event) {
    this.footerHidden = event.srcElement.scrollTop !== 0;
  }

  ngAfterViewInit(): void {
    this.headUpdaterService.attach(this.renderer);
    this.initScrollAfterNavigation();
    this.navigationStore.restoreRequest$.subscribe((position: number) => {
      this.pageContent.nativeElement.scrollTop = position;
    });
  }

  private initScrollAfterNavigation() {
    this.router.events
      .filter(events => events instanceof NavigationStart || events instanceof NavigationEnd)
      .subscribe(events => {
        if (events instanceof NavigationStart && this.router.url === '/') {
          this.navigationStore.storePosition(this.pageContent.nativeElement.scrollTop || 0);
        }
        if (events instanceof NavigationEnd) {
          this.pageContent.nativeElement.scrollTop = 0;
        }
      });
  }
}
