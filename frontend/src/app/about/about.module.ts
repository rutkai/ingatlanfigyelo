import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {AboutComponent} from "./component/about.component";
import {Routing} from "./about.routing";

@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    NgCommonModule,
    Routing
  ],
  bootstrap: []
})
export class AboutModule {
}
