import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CabeceraComponent } from '../submodulos/cabecera/componentes/cabecera.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/detalle.component';

import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';

@Component({
  selector: 'app-marcaciones',
  templateUrl: 'marcaciones.html'
})

export class MarcacionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(CabeceraComponent)
  tablacabecera: CabeceraComponent;
  mostrarcaja: boolean = false;
  @ViewChild(DetalleComponent)
  tabladetalle: DetalleComponent;
  public lregistrosaux: any = [];
  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'MARCACIONES', false, false);
    this.componentehijo = this;
  }
  registroarchivo: any;
  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.biometrico = this.mcampos.biometrico;
    this.registro.cusuario= this.mcampos.cusuario;
    this.registro.eliminado = false;
    this.registro.fingreso= this.fechaactual;

  }
grabar(){
  this.rqMantenimiento.mdatos.lregistros= this.lregistros;
  this.rqMantenimiento.mdatos.lregistroseliminar=this.lregistroseliminar;
  super.grabar();
}
  actualizar() {
    if (!this.registro.esnuevo){
    this.registro.actualizar= true;
  }
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }
  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.tablacabecera.editable = true;
  }
  consultar() {
    this.rqConsulta.CODIGOCONSULTA = 'MARCACIONESINVAL';
    this.rqConsulta.mdatos.cmodulo = sessionStorage.getItem('m');
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejorespuesta(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
  recargadto() {
    this.router.navigate([''], {skipLocationChange: true});
  }
  manejorespuesta(resp: any) {
    
    
    this.lregistrosaux = [];
    if (resp.cod === 'OK') {
      this.lregistrosaux = resp.MARCACIONESINVALIDAS;
    }
  }
  completarRegistro(reg:any){
    var oldstr=reg;
    var newstr=oldstr.toString().replace("-","/");
    const fecha= new Date(newstr.split(' '));
    this.registro.fmarcacionint=this.fechaToInteger(fecha);
  }
  consultarCatalogos(): void {
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1137;
    const consTipo = this.catalogoDetalle.crearDtoConsulta();
    consTipo.cantidad = 100;
    this.addConsultaCatalogos('TIPO', consTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if(resp.cod==='OK' && resp.FINALIZADA==='OK'){
      this.recargadto();
    }
  }
  buscarDetalleReferencia(registro: any) {
    this.rqConsulta.CODIGOCONSULTA = 'MARCACIONES';
    this.mcampos.biometrico = registro.biometrico;
    this.mcampos.cusuario= registro.cusuario;
    this.rqConsulta.mdatos.fmarcacionint = registro.fmarcacionint;
    this.rqConsulta.mdatos.cusuario = registro.cusuario;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.asignarDatos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });

  }
  asignarDatos(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.AgregarNuevo(this, resp.MARCACIONES);
      this.mostrarcaja = true;
      for (const i in this.lregistros) {
        if (this.lregistros.hasOwnProperty(i)) {
          const reg = this.lregistros[i];
          reg.esnuevo = false;
          reg.actualizar=false;
        }
      }
    }
  }
  private AgregarNuevo(tabla: BaseComponent, lista: any[]) {
    if (lista.length > 0) {
      for (const i in lista) {
        if (lista.hasOwnProperty(i)) {
          tabla.crearNuevo();
          const reg = lista[i];
          reg.esnuevo = true;
          reg.idreg = Math.floor((Math.random() * 100000) + 1);
          tabla.selectRegistro(reg);
          tabla.actualizar();
        }
      }
    }
  }
  seleccionaRegistro(evento: any) {
    this.buscarDetalleReferencia(evento);
  }
  StringToDate(value:any):Date{
    var fdata= new Date(value);
    return fdata;

  }

}

