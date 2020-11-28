import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {AboutComponent} from "./component/about.component";
import {PrivacyComponent} from "./component/privacy.component";
import {TermsComponent} from "./component/terms.component";

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'privacy-policy', component: PrivacyComponent },
  { path: 'terms-and-conditions', component: TermsComponent }
];

export const Routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
