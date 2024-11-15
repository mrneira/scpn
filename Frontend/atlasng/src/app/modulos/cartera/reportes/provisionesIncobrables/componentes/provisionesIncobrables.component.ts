import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import { find } from 'rxjs/operator/find';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-ProvisionesIncobrablesReporte',
  templateUrl: 'provisionesIncobrables.html'
})
export class ProvisionesIncobrablesComponent extends BaseComponent implements OnInit, AfterViewInit {

  public ltipoplancuentas: SelectItem[] = [{label: '...', value: null}];
  public lmesesini: SelectItem[] = [{label: '...', value: null}];
  public lista: any;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'REPORTEINCOBRABLES', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mfiltros.fperiodo = this.anioactual;
    this.fijarListaMeses();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  consultar() {
    if (this.mfiltros.fperiodo === undefined || this.mfiltros.fperiodo === null) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null) {
      this.mostrarMensajeError("INGRESE MES");
      return;
    }
    if (this.mcampos.tipoplancuenta === undefined || this.mcampos.tipoplancuenta === null){
      this.mostrarMensajeError("INGRESE TIPO DE PLAN");
      return;
    }
   
  }
  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  fijarListaMeses() {
    this.lmesesini.push({ label: "ENERO", value: 1 });
    this.lmesesini.push({ label: "FEBRERO", value: 2 });
    this.lmesesini.push({ label: "MARZO", value: 3 });
    this.lmesesini.push({ label: "ABRIL", value: 4 });
    this.lmesesini.push({ label: "MAYO", value: 5 });
    this.lmesesini.push({ label: "JUNIO", value: 6 });
    this.lmesesini.push({ label: "JULIO", value: 7 });
    this.lmesesini.push({ label: "AGOSTO", value: 8 });
    this.lmesesini.push({ label: "SEPTIEMBRE", value: 9 });
    this.lmesesini.push({ label: "OCTUBRE", value: 10 });
    this.lmesesini.push({ label: "NOVIEMBRE", value: 11 });
    this.lmesesini.push({ label: "DICIEMBRE", value: 12 });
  }

  consultarCatalogos(): any {
  }

  llenarConsultaCatalogos(): void {
    
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
  
  }
  
  public imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'PROVISIONESINCOBRABLES';

    // Agregar parametros
    this.jasper.parametros['@i_anio'] = this.mfiltros.fperiodo;
    this.jasper.parametros['@i_mes'] = this.mfiltros.finicio;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarProvisionesIncobrables';
    this.jasper.formatoexportar = resp;
    this.jasper.generaReporteCore();
  }
  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.enproceso = false;
    }
  }
}
