import {Injectable} from "@angular/core";
import {StatsRepository} from "../repository/stats.repository";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {Stats} from "../model/stats";

@Injectable()
export class StatsStore {
  private stats: BehaviorSubject<Stats> = new BehaviorSubject(null);
  public stats$: Observable<Stats> = this.stats.asObservable();

  constructor(private statsRepository: StatsRepository) {
    statsRepository.getStats().then((stats: Stats) => {
      this.stats.next(stats);
    });
  }
}
