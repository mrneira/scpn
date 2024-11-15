import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovInversionesComponent } from '../../../../inversiones/lov/inversiones/componentes/lov.inversiones.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';
import { InversionesServicios } from './../../../servicios/_invservicios.service';

@Component({
  selector: 'app-operacionesrentavariable',
  templateUrl: 'operacionesrentavariable.html',
  providers: [InversionesServicios]
})
export class OperacionesrentavariableComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovInversionesComponent) private lovInversiones: LovInversionesComponent;
  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  public lOperacion: SelectItem[] = [{ label: '...', value: null }];
  public lAfectacion: SelectItem[] = [{ label: '...', value: null }];
  public lRubros: SelectItem[] = [{ label: '...', value: null }];
  private pEliminar: boolean = false;
  
  fecha = new Date();

  constructor(router: Router, dtoServicios: DtoServicios, private inversionesServicios: InversionesServicios) {
    super(router, dtoServicios, 'tinvcontabilizacion', 'OPERACIONESRENTAVARIABLE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.inversionesServicios.limpiarService();
    this.obtenerPlantillaContable();
    super.init(this.formFiltros);
    this.llenarEstado();
    this.consultarCatalogos();

    this.rqMantenimiento.lregistrosTotales = [];
    this.rqMantenimiento.lregistrosTotales.push({
      debe: 0,
      haber: 0
    });

  }

  ngAfterViewInit() {
  }

  crearNuevo() {

    let mensaje: string = this.validarCabecera();

    if (!this.estaVacio(mensaje)) {
      this.mostrarMensajeError(mensaje);
      return;
    }
    else {
      super.crearNuevo();

      this.mcampos.ccuentacon = null;
      this.mcampos.ncuentacon = null;
      this.mcampos.afectacion = null;

      this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
      this.registro.cinversion = this.mcampos.cinversion;
      this.registro.procesoccatalogo = 1220;
      this.registro.procesocdetalle = this.mcampos.procesocdetalle;
      this.registro.rubroccatalogo = 1219;
      this.registro.fcontable = null;
      this.registro.fingreso = this.fecha;
      this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;

    }
  }

  validarCabecera(): string {

    let lmensaje: string = "";

    if (this.estaVacio(this.mcampos.procesocdetalle)) {
      lmensaje = "DEBE ESCOGER UNA OPERACIÓN";
    }
    else {
      if (this.estaVacio(this.mcampos.cinversion)) {
        lmensaje = "DEBE ESCOGER UNA INVERSIÓN";
      }
    }
    return lmensaje;
  }


  actualizar() {

    this.encerarMensajes();

    if (this.estaVacio(this.registro.valor) || this.registro.valor <= 0) {
      this.mostrarMensajeError("VALOR DEBE SER MAYOR QUE CERO");
      return;
    }

    this.registro.ccuenta = this.mcampos.ccuentacon;

    this.afectacionContable();

    super.actualizar();
    this.totalizar();
  }

  eliminar() {
    if (this.pEliminar) {
      super.eliminar();
      this.totalizar();
      }      
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {

    this.pEliminar = true;
    if (!this.estaVacio(registro.mdatos.nccomprobante))
    {
      this.mostrarMensajeError("NO PUEDE ACTUALIZAR OPERACIONES YA CONTABILIZADAS");
      this.pEliminar = false;
      return;
    }

    super.selectRegistro(registro);

    if (this.estaVacio(this.registro.debito)) {
      this.mcampos.afectacion = null;
    }
    else {

      if (this.registro.debito == true) {
        this.mcampos.afectacion = "DEB";
      }
      else {
        this.mcampos.afectacion = "CRE";
      }

    }

    this.mcampos.ccuentacon = this.registro.ccuenta;
    this.mcampos.ncuentacon = this.registro.mdatos.ncuentacon;

  }

  // Inicia CONSULTA *********************
  consultar() {
    this.lregistros = [];
    if (this.estaVacio(this.validarCabecera())) {
      this.crearDtoConsulta();
      super.consultar();
    }
  }

  public crearDtoConsulta(): Consulta {

    this.mfiltros.procesocdetalle = this.mcampos.procesocdetalle;
    this.mfiltros.cinversion = this.mcampos.cinversion;
    const consulta = new Consulta(this.entityBean, 'Y', 't.fcontable DESC', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nRubro', 'i.ccatalogo = t.rubroccatalogo and i.cdetalle = t.rubrocdetalle');
    consulta.addSubquery('tconcatalogo', 'nombre', 'ncuentacon', 'i.ccuenta = t.ccuenta');
    consulta.addSubqueryPorSentencia('select case when j.ccomprobante is not null and j.anulado = 0 and j.eliminado = 0 then j.ccomprobante else null end from tconcomprobante j where t.ccomprobante = j.ccomprobante', 'nccomprobante');
    this.addConsulta(consulta);
    return consulta;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.totalizar();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    let lmensaje: string = "";

    if (!this.estaVacio(this.validarCabecera())) {
      lmensaje = "NO HA REALIZADO OPERACIONES DE ACTUALIZACIÓN";
    }
    else {
      if (this.lregistros != undefined && this.lregistros.length > 0 && this.rqMantenimiento.lregistrosTotales[0].debe != this.rqMantenimiento.lregistrosTotales[0].haber) {
        lmensaje = "DEBE CUADRAR EL DÉBITO CON EL CRÉDITO";
      }
    }

    if (!this.estaVacio(lmensaje)) {
      this.mostrarMensajeError(lmensaje);
      return;
    }


    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.encerarMensajes();
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        this.manejaRespuestaCatalogos(resp);

      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  llenarConsultaCatalogos(): void {

    const mfiltrosOpe: any = { 'ccatalogo': 1220 };
    const mfiltrosOpeEsp: any = { 'cdetalle': " in ('RECUP') " };
    const consultaOpe = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosOpe, mfiltrosOpeEsp);
    consultaOpe.cantidad = 50;
    this.addConsultaPorAlias('OPERACIONES', consultaOpe);

    const mfiltrosProf: any = { 'ccatalogo': 1219 };
    const consultaProf = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosProf, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('RUBROS', consultaProf);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lOperacion, resp.OPERACIONES, 'cdetalle');
      this.llenaListaCatalogo(this.lRubros, resp.RUBROS, 'cdetalle');

    }
    this.lconsulta = [];
  }

  llenarEstado() {
    this.lAfectacion = [];
    this.lAfectacion.push({ label: '...', value: null });
    this.lAfectacion.push({ label: 'DÉBITO', value: 'DEB' });
    this.lAfectacion.push({ label: 'CRÉDITO', value: 'CRE' });
  }

  mostrarLovInversiones(): void {
    this.lovInversiones.mfiltros.tasaclasificacioncdetalle = "VAR";
    this.lovInversiones.showDialog();
  }

  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true); // con true solo muestra cuentas de movimiento.
  }

  fijarLovCuentasContablesSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.msgs = [];

      this.mcampos.ccuentacon = reg.registro.ccuenta;
      this.mcampos.ncuentacon = reg.registro.nombre;
      this.registro.mdatos.ncuentacon = reg.registro.nombre;
    }
  }

  afectacionContable() {
    if (this.mcampos.afectacion == "DEB") {
      this.registro.debito = true;
    }
    else {
      if (this.mcampos.afectacion == "CRE") {
        this.registro.debito = false;
      }
      else {
        this.registro.debito = null;
      }
    }
  }

  totalizar() {

    this.rqMantenimiento.lregistrosTotales[0].debe = 0;
    this.rqMantenimiento.lregistrosTotales[0].haber = 0;

    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {

        if (this.lregistros[i].debito == true) {
          this.rqMantenimiento.lregistrosTotales[0].debe = this.rqMantenimiento.lregistrosTotales[0].debe + this.lregistros[i].valor;
        }
        else {
          this.rqMantenimiento.lregistrosTotales[0].haber = this.rqMantenimiento.lregistrosTotales[0].haber + this.lregistros[i].valor;
        }

      }
    }

  }

  fijarLovInversionesSelec(reg: any): void {

    this.inversionesServicios.pInstrumentocdetalle = null;
    this.inversionesServicios.pCinvagentebolsa = null;
    this.inversionesServicios.pEmisorcdetalle = null;

    this.inversionesServicios.pBancocdetalle = null;
    this.inversionesServicios.pBolsavalorescdetalle = null;


    this.mcampos.fcolocacion = null;

    if (reg.registro !== undefined) {

      this.msgs = [];
      this.mcampos.cinversion = reg.registro.cinversion;
      this.mcampos.codigotitulo = reg.registro.codigotitulo;
      this.inversionesServicios.pEmisorcdetalle = reg.registro.emisorcdetalle;
      this.inversionesServicios.pEmisorcdetalleNuevo = reg.registro.aceptantecdetalle;
      this.inversionesServicios.pCinvagentebolsa = reg.registro.cinvagentebolsa;
      this.inversionesServicios.pInstrumentocdetalle = reg.registro.instrumentocdetalle;
      this.inversionesServicios.pBancocdetalle = reg.registro.bancocdetalle;
      this.inversionesServicios.pBolsavalorescdetalle = reg.registro.bolsavalorescdetalle;
      this.inversionesServicios.pCentrocostocdetalle = reg.registro.centrocostocdetalle;
      this.consultar();
    }


  }

  rubroChange() {
    super.registrarEtiqueta(this.registro, this.lRubros, "rubrocdetalle", "nRubro");

    let lcuenta: any = [];

    switch (this.registro.rubrocdetalle) {
      case "COMOPE":
        lcuenta = this.inversionesServicios.asignaCuentaPredefinidaAgente(this.inversionesServicios.pcCOMISIONOPERADOR, this.mcampos.procesocdetalle);
        break;
      case "BANCOS":
        lcuenta = this.inversionesServicios.asignaCuentaPredefinida(this.inversionesServicios.pcBANCOS, this.mcampos.procesocdetalle, 1224, this.inversionesServicios.pBancocdetalle);
        break;
      case "CAP":
        lcuenta = this.inversionesServicios.asignaCuentaPredefinida(this.inversionesServicios.pcCAPITAL, this.mcampos.procesocdetalle, 1213, this.inversionesServicios.pEmisorcdetalle);
        break;
      case "INT":
        lcuenta = this.inversionesServicios.asignaCuentaPredefinida(this.inversionesServicios.pcINTERES, this.mcampos.procesocdetalle, 1213, this.inversionesServicios.pEmisorcdetalle);
        break;
      case "COMBOL":
        lcuenta = this.inversionesServicios.asignaCuentaPredefinida(this.inversionesServicios.pcCOMISIONBOLSA, this.mcampos.procesocdetalle, 1215, this.inversionesServicios.pBolsavalorescdetalle);
        break;
    }


    if (lcuenta["0"].ccuenta != "") {
      let lccuenta: string = "";
      let lncuenta: string = "";
      let lafectacion: string = "";
      lccuenta = lcuenta["0"].ccuenta;
      lncuenta = lcuenta["0"].ncuenta;
      lafectacion = lcuenta["0"].debito == true ? "DEB" : "CRE";
      this.mcampos.ccuentacon = lccuenta;
      this.mcampos.ncuentacon = lncuenta;
      this.mcampos.afectacion = lafectacion;
      this.registro.mdatos.ncuentacon = lncuenta;
      switch (lafectacion) {
        case "DEB":
          this.registro.debito = true;
          break;
        case "CRE":
          this.registro.debito = false;
          break;
        default:
          break;
      }
 

    }


  }

  obtenerPlantillaContable() {
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    rqConsulta.inversion = 7;
    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod !== 'OK') {
          return;
        }

        this.inversionesServicios.pPlantillaContable = resp.PLANTILLACONTABLE;
        this.inversionesServicios.pPlantillaContableAgente = resp.PLANTILLACONTABLEAGENTE;
        this.inversionesServicios.pAmbiente = resp.AMBIENTE;
        

      },
      error => {
        this.dtoServicios.manejoError(error);
      });

  }

}
