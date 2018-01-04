import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Stats} from "../model/stats";

@Injectable()
export class StatsRepository {
  constructor(private http: HttpClient) {
  }

  public getStats(): Promise<Stats> {
    return this.http.get(`//${environment.apiDomain}/stats`).toPromise() as Promise<Stats>;
  }
}
