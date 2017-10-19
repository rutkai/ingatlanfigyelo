import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Estate} from "../model/estate";

@Injectable()
export class EstatesRepository {
  constructor(private http: HttpClient) {}

  public getEstates(start: number = 0): Promise<Estate[]> {
    return this.http.get(`/load-estates/${start}`).toPromise()
      .then((response: any) => response.estates)
      .then((rawEstates: any[]) => {
        return rawEstates.map(rawEstate => {
          const estate = new Estate();
          estate.balcony = rawEstate.balcony;
          estate.district = rawEstate.district;
          estate.elevator = rawEstate.elevator;
          estate.floor = rawEstate.floor;
          estate.heating = rawEstate.heating;
          estate.images = rawEstate.images;
          estate.price = rawEstate.price;
          estate.region = rawEstate.region;
          estate.rooms = rawEstate.rooms;
          estate.size = rawEstate.size;
          estate.source = rawEstate.source;
          estate.url = rawEstate.url;

          return estate;
        });
      });
  }
}
