import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Filter} from "../../model/filters/types/filter";
import {BooleanFilter} from "../../model/filters/types/boolean.filter";
import {IntervalFilter} from "../../model/filters/types/interval.filter";
import {MultiselectFilter} from "../../model/filters/types/multiselect.filter";
import {StringFilter} from "../../model/filters/types/string.filter";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input() public filter: Filter;
  @Output() public remove = new EventEmitter<Filter>();
  @Output() public change = new EventEmitter<Filter>();

  public changed() {
    this.change.emit(this.filter);
  }

  public removeFilter() {
    this.remove.emit(this.filter);
  }

  public isBooleanFilter(): boolean {
    return this.filter instanceof BooleanFilter;
  }

  public isIntervalFilter(): boolean {
    return this.filter instanceof IntervalFilter;
  }

  public isMultiselectFilter(): boolean {
    return this.filter instanceof MultiselectFilter;
  }

  public isStringFilter(): boolean {
    return this.filter instanceof StringFilter;
  }

}
