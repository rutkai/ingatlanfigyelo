import {Component} from '@angular/core';
import {Stats, StatsStore} from "../../common";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  public stats: Stats;

  constructor(private statsStore: StatsStore) {
    this.statsStore.stats$.subscribe((stats: Stats) => {
      this.stats = stats;
    });
  }
}
