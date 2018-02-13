import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EstateParser} from "../parsers/estate.parser";
import {Estate} from "../model/estate";
import {EstatePool} from "../model/estate-pool";
import {environment} from "../../../environments/environment";

@Injectable()
export class EstatesRepository {
  constructor(private http: HttpClient, private estateParser: EstateParser) {
  }

  public getEstate(id: string): Promise<Estate> {
    return this.http.get(`${environment.apiScheme}://${environment.apiDomain}/estate/${id}`, {withCredentials: true}).toPromise()
      .then((response: any) => response.estate)
      .then(estate => this.estateParser.parse(estate));
  }

  public getEstates(start: number = 0, pool: EstatePool): Promise<Estate[]> {
    return this.http.get(`${environment.apiScheme}://${environment.apiDomain}/estates/${start}/${pool}`, {withCredentials: true}).toPromise()
      .then((response: any) => response.estates)
      .then(estates => this.estateParser.parseMany(estates));
  }

  public setEstateUserAttributes(estate: Estate): Promise<void> {
    const data = {
      favourite: estate.favourite,
      seen: estate.isSeen
    };

    return this.http.put(`${environment.apiScheme}://${environment.apiDomain}/estate/${estate.id}`, data, {withCredentials: true}).toPromise()
      .then(() => {});
  }

  public markAllSeen(): Promise<void> {
    return this.http.post(`${environment.apiScheme}://${environment.apiDomain}/estates/mark-read`, {}, {withCredentials: true}).toPromise()
      .then(() => {});
  }
}
