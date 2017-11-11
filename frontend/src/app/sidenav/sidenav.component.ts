import {Component, OnDestroy, OnInit} from "@angular/core";
import {UserStore} from "../../store/user.store";
import {User} from "../../model/user";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
import {debounceTime} from "rxjs/operators";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  public user: User;
  public showSaved: boolean | null = null;

  private debounceTime = 2000;
  private changes = new Subject();
  private subscription: Subscription;

  constructor(private userStore: UserStore, private userService: UserService) {
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
