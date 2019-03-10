import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable()
export class RegionsRepository {
  constructor(private http: HttpClient) {
  }

  public getRegions(): Promise<string[]> {
    return this.http.get(`${environment.apiScheme}://${environment.apiDomain}/filters/regions`).toPromise() as Promise<string[]>;
  }
}
