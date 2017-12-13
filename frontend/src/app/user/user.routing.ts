import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {LoginComponent} from "./component/login.component";
import {RegisterComponent} from "./component/register.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login' }
];

export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
