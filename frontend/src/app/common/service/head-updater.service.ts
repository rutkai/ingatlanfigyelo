import {Inject, Injectable, Renderer2} from "@angular/core";
import {User} from "../model/user";
import {UserStore} from "../store/user.store";
import {DOCUMENT} from "@angular/common";

@Injectable()
export class HeadUpdaterService {
  private renderer: Renderer2;
  private user: User;
  private attached = false;

  constructor(@Inject(DOCUMENT) private document: any,
              private userStore: UserStore) {
    this.userStore.user$.subscribe(user => {
      this.user = user;

      if (this.attached) {
        this.refresh();
      }
    });
  }

  public attach(renderer: Renderer2) {
    this.attached = true;
    this.renderer = renderer;
    this.refresh();
  }

  private refresh() {
    let headChildren = this.document.head.children;
    for (const element of headChildren) {
      if (element.tagName.toLowerCase() === 'link' && element.rel.toLowerCase() === 'alternate' && element.type.toLowerCase() === 'application/rss+xml') {
        this.renderer.setProperty(element, 'href', this.user ? ('/rss/' + this.user.id) : '/rss');
      }
    }
  }
}
