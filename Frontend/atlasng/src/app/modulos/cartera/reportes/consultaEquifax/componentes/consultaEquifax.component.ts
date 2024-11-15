import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-consultaEquifax',
  templateUrl: 'consultaEquifax.html'
})
export class ConsultaEquifaxComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public ldevoluciones: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'CAR_REPORTEEQUIFAX', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fecha = new Date();
  }

  ngAfterViewInit() {
  }

  // Inicia CONSULTA *********************
  // consultar() {
  //   this.fijarFiltrosConsulta();
  //   super.consultar();
  // }

  // private fijarFiltrosConsulta() {
  //   super.encerarConsulta();
  //   this.rqConsulta = { 'mdatos': {} };
  //   this.rqConsulta.mdatos.CODIGOCONSULTA = 'CAR_REPORTEEQUIFAX';
  //   this.rqConsulta.storeprocedure = "sp_CarRptConsultaEquifax";
  //   this.rqConsulta.parametro_fcontable = this.mcampos.fcontable;
  // }

  // validaFiltrosConsulta(): boolean {
  //   return super.validaFiltrosConsulta();
  // }

  // /**Se llama automaticamente luego de ejecutar una consulta. */
  // public postQuery(resp: any) {
  //   super.postQueryEntityBean(resp);
  //   //this.calcularTotales();
  // }
  // Fin CONSULTA *********************

  /**Calcula totales de registros. */
  // calcularTotales(): void {
  //   this.mcampos.totalcapitalxvencer = 0;
  //   this.mcampos.totalcapitalnodevenga = 0;
  //   this.mcampos.totalcapitalvencido = 0;
  //   this.mcampos.totaljudicial = 0;
  //   this.mcampos.totalcastigo = 0;

  //   for (const i in this.lregistros) {
  //     if (this.lregistros.hasOwnProperty(i)) {
  //       const reg = this.lregistros[i];
  //       this.mcampos.totalcapitalxvencer += reg.capitalxvencer;
  //       this.mcampos.totalcapitalnodevenga += reg.capitalnodevenga;
  //       this.mcampos.totalcapitalvencido += reg.capitalvencido;
  //       this.mcampos.totaljudicial += reg.judicial;
  //       this.mcampos.totalcastigo += reg.castigo;
  //     }
  //   }
  // }

  /**Imprimir. */
  public imprimir(): void {
    if (this.mcampos.fecha === null || this.mcampos.fecha === undefined) {
      this.mostrarMensajeError('FECHA REQUERIDA');
    }
    else{
      this.jasper.nombreArchivo = 'REPORTEEQUIFAX_' + this.fechaToInteger(this.mcampos.fecha);
      // Agregar parametros
      this.jasper.parametros['@fcontable'] = this.fechaToInteger(this.mcampos.fecha);
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaEquifax';
      this.jasper.formatoexportar = 'xls';
      this.jasper.generaReporteCore();
    }
    
  }

}
