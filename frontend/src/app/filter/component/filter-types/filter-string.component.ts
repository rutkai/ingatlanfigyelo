import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Filter, StringFilter} from "../../../common";

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
