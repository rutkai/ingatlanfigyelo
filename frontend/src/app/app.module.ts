import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule, MatIconModule, MatSidenavModule} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NavbarComponent} from "./navbar.component";
import {FooterComponent} from "./footer.component";
import {SidenavMenuComponent} from "./sidenav/sidenav-menu.component";
import {CommonModule} from "./common/common.module";
import {FilterModule} from "./filter/filter.module";
import {EstateModule} from "./estate/estate.module";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  { path: '', loadChildren: './estate/estate.module#EstateModule' },
  { path: 'user', loadChildren: './user/user.module#UserModule' },
  { path: 'about', loadChildren: './about/about.module#AboutModule' },
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
    RouterModule.forRoot(routes, {useHash: true}),
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    CommonModule.forRoot(),
    FilterModule,
    EstateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
