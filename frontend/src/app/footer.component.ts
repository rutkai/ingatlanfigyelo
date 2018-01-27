import {Component} from '@angular/core';
import {StorageService} from "./common";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public show = true;

  constructor(private storageService: StorageService) {
    let store = storageService.get('cookies-notice');
    this.show = store === null || store;
  }

  public hide() {
    this.show = false;
    this.storageService.set('cookies-notice', false);
  }
}
