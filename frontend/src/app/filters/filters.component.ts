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

  public attributes = EstateAttributes;
  public selected = EstateAttributes.PRICE;

  public addFilter() {
    const filter = FilterFactory.createFilterFor(this.selected);
    this.filters.addFilter(filter);
  }

  public removeFilter(filter: Filter) {
    this.filters.removeFilter(filter);
  }

  public removeGroup() {
    this.remove.emit(this.filters);
  }
}
