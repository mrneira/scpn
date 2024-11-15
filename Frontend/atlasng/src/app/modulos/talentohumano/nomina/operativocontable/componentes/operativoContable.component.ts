import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-operativo-contable',
  templateUrl: 'operativoContable.html'
})
export class OperativoContableComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lrubros: SelectItem[] = [{ label: '...', value: null }];
  public loperativo: any = [];
  public mostrarDialogoOperativo = false;
  public sumasaldovencido = 0;
  public sumasaldoxvencer = 0;
  public sumasaldo = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'SALDOSCONTABLESACTIVOS', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.mfiltros.fcontable = this.fechaactual;
    super.init();
    this.consultar();
  }

  ngAfterViewInit() {
    this.mfiltros.fcontable = this.fechaactual;
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mfiltros.fcontable)) {
      super.mostrarMensajeError('FECHA CONTABLE ES REQUERIDO');
      return;
    }
    this.fijarFiltrosConsulta();
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'TH_SALDOSCONTABLES';
    this.rqConsulta.storeprocedure = "sp_NomConSaldosContables";
    this.rqConsulta.parametro_i_fecha = this.fechaToInteger(this.mfiltros.fcontable);
    super.consultar();
  }

  private fijarFiltrosConsulta() {
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };

    const fcierre = this.mfiltros.fcontable;
    if (!this.estaVacio(this.mfiltros.fcontable)) {
      this.rqConsulta.parametro_i_fecha = this.fechaToInteger(this.mfiltros.fcontable);
    }else{
      super.mostrarMensajeError("NO HA INGRESADO LA FECHA CONTABLE");
    }

  }

  consultaDetalleOperativo(registro: any) {
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };
    this.mcampos.cuenta = registro.ccuenta + ' - ' + registro.ncuenta
    if (!this.estaVacio(this.mfiltros.fcontable)) {
      this.rqConsulta.parametro_i_fecha = this.fechaToInteger(this.mfiltros.fcontable);
    }else{
      super.mostrarMensajeError("NO HA INGRESADO LA FECHA CONTABLE");
    }
    const fcierre = this.mcampos.fcontable;
    this.rqConsulta.parametro_i_fecha = this.fechaToInteger(this.mfiltros.fcontable);
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'TH_SALDOSCONTABLES';
    this.rqConsulta.storeprocedure = "sp_NomConSaldosContables";
    super.consultar();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (this.rqConsulta.mdatos.CODIGOCONSULTA === 'TH_SALDOSCONTABLES') {
      this.lregistros = resp.TH_SALDOSCONTABLES;
      this.mostrarDialogoOperativo = true;
      for (const i in this.lregistros) {
        if (this.lregistros.hasOwnProperty(i)) {
          const item = this.lregistros[i];
          this.registro.ccuenta = item.ccuenta;
          this.registro.ncuenta = item.ncuenta;
          this.registro.saldoactivos = item.saldoactivos;
          this.registro.saldocontable = item.saldocontable;
          this.registro.diferencia = item.diferencia;

        }
      }
    } else {
      super.postQueryEntityBean(resp);
    }
  }
  // Fin CONSULTA *********************

  /** Consulta catalogos */
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();
    this.ejecutarConsultaCatalogos();
  }

  cerrarDialogoOperativo() {
    this.mostrarDialogoOperativo = false;
  }

}
