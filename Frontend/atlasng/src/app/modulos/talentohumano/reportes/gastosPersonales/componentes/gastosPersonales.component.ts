import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SpinnerModule } from 'primeng/primeng';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';


@Component({
  selector: 'app-reporte-gastosPersonales',
  templateUrl: 'gastosPersonales.html'
})
export class GastosPersonalesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'gastosPersonales', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mfiltros.anio = new Date().getFullYear();
  }

  ngAfterViewInit() {
  }


  descargarReporte(): void {

    this.jasper.nombreArchivo = 'FormularioGastosPersonales';
    
    if (this.mfiltros.cfuncionario === undefined || this.mfiltros.cfuncionario === null) {
      this.mostrarMensajeError("SELECCIONE EL FUNCIONARIO");
      return;
    }

    if (this.mfiltros.anio === undefined || this.mfiltros.anio === null || this.mfiltros.anio === '') {
      this.mostrarMensajeError("INGRESE EL AÑO");
      return;
    }

    // Agregar parametros
    this.jasper.parametros['@i_cfuncionario'] = this.mfiltros.cfuncionario;
    this.jasper.parametros['@i_anio'] = this.mfiltros.anio;



    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthFormularioGastosPersonales';
    this.jasper.generaReporteCore();
  }

  /**Muestra lov de funcionarios */
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nfuncionario = reg.registro.mdatos.nombre;
      this.mfiltros.cfuncionario = reg.registro.cfuncionario;
      this.consultar();
    }
  }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
      super.postQueryEntityBean(resp);
    }


}
