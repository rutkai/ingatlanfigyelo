import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Filters} from "../../model/filters/filters";
import {Filter} from "../../model/filters/types/filter";
import {EstateAttributes} from "../../model/filters/estate-attributes";
import {FilterFactory} from "../../factory/filter.factory";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  @Input() public filters: Filters;
  @Output() public remove = new EventEmitter<Filters>();
  @Output() public change = new EventEmitter<Filters>();

  public attributes: string[];
  public selected = EstateAttributes.PRICE;

  constructor() {
    this.attributes = Object.keys(EstateAttributes).map(key => EstateAttributes[key]);
  }

  public addFilter() {
    const filter = FilterFactory.createFilterFor(this.selected);
    this.filters.addFilter(filter);
    this.change.emit(this.filters);
  }

  public removeFilter(filter: Filter) {
    this.filters.removeFilter(filter);
    this.change.emit(this.filters);
  }

  public removeGroup() {
    this.remove.emit(this.filters);
  }

  public changed() {
    this.change.emit(this.filters);
  }
}
