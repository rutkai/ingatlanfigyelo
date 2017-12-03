import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Filter, IntervalFilter} from "../../../common";

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
