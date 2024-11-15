import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovProveedoresComponent } from '../../../lov/proveedores/componentes/lov.proveedores.component';
import { SelectItem } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-autorizacioncxp',
  templateUrl: 'autorizacioncxp.html'
})
export class AutorizacioncxpComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovProveedoresComponent)
  lovproveedores: LovProveedoresComponent;
  selectedRegistros: any = [];
  lregistrospendientes: any = [];
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcuentaporpagar', 'tconcuentaporpagar', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1);
    this.mfiltros.fingresoini = finicio;
    this.mfiltros.fingresofin = this.fechaactual;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }


  //#region consultacuentasporpagar
  consultar() {
    this.lregistros = [];
    this.lregistrospendientes = [];
    this.consultarCuentasPorPagar();
    this.consultarCuentasPorPagarPendientePresupuesto();
  }

  private fijarFiltrosConsulta() {
  }

  consultarCuentasPorPagar() {
    this.rqConsulta.CODIGOCONSULTA = 'CXPPARAAUTORIZAR';
    this.rqConsulta.storeprocedure = "sp_ConConCxpAutorizarPago";

    delete this.rqConsulta.parametro_fingresoini;
    delete this.rqConsulta.parametro_fingresofin;
    delete this.rqConsulta.parametro_valorpagardesde;
    delete this.rqConsulta.parametro_valorpagarhasta;
    delete this.rqConsulta.parametro_cpersona;
    this.rqConsulta.parametro_fingresoini = super.calendarToFechaString(this.mfiltros.fingresoini);
    this.rqConsulta.parametro_fingresofin = super.calendarToFechaString(this.mfiltros.fingresofin);
    this.rqConsulta.parametro_valorpagardesde = this.mfiltros.valorpagarini;
    this.rqConsulta.parametro_valorpagarhasta = this.mfiltros.valorpagarfin;
    this.rqConsulta.parametro_cpersona = this.mfiltros.cpersona;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaCuentasporpagar(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
    this.rqConsulta.CODIGOCONSULTA = null;
  }

  private manejaRespuestaCuentasporpagar(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.CXPPARAAUTORIZAR;
    }
  }

  consultarCuentasPorPagarPendientePresupuesto() {
    this.rqConsulta.CODIGOCONSULTA = 'CXPPENDIENTESPRESUPUESTO';
    this.rqConsulta.storeprocedure = "sp_ConConCxpPendientePresupuesto";

    delete this.rqConsulta.parametro_fingresoini;
    delete this.rqConsulta.parametro_fingresofin;
    delete this.rqConsulta.parametro_valorpagardesde;
    delete this.rqConsulta.parametro_valorpagarhasta;
    delete this.rqConsulta.parametro_cpersona;
    this.rqConsulta.parametro_fingresoini = super.calendarToFechaString(this.mfiltros.fingresoini);
    this.rqConsulta.parametro_fingresofin = super.calendarToFechaString(this.mfiltros.fingresofin);
    this.rqConsulta.parametro_valorpagardesde = this.mfiltros.valorpagarini;
    this.rqConsulta.parametro_valorpagarhasta = this.mfiltros.valorpagarfin;
    this.rqConsulta.parametro_cpersona = this.mfiltros.cpersona;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaCuentasporpagarPendientesPresupuesto(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
    this.rqConsulta.CODIGOCONSULTA = null;
  }

  private manejaRespuestaCuentasporpagarPendientesPresupuesto(resp: any) {
    this.lregistrospendientes = [];
    if (resp.cod === 'OK') {
      this.lregistrospendientes = resp.CXPPENDIENTESPRESUPUESTO;
    }
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  //#endregion
  getColorNecesitaPresupuesto(x, reg) {
    var color: string;
    if (!reg.ruteopresupuesto) {
      color = 'lightgreen';
    } else {
      color = 'yellow';
    }
    x.parentNode.parentNode.style.background = color;
  }

  getColorAprobadoPresupuesto(x, reg) {
    var color: string;
    if (!reg.ruteopresupuesto) {
      color = 'lightgreen';
    } else if (reg.ruteopresupuesto && reg.aprobadopresupuesto) {
      color = 'lightgreen';
    } else if (reg.ruteopresupuesto && !reg.aprobadopresupuesto) {
      color = 'red';
    }
    x.parentNode.parentNode.style.background = color;
  }

  //Inicia MANTENIMIENTO *********************
  grabar(): void {

    if (this.selectedRegistros.length === 0 || this.estaVacio(this.selectedRegistros)) {
      super.mostrarMensajeError("NO EXISTEN REGISTROS SELECCIONADOS PARA AUTORIZAR PAGOS");
      return;
    }

    this.crearDtoMantenimiento();
    super.grabar();
    this.lregistros = [];
  }

  public crearDtoMantenimiento() {
    // tslint:disable-next-line:forin
    this.lregistros = [];
    //for (const i in this.selectedRegistros) {
    const reg = this.selectedRegistros;
    reg.esnuevo = true;
    this.lregistros.push(reg);
    //}
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    this.lregistros = [];
    this.lregistrospendientes = [];
    this.descargarReporte();
  }

  fijarLovProveedores(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
    }
  }

  mostrarlovproveedores(): void {
    this.lovproveedores.showDialog();
  }

  //#region Reporte
  descargarReporte(): void {
    const reg = this.selectedRegistros;
    // Agregar parametros
    let tipoComprobante = 'Diario';
    this.jasper.parametros['@i_ccomprobante'] = reg.ccompcontable;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }
}
