import {Injectable} from "@angular/core";
import {Estate} from "../model/estate";

@Injectable()
export class EstateParser {
  public parse(rawEstate: any): Estate {
    const estate = new Estate();
    estate.id = rawEstate.id;
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
    estate.urls = rawEstate.urls;
    estate.updated = new Date(rawEstate.updated);
    estate.favourite = rawEstate.favourite;
    estate.isSeen = rawEstate.seen;

    return estate;
  }

  public parseMany(rawEstates: any[]): Estate[] {
    return rawEstates.map(rawEstate => {
      return this.parse(rawEstate);
    });
  }
}
