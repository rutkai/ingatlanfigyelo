import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Estate} from "../model/estate";
import {EstateParser} from "../parsers/estate.parser";

@Injectable()
export class EstatesRepository {
  constructor(private http: HttpClient, private estateParser: EstateParser) {
  }

  public getEstates(start: number = 0): Promise<Estate[]> {
    return this.http.get(`/load-estates/${start}`, {withCredentials: true}).toPromise()
      .then((response: any) => response.estates)
      .then(this.estateParser.parse);
  }
}
