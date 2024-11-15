import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-aportes',
  templateUrl: 'aportes.html'
})
export class AportesComponent extends BaseComponent implements OnInit, AfterViewInit {
  devolucion: boolean;


  public activarnuevo = true;

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('tblaaportes')
  public jasper: JasperComponent;

  @Output()
  childChanged = new EventEmitter<string>();


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpreaporte', 'APORTES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
  }

  ngAfterViewInit() {
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }


  public postCommit(resp: any) {

  }


  /**Manejo respuesta de ejecucion. */
  private manejaRespuestaDatosAportes(resp: any) {
    this.mcampos.aporteacumulado = 0.00;
    const msgs = [];
    if (resp.cod === 'OK') {

      for (const i in this.lregistros) {
        const reg = this.lregistros[i];
        this.mcampos.aporteacumulado = this.mcampos.aporteacumulado + reg.acumulado;
      }
    }
    this.lconsulta = [];
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    // super.postQueryEntityBean(resp);
    //this.manejaRespuestaDatosAportes(resp);
    // this.childChanged.emit(resp);
    //  this.calcularBonificacion();

  }



  public limpiar() {
    this.lregistros = [];
  }
  // Fin CONSULTA ********************* 

  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    // super.consultar();
  }

  public crearDtoConsulta() {
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 203;
    this.rqConsulta.CODIGOCONSULTA = 'APORTES';
    this.rqConsulta.cpersona = this.mfiltros.cpersona;
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod === 'OK') {
            super.postQueryEntityBean(resp);
            this.manejaRespuestaDatosAportes(resp);
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
  
  descargarReporte(reg: any): void {
    this.jasper.formatoexportar = reg;
    this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
    this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestaciones/AportesPersonales';
    this.jasper.generaReporteCore();
  }
}
