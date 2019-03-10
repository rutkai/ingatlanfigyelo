import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs";
import {DistrictsRepository} from "../repository/districts.repository";

@Injectable()
export class DistrictsStore {
  private districts: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public districts$: Observable<string[]> = this.districts.asObservable();

  constructor(districtsRepository: DistrictsRepository) {
    districtsRepository.getDistricts().then((districts: string[]) => {
      this.districts.next(districts);
    });
  }
}
