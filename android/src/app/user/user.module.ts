import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {LoginComponent} from "../../frontend/app/user/component/login.component";
import {RegisterComponent} from "../../frontend/app/user/component/register.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule, MatInputModule} from "@angular/material";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    NgCommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  bootstrap: []
})
export class UserModule {
}
