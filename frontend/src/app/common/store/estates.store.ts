import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EstatesRepository} from "../repository/estates.repository";
import {Observable} from "rxjs/Observable";
import {UserStore} from "./user.store";
import {Estate} from "../model/estate";
import {WebsocketEventsStore} from "./websocket-events.store";

@Injectable()
export class EstatesStore {
  private readonly FETCH_COUNT = 3;

  private estateData: Estate[] = [];
  private exhaustedData = false;

  private estates: BehaviorSubject<Estate[]> = new BehaviorSubject(this.estateData);
  public estates$: Observable<Estate[]> = this.estates.asObservable();

  private exhausted: BehaviorSubject<boolean> = new BehaviorSubject(this.exhaustedData);
  public exhausted$: Observable<boolean> = this.exhausted.asObservable();

  constructor(private estatesRepository: EstatesRepository,
              private websocketEventsStore: WebsocketEventsStore,
              private userStore: UserStore) {
    this.websocketEventsStore.newEstates$.subscribe((estates: Estate[]) => {
      this.estateData = estates.concat(this.estateData);
      this.estates.next(this.estateData);
    });
    this.userStore.user$.subscribe(() => {
      this.reset();
    });
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
        }
        if (estates.length < this.FETCH_COUNT) {
          this.exhaustedData = true;
          this.exhausted.next(this.exhaustedData);
        }
      });
  }

  public reset(): void {
    this.estateData = [];
    this.estates.next(this.estateData);
    this.exhaustedData = false;
    this.exhausted.next(this.exhaustedData);
  }
}