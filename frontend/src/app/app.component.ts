import {Component} from '@angular/core';
import {Estate} from "../model/estate";
import {EstatesStore} from "../store/estates.store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public estates: Estate[] = [];
  public exhausted = true;

  private loadingInProgress = false;

  constructor(private estatesStore: EstatesStore) {
    this.estatesStore.estates$.subscribe(estates => {
      this.estates = estates;
    });
    this.estatesStore.exhausted$.subscribe(exhausted => {
      this.exhausted = exhausted;
    });
  }

  public loadMoreEstates() {
    if (this.loadingInProgress) {
      return;
    }

    this.loadingInProgress = true;
    this.estatesStore.fetchMore().then(() => {
      setTimeout(() => {
        this.loadingInProgress = false;
      }, 100);
    });
  }
}
