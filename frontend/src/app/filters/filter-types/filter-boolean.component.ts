import {Component, EventEmitter, Input, Output} from "@angular/core";
import {BooleanFilter} from "../../../model/filters/types/boolean.filter";
import {Filter} from "../../../model/filters/types/filter";

@Component({
  selector: 'app-filter-boolean',
  templateUrl: './filter-boolean.component.html',
  styleUrls: ['./filter-boolean.component.scss']
})
export class FilterBooleanComponent {
  @Input() public filter: BooleanFilter;
  @Output() public change = new EventEmitter<Filter>();

  public changed() {
    this.change.emit(this.filter);
  }

}
