import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {Routing} from "./user.routing";
import {LoginComponent} from "./component/login.component";
import {RegisterComponent} from "./component/register.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule, MatInputModule} from "@angular/material";

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    NgCommonModule,
    Routing,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  bootstrap: []
})
export class UserModule {
}
