import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Filter} from "../../model/filters/types/filter";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input() public filter: Filter;
  @Output() public remove = new EventEmitter<Filter>();

  public removeFilter() {
    this.remove.emit(this.filter);
  }

}
