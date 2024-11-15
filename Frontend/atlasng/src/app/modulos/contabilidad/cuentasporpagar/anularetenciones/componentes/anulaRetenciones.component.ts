import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-anulaRetenciones',
  templateUrl: 'anulaRetenciones.html'
})
export class AnulaRetencionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcellogdocumentos', 'RETENCIONES', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
  }

  actualizar() {
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

  // Inicia CONSULTA *********************
  consultar() {
    this.consultarDocumentos();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.clog', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

   //MÉTODO PARA CONSULTAR DATOS DEL DOCUMENTOS AUTORIZADOS -- COMPONENTE DE CONSULTA
   consultarDocumentos() {
    this.rqConsulta.CODIGOCONSULTA = 'CON_COMPRETEAUTORIZADOS';
    this.rqConsulta.storeprocedure = "sp_ConConBuscaComprobanteRetencion";
    this.rqConsulta.parametro_numerodocumento = this.mfiltros.numerodocumento;  
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaDocumentos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaDocumentos(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.CON_COMPRETEAUTORIZADOS;
    }
  }

  anularComprobante(): void {   
    this.rqMantenimiento.numerodocumento = this.mfiltros.numerodocumento;
    this.rqMantenimiento.mdatos.anular = true;
    this.grabar();
  }

  private fijarFiltrosConsulta() {
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
    this.lmantenimiento = []; // Encerar Mantenimiento
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
  }


}
