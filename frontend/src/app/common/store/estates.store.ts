import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {EstatesRepository} from "../repository/estates.repository";
import {Observable} from "rxjs/Observable";
import {UserStore} from "./user.store";
import {Estate} from "../model/estate";
import {WebsocketEventsStore} from "./websocket-events.store";
import {EstatePool} from "../model/estate-pool";
import {User} from "../";

@Injectable()
export class EstatesStore {
  private readonly FETCH_COUNT = 3;

  private favouriteData: Estate[] = [];
  private unseenData: Estate[] = [];
  private seenData: Estate[] = [];
  private estateData: Estate[] = [];
  private favouriteExhaustedData = false;
  private unseenExhaustedData = false;
  private seenExhaustedData = false;
  private exhaustedData = false;

  private user: User;

  private estates: BehaviorSubject<Estate[]> = new BehaviorSubject(this.estateData);
  public estates$: Observable<Estate[]> = this.estates.asObservable();

  private exhausted: BehaviorSubject<boolean> = new BehaviorSubject(this.exhaustedData);
  public exhausted$: Observable<boolean> = this.exhausted.asObservable();

  private favouriteExhausted: BehaviorSubject<boolean> = new BehaviorSubject(this.favouriteExhaustedData);
  public favouriteExhausted$: Observable<boolean> = this.favouriteExhausted.asObservable();

  private unseenExhausted: BehaviorSubject<boolean> = new BehaviorSubject(this.unseenExhaustedData);
  public unseenExhausted$: Observable<boolean> = this.unseenExhausted.asObservable();

  private seenExhausted: BehaviorSubject<boolean> = new BehaviorSubject(this.seenExhaustedData);
  public seenExhausted$: Observable<boolean> = this.seenExhausted.asObservable();

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

    let exhaustedCheck = () => {
      let status = this.unseenExhaustedData && ((this.favouriteExhaustedData && this.seenExhaustedData) || !this.user);
      if (status !== this.exhaustedData) {
        this.exhaustedData = status;
        this.exhausted.next(this.exhaustedData);
      }
    };
    this.favouriteExhausted$.subscribe(exhaustedCheck);
    this.unseenExhausted$.subscribe(exhaustedCheck);
    this.seenExhausted$.subscribe(exhaustedCheck);
  }

  public fetchMore(): Promise<void> {
    if (this.exhaustedData) {
      return Promise.resolve();
    }

    if (!this.favouriteExhaustedData && this.user) {
      return this.estatesRepository.getEstates(this.favouriteData.length, EstatePool.FAVOURITE)
        .then((estates: Estate[]) => {
          if (estates.length) {
            this.favouriteData = this.favouriteData.concat(estates);
            this.estateData = this.estateData.concat(estates);
            this.estates.next(this.estateData);
          }
          if (estates.length < this.FETCH_COUNT) {
            this.favouriteExhaustedData = true;
            this.favouriteExhausted.next(this.favouriteExhaustedData);
            return this.fetchMore();
          }
        });
    }

    if (!this.unseenExhaustedData) {
      return this.estatesRepository.getEstates(this.unseenData.length, EstatePool.UNSEEN)
        .then((estates: Estate[]) => {
          if (estates.length) {
            this.unseenData = this.unseenData.concat(estates);
            this.estateData = this.estateData.concat(estates);
            this.estates.next(this.estateData);
          }
          if (estates.length < this.FETCH_COUNT) {
            this.unseenExhaustedData = true;
            this.unseenExhausted.next(this.unseenExhaustedData);
            return this.fetchMore();
          }
        });
    }

    if (!this.seenExhaustedData && this.user) {
      return this.estatesRepository.getEstates(this.seenData.length, EstatePool.SEEN)
        .then((estates: Estate[]) => {
          if (estates.length) {
            this.seenData = this.seenData.concat(estates);
            this.estateData = this.estateData.concat(estates);
            this.estates.next(this.estateData);
          }
          if (estates.length < this.FETCH_COUNT) {
            this.seenExhaustedData = true;
            this.seenExhausted.next(this.seenExhaustedData);
          }
        });
    }

    return Promise.reject("This shouldn't be happening!");
  }

  public reset(): void {
    this.favouriteData = [];
    this.unseenData = [];
    this.seenData = [];
    this.estateData = [];
    this.estates.next(this.estateData);

    this.favouriteExhaustedData = false;
    this.favouriteExhausted.next(this.favouriteExhaustedData);
    this.unseenExhaustedData = false;
    this.unseenExhausted.next(this.unseenExhaustedData);
    this.seenExhaustedData = false;
    this.seenExhausted.next(this.seenExhaustedData);
  }
}
