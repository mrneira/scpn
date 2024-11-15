import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-detalle-operativo',
  template: ''
})
export class DetalleOperativoCarteraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public loperativo: any = [];
  public mostrarDialogoOperativo = false;
  public sumasaldovencido = 0;
  public sumasaldoxvencer = 0;
  public sumasaldo = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'SALDOSCONTABLESCARTERA', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {
  }

  // Inicia CONSULTA *********************
  public consultar() {
    this.fijarFiltrosConsulta();
    super.consultar();
  }

  private fijarFiltrosConsulta() {
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };
    this.lregistros = [];
    const fcierre = this.fechaToInteger(this.mcampos.fcontable);

    this.rqConsulta.mdatos.CODIGOCONSULTA = 'SALDOSCONTABLESCARTERA';
    this.rqConsulta.storeprocedure = "sp_CarConSaldosContables";
    this.rqConsulta.parametro_i_fcierre = fcierre;
    this.rqConsulta.parametro_i_particion = fcierre.toString().substring(0, 4) + fcierre.toString().substring(4, 6);
    this.rqConsulta.parametro_i_csaldo = this.mcampos.csaldo;
    this.rqConsulta.parametro_i_detalle = true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.calcularTotales();
  }
  // Fin CONSULTA *********************

  calcularTotales(): void {
    this.mcampos.totaldetalle = 0;

    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        this.mcampos.totaldetalle += reg.saldo;
      }
    }
  }

  imprimir(resp: any): void {
  }

  /*
  RNI 20240605
  */

  public consultarMora() {
    this.fijarFiltrosConsultaMora();
    super.consultar();
  }
  
  private fijarFiltrosConsultaMora() {
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };
    this.lregistros = [];
    const fcierre = this.calendarToFechaString(this.mcampos.fcontable);

    this.rqConsulta.mdatos.CODIGOCONSULTA = 'SALDOSCONTABLESCARTERA';
    this.rqConsulta.storeprocedure = "sp_ConRptRendimientoInteresMora";
    this.rqConsulta.parametro_i_ccuenta = '75209';
    this.rqConsulta.parametro_i_fcorte = fcierre;
    this.rqConsulta.parametro_i_detalle = true;  
  }


}
