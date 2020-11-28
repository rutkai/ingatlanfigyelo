import {EstatesComponent} from "./component/estates.component";
import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {SingleEstateComponent} from "./component/single-estate.component";

const routes: Routes = [
  { path: '', component: EstatesComponent },
  { path: 'estate/:id', component: SingleEstateComponent },
];

export const Routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
