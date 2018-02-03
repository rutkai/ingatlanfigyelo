import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {MatButtonModule, MatIconModule, MatSidenavModule} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppComponent} from '../frontend/dist/app/app.component';
import {NavbarComponent} from "../frontend/dist/app/navbar.component";
import {FooterComponent} from "../frontend/dist/app/footer.component";
import {SidenavMenuComponent} from "../frontend/dist/app/sidenav/sidenav-menu.component";
import {CommonModule} from "../frontend/dist/app/common/common.module";
import {FilterModule} from "../frontend/dist/app/filter/filter.module";
import {EstateModule} from "../frontend/dist/app/estate/estate.module";
import {environment} from "../frontend/dist/environments/environment";
import {UsermenuModule} from "../frontend/dist/app/usermenu/usermenu.module";

import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

const routes: Routes = [
    {path: '', loadChildren: './about/about.module#AboutModule'},
    // {path: '', loadChildren: './estate/estate.module#EstateModule'},
    // {path: 'user', loadChildren: './user/user.module#UserModule'},
    // {path: 'about', loadChildren: './about/about.module#AboutModule'},
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
