import { Component, Inject, forwardRef, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { LoginComponent } from '../util/seguridad/componentes/login/login.component';
import { AppService } from '../util/servicios/app.service';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="topbar clearfix" style="background-color: #f61212;">
            <div class="topbar-left">
                <div class="logo"></div>
            </div>
            <div class="topbar-right">
                <a id="menu-button" href="#" (click)="app.onMenuButtonClick($event)" >
                    <i></i>
                </a>
                <span style='color:white;font-size:16px;font-family: Roboto,"Helvetica Neue",sans-serif;-webkit-font-smoothing: antialiased;'>A T L A S</span>
                      
                <a id="topbar-menu-button" href="#" (click)="app.onTopbarMenuButtonClick($event)">
                    <i class="material-icons">menu</i>
                </a>

                <label class="f-bold" style="display: inline-block;text-align: right;padding: 2px 10px 2px 2px;color:#FFFF;background-color: #0B3C5D;position: absolute; top: 10px; right: 10px;" *ngIf="!(!appService.login || appService.validarotp || appService.cambiopassword)">{{app.dtoServicios.mradicacion.np}}</label>
              
              
                <ul class="topbar-items animated fadeInDown" [ngClass]="{'topbar-items-visible': app.topbarMenuActive}">
                    <li #settings [ngClass]="{'active-top-menu':app.activeTopbarItem === settings}">
                        <a href="#" (click)="app.onTopbarItemClick($event,settings)">
                            <i class="topbar-icon material-icons">settings</i>
                            <span class="topbar-item-name">Configuración</span>
                        </a>
                        <label class="" style="display: inline-block;text-align: center;padding: 2px 10px 2px 2px;color:#FFFF;background-color: #0B3C5D;width: 10px !important;">Cuenta</label>
                        <ul class="ultima-menu animated fadeInDown">
                            <li role="menuitem">
                                <a href="#"  (click)="appService.cambioPassword($event)">
                                    <i class="material-icons">palette</i>
                                    <span>Cambiar password</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="appService.salir($event)">
                                    <i class="material-icons">lock</i>
                                    <span>Salir</span>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li #dashboardroles class="search-item" [ngClass]="{'active-top-menu':app.activeTopbarItem === dashboardroles}"
                        (click)="app.onTopbarItemClick($event,dashboardroles)">

                        <a href="#" (click)="appService.mostrarRoles();">
                            <i class="topbar-icon material-icons">dashboard</i>
                            <span class="topbar-item-name">Perfiles de Usuario</span>
                        </a>
                        <label class="" style="display: inline-block;text-align: center;padding: 2px 10px 2px 2px;color:#FFFF;background-color: #0B3C5D;width: 15px !important;">Perfiles</label>
                    </li>
                    
                    <li #dashboardroles class="" [ngClass]="{'active-top-menu':app.activeTopbarItem === dashboardroles}" 
                        (click)="app.onTopbarItemClick($event,dashboardroles)">
                    <a href="#" (click)="appService.mostrarAyuda();" 
                                *ngIf="!(!appService.login || appService.validarotp || appService.cambiopassword)">
                                <i class="topbar-icon material-icons">help_outline</i>
                                </a>
                                <label class="" style="display: inline-block;text-align: center;padding: 2px 10px 2px 2px;color:#FFFF;background-color: #0B3C5D;width: 10px !important;">Ayuda</label>
                             
                     </li>
                    <li #info class="" [ngClass]="{'active-top-menu':app.activeTopbarItem === info}" (click)="app.onTopbarItemClick($event,info)">
                        <a href="#" (click)="appService.muestraUserInfo = !appService.muestraUserInfo" style="margin: 10px auto;"
                                    *ngIf="!(!appService.login || appService.validarotp || appService.cambiopassword)">
                          <label class="app-info-fecha" style="cursor: pointer;">{{integerToFormatoFecha(app.dtoServicios.mradicacion.ftrabajo)}}</label>
                          </a>
                          <label class="app-info-ambiente" *ngIf="!(!appService.login || appService.validarotp || appService.cambiopassword)">{{app.dtoServicios.mradicacion.nambiente}}</label>

                        
                    </li>
                   

                </ul>
            </div>
        </div>
    `
})
export class AppTopBar {
    @ViewChild(LoginComponent)
    logincomponent: LoginComponent;

    constructor(@Inject(forwardRef(() => AppComponent)) public app: AppComponent, public appService: AppService) { }

    public integerToFormatoFecha(valor: number): string {
        // ejemplo yyyyMMdd 20170131    31 de enero del 2017
        const anio = valor.toString().substring(0, 4);
        const mes = valor.toString().substring(4, 6);
        const dia = valor.toString().substring(6, 8);
        const fecha = anio + '-' + mes + '-' + dia;
        return fecha;
    }

}
