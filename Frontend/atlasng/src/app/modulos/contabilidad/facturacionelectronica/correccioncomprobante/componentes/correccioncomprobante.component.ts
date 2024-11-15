import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-correccioncomprobante',
  templateUrl: 'correccioncomprobante.html'
})

export class CorreccionComprobanteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public ltipodoc: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcellogdocumentos', 'CORRECCIONCOMPROBANTES', false, false);
    this.componentehijo = this;
  }
  registroarchivo: any;
  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  private fijarFiltrosConsulta() {
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    //No aplica
  }

  actualizar() {
    //No aplica
  }

  eliminar() {
    //No aplica 
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
    
  }

  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ltipodoc, resp.TIPODOC, 'cdetalle');
    }
    this.lconsulta = [];
  }

  llenarConsultaCatalogos(): void {
    const mfiltroTIPODOC: any = { 'ccatalogo': 1018 };
    const consultaTIPODOC = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTIPODOC, {});
    consultaTIPODOC.cantidad = 10;
    this.addConsultaPorAlias('TIPODOC', consultaTIPODOC);
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.encerarMensajes();
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.mfiltros.estado=2;
    this.mfiltrosesp.autorizacion="is null";
    const consulta = new Consulta(this.entityBean, 'Y', 't.clog', this.mfiltros, this.mfiltrosesp);
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  grabar(): void {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.tipodocumento=this.mfiltros.tipodocumento;
    this.rqMantenimiento.mdatos.numerodocumento=this.mfiltros.numerodocumento;
    this.rqMantenimiento.mdatos.claveacceso=this.lregistros[0].clavedeacceso;
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
    if (resp.cod === "OK") {
      this.enproceso = false;
      this.consultar();
    }
  }

}

