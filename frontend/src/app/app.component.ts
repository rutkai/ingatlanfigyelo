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

  public showUsermenu = false;

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
}
