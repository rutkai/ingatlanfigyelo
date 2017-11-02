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
        return new IntervalFilter();
      case EstateAttributes.DISTRICT:
        return new MultiselectFilter(this.generateDistricts());
      case EstateAttributes.ELEVATOR:
        return new BooleanFilter();
      case EstateAttributes.FLOOR:
        return new IntervalFilter();
      case EstateAttributes.HEATING:
        return new StringFilter();
      case EstateAttributes.PRICE:
        return new IntervalFilter();
      case EstateAttributes.ROOMS:
        return new IntervalFilter();
      case EstateAttributes.HALF_ROOMS:
        return new IntervalFilter();
      case EstateAttributes.SIZE:
        return new IntervalFilter();
      case EstateAttributes.SOURCE:
        return new MultiselectFilter(Object.values(EstateSources));
    }
    throw new Error('Unknown estate attribute');
  }

  private static generateDistricts(): number[] {
    return Array(23).fill(0).map((e, i) => i + 1);
  }
}
