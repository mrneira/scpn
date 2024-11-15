import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-autorizararchivocobro',
  templateUrl: 'autorizararchivocobro.html'
})
export class AutorizarArchivoCobroComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lresumen: any[];
  public ldetalle: any[];
  public cargaok: boolean;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcarrecaudaciondetalle', 'DETALLERECAUDACION', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.fgeneracion = super.stringToFecha(super.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable));
    this.consultar();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    if (resp.cod === 'OK') {
      if (resp.DETALLERECAUDACION.length > 0) {
        this.consultaResumen();
      }
    }
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.mfiltros.fcontable = this.dtoServicios.mradicacion.fcontable;
    this.mfiltros.cestado = 1;
    const consulta = new Consulta(this.entityBean, 'Y', 't.fcontable', this.mfiltros, {});
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  //MÉTODO PARA CONSULTAR DATOS DEL DOCUMENTOS AUTORIZADOS -- COMPONENTE DE CONSULTA
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.fcontable = this.mfiltros.fcontable;
    this.crearDtoMantenimiento();
    super.grabar();
  }

  autorizarpagos() {
    this.grabar();
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


}
