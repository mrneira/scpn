import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem, SpinnerModule, FieldsetModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovCompromisoComponent } from '../../../lov/compromiso/componentes/lov.compromiso.component';

@Component({
  selector: 'app-afectacionPresupuestaria',
  templateUrl: 'afectacionPresupuestaria.html'
})
export class AfectacionPresupuestariaComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovCompromisoComponent)
  private lovcompromiso: LovCompromisoComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'CERTIFICACION', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fcorte = new Date();
    0
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

    /**Muestra lov de compromiso */
    mostrarlovCompromiso(): void {
      this.lovcompromiso.showDialog(true);
    }
  
    /**Retorno de lov de Compromiso presupuestario. */
    fijarLovCompromisoSelec(reg: any): void {
      if (reg.registro !== undefined) {
        this.mfiltros.ccompromiso = reg.registro.ccompromiso;
        this.registro.ccompromiso=reg.registro.ccompromiso;
        this.msgs = [];
        this.consultar();
      }
  
    }

  imprimir(resp: any): void {

    let mensaje: string = this.validarCabecera();

    if (!this.estaVacio(mensaje)) {
      this.mostrarMensajeError(mensaje);
      return;
    }

    this.jasper.nombreArchivo = 'rptPptAfectacionPresupuestaria';

    this.jasper.formatoexportar = resp;

    // Agregar parametros

    this.jasper.parametros['@i_ccompromiso'] = this.mfiltros.ccompromiso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptAfectacionPresupuestaria';
    this.jasper.generaReporteCore();

  }

  validarCabecera(): string {

    let lmensaje: string = "";

    
      if (this.estaVacio(this.mfiltros.ccompromiso)) {
        lmensaje = "Seleccione un compromiso";
      }  
    return lmensaje;
  }

  

}
