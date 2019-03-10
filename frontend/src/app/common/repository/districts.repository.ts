import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable()
export class DistrictsRepository {
  constructor(private http: HttpClient) {
  }

  public getDistricts(): Promise<string[]> {
    return this.http.get(`${environment.apiScheme}://${environment.apiDomain}/filters/districts`).toPromise() as Promise<string[]>;
  }
}
