import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {LoginComponent} from "./component/login.component";
import {RegisterComponent} from "./component/register.component";
import {ForgottenPasswordComponent} from "./component/forgotten-password.component";
import {ResetPasswordComponent} from "./component/reset-password.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgotten-password', component: ForgottenPasswordComponent },
  { path: 'reset-password/:id/:token', component: ResetPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login' }
];

export const Routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
