import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EstateParser} from "../parsers/estate.parser";
import {Estate} from "../model/estate";
import {EstatePool} from "../model/estate-pool";

@Injectable()
export class EstatesRepository {
  constructor(private http: HttpClient, private estateParser: EstateParser) {
  }

  public getEstates(start: number = 0, pool: EstatePool): Promise<Estate[]> {
    return this.http.get(`/estates/${start}/${pool}`, {withCredentials: true}).toPromise()
      .then((response: any) => response.estates)
      .then(this.estateParser.parse);
  }

  public setEstateUserAttributes(estate: Estate): Promise<void> {
    const data = {
      favourite: estate.favourite,
      seen: estate.isSeen
    };

    return this.http.put(`/estate/${estate.id}`, data, {withCredentials: true}).toPromise()
      .then(() => {});
  }

  public markAllSeen(): Promise<void> {
    return this.http.post(`/estates/mark-read`, {}, {withCredentials: true}).toPromise()
      .then(() => {});
  }
}
