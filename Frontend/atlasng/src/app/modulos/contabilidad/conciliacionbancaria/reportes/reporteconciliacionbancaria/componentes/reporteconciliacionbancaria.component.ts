
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovCuentasContablesComponent } from '../../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';


@Component({
  selector: 'app-reporteconciliacionbancaria',
  templateUrl: 'reporteconciliacionbancaria.html'
})
export class ReporteconciliacionbancariaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconlibrobancosaldo', 'REPORTECONCILIACION', false);
    this.componentehijo = this;
  }
// RRO 20220705
  ngOnInit() {
    super.init();
    this.mcampos.finicio = super.stringToFecha(super.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable));
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {
    //this.actualizarSaldo();

    if (this.mcampos.ccuenta == undefined) {
      this.mostrarMensajeError("CUENTA CONTABLE REQUERIDA");
      return;;
    }

    if (this.estaVacio(this.mcampos.finicio)) {
      this.mostrarMensajeError('FECHA DE INICIO REQUERIDA');
      return;
    }

    if (this.estaVacio(this.mcampos.ffin)) {
      this.mostrarMensajeError('FECHA DE FINALIZACIÓN REQUERIDA');
      return;
    }

    this.jasper.nombreArchivo = 'rptConConciliacionBancaria_2022';

    if ((this.mcampos.finicio != null && this.mcampos.ffin == null) || (this.mcampos.finicio == null && this.mcampos.ffin != null) || (this.mcampos.finicio > this.mcampos.ffin)) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");

    } else {

      let lfinicio: number = 0;
      let lffin: number = 99990101;

      if (this.mcampos.finicio === undefined || this.mcampos.finicio === null) {
        this.mcampos.finicio = 0
      }
      else {
        lfinicio = (this.mcampos.finicio.getFullYear() * 10000) + ((this.mcampos.finicio.getMonth() + 1) * 100) + this.mcampos.finicio.getDate();
      }

      if (this.mcampos.ffin === undefined || this.mcampos.ffin === null) {
        this.mcampos.ffin = 99990101
      }
      else {
        lffin = (this.mcampos.ffin.getFullYear() * 10000) + ((this.mcampos.ffin.getMonth() + 1) * 100) + this.mcampos.ffin.getDate();
      }

      this.jasper.formatoexportar = resp;
      this.jasper.parametros['@cuenta'] = this.mcampos.ccuenta;
      this.jasper.parametros['@finicio'] = lfinicio;
      this.jasper.parametros['@ffin'] = lffin;
      this.jasper.parametros['@cfuncionario'] = sessionStorage.getItem("cfuncionario"); // this.dtoServicios.mradicacion.np;

      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConConciliacionBancaria_2022';
      this.jasper.generaReporteCore();
      
    }
  }

  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
    }
    this.lconsulta = [];
  }

  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true); // con true solo muestra cuentas de movimiento.
  }

  fijarLovCuentasContablesSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.msgs = [];
      this.registro.ccuenta = reg.registro.ccuenta;
      this.mcampos.ccuenta = reg.registro.ccuenta;
      this.mcampos.ncuenta = reg.registro.nombre;
      this.rqMantenimiento.ccuenta = this.mcampos.ccuenta;
   //   this.obtenerSaldo();
    }
  }

/*   obtenerSaldo() {
    this.mcampos.saldoparaconciliacion = 0;
    const rqConsulta: any = new Object();
    if (!this.estaVacio(this.mcampos.ffin)
      && !this.estaVacio(this.mcampos.ccuenta)) {
      rqConsulta.ccompania = 1;
      rqConsulta.ccuenta = this.mcampos.ccuenta;
      rqConsulta.finicio = this.mcampos.finicio;
      rqConsulta.ffin =this.fechaToParticion(this.mcampos.ffin);
      rqConsulta.CODIGOCONSULTA = 'SALDOCONCILIACION';

      this.dtoServicios.ejecutarConsultaRest(rqConsulta)
        .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }

          this.mcampos.saldoparaconciliacion = resp.SALDO;
        },
        error => {
          this.dtoServicios.manejoError(error);
        });

    }
  } 
  */




  /*
  actualizarSaldo() {

    const rqConsulta: any = new Object();
    if (!this.estaVacio(this.mcampos.ffin)  && !this.estaVacio(this.mcampos.ccuenta)) {
      rqConsulta.ccompania = 1;
      rqConsulta.ccuenta = this.mcampos.ccuenta;
      rqConsulta.fecha = this.fechaToParticion(this.mcampos.ffin);
      // (this.mcampos.ffin.getFullYear() * 10000) + ((this.mcampos.ffin.getMonth() + 1) * 100) + this.mcampos.ffin.getDate();
      rqConsulta.saldoparaconciliacion = this.mcampos.saldoparaconciliacion;
      rqConsulta.CODIGOCONSULTA = 'SALDOCONCILIACIONACTUALIZA';

      this.dtoServicios.ejecutarConsultaRest(rqConsulta)
        .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });

    }
  }
  */
}
