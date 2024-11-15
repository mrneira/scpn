import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { ConfirmationService } from 'primeng/primeng';

import { DatosgeneralesComponent } from "../submodulos/datosgenerales/componentes/datosgenerales.component";
import { DetalleComponent} from "../submodulos/detalle/componentes/detalle.component";

import { MenuItem } from 'primeng/components/common/menuitem';
import { AppService } from 'app/util/servicios/app.service';
export enum KEY_CODE {
  FLECHA_ABAJO = 40
}
@Component({
  selector: 'app-plananual',
  templateUrl: 'plananual.html'
})
export class PlananualComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;



  @ViewChild(DatosgeneralesComponent)
  tablaCabecera: DatosgeneralesComponent;

  @ViewChild(DetalleComponent)
  private tablaDetalle: DetalleComponent;



  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  
  
  public nuevo = true;
  public cerrada = false;
  public nuevaNomina = false;

  public ldatos: any = [];
  public indextab: number;

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'ABSTRACT', 'PLANANUALGENERAL', false);
  }

  ngOnInit() {
    this.indextab = 0;
    this.componentehijo = this;
    super.init(this.formFiltros, this.route);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    this.route['queryParams'].subscribe((p: any) => {
      if (p.sol) {
        const sol = JSON.parse(p.sol);
        this.ldatos = sol.ldatos;
        this.tablaCabecera.registro.tipocdetalle = sol.tipocdetalle;
        this.componentehijo.mcampos.anio = sol.anio;
        this.componentehijo.mcampos.tipocdetalle = sol.tipocdetalle;
        this.componentehijo.mcampos.cmodulo = sol.cmodulo;
        this.componentehijo.mcampos.pparticipacion=sol.pparticipacion;
        this.componentehijo.mcampos.pmontototal=sol.pmontototal;
        
        this.componentehijo.nuevaNomina = sol.nuevaNomina;
        this.tablaCabecera.nuevo = sol.nuevaNomina;
        this.componentehijo.cerrada = sol.cerrada;
        
        this.nuevo = this.nuevaNomina;
        if (this.nuevaNomina) {
          this.componentehijo.nuevo = true;
        } else {
          this.consultar();
          this.consultarCatalogosDetalle(sol.tipocdetalle,sol.cmodulo);
          this.componentehijo.nuevo = false;

        }
      }
    });
  }

  crearNuevo() {

  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }
  descargarBytes(bytes: any): void {
    const linkElement = document.createElement('a');
    try {
      let contenttype = '';
      if (this.tablaCabecera.mcampos.tipo === 'PDF') {
        contenttype = 'application/pdf';
      } else if (this.tablaCabecera.mcampos.tipo === 'EXCEL') {
        contenttype = 'application/vnd.ms-excel';
      } else {
        contenttype = 'application/octet-stream';
      }
      var blob = new Blob([this.base64ToArrayBuffer(bytes)], { type: contenttype });
      const bloburl = URL.createObjectURL(blob);

      if (this.tablaCabecera.mcampos.tipo === 'PDF') {
        window.open(bloburl);
        return;
      } else {
        linkElement.href = bloburl;
        if (this.tablaCabecera.mcampos.tipo === 'EXCEL') {
          linkElement.download = "ROL-" + this.tablaCabecera.registro.anio + "-" + this.tablaCabecera.registro.mescdetalle + '.' + "xls";
        } else {
          linkElement.download = "ROL" + '.' + this.tablaCabecera.mcampos.tipo;

        }

        const clickEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': false
        });
        linkElement.dispatchEvent(clickEvent);

      }

    } catch (ex) {
    }
  }

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  generarRol() {
    this.rqConsulta.CODIGOCONSULTA = 'ROLPROVISIONTEMP';
    this.rqConsulta.mdatos.lregistros = this.tablaDetalle.lregistros;
    this.rqConsulta.mdatos.tipo = this.tablaCabecera.mcampos.tipo;
    this.rqConsulta.mdatos.tiporeporte = this.tablaCabecera.mcampos.tiporeporte;
    this.rqConsulta.mdatos.nomina = this.tablaCabecera.registro;

    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.lregistros = [];
          if (resp.cod === 'OK') {

            this.descargarBytes(resp.ROLPROVISIONTEMP);

          }

        },
        error => {
          this.dtoServicios.manejoError(error);
        });

  }
  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.encerarConsulta();
    if (this.estaVacio(this.mcampos.tipocdetalle)) {
      this.mostrarMensajeError('ELIJA UNA PLAN PARA REALIZAR EL MANTENIMIENTO');
      return;
    }

    this.crearDtoConsulta();
    super.consultar();
  }
  consultarDetalleNuevos(reg: any) {
    
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    const consCabecera = this.tablaCabecera.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaCabecera.alias, consCabecera);

    const consRolPago = this.tablaDetalle.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaDetalle.alias, consRolPago);

    const consIngreso = this.tablaDetalle.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaDetalle.alias, consIngreso);

    const consEgreso = this.tablaDetalle.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaDetalle.alias, consEgreso);

  }

  private fijarFiltrosConsulta() {
  
    this.tablaCabecera.mcampos.tipocdetalle = this.mcampos.tipocdetalle;
    this.tablaDetalle.mcampos.tipocdetalle = this.mcampos.tipocdetalle;
    this.tablaCabecera.mcampos.anio = this.mcampos.anio;
    this.tablaDetalle.mcampos.anio = this.mcampos.anio;
    this.tablaDetalle.mcampos.cmodulo=this.mcampos.cmodulo;
    this.tablaCabecera.mcampos.cmodulo=this.mcampos.cmodulo;
    
    this.tablaDetalle.mcampos.pparticipacion=this.mcampos.pparticipacion;
    this.tablaDetalle.mcampos.pmontototal=this.mcampos.pmontototal;
  }


  guardarCambios() {
    this.rqMantenimiento.mdatos = {};
 
    this.grabar();
  }

  finalizarIngreso(): void {
    this.rqMantenimiento.mdatos = {};
    this.confirmationService.confirm({
      message: 'Está seguro de finalizar la nómina?',
      header: 'Nómina',
      icon: 'fa fa-question-circle',
      accept: () => {

        let mensaje = '';
        if (mensaje !== '') {
          super.mostrarMensajeError(mensaje);
          return;

        }
        //this.rqMantenimiento.mdatos=[];
        this.rqMantenimiento.mdatos.nuevo = false;
        this.rqMantenimiento.mdatos.nomina = this.tablaCabecera.registro;
        this.rqMantenimiento.mdatos.lregistros = this.tablaDetalle.lregistros;
        this.rqMantenimiento.mdatos.cerrada = true;

        this.grabar();
      },
      reject: () => {
      }
    });



  }
  reacalcular() {
    this.rqMantenimiento.mdatos = {};
    let mensaje = '';
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;

    }
    this.rqMantenimiento.mdatos.nuevo = false;
    this.rqMantenimiento.mdatos.cplan = this.tablaCabecera.registro.cplan;

    this.grabar();

  }
  validaFiltrosConsulta(): boolean {
    return (
      this.tablaCabecera.validaFiltrosRequeridos() &&
      this.tablaDetalle.validaFiltrosRequeridos()

    );
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.tablaCabecera.postQuery(resp);
    this.tablaDetalle.postQuery(resp);
    this.nuevaNomina = false;
    this.nuevo = false;
  
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();

    this.rqMantenimiento.mdatos.ldatos = this.ldatos;
    this.rqMantenimiento.mdatos.nuevo = this.nuevaNomina;
    if (this.nuevo) {
      this.tablaCabecera.selectRegistro(this.tablaCabecera.registro);
      this.tablaCabecera.actualizar();
    }
    super.addMantenimientoPorAlias(this.tablaCabecera.alias, this.tablaCabecera.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.tablaDetalle.alias, this.tablaDetalle.getMantenimiento(2));
    super.grabar();
  }
  validarGrabar(): string {
    let mensaje: string = '';

   
   
    //VALIDACIONES EN SUBMODULOS
    if (this.tablaDetalle.validarRegistros().length != 0) {
      mensaje += this.tablaDetalle.validarRegistros() + ' <br/>';
    }

    return mensaje;
  }
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    
    const mfiltrosModulo: any = {'activo': true};
    const consultaModulo = new Consulta('TgenModulo', 'Y', 't.nombre', mfiltrosModulo, {});
    consultaModulo.cantidad = 50;
    this.addConsultaCatalogos('MODULO', consultaModulo, this.tablaCabecera.lmodulos, super.llenaListaCatalogo, 'cmodulo');
    this.ejecutarConsultaCatalogos();
  }
  AsignarTotales(){
    this.tablaCabecera.registro.pparticipaciontotal=this.tablaDetalle.mcampos.pparticipaciontotal;
  }
  consultarCatalogosDetalle(tipocdetalle:any,cmodulo:any):any{
    this.encerarConsultaCatalogos();

    const mfiltrosProducto: any = { 'cmodulo': cmodulo };
    const consultaProducto = new Consulta('tgenproducto', 'Y', 't.cproducto', mfiltrosProducto, {});
    consultaProducto.cantidad = 100;
    consultaProducto.addFiltroEspecial('cproducto',"in (SELECT cproducto FROM tgenproducto WHERE tipocdetalle ='"+tipocdetalle+"' AND cmodulo ="+cmodulo+")");
    this.addConsultaCatalogos('PRODUCTO', consultaProducto, this.tablaDetalle.lproducto, super.llenaListaCatalogo, 'cproducto');

  
    const mfiltrosparamcalif = { 'cmodulo': cmodulo };
    const consultaParametrosCalificacion = new Consulta('tgentipoproducto', 'Y', 't.cproducto', mfiltrosparamcalif, {});
    consultaParametrosCalificacion.cantidad = 500;
    this.addConsultaCatalogos('TIPOPRODUCTOGEN', consultaParametrosCalificacion, this.tablaDetalle.ltipoproductogen, this.llenarCalidad, '', this.componentehijo, false);


    this.ejecutarConsultaCatalogos();
  }
  public llenarCalidad(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.tablaDetalle.ltipoproductogen = pListaResp;
   
  }
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {

    if (resp.cod === 'OK') {

      this.tablaCabecera.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaCabecera.alias));
      this.tablaDetalle.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaDetalle.alias));
    
    } else {
      super.mostrarMensajeError(resp.msgs);
    }
    if (!this.estaVacio(resp.DATOS)) {
      this.tablaDetalle.lregistros = resp.ROLPAGO;

    }
    if(resp.PLANANUAL){
      let cmodulo = resp.PLANANUAL[0].cmodulo;
     
    }

    if (!this.estaVacio(resp.cplan)) {
      this.mcampos.tipocdetalle = resp.tipocdetalle;
      this.mcampos.cmodulo = resp.cmodulo;
      this.mcampos.anio=resp.anio;
      this.mcampos.pparticipacion=resp.pparticipacion;
      this.mcampos.pmontototal=resp.pmontototal;
      this.tablaCabecera.mcampos.tipocdetalle = this.mcampos.tipocdetalle;
      this.tablaCabecera.mcampos.cmodulo = this.mcampos.cmodulo;

      this.tablaDetalle.mcampos.tipocdetalle = this.mcampos.tipocdetalle;
      this.tablaDetalle.mcampos.cmodulo = this.mcampos.cmodulo;
      this.tablaDetalle.mcampos.pparticipacion = this.mcampos.pparticipacion;
      this.tablaDetalle.mcampos.pmontototal = this.mcampos.pmontototal;
     
      this.tablaCabecera.registro.esnuevo = false;
      this.tablaCabecera.registro.actualizar = true;
      this.nuevaNomina = false;
      this.nuevo = false;
      this.consultarCatalogosDetalle(this.mcampos.tipocdetalle,this.mcampos.cmodulo);

    }

    if (resp.RECALCULADO) {
      this.enproceso = false;

      super.encerarConsulta();
      this.rqConsulta = { 'mdatos': {} };
      this.consultar();

    }


   
  }

  cambiarProyectado(){
   this.tablaDetalle.mcampos.pparticipacion= this.tablaCabecera.registro.pparticipacion;
    for (const i in this.tablaDetalle.lregistros) {
      this.tablaDetalle.actualizarTotalIndv(Number(i));
    }
    
  }
  consultarDetalle(reg: any) {

    if (this.tablaCabecera.registro.tipocdetalle === 'GEN' && this.tablaCabecera.registro.estadicdetalle === 'GEN') {
      this.rqConsulta.CODIGOCONSULTA = 'ROLPAGOS';
    } else {
      this.consultarDetalleNuevos(reg);
      return;
    }

    this.rqConsulta.mdatos.ldatos = reg.registro;
    this.rqConsulta.mdatos.registro = this.tablaCabecera.registro;

    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.lregistros = [];
          if (resp.cod === 'OK') {
            

          } else {
            super.mostrarMensajeError(resp.msgusu)
          }

        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
 




  validaGrabar() {
    return this.tablaCabecera.validaGrabar()
  }




}
