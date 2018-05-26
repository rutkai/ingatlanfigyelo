import {Component, EventEmitter, OnDestroy, Output} from "@angular/core";
import {Filters, User, UserStore} from "../../common";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'app-filter-groups',
  templateUrl: './filter-groups.component.html',
  styleUrls: ['./filter-groups.component.scss']
})
export class FilterGroupsComponent implements OnDestroy {
  @Output() public change = new EventEmitter<Filters[]>();

  public user: User;

  private subscriptions: Subscription[] = [];

  constructor(userStore: UserStore) {
    this.subscriptions.push(userStore.user$.subscribe(user => {
      this.user = user;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  public addFilterGroup() {
    this.user.addFilterGroup(new Filters());
    this.change.emit(this.user.filterGroups);
  }

  public removeFilterGroup(group: Filters) {
    this.user.removeFilterGroup(group);
    this.change.emit(this.user.filterGroups);
  }

  public changed() {
    this.change.emit(this.user.filterGroups);
  }

}
