import {Component, EventEmitter, Input, Output} from "@angular/core";
import {BooleanFilter, Filter} from "../../../common";

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
