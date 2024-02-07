import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";

import {AppComponent} from './app.component';
import {NavbarComponent} from "./navbar.component";
import {FooterComponent} from "./footer.component";
import {SidenavMenuComponent} from "./sidenav/sidenav-menu.component";
import {CommonModule} from "./common/common.module";
import {FilterModule} from "./filter/filter.module";
import {EstateModule} from "./estate/estate.module";
import {environment} from "../environments/environment";
import {UsermenuModule} from "./usermenu/usermenu.module";

const routes: Routes = [
  { path: '', loadChildren: () => import('./estate/estate.module').then(m => m.EstateModule)},
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SidenavMenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {useHash: !environment.production}),
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    CommonModule.forRoot(),
    FilterModule,
    EstateModule,
    UsermenuModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
