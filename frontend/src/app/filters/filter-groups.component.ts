import {Component} from "@angular/core";
import {UserStore} from "../../store/user.store";
import {User} from "../../model/user";
import {Filters} from "../../model/filters/filters";

@Component({
  selector: 'app-filter-groups',
  templateUrl: './filter-groups.component.html',
  styleUrls: ['./filter-groups.component.scss']
})
export class FilterGroupsComponent {

  public user: User;

  constructor(private userStore: UserStore) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  public addFilterGroup() {
    this.user.addFilterGroup(new Filters());
  }

  public removeFilterGroup(group: Filters) {
    this.user.removeFilterGroup(group);
  }

}
