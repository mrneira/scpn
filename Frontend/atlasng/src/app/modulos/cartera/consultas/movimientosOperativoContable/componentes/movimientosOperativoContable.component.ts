import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta, Subquery } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-movimientos-operativo-contables',
  templateUrl: 'movimientosOperativoContable.html'
})
export class MovimientosOperativoContableComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovCuentasContablesComponent)
  private lovcuentasContables: LovCuentasContablesComponent;

  public sumadebitos = 0;
  public sumacreditos = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEGENERICO', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
    this.mcampos.fcontable = super.integerToDate(this.dtoServicios.mradicacion.fcontable);
  }

  ngAfterViewInit() {
  }


  crearNuevo() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.fcontable)) {
      super.mostrarMensajeError('FECHA ES REQUERIDO');
      return;
    }
    if (this.estaVacio(this.mcampos.ccuenta)) {
      super.mostrarMensajeError('CUENTA CONTABLE ES REQUERIDO');
      return;
    }

    this.fijarFiltrosConsulta();
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'REPORTEGENERICO';
    this.rqConsulta.storeprocedure = "sp_CarConMovimientosContables";
    super.consultar();
  }

  private fijarFiltrosConsulta() {
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };

    this.rqConsulta.parametro_particion = this.fechaToInteger(this.mcampos.fcontable).toString().substring(0, 6);
    this.rqConsulta.parametro_fcontable = this.fechaToInteger(this.mcampos.fcontable);
    this.rqConsulta.parametro_ccuenta = this.mcampos.ccuenta;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  /**Muestra lov de cuentas contables */
  mostrarlovcuentasContables(): void {
    this.lovcuentasContables.mfiltros.ccuenta = undefined;
    this.lovcuentasContables.mfiltros.nombre = undefined;
    this.lovcuentasContables.showDialog(true);
    this.lovcuentasContables.consultar();
  }

  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (!this.estaVacio(reg.registro)) {
      this.mcampos.ncuenta = reg.registro.nombre;
      this.mcampos.ccuenta = reg.registro.ccuenta;
    }
  }

  public calcultaTotales(ccomprobante: any) {
    this.sumadebitos = 0;
    this.sumacreditos = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.ccomprobante === ccomprobante) {
          if (reg.debito) {
            this.sumadebitos = this.sumadebitos + reg.monto;
          } else {
            this.sumacreditos = this.sumacreditos + reg.monto;
          }
        }
      }
    }
  }

  public imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'DEVOLUCIONES_' + resp.fdevolucion + '_' + resp.ccomprobante;

    // Agregar parametros
    this.jasper.parametros['@i_tipo'] = 'R';
    this.jasper.parametros['@i_finicio'] = 0;
    this.jasper.parametros['@i_ffin'] = 0;
    this.jasper.parametros['@i_fcontable'] = resp.fdevolucion;
    this.jasper.parametros['@i_mensaje'] = resp.mensaje;
    this.jasper.parametros['@i_ccomprobante'] = resp.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rpt_DevolucionesDescuentos';
    this.jasper.formatoexportar = 'xls';
    this.jasper.generaReporteCore();
  }

}
