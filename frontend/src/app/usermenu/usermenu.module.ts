import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {NaviconComponent} from "./component/navicon.component";
import {GravatarEmailHashPipe} from "./pipes/gravatar-email-hash.pipe";
import {MatButtonModule, MatListModule, MatMenuModule} from "@angular/material";
import {DropdownComponent} from "./component/dropdown.component";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    GravatarEmailHashPipe,
    DropdownComponent,
    NaviconComponent,
  ],
  imports: [
    RouterModule,
    NgCommonModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
  ],
  exports: [
    NaviconComponent,
    DropdownComponent,
  ],
  bootstrap: []
})
export class UsermenuModule {
}
