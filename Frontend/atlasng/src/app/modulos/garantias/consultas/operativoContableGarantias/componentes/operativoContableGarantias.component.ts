import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-operativo-contable',
  templateUrl: 'operativoContableGarantias.html'
})
export class OperativoContableGarantiasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lrubros: SelectItem[] = [{ label: '...', value: null }];
  public loperativo: any = [];
  public mostrarDialogoOperativo = false;
  public sumasaldo = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'SALDOSCONTABLESGARANTIA', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    this.mcampos.fcontable = super.integerToDate(this.dtoServicios.mradicacion.fcontable);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.fcontable)) {
      super.mostrarMensajeError('FECHA CONTABLE ES REQUERIDO');
      return;
    }

    if (this.estaVacio(this.mcampos.csaldo)) {
      super.mostrarMensajeError('RUBRO ES REQUERIDO');
      return;
    }

    this.fijarFiltrosConsulta();
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'SALDOSCONTABLESGARANTIA';
    this.rqConsulta.storeprocedure = "sp_GarConSaldosContables";
    super.consultar();
  }

  private fijarFiltrosConsulta() {
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };

    const fcierre = this.fechaToInteger(this.mcampos.fcontable);
    this.rqConsulta.parametro_i_fcierre = fcierre;
    this.rqConsulta.parametro_i_particion = fcierre.toString().substring(0, 4) + fcierre.toString().substring(4, 6);
    this.rqConsulta.parametro_i_csaldo = this.mcampos.csaldo;
  }

  consultaDetalleOperativo(registro: any) {
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };
    this.mcampos.cuenta = registro.ccuenta + ' - ' + registro.ncuenta

    const fcierre = this.fechaToInteger(this.mcampos.fcontable);
    this.rqConsulta.parametro_i_fcierre = fcierre;
    this.rqConsulta.parametro_i_ctipogarantia = registro.ctipogarantia;
    this.rqConsulta.parametro_i_ctipobien = registro.ctipobien;
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'SALDOSOPERATIVOGARANTIA';
    this.rqConsulta.storeprocedure = "sp_GarConSaldosOperativo";
    super.consultar();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (this.rqConsulta.mdatos.CODIGOCONSULTA === 'SALDOSOPERATIVOGARANTIA') {
      this.loperativo = resp.SALDOSOPERATIVOGARANTIA;
      this.mostrarDialogoOperativo = true;

      this.sumasaldo = 0;
      for (const i in this.loperativo) {
        if (this.loperativo.hasOwnProperty(i)) {
          const item = this.loperativo[i];
          this.sumasaldo += item.saldo;
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

    const mfiltrosEspRubro: any = { 'csaldo': 'in (select distinct csaldo from TgarSaldosContables)' };
    const consultaRubro = new Consulta('TmonSaldo', 'Y', 't.nombre', {}, mfiltrosEspRubro);
    consultaRubro.cantidad = 100;
    this.addConsultaCatalogos('RUBROS', consultaRubro, this.lrubros, super.llenaListaCatalogo, 'csaldo');

    this.ejecutarConsultaCatalogos();
  }

  cerrarDialogoOperativo() {
    this.mostrarDialogoOperativo = false;
  }

}
