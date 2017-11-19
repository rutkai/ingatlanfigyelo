import {EstateAttributes} from "../model/filters/estate-attributes";
import {Filter} from "../model/filters/types/filter";
import {IntervalFilter} from "../model/filters/types/interval.filter";
import {MultiselectFilter} from "../model/filters/types/multiselect.filter";
import {EstateSources} from "../model/estate-sources";
import {BooleanFilter} from "../model/filters/types/boolean.filter";
import {StringFilter} from "../model/filters/types/string.filter";

export class FilterFactory {
  public static createFilterFor(attribute: EstateAttributes): Filter {
    switch (attribute) {
      case EstateAttributes.BALCONY:
        return new IntervalFilter(attribute);
      case EstateAttributes.DISTRICT:
        return new MultiselectFilter(attribute, this.generateDistricts());
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
      case EstateAttributes.SOURCE:
        const sources = Object.keys(EstateSources).map(key => EstateSources[key]);
        return new MultiselectFilter(attribute, sources);
    }
    throw new Error('Unknown estate attribute');
  }

  private static generateDistricts(): number[] {
    return Array(23).fill(0).map((e, i) => i + 1);
  }
}
