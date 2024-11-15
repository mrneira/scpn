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
  selector: 'app-autorizararchivocash',
  templateUrl: 'autorizararchivocash.html'
})
export class AutorizarArchivoCashComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lresumen: any[];
  public ldetalle: any[];
  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  selectedRegistros;
  graba: boolean = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttesrecaudacion', 'AUTORIZARECAUDACION', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.fgeneracion = super.stringToFecha(super.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable));
    this.consultarCatalogos();
    this.consultar();
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
    this.ejecutarConsultaCatalogos();
  }

  public crearDtoConsulta(): Consulta {
    this.lregistros = [];
    this.mfiltrosesp.finicio = 'between ' + this.dtoServicios.mradicacion.fcontable + ' and ' + this.dtoServicios.mradicacion.fcontable;
    this.mfiltrosesp.ffin = 'between ' + this.dtoServicios.mradicacion.fcontable + ' and ' + this.dtoServicios.mradicacion.fcontable;
    this.mfiltros.cestado = 1;
    const consulta = new Consulta(this.entityBean, 'Y', 't.fcontable', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgenmodulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('TgenTransaccion', 'nombre', 'ntransaccion', 'i.ctransaccion = t.ctransaccion and i.cmodulo = t.cmodulo');
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
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
    this.rqMantenimiento.mdatos.fcontable = this.mfiltros.fcontable;
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  consultaResumen() {
    this.rqConsulta.CODIGOCONSULTA = 'RESUMENRECAUDACION';
    this.rqConsulta.mdatos.fcontable = this.mfiltros.fcontable;
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

  registrosprocesarcash(): boolean {
    this.graba = false;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        for (const j in this.selectedRegistros) {
          if (this.selectedRegistros.hasOwnProperty(j)) {
            const mar: any = this.selectedRegistros[j];
            if (reg !== undefined && mar !== undefined && reg.crecaudacion === mar.crecaudacion) {
              reg.mdatos.autorizar = true;
              this.graba = true;
            }
          }
        }
      }
    }
    if (this.selectedRegistros === undefined || this.selectedRegistros === null) {
      this.graba = false;
    }
    return this.graba;
  }

  autorizarcash() {
    if (!this.registrosprocesarcash()) {
      this.mostrarMensajeError('DEBE SELECCIONAR REGISTROS PARA AUTORIZACIÓN');
    }
    else {
      this.grabar();
    }
  }

}
