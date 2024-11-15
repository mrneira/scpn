import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovPersonaVistaComponent } from '../../../../personas/lov/personavista/componentes/lov.personaVista.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';
import { LovEstadoTransaccionComponent } from '../../../../tesoreria/lov/estadotransaccion/componentes/lov.estadotransaccion.component';
import { DatosGeneralesComponent } from '../submodulos/datosgenerales/componentes/_datosGenerales.component';
import { SolicitudComponent } from '../submodulos/datosgenerales/componentes/_solicitud.component';
import { TablaAmortizacionComponent } from '../submodulos/tablaamortizacion/componentes/_tablaAmortizacion.component';
import { ValVencidosComponent } from '../submodulos/valvencidos/componentes/_valVencidos.component';
import { TransaccionesComponent } from '../submodulos/transacciones/componentes/_transacciones.component';
import { RubrosOperacionComponent } from '../submodulos/rubrosoperacion/componentes/_rubrosOperacion.component';
import { GarantiasOperacionComponent } from '../submodulos/garantias/componentes/_garantiasOperacion.component';

@Component({
  selector: 'app-consulta-operacion',
  templateUrl: 'consultaOperacion.html'
})
export class ConsultaOperacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild('vistadeudor')
  private lovPersonaVista: LovPersonaVistaComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  @ViewChild(LovEstadoTransaccionComponent)
  private lovEstadoTransaccion: LovEstadoTransaccionComponent;

  @ViewChild(DatosGeneralesComponent)
  datosGeneralesComponent: DatosGeneralesComponent;

  @ViewChild(SolicitudComponent)
  solicitudComponent: SolicitudComponent;

  @ViewChild(TablaAmortizacionComponent)
  tablaAmortizacionComponent: TablaAmortizacionComponent;

  @ViewChild(ValVencidosComponent)
  valVencidosComponent: ValVencidosComponent;

  @ViewChild(RubrosOperacionComponent)
  rubrosOperacionComponent: RubrosOperacionComponent;

  @ViewChild(GarantiasOperacionComponent)
  garantiasOperacionComponent: GarantiasOperacionComponent;

  @ViewChild(TransaccionesComponent)
  transaccionesComponent: TransaccionesComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CONSULTAOPERACION', false);
  }

  ngOnInit() {
    this.componentehijo = this;
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
  }

  private fijarFiltrosConsulta() {
    this.solicitudComponent.mfiltros.coperacion = this.mcampos.coperacion;
    this.solicitudComponent.fijarFiltrosConsulta();

    this.tablaAmortizacionComponent.mfiltros.coperacion = this.mcampos.coperacion;
    this.tablaAmortizacionComponent.fijarFiltrosConsulta();

    this.valVencidosComponent.mfiltros.coperacion = this.mcampos.coperacion;
    this.valVencidosComponent.fijarFiltrosConsulta();

    this.rubrosOperacionComponent.mfiltros.coperacion = this.mcampos.coperacion;

    this.garantiasOperacionComponent.mfiltros.coperacion = this.mcampos.coperacion;
    this.garantiasOperacionComponent.garantiasPersonalesComponent.mfiltros.coperacion = this.mcampos.coperacion;

    this.transaccionesComponent.mfiltros.coperacion = this.mcampos.coperacion;
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.solicitudComponent.consultar();
    this.tablaAmortizacionComponent.consultar();
    this.valVencidosComponent.consultar();
    this.rubrosOperacionComponent.consultar();
    this.garantiasOperacionComponent.consultar();
    this.garantiasOperacionComponent.garantiasPersonalesComponent.consultar();
    this.transaccionesComponent.consultar();
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  validaGrabar() {
    return true;
  }

  public postCommit(resp: any) {
    this.mcampos.csolicitud = resp.csolicitud;

    this.solicitudComponent.postCommit(resp, this.getDtoMantenimiento(this.solicitudComponent.alias));
  }

  public consultarDatosOperacion() {
    this.mcampos.nombre = null;
    this.mcampos.cpersona = null;
    this.mcampos.cmoneda = null;
    this.mcampos.ntipoprod = null;

    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'CONSULTAOPERACIONCARTERA';
    rqConsulta.coperacion = this.mcampos.coperacion;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.msgs = [];
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod !== 'OK') {
            return;
          }
          const operacion = resp.OPERACION[0];
          const tcaroperacion = resp.TCAROPERACION[0];
          this.mcampos.identificacion = operacion.identificacion;
          this.mcampos.nombre = operacion.n_persona;
          this.mcampos.cpersona = operacion.cpersona;
          this.mcampos.cmoneda = operacion.cmoneda;
          this.mcampos.ntipoprod = tcaroperacion.n_producto + ' - ' + tcaroperacion.n_tipoproducto;
          this.mcampos.fapertura = tcaroperacion.fapertura;

          this.rqMantenimiento.cmoneda = tcaroperacion.cmoneda;
          this.rqMantenimiento.coperacion = this.mcampos.coperacionvista;

          this.consultar();
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;

      this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
      this.lovOperacion.consultar();
      this.lovOperacion.showDialog();
    }
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de operacion. */
  fijarLovOperacionSelec(reg: any): void {
    this.mcampos.coperacion = reg.registro.coperacion;
    this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    this.mcampos.montooriginal = reg.registro.montooriginal;
    this.mcampos.fapertura = reg.registro.fapertura;
    this.consultar();
  }

  /**Muestra lov de persona vista */
  mostrarLovPersonaVista(): void {
    this.lovPersonaVista.showDialog();
    this.lovPersonaVista.mcampos.cpersona = this.mcampos.cpersona;
    this.lovPersonaVista.mcampos.identificacion = this.mcampos.identificacion;
    this.lovPersonaVista.mcampos.nombre = this.mcampos.nombre;
    this.lovPersonaVista.consultar();
  }

  /**Muestra lov de estado de transaccion */
  mostrarLovEstadoTransaccion(): void {
    this.lovEstadoTransaccion.verreg = 0;
    this.lovEstadoTransaccion.modulo = Number(sessionStorage.getItem('m'));
    this.lovEstadoTransaccion.cestado = '';
    this.lovEstadoTransaccion.fcontable = this.mcampos.fapertura;
    this.lovEstadoTransaccion.mfiltros.referenciainterna = this.mcampos.coperacion;
    this.lovEstadoTransaccion.tipotransaccion = 'P';
    this.lovEstadoTransaccion.habilitarfiltros = false;

    this.lovEstadoTransaccion.showDialog(true);
  }
}