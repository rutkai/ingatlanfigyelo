import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs/internal/Subject";
import {Subscription} from "rxjs/internal/Subscription";
import {debounceTime} from "rxjs/internal/operators";
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

  private subscriptions: Subscription[] = [];

  constructor(private estatesStore: EstatesStore, userStore: UserStore, private userService: UserService) {
    this.subscriptions.push(userStore.user$.subscribe((user: User) => {
      this.user = user;
    }));
  }

  ngOnInit(): void {
    const subscription = this.changes.pipe(
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

    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  public saveFilters() {
    this.showSaved = false;
    this.changes.next(this.user);
  }

}
