import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {NaviconComponent} from "./component/navicon.component";
import {GravatarEmailHashPipe} from "./pipes/gravatar-email-hash.pipe";
import {MatButtonModule, MatListModule, MatMenuModule, MatSlideToggleModule} from "@angular/material";
import {DropdownComponent} from "./component/dropdown.component";
import {RouterModule} from "@angular/router";
import {CommonModule} from "../common/common.module";

@NgModule({
  declarations: [
    GravatarEmailHashPipe,
    DropdownComponent,
    NaviconComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgCommonModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatSlideToggleModule,
  ],
  exports: [
    NaviconComponent,
    DropdownComponent,
  ],
  bootstrap: []
})
export class UsermenuModule {
}
