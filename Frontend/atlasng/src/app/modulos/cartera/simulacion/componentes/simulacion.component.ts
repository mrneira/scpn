import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { DatePipe } from '@angular/common';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { DatosGeneralesComponent } from '../submodulos/datosgenerales/componentes/_datosGenerales.component';
import { SolicitudComponent } from '../submodulos/datosgenerales/componentes/_solicitud.component';
import { TablaAmortizacionComponent } from '../../originacion/solicitudingreso/submodulos/tablaamortizacion/componentes/_tablaAmortizacion.component';
import { JasperComponent } from '../../../../util/componentes/jasper/componentes/jasper.component'
import { LovPersonaVistaComponent } from '../../../personas/lov/personavista/componentes/lov.personaVista.component';

@Component({
  selector: 'app-simulacion',
  templateUrl: 'simulacion.html',
  providers: [DatePipe]
})
export class SimulacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public reporte: JasperComponent;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovPersonaVistaComponent)
  private lovPersonaVista: LovPersonaVistaComponent;

  @ViewChild(DatosGeneralesComponent)
  datosGeneralesComponent: DatosGeneralesComponent;

  @ViewChild(SolicitudComponent)
  solicitudComponent: SolicitudComponent;

  @ViewChild(TablaAmortizacionComponent)
  tablaAmortizacionComponent: TablaAmortizacionComponent;

  private datePipe: DatePipe;
  private csolicitud = 0;
  private print = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREASOLICITUDINGRESO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.consultarCatalogos();
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.

    const conSol = this.solicitudComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.solicitudComponent.alias, conSol);

    this.tablaAmortizacionComponent.mcampos.csolicitud = this.csolicitud;
  }

  private fijarFiltrosConsulta() {
    this.solicitudComponent.mfiltros.csolicitud = this.csolicitud;
    this.solicitudComponent.mfiltros.cpersona = this.registro.cpersona;
    this.solicitudComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.solicitudComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.solicitudComponent.postQuery(resp);

    if (this.csolicitud !== 0) {
      this.editable = false;
    }

    this.solicitudComponent.mfiltros.cpersona = this.solicitudComponent.registro.cpersona;
  }

  // Inicia MANTENIMIENTO *********************
  grabar() {
    // No existe para el padre
  }

  grabarSimulacion(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento

    if (!this.estaVacio(this.mcampos.csolicitud)) {
      this.rqMantenimiento.csolicitud = this.mcampos.csolicitud;
    }
    if (this.solicitudComponent.registro.montooriginal <= 0 || this.solicitudComponent.registro.numerocuotas <= 0) {
      super.mostrarMensajeError("MONTO Y NÚMERO DE CUOTAS REQUERIDOS");
      return;
    }

    this.solicitudComponent.registro.csolicitud = this.csolicitud;
    this.solicitudComponent.formvalidado = true;
    this.solicitudComponent.registro.monto = this.solicitudComponent.registro.montooriginal;
    this.solicitudComponent.registro.cmodulo = 7;
    this.solicitudComponent.registro.cmoneda = 'USD';
    this.solicitudComponent.selectRegistro(this.solicitudComponent.registro);
    this.solicitudComponent.actualizar();

    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');
    this.rqMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    this.rqMantenimiento['cmodulo'] = 7;
    this.rqMantenimiento['ctransaccion'] = 97;
    this.rqMantenimiento['essimulacion'] = true;

    super.addMantenimientoPorAlias(this.solicitudComponent.alias, this.solicitudComponent.getMantenimiento(1));
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  validaGrabar() {
    return this.solicitudComponent.validaGrabar();
  }

  public postCommit(resp: any) {
    if (this.rqMantenimiento['ctransaccion'] === 97 && this.rqMantenimiento['essimulacion'] === true) {
      if (resp.cod === 'OK') {
        this.print = true;
        this.tablaAmortizacionComponent.mcampos.csolicitud = resp.csolicitud;
        this.tablaAmortizacionComponent.postQuery(resp);
        this.solicitudComponent.mcampos.tasa = resp.tasa;
        this.solicitudComponent.mcampos.plazo = resp.plazo;
        this.solicitudComponent.registro.valorcuota = resp.TABLA[0].valcuo;

        super.registrarEtiqueta(this.solicitudComponent.registro, this.solicitudComponent.lproducto, "cproducto", "nproducto");
        super.registrarEtiqueta(this.solicitudComponent.registro, this.solicitudComponent.ltipoproducto, "ctipoproducto", "ntipoproducto");
      }
    }
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.validaRegimen = true;
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.csolicitud = 0;
      this.registro.cpersona = reg.registro.cpersona;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;

      this.solicitudComponent.registro.cpersona = reg.registro.cpersona;
      this.solicitudComponent.mfiltros.cpersona = reg.registro.cpersona;

      this.datosGeneralesComponent.habilitarEdicion();
      this.solicitudComponent.selectRegistro(this.solicitudComponent.registro);
    }
  }

  /**Muestra lov de persona vista */
  mostrarLovPersonaVista(): void {
    this.lovPersonaVista.showDialog();
    this.lovPersonaVista.mcampos.cpersona = this.mcampos.cpersona;
    this.lovPersonaVista.mcampos.identificacion = this.mcampos.identificacion;
    this.lovPersonaVista.mcampos.nombre = this.mcampos.nombre;
    this.lovPersonaVista.consultar();
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosProd: any = { 'cmodulo': 7 };
    const consultaProd = new Consulta('TgenProducto', 'Y', 't.nombre', mfiltrosProd, {});
    consultaProd.cantidad = 100;
    this.addConsultaCatalogos('PRODUCTO', consultaProd, this.solicitudComponent.lproducto, super.llenaListaCatalogo, 'cproducto');

    const mfiltrosTipoProd: any = { 'cmodulo': 7, 'activo': true, 'verreg': 0 };
    const consultaTipoProd = new Consulta('TcarProducto', 'Y', 't.nombre', mfiltrosTipoProd, {});
    consultaTipoProd.cantidad = 100;
    this.addConsultaCatalogos('TIPOPRODUCTO', consultaTipoProd, this.solicitudComponent.ltipoproducto, this.llenarTipoProducto, '', this.componentehijo);

    const consultaTipoTamortizacion = new Consulta('TcarTipoTablaAmortizacion', 'Y', 't.nombre', {}, {});
    consultaTipoTamortizacion.cantidad = 100;
    this.addConsultaCatalogos('TIPOTABLAAMORTIZACION', consultaTipoTamortizacion, this.solicitudComponent.ltablaamortizacion, super.llenaListaCatalogo, 'ctabla');

    this.ejecutarConsultaCatalogos();
  }

  public llenarTipoProducto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.solicitudComponent.ltipoproductototal = pListaResp;
  }

  limpiarSimulacion() {
    super.encerarMensajes();
    this.print = false;
    this.solicitudComponent.mcampos.tasa = null;
    this.solicitudComponent.registro.valorcuota = null;
    this.tablaAmortizacionComponent.lregistros = null;
    this.solicitudComponent.actualizar();
    this.tablaAmortizacionComponent.actualizar();
  }

  recargarSimulacion() {
    this.limpiarSimulacion();
  }

  descargarReporte() {
    this.reporte.nombreArchivo = 'ReporteSimulacion';
    // Agregar parametros
    this.reporte.parametros['@i_csolicitud'] = this.tablaAmortizacionComponent.mcampos.csolicitud;
    this.reporte.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.reporte.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaSimulacion';
    this.reporte.generaReporteCore();
  }
}
