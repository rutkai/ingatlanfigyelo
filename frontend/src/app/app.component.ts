import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {HeadUpdaterService} from "./common/service/head-updater.service";
import {User, UserStore} from "./common";
import {MatSidenav} from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('pageContent') pageContent: ElementRef;
  @ViewChild('sidenavMenu') sidenavMenu: MatSidenav;
  @ViewChild('sidenavFilter') sidenavFilter: MatSidenav;

  public showUsermenu = false;

  private swipeCoord?: [number, number];
  private swipeTime?: number;

  constructor(private headUpdaterService: HeadUpdaterService,
              userStore: UserStore,
              private renderer: Renderer2) {
    userStore.user$.subscribe((user: User) => {
      if (!user) {
        this.showUsermenu = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.headUpdaterService.attach(this.renderer);
  }

  public toggleUsermenu() {
    this.showUsermenu = !this.showUsermenu;
  }

  public hideMenus() {
    this.sidenavMenu.close();
    this.showUsermenu = false;
  }

  public swipe(e: TouchEvent, when: string, target?: string): void {
    const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000 //Rapid
        && Math.abs(direction[0]) > 30 //Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { //Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';

        if (target === 'menu' && swipe === 'next') {
          this.sidenavMenu.close();
        }
        if (target === 'filter' && swipe === 'previous') {
          this.sidenavFilter.close();
        }
      }
    }
  }
}
