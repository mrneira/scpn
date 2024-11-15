import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';
import { LovProveedoresComponent } from '../../../../contabilidad/lov/proveedores/componentes/lov.proveedores.component';

@Component({
  selector: 'app-cuentasporpagar',
  templateUrl: 'cuentasporpagar.html'
})
export class CuentasporpagarComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild(LovProveedoresComponent)
  lovProveedores: LovProveedoresComponent;

  public lestadosCxP: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcomprobantedetalle', 'REPORTEDEUDASPROVEEDORES', false, false);
    this.componentehijo = this;
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

  ngOnInit() {
    super.init();
    this.mcampos.finicio = new Date();
    this.mcampos.ffin = new Date();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {

    this.jasper.nombreArchivo = 'CuentasPorPagar';


      if (this.mcampos.finicio === undefined || this.mcampos.ffin === undefined) {
        this.mostrarMensajeError("INGRESE RANGO DE FECHAS");
        return;
      }
      this.jasper.formatoexportar = resp;
      this.jasper.parametros['@i_finicial'] = this.mcampos.finicio;
      this.jasper.parametros['@i_ffinal'] = this.mcampos.ffin;
      this.jasper.parametros['@i_cpersona'] = this.mcampos.cpersona;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConCuentasPorPagar';
      this.jasper.generaReporteCore();
  }


  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lestadosCxP, resp.ESTADOSCXP, 'cdetalle');
    }
    this.lconsulta = [];
  }
  /**Muestra lov de cuentas contables */

  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true); // con true solo muestra cuentas de movimiento.
  }

  mostrarLovProveedores(): void {
    this.lovProveedores.showDialog();
  }

  llenarConsultaCatalogos(): void {

    const mfiltrosEstadosCxP: any = { 'ccatalogo': 1005 };
    const consultaEstadosCxP = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstadosCxP, {});
    consultaEstadosCxP.cantidad = 50;
    this.addConsultaPorAlias('ESTADOSCXP', consultaEstadosCxP);
  }

  fijarLovProveedoresSelect(reg: any): void {
    if (reg.registro !== undefined) {

      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;

    }
  }


}
