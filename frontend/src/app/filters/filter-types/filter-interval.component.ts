import {Component, EventEmitter, Input, Output} from "@angular/core";
import {IntervalFilter} from "../../../model/filters/types/interval.filter";
import {Filter} from "../../../model/filters/types/filter";

@Component({
  selector: 'app-filter-interval',
  templateUrl: './filter-interval.component.html',
  styleUrls: ['./filter-interval.component.scss']
})
export class FilterIntervalComponent {
  @Input() public filter: IntervalFilter;
  @Output() public change = new EventEmitter<Filter>();

  public changed() {
    this.change.emit(this.filter);
  }

}
