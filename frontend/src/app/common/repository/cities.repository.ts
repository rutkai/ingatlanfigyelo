import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable()
export class CitiesRepository {
  constructor(private http: HttpClient) {
  }

  public getCities(): Promise<string[]> {
    return this.http.get(`${environment.apiScheme}://${environment.apiDomain}/filters/cities`).toPromise() as Promise<string[]>;
  }
}
