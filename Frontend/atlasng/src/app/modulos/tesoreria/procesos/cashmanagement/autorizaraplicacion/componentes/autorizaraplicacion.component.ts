import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../..//util/dto/dto.component';
import { Mantenimiento } from '../../../../../..//util/dto/dto.component';
import { BaseComponent } from '../../../../../..//util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-autorizaraplicacion',
  templateUrl: 'autorizaraplicacion.html'
})
export class AutorizarAplicacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lresumen: any[];
  public ldetalle: any[];
  public ldestino: any[];
  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  habilitaDetalle = false;
  graba = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttesrecaudacion', 'AUTORIZARAPLICACION', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.fgeneracion = super.stringToFecha(super.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable));
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  consultar(): void {

    this.crearDtoConsulta();
    super.consultar();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosMod: any = { activo: true, negocio: true };
    const conModulo = new Consulta('tgenmodulo', 'Y', 't.nombre', mfiltrosMod, {});
    conModulo.cantidad = 50;
    this.addConsultaCatalogos('MODULOS', conModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');

    const mfiltrosDes: any = { cmodulodestino: sessionStorage.getItem('m'), ctransacciondestino: sessionStorage.getItem('t'), tipomapeo: 'CAS' };
    const conDestino = new Consulta('TtesRetroalimentacion', 'Y', 't.cretroalimentacion', mfiltrosDes, {});
    conDestino.cantidad = 50;
    this.addConsultaCatalogos('RETROALIMENTACION', conDestino, this.ldestino, this.llenarRetroalimentacion, '', this.componentehijo);

    this.ejecutarConsultaCatalogos();

  }

  public llenarRetroalimentacion(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.ldestino = pListaResp;
  }

  public crearDtoConsulta(): Consulta {
    this.lregistros = [];
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.fcontable', this.mfiltros, {});
    consulta.addSubquery('tgenmodulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('TgenTransaccion', 'nombre', 'ntransaccion', 'i.ctransaccion = t.ctransaccion and i.cmodulo = t.cmodulo');
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

    if (!this.estaVacio(this.ldestino)) {
      this.mfiltros.ctransaccion = this.ldestino[0].ctransaccionoriginal;
      this.mfiltros.cmodulo = this.ldestino[0].cmoduloriginal;
      this.mfiltros.cestado = 5;
    }
    else {
      this.mfiltros.ctransaccion = 0;
      this.mfiltros.cmodulo = 0;
      this.mfiltros.cestado = 0;
    }
  }

  public consultarAnterior() {
    this.rqConsulta = [];
    super.consultarAnterior();
  }

  public consultarSiguiente() {
    this.rqConsulta = [];
    super.consultarSiguiente();
  }

  //MÉTODO PARA CONSULTAR DATOS DEL DOCUMENTOS AUTORIZADOS -- COMPONENTE DE CONSULTA
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.fcontable = this.dtoServicios.mradicacion.fcontable;
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  consultaResumen(evento: any) {
    this.rqConsulta.CODIGOCONSULTA = 'RECAUDACIONRESUMENCABECERA';
    this.rqConsulta.mdatos.fcontable = this.dtoServicios.mradicacion.fcontable;
    this.rqConsulta.mdatos.crecaudacion = evento.data.crecaudacion;
    this.rqConsulta.mdatos.cestado = this.mfiltros.cestado;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaDetalle(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuestaDetalle(resp: any) {
    if (resp.cod === 'OK') {
      if (resp.detalle === 'OK') {
        this.ldetalle = resp.resumenrecaudacion;
        this.habilitaDetalle = true;
      }
    }
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.enproceso = false;
      this.recargar();
      this.mostrarMensajeSuccess('PAGO AUTORIZADO');
    }
  }

  autorizaraplicacion() {
    if (this.lregistros.length === 0) {
      this.mostrarMensajeError('NO EXISTEN REGISTROS A APLICAR');
      return;
    }
    this.generarcash()
    this.grabar();
  }

  generarcash(): boolean {
    this.graba = false;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        reg.mdatos.generar = true;
        this.graba = true;
      }
    }
    return this.graba;
  }

  seleccionaRegistro(evento: any) {
    this.habilitaDetalle = false;
    this.consultaResumen(evento);
  }
}
