import { DashboardrolesComponent } from './util/componentes/dashboardroles/dashboardroles.component';
import { Component, OnInit, AfterViewInit, ElementRef, Renderer, ViewChild } from '@angular/core';
import { LoginComponent } from './util/seguridad/componentes/login/login.component';
import { CambioContraseniaLoginComponent } from './util/seguridad/componentes/cambiocontrasenialogin/componentes/cambioContraseniaLogin.component';

import { MayusculasDirective } from './util/directivas/mayusculas.directive';
import { DtoServicios } from './util/servicios/dto.servicios';
import { AppService } from './util/servicios/app.service';


enum MenuOrientation {
  STATIC,
  OVERLAY,
  SLIM,
  HORIZONTAL
};

declare var jQuery: any;
@Component({
  selector: 'my-app',
  templateUrl: 'sobre/principal.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  // Manejo de login 
  @ViewChild(LoginComponent)
  logincomponent: LoginComponent;

  /**Varible de referencia al componente de cambio de password*/
  @ViewChild(CambioContraseniaLoginComponent)
  cambiocontraseniacomponent: CambioContraseniaLoginComponent;

  // Manejo de utima  layoutCompact debe ir en true
  layoutCompact: boolean = true;

  layoutMode: MenuOrientation = MenuOrientation.STATIC;

  darkMenu: boolean = false;

  profileMode: string = 'inline';

  rotateMenuButton: boolean;

  topbarMenuActive: boolean;

  overlayMenuActive: boolean;

  staticMenuDesktopInactive: boolean;

  staticMenuMobileActive: boolean;

  rightPanelActive: boolean;

  rightPanelClick: boolean;

  layoutContainer: HTMLDivElement;

  layoutMenuScroller: HTMLDivElement;

  menuClick: boolean;

  topbarItemClick: boolean;

  activeTopbarItem: any;

  resetMenu: boolean;

  menuHoverActive: boolean;

  modulotransaccion: string;

  @ViewChild('layoutContainer') layourContainerViewChild: ElementRef;

  @ViewChild('layoutMenuScroller') layoutMenuScrollerViewChild: ElementRef;

  constructor(public renderer: Renderer, private dtoServicios: DtoServicios, public appService: AppService
    ) { }

  ngOnInit() {
    this.appService.login = false;
    this.appService.validarotp = sessionStorage.getItem('validarotp') === 'true';
    this.appService.cambiocontraseniacomponent = this.cambiocontraseniacomponent;

    if (sessionStorage.getItem('mradicacion')) {
      this.appService.titulopagina = this.appService.titulopagina + JSON.parse(sessionStorage.getItem('mradicacion')).np;
    }


    if (sessionStorage.getItem('c')) {
      this.appService.login = true;
      const mradicacion = JSON.parse(sessionStorage.getItem('mradicacion'));
      this.inicializarAmbiente(mradicacion);
      this.logincomponent.validaCambioPassword(mradicacion);
    }
  }

  ngAfterViewInit() {
    this.layoutContainer = <HTMLDivElement>this.layourContainerViewChild.nativeElement;
    this.layoutMenuScroller = <HTMLDivElement>this.layoutMenuScrollerViewChild.nativeElement;

    setTimeout(() => {
      jQuery(this.layoutMenuScroller).nanoScroller({flash: true});
    }, 10);
  }

  /**Fija datos de respuesta cuando el login es exitoso. */
  private inicializarAmbiente(mradicacion: any) {
    let c: string;
    const ip = document.domain === 'localhost' ? '127.0.0.1' : document.domain;
   
    this.appService.llenarRolesUsuario(mradicacion.roles);

    c = mradicacion.cc + '^' + mradicacion.cs + '^' + mradicacion.cag + '^' + mradicacion.cu + '^';
    c = c + mradicacion.roles[0].id + '^' + mradicacion.ci + '^' + mradicacion.cca;
    sessionStorage.setItem('c', c);
    sessionStorage.setItem('mradicacion', JSON.stringify(mradicacion));
    // delete mradicacion.roles;

    // ejecuta consulta del menu del primer rol
    this.appService.consultarMenu();

    // Fija datos de radicacion del usuario en el singleton de servicios.
    this.dtoServicios.actualizarRadicacion(mradicacion);
  }

  onLayoutClick() {
    if (!this.topbarItemClick) {
      this.activeTopbarItem = null;
      this.topbarMenuActive = false;
    }

    if (!this.menuClick) {
      if (this.isHorizontal() || this.isSlim()) {
        this.resetMenu = true;
      }

      if (this.overlayMenuActive || this.staticMenuMobileActive) {
        this.hideOverlayMenu();
      }

      this.menuHoverActive = false;
    }

    if (!this.rightPanelClick) {
      this.rightPanelActive = false;
    }

    this.topbarItemClick = false;
    this.menuClick = false;
    this.rightPanelClick = false;
  }
    
  onMenuButtonClick(event) {
    this.menuClick = true;
    this.rotateMenuButton = !this.rotateMenuButton;
    this.topbarMenuActive = false;

    if (this.layoutMode === MenuOrientation.OVERLAY) {
      this.overlayMenuActive = !this.overlayMenuActive;
    }
    else {
      if (this.isDesktop())
        this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
      else
        this.staticMenuMobileActive = !this.staticMenuMobileActive;
    }

    event.preventDefault();
  }

  onMenuClick($event) {
    this.menuClick = true;
    this.resetMenu = false;

    if (!this.isHorizontal()) {
      setTimeout(() => {
        jQuery(this.layoutMenuScroller).nanoScroller();
      }, 500);
    }
  }

  onTopbarMenuButtonClick(event) {
    this.topbarItemClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
  }

  onTopbarItemClick(event, item) {
    this.topbarItemClick = true;

    if (this.activeTopbarItem === item)
      this.activeTopbarItem = null;
    else
      this.activeTopbarItem = item;

    event.preventDefault();
  }

  onRightPanelButtonClick(event) {
    this.rightPanelClick = true;
    this.rightPanelActive = !this.rightPanelActive;
    event.preventDefault();
  }

  onRightPanelClick() {
    this.rightPanelClick = true;
  }

  hideOverlayMenu() {
    this.rotateMenuButton = false;
    this.overlayMenuActive = false;
    this.staticMenuMobileActive = false;
  }

  isTablet() {
    let width = window.innerWidth;
    return width <= 1024 && width > 640;
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isMobile() {
    return window.innerWidth <= 640;
  }

  isOverlay() {
    return this.layoutMode === MenuOrientation.OVERLAY;
  }

  isHorizontal() {
    return this.layoutMode === MenuOrientation.HORIZONTAL;
  }

  isSlim() {
    return this.layoutMode === MenuOrientation.SLIM;
  }

  changeToStaticMenu() {
    this.layoutMode = MenuOrientation.STATIC;
  }

  changeToOverlayMenu() {
    this.layoutMode = MenuOrientation.OVERLAY;
  }

  changeToHorizontalMenu() {
    this.layoutMode = MenuOrientation.HORIZONTAL;
  }

  changeToSlimMenu() {
    this.layoutMode = MenuOrientation.SLIM;
  }

  ngOnDestroy() {
    jQuery(this.layoutMenuScroller).nanoScroller({flash: true});
  }

  ValidarTransaccion(event){

    this.modulotransaccion =  event.currentTarget.value.trim() ;
    const valores = this.modulotransaccion.split('-');

    const reg = this.appService.menutransaccion.find(x => x.modulo == Number(valores[0]) && x.transaccion == Number(valores[1]));
    if (reg !== undefined){
        const opciones: any =[];
        opciones.mod = valores[0];
        opciones.tran = valores[1];
        opciones.tit = this.modulotransaccion + " " +  reg.nombre;
        opciones.ins = reg.crear;
        opciones.upd = reg.editar;
        opciones.del = reg.eliminar;
        opciones.ac = reg.ac;
        opciones.path = "/" + this.modulotransaccion;
        sessionStorage.setItem('m', opciones.mod);
        sessionStorage.setItem('t', opciones.tran);
        sessionStorage.setItem('titulo', opciones.tit);
        sessionStorage.setItem('ins', opciones.ins);
        sessionStorage.setItem('upd', opciones.upd);
        sessionStorage.setItem('del', opciones.del);
        sessionStorage.setItem('ac', opciones.ac);
        sessionStorage.setItem('path', "/" + this.modulotransaccion);
        this.appService.titulopagina = opciones['tit'];
        this.appService.router.navigate([opciones['path']], {skipLocationChange: true}); 
    }else { event.currentTarget.value = "";}


  }
}