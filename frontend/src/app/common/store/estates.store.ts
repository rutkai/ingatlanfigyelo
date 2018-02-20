import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EstatesRepository} from "../repository/estates.repository";
import {Observable} from "rxjs/Observable";
import {UserStore} from "./user.store";
import {Estate} from "../model/estate";
import {WebsocketEventsStore} from "./websocket-events.store";
import {EstatePool} from "../model/estate-pool";
import {User} from "../model/user";

@Injectable()
export class EstatesStore {
  private readonly FETCH_COUNT = 6;

  private estatesData: Estate[] = [];
  private exhaustedData = false;

  private user: User;

  private estatePoolData = EstatePool.UNSEEN;
  private estatePool: BehaviorSubject<EstatePool> = new BehaviorSubject(this.estatePoolData);
  public estatePool$: Observable<EstatePool> = this.estatePool.asObservable();

  private estates: BehaviorSubject<Estate[]> = new BehaviorSubject(this.estatesData);
  public estates$: Observable<Estate[]> = this.estates.asObservable();

  private exhausted: BehaviorSubject<boolean> = new BehaviorSubject(this.exhaustedData);
  public exhausted$: Observable<boolean> = this.exhausted.asObservable();

  constructor(private estatesRepository: EstatesRepository,
              private websocketEventsStore: WebsocketEventsStore,
              private userStore: UserStore) {
    this.websocketEventsStore.newEstates$.subscribe((estates: Estate[]) => {
      this.estatesData = estates.concat(this.estatesData);
      this.estates.next(this.estatesData);
    });
    this.userStore.user$.subscribe(user => {
      if (this.user !== user) {
        this.resetHard();
      }
      this.user = user;
    });
  }

  public get loadedEstates(): Estate[] {
    return this.estatesData;
  }

  public setEstatePool(value: EstatePool): void {
    if (this.estatePoolData === value) {
      return;
    }

    this.estatePoolData = value;
    this.estatePool.next(this.estatePoolData);
    this.reset();
  }

  public fetchMore(): Promise<void> {
    if (!this.exhaustedData) {
      return this.estatesRepository.getEstates(this.estatesData.length, this.estatePoolData)
        .then((estates: Estate[]) => {
          if (estates.length) {
            this.estatesData = this.estatesData.concat(estates);
            this.estates.next(this.estatesData);
          }
          if (estates.length < this.FETCH_COUNT) {
            this.exhaustedData = true;
            this.exhausted.next(this.exhaustedData);
          }
        });
    }

    return Promise.reject('Cannot fetch from exhausted dataset!');
  }

  public markAllSeen() {
    for (const estate of this.estatesData) {
      estate.isSeen = true;
    }

    if (this.estatePoolData === EstatePool.UNSEEN) {
      this.setEstatePool(EstatePool.SEEN);
    }
  }

  public reset(): void {
    this.estatesData = [];
    this.estates.next(this.estatesData);

    this.exhaustedData = false;
    this.exhausted.next(this.exhaustedData);
  }

  public resetHard(): void {
    this.reset();

    this.estatePoolData = EstatePool.UNSEEN;
    this.estatePool.next(this.estatePoolData);
  }
}
