import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {Routing} from "./user.routing";
import {LoginComponent} from "./component/login.component";
import {RegisterComponent} from "./component/register.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {ForgottenPasswordComponent} from "./component/forgotten-password.component";
import {ResetPasswordComponent} from "./component/reset-password.component";

@NgModule({
  declarations: [
    LoginComponent,
    ForgottenPasswordComponent,
    ResetPasswordComponent,
    RegisterComponent
  ],
  imports: [
    NgCommonModule,
    Routing,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  bootstrap: []
})
export class UserModule {
}
