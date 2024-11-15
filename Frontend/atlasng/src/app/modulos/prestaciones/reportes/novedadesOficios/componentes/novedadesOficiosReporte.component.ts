import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovPersonasComponent} from '../../../../personas/lov/personas/componentes/lov.personas.component'

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'novedadesOficiosReporte.html'
})
export class NovedadesOficiosReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTENOVEDADESOFICIOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fIniOficio = new Date();
    this.mcampos.camposfecha.fFinOficio = new Date();
  }

  ngAfterViewInit() {
  }
  
   validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  descargarReporte(): void {
    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    this.jasper.nombreArchivo = 'ReporteNovedadesOficios';

    if((this.mcampos.fIniOficio != null && this.mcampos.fFinOficio == null) || (this.mcampos.fIniOficio == null && this.mcampos.fFinOficio != null) || (this.mcampos.fIniOficio > this.mcampos.fFinOficio) ){
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
      
  }else{
    
    if (this.mcampos.fIniOficio === undefined || this.mcampos.fIniOficio === null) {
      this.mcampos.fIniOficio = null
    }

    if (this.mcampos.fFinOficio === undefined || this.mcampos.fFinOficio === null) {
      this.mcampos.fFinOficio = null
    }  
    if (this.mcampos.cpersona === undefined) {
      this.mcampos.identificacion = '';
    }

   
    // Agregar parametros
    
    this.jasper.parametros['@i_fIniOfi'] = this.mcampos.fIniOficio;
    this.jasper.parametros['@i_fFinOfi'] = this.mcampos.fFinOficio;
    this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
    this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestaciones/NovedadesOficios';

    this.jasper.generaReporteCore();
  }
  }

  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovPersonas.mfiltros.tipodepersona = 'N';
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
    }
  }
  
}
