import {Component, EventEmitter, Input, Output} from "@angular/core";
import {EstateAttributes, Filter, FilterFactory, Filters} from "../../common";

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

  constructor(private filterFactory: FilterFactory) {
    this.attributes = Object.keys(EstateAttributes).map(key => EstateAttributes[key]);
  }

  public addFilter() {
    const filter = this.filterFactory.createFilterFor(this.selected);
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
