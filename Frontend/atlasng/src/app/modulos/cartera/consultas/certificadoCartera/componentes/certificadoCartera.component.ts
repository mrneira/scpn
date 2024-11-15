import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-certificado-cartera',
  templateUrl: 'certificadoCartera.html'
})
export class CertificadoCarteraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  loperaciones: any = [];
  fvigencia = this.dtoServicios.mradicacion.fcontable;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'LISTAOPERACIONES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros, this.route);
    const fechacont: Date = this.integerToDate(this.dtoServicios.mradicacion.fcontable);
    fechacont.setMonth(fechacont.getMonth() + 1);
    fechacont.setDate(1);
    fechacont.setDate(fechacont.getDate() - 1);
    this.fvigencia = super.fechaToInteger(fechacont);
  }

  ngAfterViewInit() {
  }

  public selectRegistro(registro: any) {
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'SALDOS-OPERACION';
    this.rqConsulta.mdatos.cpersona = this.mcampos.cpersona;
    this.rqConsulta.mdatos.solosaldo = true;
    super.consultar();
  }

  validaFiltrosConsulta(): boolean {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeError("DEBE SELECCIONAR LA PERSONA A GENERAR EL CERTIFICADO");
      return false;
    }
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.manejaRespuesta(resp);
  }

  manejaRespuesta(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.loperaciones = resp.SALDOSOPERACION;
    }
    this.lconsulta = [];
  }
  // Fin CONSULTA *********************

  descargarReporte() {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeError("DEBE SELECCIONAR LA PERSONA A GENERAR EL CERTIFICADO");
      return;
    }
    this.jasper.nombreArchivo = 'ReporteCertificado';
    // Agregar parametros
    this.jasper.parametros['@i_cpersona'] = this.mcampos.cpersona + "";
    this.jasper.parametros['@i_loperaciones'] = this.loperaciones;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/BancaEnLinea/ReporteCertificado';
    this.jasper.formatoexportar = 'pdf';
    this.jasper.generaReporteCore();
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
    this.lovPersonas.mfiltros.csocio = 1;
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (!this.estaVacio(reg.registro)) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.consultar();
    }
  }

}
