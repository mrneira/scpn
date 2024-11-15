import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './util/core/core.module';
import { BasicModule } from './util/shared/basic.module';

import { AppComponent } from './app.component';
import { AppMenuComponent, AppSubMenu } from './sobre/app.menu.component';
import { AppTopBar } from './sobre/app.topbar.component';
import { AppFooter } from './sobre/app.footer.component';
import { InlineProfileComponent } from './app.profile.component';
import { InicioComponent } from './sobre/inicio.component';

import { LoginComponent } from './util/seguridad/componentes/login/login.component';
import { OlvidoContraseniaComponent } from './util/seguridad/componentes/olvidocontrasenia/olvidoContrasenia.component';
import { CambioContraseniaLoginComponent } from './util/seguridad/componentes/cambiocontrasenialogin/componentes/cambioContraseniaLogin.component';
import { ReloadComponent } from './util/seguridad/componentes/login/reload.component';
import { OtpComponent } from './util/seguridad/componentes/otp/otp.component';


import { routing, appRoutingProviders } from './util/router/app.routing';
import { AppService } from './util/servicios/app.service';
import { AlertService } from './util/servicios/alert.service';
import { AlertModule } from './util/componentes/alert/alert.module';
import { InicioModule } from './sobre/inicio/inicio.module';
import { ImpresionComponent } from './util/componentes/impresion/impresion.component';
import { ImpresionService } from './util/servicios/impresion.service';
import { SocketimpresionService } from './util/servicios/socketimpresion.service';
import { VerificaAutorizacionService } from './util/servicios/verificaAutorizacion.service';
import {GrowlModule, SelectButtonModule} from 'primeng/primeng';
import {ConfirmDialogModule, ConfirmationService} from 'primeng/primeng';
import { DashboardrolesComponent } from './util/componentes/dashboardroles/dashboardroles.component';
import {PasswordModule} from 'primeng/primeng';
@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule,CoreModule, BasicModule, routing, GrowlModule, ConfirmDialogModule, InicioModule, AlertModule, PasswordModule, SelectButtonModule],
  declarations: [AppComponent, LoginComponent,OlvidoContraseniaComponent ,CambioContraseniaLoginComponent, ReloadComponent, AppTopBar, AppFooter, AppMenuComponent, AppSubMenu, InlineProfileComponent,
                 ImpresionComponent, DashboardrolesComponent, OtpComponent, InicioComponent,],
  providers: [VerificaAutorizacionService, AlertService, ImpresionService, AppService, SocketimpresionService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }

