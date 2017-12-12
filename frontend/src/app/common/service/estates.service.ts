import {Injectable} from "@angular/core";
import {Estate} from "../";
import {EstatesRepository} from "../repository/estates.repository";

@Injectable()
export class EstatesService {
  constructor(private estatesRepository: EstatesRepository) {
  }

  public updateEstateSeen(estate: Estate): Promise<void> {
    return this.estatesRepository.setEstateUserAttributes(estate);
  }

  public updateEstateFavourite(estate: Estate): Promise<void> {
    return this.estatesRepository.setEstateUserAttributes(estate);
  }
}
