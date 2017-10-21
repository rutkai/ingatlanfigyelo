import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EstatesRepository} from "../repository/estates.repository";
import {Estate} from "../model/estate";
import {Observable} from "rxjs/Observable";

@Injectable()
export class EstatesStore {
  private estateData: Estate[] = [];
  private exhaustedData = false;

  private estates: BehaviorSubject<Estate[]> = new BehaviorSubject(this.estateData);
  public estates$: Observable<Estate[]> = this.estates.asObservable();

  private exhausted: BehaviorSubject<boolean> = new BehaviorSubject(this.exhaustedData);
  public exhausted$: Observable<boolean> = this.exhausted.asObservable();

  constructor(private estatesRepository: EstatesRepository) {
  }

  public fetchMore(): Promise<void> {
    if (this.exhaustedData) {
      return;
    }

    return this.estatesRepository.getEstates(this.estateData.length)
      .then((estates: Estate[]) => {
        if (estates.length) {
          this.estateData = this.estateData.concat(estates);
          this.estates.next(this.estateData);
        } else {
          this.exhaustedData = true;
        }
      });
  }

}
