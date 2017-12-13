import {EstatesComponent} from "./component/estates.component";
import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";

const routes: Routes = [
  { path: '', component: EstatesComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
