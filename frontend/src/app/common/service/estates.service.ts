import {Injectable} from "@angular/core";
import {EstatesRepository} from "../repository/estates.repository";
import {EstatesStore} from "../store/estates.store";
import {Estate} from "../model/estate";

@Injectable()
export class EstatesService {
  constructor(private estatesRepository: EstatesRepository,
              private estatesStore: EstatesStore) {
  }

  public updateEstateSeen(estate: Estate): Promise<void> {
    return this.estatesRepository.setEstateUserAttributes(estate);
  }

  public updateEstateFavourite(estate: Estate): Promise<void> {
    return this.estatesRepository.setEstateUserAttributes(estate);
  }

  public markAllSeen(): Promise<void> {
    return this.estatesRepository.markAllSeen()
      .then(() => {
        this.estatesStore.markAllSeen();
      });
  }
}
