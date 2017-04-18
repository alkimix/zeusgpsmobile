import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { InicioPage } from '../pages/inicio/inicio';

import { AuthService } from '../providers/auth-service';
import { HttpModule } from '@angular/http';
import { ConductorPage } from '../pages/conductor/conductor';
import { HomePage } from '../pages/home/home';
import { TestingPage } from '../pages/testing/testing';
import { Configuracion } from '../pages/configuracion/configuracion';
import { Administrador } from '../pages/administrador/administrador';

import { AgmCoreModule } from 'angular2-google-maps/core';

@NgModule({
  declarations: [
    MyApp,
    InicioPage,
    HomePage,
    TestingPage,
    Configuracion,
    Administrador,
	ConductorPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyCu_2BrkVMk_nEi_hetfR0ttL6NVrHt5v4'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InicioPage,
    HomePage,
    TestingPage,
    Configuracion,
    Administrador,
	ConductorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService
  ]
})
export class AppModule {}
