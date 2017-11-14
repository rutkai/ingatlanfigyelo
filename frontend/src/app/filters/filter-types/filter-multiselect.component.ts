import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {MultiselectFilter} from "../../../model/filters/types/multiselect.filter";
import {Filter} from "../../../model/filters/types/filter";

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
