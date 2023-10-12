import {Component, EventEmitter, Input, Output} from "@angular/core";
import {BooleanFilter, Filter, IntervalFilter, MultiselectFilter, StringFilter} from "../../common";

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

  public getFilterAsBooleanFilter(): BooleanFilter {
    return this.filter as BooleanFilter;
  }

  public isIntervalFilter(): boolean {
    return this.filter instanceof IntervalFilter;
  }

  public getFilterAsIntervalFilter(): IntervalFilter {
    return this.filter as IntervalFilter;
  }

  public isMultiselectFilter(): boolean {
    return this.filter instanceof MultiselectFilter;
  }

  public getFilterAsMultiselectFilter(): MultiselectFilter {
    return this.filter as MultiselectFilter;
  }

  public isStringFilter(): boolean {
    return this.filter instanceof StringFilter;
  }

  public getFilterAsStringFilter(): StringFilter {
    return this.filter as StringFilter;
  }
}
