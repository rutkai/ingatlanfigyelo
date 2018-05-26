import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {AboutComponent} from "./component/about.component";
import {Routing} from "./about.routing";
import {CommonModule} from "../common/common.module";
import {PrivacyComponent} from "./component/privacy.component";
import {TermsComponent} from "./component/terms.component";

@NgModule({
  declarations: [
    AboutComponent,
    PrivacyComponent,
    TermsComponent,
  ],
  imports: [
    NgCommonModule,
    Routing,
    CommonModule,
  ],
  bootstrap: []
})
export class AboutModule {
}
