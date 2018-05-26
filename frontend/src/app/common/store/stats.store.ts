import {Injectable} from "@angular/core";
import {StatsRepository} from "../repository/stats.repository";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {Stats} from "../model/stats";

@Injectable()
export class StatsStore {
  private stats: BehaviorSubject<Stats> = new BehaviorSubject(null);
  public stats$: Observable<Stats> = this.stats.asObservable();

  constructor(statsRepository: StatsRepository) {
    statsRepository.getStats().then((stats: Stats) => {
      this.stats.next(stats);
    });
  }
}
