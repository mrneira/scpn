import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-consulta-cobro',
  templateUrl: 'consultaCobro.html'
})

export class ConsultaCobroComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lparticion: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CONSULTARECAUDACION', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.finicio = new Date();
    this.mcampos.ffin = new Date();
  }

  ngAfterViewInit() {
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.finicio)) {
      super.mostrarMensajeError('FECHA INICIO REQUERIDA');
      return;
    }
    if (this.estaVacio(this.mcampos.ffin)) {
      super.mostrarMensajeError('FECHA FIN REQUERIDA');
      return;
    }

    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    this.rqConsulta.CODIGOCONSULTA = 'CONSULTARECAUDACION';
    this.rqConsulta.storeprocedure = "sp_CarConRecaudacion";
  }

  private fijarFiltrosConsulta() {
    this.rqConsulta.parametro_finicio = this.fechaToInteger(this.mcampos.finicio);
    this.rqConsulta.parametro_ffin = this.fechaToInteger(this.mcampos.ffin);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.calcularTotales();
  }
  // Fin CONSULTA *********************

  calcularTotales(): void {
    this.mcampos.totalenvio = 0;
    this.mcampos.totalrespuesta = 0;
    this.mcampos.totalpago = 0;

    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        this.mcampos.totalenvio += reg.valor;
        this.mcampos.totalrespuesta += reg.valorprocesado;
        this.mcampos.totalpago += reg.monto;
      }
    }
  }

  imprimir(resp: any): void {
    if (!this.estaVacio(this.mcampos.finicio) && !this.estaVacio(this.mcampos.ffin)) {
      // Agregar parametros
      const finicio = this.fechaToInteger(this.mcampos.finicio);
      const ffin = this.fechaToInteger(this.mcampos.ffin);

      this.jasper.nombreArchivo = 'ConsultaRecaudacion_' + finicio + '_' + ffin;
      this.jasper.formatoexportar = resp;
      this.jasper.parametros['@finicio'] = finicio;
      this.jasper.parametros['@ffin'] = ffin;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaRecaudacion';
      this.jasper.generaReporteCore();
    } else {
      this.mostrarMensajeError("FECHAS DE CONSULTA ES REQUERIDO");
    }
  }

}
