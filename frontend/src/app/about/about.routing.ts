import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {AboutComponent} from "./component/about.component";

const routes: Routes = [
  { path: '', component: AboutComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
