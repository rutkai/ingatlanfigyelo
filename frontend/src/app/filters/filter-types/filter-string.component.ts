import {Component, EventEmitter, Input, Output} from "@angular/core";
import {StringFilter} from "../../../model/filters/types/string.filter";
import {Filter} from "../../../model/filters/types/filter";

@Component({
  selector: 'app-filter-string',
  templateUrl: './filter-string.component.html'
})
export class FilterStringComponent {
  @Input() public filter: StringFilter;
  @Output() public change = new EventEmitter<Filter>();

  public changed() {
    this.change.emit(this.filter);
  }

}
