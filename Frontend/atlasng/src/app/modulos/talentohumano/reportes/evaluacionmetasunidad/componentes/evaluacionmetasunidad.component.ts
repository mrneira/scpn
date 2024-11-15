import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SpinnerModule } from 'primeng/primeng';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovEvaluacionMetaComponent } from '../../../lov/evaluacionmeta/componentes/lov.evaluacionmeta.component'
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';


@Component({
  selector: 'app-reporte-evaluacionmetasunidad',
  templateUrl: 'evaluacionmetasunidad.html'
})
export class EvaluacionMetasUnidadComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  @ViewChild(LovEvaluacionMetaComponent) 
  private lovEvaluacionMeta: LovEvaluacionMetaComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthmeta', 'TTHMETA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    
  }

  ngAfterViewInit() {
  }


  descargarReporte(): void {

    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    this.jasper.nombreArchivo = 'EvaluacionMetasPorUnidad';
    
    if (this.registro.cmeta === undefined || this.registro.cmeta === null) {
      this.mostrarMensajeError("SELECCIONE UNA META");
      return;
    }

   

    // Agregar parametros
    this.jasper.parametros['@i_codigometa'] = this.registro.cmeta;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthEvaluacionMetasPorUnidad';
    this.jasper.generaReporteCore();
  }

  mostrarLovEvaluacionMeta(): void {
    this.lovEvaluacionMeta.mfiltros.cperiodo = this.mcampos.cperiodo;
    this.lovEvaluacionMeta.mfiltros.cdepartamento = this.registro.cdepartamento;
    this.lovEvaluacionMeta.showDialog();
  }

  fijarLovEvaluacionMetaSelect(reg: any): void{
    if (reg.registro !== undefined) {
      this.mcampos.cevaluacion = reg.registro.cevaluacion;
      this.mcampos.nevaluacion = reg.registro.mdatos.nnombre + " " + reg.registro.mdatos.napellido + " - " + reg.registro.mdatos.nperiodo;
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.cperiodo = reg.registro.cperiodo;
      this.registro.cmeta = reg.registro.cmeta;
      
    }
  }

  /**Muestra lov de funcionarios */
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nfuncionario = reg.registro.mdatos.nombre;
      this.registro.cmeta = reg.registro.cfuncionario;
      this.consultar();
    }
  }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
      super.postQueryEntityBean(resp);
    }


}
