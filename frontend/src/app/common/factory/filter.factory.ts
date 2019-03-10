import {EstateAttributes} from "../model/filters/estate-attributes";
import {Filter} from "../model/filters/types/filter";
import {IntervalFilter} from "../model/filters/types/interval.filter";
import {MultiselectFilter} from "../model/filters/types/multiselect.filter";
import {EstateSources} from "../model/estate-sources";
import {BooleanFilter} from "../model/filters/types/boolean.filter";
import {StringFilter} from "../model/filters/types/string.filter";
import {CitiesStore} from "../store/cities.store";
import {RegionsStore} from "../store/regions.store";
import {DistrictsStore} from "../store/districts.store";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class FilterFactory {
  constructor(private citiesStore: CitiesStore,
              private regionsStore: RegionsStore,
              private districtsStore: DistrictsStore) {
  }

  public createFilterFor(attribute: EstateAttributes): Filter {
    switch (attribute) {
      case EstateAttributes.BALCONY:
        return new IntervalFilter(attribute);
      case EstateAttributes.CITY:
        return new MultiselectFilter(attribute, this.citiesStore.cities$);
      case EstateAttributes.REGION:
        return new MultiselectFilter(attribute, this.regionsStore.regions$);
      case EstateAttributes.DISTRICT:
        return new MultiselectFilter(attribute, this.districtsStore.districts$);
      case EstateAttributes.ELEVATOR:
        return new BooleanFilter(attribute);
      case EstateAttributes.FLOOR:
        return new IntervalFilter(attribute);
      case EstateAttributes.HEATING:
        return new StringFilter(attribute);
      case EstateAttributes.PRICE:
        return new IntervalFilter(attribute);
      case EstateAttributes.SQUARE_METER_PRICE:
        return new IntervalFilter(attribute);
      case EstateAttributes.ROOMS:
        return new IntervalFilter(attribute);
      case EstateAttributes.HALF_ROOMS:
        return new IntervalFilter(attribute);
      case EstateAttributes.SIZE:
        return new IntervalFilter(attribute);
      case EstateAttributes.MATERIAL:
        return new StringFilter(attribute);
      case EstateAttributes.DESCRIPTION:
        return new StringFilter(attribute);
      case EstateAttributes.SOURCE:
        const sources = Object.keys(EstateSources).map(key => EstateSources[key]);
        return new MultiselectFilter(attribute, Observable.create((observer: any) => {
          observer.next(sources);
        }));
    }
    throw new Error('Unknown estate attribute');
  }
}
