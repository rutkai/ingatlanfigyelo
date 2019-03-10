import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs";
import {CitiesRepository} from "../repository/cities.repository";

@Injectable()
export class CitiesStore {
  private cities: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public cities$: Observable<string[]> = this.cities.asObservable();

  constructor(citiesRepository: CitiesRepository) {
    citiesRepository.getCities().then((cities: string[]) => {
      this.cities.next(cities);
    });
  }
}
