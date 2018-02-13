import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {MatButtonModule, MatIconModule, MatSidenavModule} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppComponent} from './component/app.component';
import {NavbarComponent} from "../frontend/app/navbar.component";
import {FooterComponent} from "../frontend/app/footer.component";
import {SidenavMenuComponent} from "../frontend/app/sidenav/sidenav-menu.component";
import {CommonModule} from "../frontend/app/common/common.module";
import {FilterModule} from "../frontend/app/filter/filter.module";
import {EstateModule} from "./estate/estate.module";
import {AboutModule} from "./about/about.module";
import {UserModule} from "./user/user.module";
import {environment} from "../frontend/environments/environment";
import {UsermenuModule} from "../frontend/app/usermenu/usermenu.module";

import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {EstatesComponent} from "../frontend/app/estate/component/estates.component";
import {SingleEstateComponent} from "../frontend/app/estate/component/single-estate.component";
import {RegisterComponent} from "../frontend/app/user/component/register.component";
import {LoginComponent} from "../frontend/app/user/component/login.component";
import {AboutComponent} from "../frontend/app/about/component/about.component";

const routes: Routes = [
    {path: '', component: EstatesComponent},
    {path: 'estate/:id', component: SingleEstateComponent},
    {path: 'user/login', component: LoginComponent},
    {path: 'user/register', component: RegisterComponent},
    {path: 'user', redirectTo: 'user/login'},
    {path: 'about', component: AboutComponent},
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
        AboutModule,
        UserModule,
        UsermenuModule,
        IonicModule.forRoot(AppComponent)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        AppComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
