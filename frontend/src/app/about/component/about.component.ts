import {Component, OnDestroy} from '@angular/core';
import {Stats, StatsStore} from "../../common";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnDestroy {
  public stats: Stats;

  private subscriptions: Subscription[] = [];

  constructor(private statsStore: StatsStore) {
    this.subscriptions.push(this.statsStore.stats$.subscribe((stats: Stats) => {
      this.stats = stats;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }
}
