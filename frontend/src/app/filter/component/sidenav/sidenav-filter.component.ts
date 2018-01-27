import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
import {debounceTime} from "rxjs/operators";
import {EstatesStore, User, UserService, UserStore} from "../../../common";

@Component({
  selector: 'app-sidenav-filter',
  templateUrl: './sidenav-filter.component.html',
  styleUrls: ['./sidenav-filter.component.scss']
})
export class SidenavFilterComponent implements OnInit, OnDestroy {
  public user: User;
  public showSaved: boolean | null = null;

  private debounceTime = 2000;
  private changes = new Subject();
  private subscription: Subscription;

  constructor(private estatesStore: EstatesStore, userStore: UserStore, private userService: UserService) {
    userStore.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.subscription = this.changes.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(() => {
      this.userService.saveFilters(this.user.filterGroups)
        .then(() => {
          this.showSaved = true;
        })
        .then(() => {
          this.estatesStore.reset();
        });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public saveFilters() {
    this.showSaved = false;
    this.changes.next(this.user);
  }

}
