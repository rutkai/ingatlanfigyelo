import {Injectable} from "@angular/core";
import {Estate} from "../model/estate";

@Injectable()
export class EstateParser {
  public parse(rawEstates: any[]): Estate[] {
    return rawEstates.map(rawEstate => {
      const estate = new Estate();
      estate.balcony = rawEstate.balcony;
      estate.district = rawEstate.district;
      estate.elevator = rawEstate.elevator;
      estate.floor = rawEstate.floor;
      estate.heating = rawEstate.heating;
      estate.images = rawEstate.images;
      estate.price = rawEstate.price;
      estate.address = rawEstate.address;
      estate.rooms = rawEstate.rooms;
      estate.halfrooms = rawEstate.halfrooms;
      estate.size = rawEstate.size;
      estate.descriptionHtml = rawEstate.descriptionHtml;
      estate.squareMeterPrice = rawEstate.squareMeterPrice;
      estate.source = rawEstate.source;
      estate.url = rawEstate.url;
      estate.updated = new Date(rawEstate.updated);

      return estate;
    });
  }
}