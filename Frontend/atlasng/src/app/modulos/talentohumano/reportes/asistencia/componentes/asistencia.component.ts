import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovFuncionariosComponent } from '../../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';


@Component({
  selector: 'app-reporte-horasextras',
  templateUrl: 'asistencia.html'
})
export class AsistenciaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionario: LovFuncionariosComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'HORASEXTRAS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1);
    this.mfiltros.finicio = finicio;
    this.mfiltros.ffin = this.fechaactual;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
   
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }
    let consulta;
    if (this.mcampos.cfuncionario === undefined || this.mcampos.cfuncionario === null) {

      consulta = -1;

    } else {
      consulta = this.mcampos.cfuncionario;
    }
    this.rqConsulta.CODIGOCONSULTA = 'TTHASISTENCIA';
    this.rqConsulta.storeprocedure = "sp_TthConAsistencia";
    this.rqConsulta.parametro_cfuncionario = consulta;
    this.rqConsulta.parametro_finicio = this.fechaToInteger(this.mfiltros.finicio);
    this.rqConsulta.parametro_ffin = this.fechaToInteger(this.mfiltros.ffin);
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaDatos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuestaDatos(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.TTHASISTENCIA;
    }
  }


  private fijarFiltrosConsulta() {
    this.mfiltros.activo = 0;
  }

  mostrarLovFuncionario(): void {
    this.lovFuncionario.showDialog();
  
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionario(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;

    }
  }
  descargarReporte(reg: any): void {
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }
    let consulta;
    if (this.mcampos.cfuncionario === undefined || this.mcampos.cfuncionario === null) {

      consulta = -1;

    } else {
      consulta = this.mcampos.cfuncionario;
    }


    this.jasper.formatoexportar = reg;
    this.jasper.nombreArchivo = 'rptTthAsistencia';
    // Agregar parametros
    this.jasper.parametros['@i_cfuncionario'] = consulta;
    this.jasper.parametros['@i_finicio'] = this.fechaToInteger(this.mfiltros.finicio);
    this.jasper.parametros['@i_ffin'] = this.fechaToInteger(this.mfiltros.ffin);
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthAsistencia';
    this.jasper.generaReporteCore();
  }


  consultarCatalogos(): any {
    this.msgs = [];
    //this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.encerarMensajes();
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
  
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

}
