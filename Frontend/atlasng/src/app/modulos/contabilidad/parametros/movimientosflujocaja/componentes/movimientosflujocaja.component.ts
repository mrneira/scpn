import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-movimientosflujocaja',
  templateUrl: 'movimientosflujocaja.html'
})
export class MovimientosflujocajaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm; 
  public ltipoplancuentas: SelectItem[] = [{label: '...', value: null}];
  public lestadoflujo: SelectItem[] = [{ label: '...', value: null }];
  public ltipooperacion: SelectItem[] = [{ label: '...', value: null }];
  public ltipooperacionaaaa: SelectItem[] = [{ label: '...', value: null }];
  public total: Number = 0;
  public tipoflujoccatalogo = 1033;
  public tipooperacionccatalogo = 1034;
  public inicio : SelectItem[] = [{ label: '...', value: null }];
  public final : SelectItem[] = [{ label: '...', value: null }];
  public listMeses : SelectItem[] = [{ label: '...', value: null }];
  public fechaPrueba;
  private catalogoDetalle: CatalogoDetalleComponent;
  public producto = "" ;
  constructor(router: Router, dtoServicios: DtoServicios) {
    //super(router, dtoServicios, 'tconflujoefectivo', 'AJUSTES', false, true);
    super(router, dtoServicios, 'TconFlujocaja', 'FLUJOCAJA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.mcampos.fingreso = this.fechaactual;
    //this.consultar();  // para ejecutar consultas automaticas.
    this.fechaPrueba;
    this.listMeses =
  [
    {
      "label": "...",
      "value": null
    },
    {
      "label": "ENERO",
      "value": "0131"
    },
    {
      "label": "FEBRERO",
      "value": "0228"
    },
    {
      "label": "MARZO",
      "value": "0331"
    },
    {
      "label": "ABRIL",
      "value": "0430"
    },
    {
      "label": "MAYO",
      "value": "0531"
    },
    {
      "label": "JUNIO",
      "value": "0630"
    },
    {
      "label": "JULIO",
      "value": "0731"
    },
    {
      "label": "AGOSTO",
      "value": "0831"
    },
    {
      "label": "SEPTIEMBRE",
      "value": "0930"
    },
    {
      "label": "OCTUBRE",
      "value": "1031"
    },
    {
      "label": "NOVIEMBRE",
      "value": "1130"
    },
    {
      "label": "DICIEMBRE",
      "value": "1231"
    },
  ]
  }

  ngAfterViewInit() {
    // this.consultarCatalogos();
  }

  crearNuevo() {
    if (this.estaVacio(this.mcampos.tipoplancuenta)) {
      this.mostrarMensajeError("DEBE SELECCIONAR EL TIPO DE CUENTA");
        return;
      }
    if (this.estaVacio(this.mcampos.tipoflujocdetalle)) {
      this.mostrarMensajeError("DEBE SELECCIONAR EL TIPO DE FLUJO");
        return;
      }
    super.crearNuevo();
    if (this.mcampos.tipoplancuenta === 'PC-FA') {
      this.registro.ccuenta='711020101'
      }
      else{
        this.registro.ccuenta='11020101'
      }  
      var currentTime = new Date();
      var year = currentTime.getFullYear()
      this.fechaPrueba 
      var finalfecha = "";
      finalfecha = ""+year+this.fechaPrueba;
    if(this.mcampos.tipoflujocdetalle !='REA'){
      this.registro.fcontable = finalfecha;
    }else{
      this.registro.fcontable = this.fechaToInteger(this.mcampos.fingreso);
    }  
    this.registro.fcontable = this.fechaToInteger(this.mcampos.fingreso);
    this.registro.tipoflujoccatalogo = this.tipoflujoccatalogo
    this.registro.tipoflujocdetalle = this.mcampos.tipoflujocdetalle
    this.registro.tipooperacionccatalogo = this.tipooperacionccatalogo
    this.registro.tipoplanccatalogo = 1001;
    this.registro.tipoplancdetalle = this.mcampos.tipoplancuenta;
    this.mostrarDialogoGenerico = true;
    this.inicio = this.ltipooperacionaaaa.slice(0, 7);
    this.final = this.ltipooperacionaaaa.slice(7);//CCA 20220627
    this.final.unshift({"label": "...","value": null})
  }

  actualizar() {
    super.actualizar();

  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    this.encerarMensajes();
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.mostrarDialogoGenerico = true;
  }

  // Inicia CONSULTA *********************
  consultar() {
    if(this.mcampos.tipoflujocdetalle === "PRO"){
      
    this.producto = this.mcampos.tipoflujocdetalle;
    }
    else
    {
      this.producto = this.mcampos.tipoflujocdetalle;
    }

    if (this.estaVacio(this.mcampos.tipoplancuenta)) {
      this.mostrarMensajeError("DEBE SELECCIONAR EL TIPO DE CUENTA");
        return;
      }
    if (this.estaVacio(this.mcampos.tipoflujocdetalle)) {
      this.mostrarMensajeError("DEBE SELECCIONAR EL TIPO DE FLUJO");
        return;
      }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cflujocaja', this.mfiltros, this.mfiltrosesp);
    // consulta.addSubquery('tconcatalogo', 'nombre', 'nnombre', 'i.ccuenta = t.ccuenta');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntipooperacion', 'i.ccatalogo = t.tipooperacionccatalogo  and i.cdetalle = t.tipooperacioncdetalle');
    consulta.cantidad = 200;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    //this.mfiltros.fcontable =  this.dtoServicios.mradicacion.fcontable;
    this.mfiltros.tipoplanccatalogo = 1001;
    this.mfiltros.tipoplancdetalle = this.mcampos.tipoplancuenta;
    this.mfiltros.tipoflujoccatalogo = 1033;
    this.mfiltros.tipoflujocdetalle = this.mcampos.tipoflujocdetalle;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

    // Inicia MANTENIMIENTO *********************
    grabar(): void {
      if (this.estaVacio(this.mcampos.tipoplancuenta)) {
        this.mostrarMensajeError("DEBE SELECCIONAR EL TIPO DE CUENTA");
          return;
        }
        if (this.estaVacio(this.mcampos.tipoflujocdetalle)) {
          this.mostrarMensajeError("DEBE SELECCIONAR EL TIPO DE FLUJO");
            return;
          }
          var currentTime = new Date();
          var year = currentTime.getFullYear()
          this.fechaPrueba 
          var finalfecha = "";
          finalfecha = ""+year+this.fechaPrueba;
          
      this.lmantenimiento = []; // Encerar Mantenimiento
      //this.lmantenimiento = []; // Encerar Mantenimiento
      //this.rqMantenimiento.mdatos.fcontable = this.fechaToInteger(this.mcampos.fingreso); 
      if(this.mcampos.tipoflujocdetalle !='REA'){
        this.rqMantenimiento.mdatos.fcontable = finalfecha;
      }else{
        this.rqMantenimiento.mdatos.fcontable = this.fechaToInteger(this.mcampos.fingreso);
      }
      this.rqMantenimiento.mdatos.tipoplancdetalle = this.mcampos.tipoplancuenta;
      this.rqMantenimiento.mdatos.tipoflujocdetalle = this.mcampos.tipoflujocdetalle;
      this.crearDtoMantenimiento();
      // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
      super.grabar();
    }
  
    public crearDtoMantenimiento() {
      const mantenimiento = super.getMantenimiento(1);
      super.addMantenimientoPorAlias(this.alias, mantenimiento);
    }
  
    public postCommit(resp: any) {
      super.postCommitEntityBean(resp);
      // this.consultar();
    }

  cerrarDialogo() {
  }

  consultarCatalogos(): void{

    this.encerarConsultaCatalogos();
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1001;
    const consultaTipoPlanCuenta = this.catalogoDetalle.crearDtoConsulta();
    consultaTipoPlanCuenta.cantidad = 100;
    this.addConsultaCatalogos('TIPOPLANCUENTA', consultaTipoPlanCuenta, this.ltipoplancuentas, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = this.tipoflujoccatalogo;
    const consultaEstadoFlujoCaja = this.catalogoDetalle.crearDtoConsulta();
    consultaEstadoFlujoCaja.cantidad = 100;
    this.addConsultaCatalogos('ESTADOFLUJOCAJA', consultaEstadoFlujoCaja, this.lestadoflujo, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = this.tipooperacionccatalogo;
    const consultaTipoOperacionFlujo = this.catalogoDetalle.crearDtoConsulta();
    consultaTipoOperacionFlujo.cantidad = 100;
    this.addConsultaCatalogos('TOPERACIONFLUJO', consultaTipoOperacionFlujo, this.ltipooperacion, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1036;
    const consultaTipoOperacionFlujoaaa = this.catalogoDetalle.crearDtoConsulta();
    consultaTipoOperacionFlujoaaa.cantidad = 100;
    this.addConsultaCatalogos('TOPERACIONFLUJOaaa', consultaTipoOperacionFlujoaaa, this.ltipooperacionaaaa, super.llenaListaCatalogo, 'nombre');


    this.ejecutarConsultaCatalogos();

  }

}

