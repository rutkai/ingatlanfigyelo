import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs";
import {RegionsRepository} from "../repository/regions.repository";

@Injectable()
export class RegionsStore {
  private regions: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public regions$: Observable<string[]> = this.regions.asObservable();

  constructor(regionsRepository: RegionsRepository) {
    regionsRepository.getRegions().then((regions: string[]) => {
      this.regions.next(regions);
    });
  }
}
