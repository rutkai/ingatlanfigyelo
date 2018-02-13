import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {AboutComponent} from "../../frontend/app/about/component/about.component";
import {CommonModule} from "../../frontend/app/common/common.module";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    NgCommonModule,
    RouterModule,
    CommonModule,
  ],
  bootstrap: []
})
export class AboutModule {
}
