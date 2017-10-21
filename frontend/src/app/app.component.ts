import {Component, OnInit} from '@angular/core';
import {Estate} from "../model/estate";
import {EstatesStore} from "../store/estates.store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public estates: Estate[] = [];
  public exhausted = true;

  constructor(private estatesStore: EstatesStore) {
    this.estatesStore.estates$.subscribe(estates => {
      this.estates = estates;
    });
    this.estatesStore.exhausted$.subscribe(exhausted => {
      this.exhausted = exhausted;
    });
  }

  ngOnInit(): void {
    this.estatesStore.fetchMore();
  }
}
