import {Component, OnInit} from '@angular/core';
import {Estate} from "../model/estate";
import {EstatesStore} from "../store/estates.store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
    this.estatesStore.fetchMore();
  }

  ngOnInit(): void {

  }
}
