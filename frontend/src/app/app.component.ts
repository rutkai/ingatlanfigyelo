import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {HeadUpdaterService} from "./common/service/head-updater.service";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {NavigationStore, ScrollPositionStore, User, UserStore} from "./common";
import {MatSidenav} from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('pageContent') pageContent: ElementRef;
  @ViewChild('sidenavMenu') sidenavMenu: MatSidenav;

  public showUsermenu = false;

  constructor(private headUpdaterService: HeadUpdaterService,
              private navigationStore: NavigationStore,
              private scrollPositionStore: ScrollPositionStore,
              userStore: UserStore,
              private renderer: Renderer2,
              private router: Router) {
    userStore.user$.subscribe((user: User) => {
      if (!user) {
        this.showUsermenu = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.headUpdaterService.attach(this.renderer);
    this.initScrollAfterNavigation();
    this.navigationStore.restoreRequest$.subscribe((position: number) => {
      this.pageContent.nativeElement.scrollTop = position;
    });
  }

  public scrolled(event) {
    this.scrollPositionStore.updatePosition(event.srcElement.scrollTop, event.srcElement.clientHeight);
  }

  public toggleUsermenu() {
    this.showUsermenu = !this.showUsermenu;
  }

  public hideMenus() {
    this.sidenavMenu.close();
    this.showUsermenu = false;
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
