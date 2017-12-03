import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Filter, MultiselectFilter} from "../../../common";

@Component({
  selector: 'app-filter-multiselect',
  templateUrl: './filter-multiselect.component.html'
})
export class FilterMultiselectComponent {
  @Input() public filter: MultiselectFilter;
  @Output() public change = new EventEmitter<Filter>();

  public changed() {
    this.change.emit(this.filter);
  }

}
