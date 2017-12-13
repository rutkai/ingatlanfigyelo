import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule,
  MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatTooltipModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NavbarComponent} from "./navbar.component";
import {LoginDialogComponent} from "./user/login-dialog.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterDialogComponent} from "./user/register-dialog.component";
import {FooterComponent} from "./footer.component";
import {SidenavMenuComponent} from "./sidenav/sidenav-menu.component";
import {CommonModule} from "./common/common.module";
import {FilterModule} from "./filter/filter.module";
import {EstateModule} from "./estate/estate.module";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  { path: '', loadChildren: './estate/estate.module#EstateModule' },
  { path: 'about', loadChildren: './about/about.module#AboutModule' },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginDialogComponent,
    RegisterDialogComponent,
    SidenavMenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {useHash: true}),
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    CommonModule,
    FilterModule,
    EstateModule
  ],
  providers: [
  ],
  entryComponents: [
    LoginDialogComponent,
    RegisterDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
