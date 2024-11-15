import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPlantillasComprobanteComponent } from '../../../lov/plantillascomprobante/componentes/lov.plantillasComprobante.component';
import { LovConceptoContablesComponent } from '../../../lov/conceptocontables/componentes/lov.conceptoContables.component';
import { LovPartidaPresupuestariaComponent } from '../../../lov/partidapresupuestaria/componentes/lov.partidapresupuestaria.component';
import { LovCuentasContablesComponent } from '../../../lov/cuentascontables/componentes/lov.cuentasContables.component';
import { DetallePlantillasComprobanteComponent } from '../../../parametros/detalleplantillascomprobante/componentes/detallePlantillasComprobante.component';
import { ComprobanteComponent } from '../submodulos/comprobante/componentes/_comprobante.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { textChangeRangeIsUnchanged } from 'typescript';
import { AccordionModule } from 'primeng/primeng';
import { LovComprobantesComponent } from '../../../lov/comprobante/componentes/lov.comprobantes.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovProveedoresComponent } from '../../../lov/proveedores/componentes/lov.proveedores.component';
import { LovClientesComponent } from '../../../lov/clientes/componentes/lov.clientes.component';
import { LovAgenciasComponent } from '../../../../../modulos/generales/lov/agencias/componentes/lov.agencias.component';
import { LovSucursalesComponent } from '../../../../../modulos/generales/lov/sucursales/componentes/lov.sucursales.component';
import { elementAt } from 'rxjs/operator/elementAt';
import { forEach } from '@angular/router/src/utils/collection';

export enum KEY_CODE {
  FLECHA_ABAJO = 40
}

@Component({
  selector: 'app-ingreso',
  templateUrl: 'ingreso.html'
})
export class IngresoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovComprobantesComponent)
  private lovcomprobantes: LovComprobantesComponent;

  @ViewChild(ComprobanteComponent)
  comprobanteComponent: ComprobanteComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(LovPlantillasComprobanteComponent)
  private lovplantillasComprobante: LovPlantillasComprobanteComponent;

  @ViewChild(LovConceptoContablesComponent)
  private lovconceptoContables: LovConceptoContablesComponent;

  @ViewChild(LovPartidaPresupuestariaComponent)
  private lovpartidapresupuestaria: LovPartidaPresupuestariaComponent;

  @ViewChild(LovCuentasContablesComponent)
  private lovcuentasContables: LovCuentasContablesComponent;

  @ViewChild(LovCuentasContablesComponent)
  private lovcuentasContablesAux: LovCuentasContablesComponent;

  @ViewChild(LovPersonasComponent)
  private lovpersonas: LovPersonasComponent;
  @ViewChild(LovClientesComponent)
  private lovclientes: LovClientesComponent;
  @ViewChild(LovProveedoresComponent)
  private lovproveedores: LovProveedoresComponent;
  @ViewChild(LovAgenciasComponent)
  private lovagencias: LovAgenciasComponent;
  @ViewChild(LovSucursalesComponent)
  private lovsucursales: LovSucursalesComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public lsucursales: SelectItem[] = [{ label: '...', value: null }];

  public lagenciastotal: any = [];

  public lagencias: SelectItem[] = [{ label: '...', value: null }];

  public lregplantilla: any = [];
  public ltipodocumentocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public ltipopersona: SelectItem[] = [{ label: '...', value: null }, { label: 'CLIENTE', value: 'CL' }, { label: 'PROVEEDOR', value: 'PR' }, { label: 'PERSONA', value: 'PE' }];
  public grabo = false;
  public requeridoegreso = false;
  public tipodocumentoselecc: string;
  public totalesComprobanteDebito = 0;
  public totalesComprobanteCredito = 0;
  public totalesCombrobanteDiferencia = 0;
  public totalPlanCuentasADF_Debito = 0;
  public totalPlanCuentasADF_Credito = 0;
  public totalPlanCuentasFA_Debito = 0;
  public totalPlanCuentasFA_Credito = 0;
  public totalCCPC_Debito = 0;
  public totalCCPC_Credito = 0;
  public totalCCAGYE_Debito = 0;
  public totalCCAGYE_Credito = 0;
  public totalCCSCPN_Debito = 0;
  public totalCCSCPN_Credito = 0;

  public nuevo = true;
  public actualizosaldo = false;
  public eliminado = false;
  public automaticoplantilla = false;
  public valorautomatico = 0;
  public minDateValue: Date;
  public maxDateValue: Date;
  public persona = false;
  public proveedor = false;
  public cliente = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREANATURALES', false);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.FLECHA_ABAJO && event.ctrlKey) {
      this.detalleComponent.agregarCuenta();
    }

  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.mcampos.csucursal = this.dtoServicios.mradicacion.csucursal;
    this.mcampos.nsucursal = this.dtoServicios.mradicacion.nsucursal;
    this.mcampos.cagencia = this.dtoServicios.mradicacion.cagencia;
    this.mcampos.nagencia = this.dtoServicios.mradicacion.nagencia;
    this.consultarCatalogos();
    this.minDateValue = new Date(Number(this.dtoServicios.mradicacion.fcontable.toString().substring(0, 4)),
      Number(this.dtoServicios.mradicacion.fcontable.toString().substring(4, 6)) - 1,
      Number(this.dtoServicios.mradicacion.fcontable.toString().substring(6, 8))
    );

    this.maxDateValue = new Date(Number(this.dtoServicios.mradicacion.fcontable.toString().substring(0, 4)),
      Number(this.dtoServicios.mradicacion.fcontable.toString().substring(4, 6)) - 1,
      Number(this.dtoServicios.mradicacion.fcontable.toString().substring(6, 8))
    );
    this.comprobanteComponent.registro.mdatos.fcontable = this.integerToDate(this.dtoServicios.mradicacion.fcontable);
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
    this.rqConsulta.CODIGOCONSULTA = null;
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conComprobante = this.comprobanteComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.comprobanteComponent.alias, conComprobante);
    if (this.persona) {
      conComprobante.addSubquery('tperpersonadetalle', 'nombre', 'npersonarecibido', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
      conComprobante.addSubquery('tperpersonadetalle', 'identificacion', 'nidentificacionrecibido', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    } else if (this.proveedor || this.cliente) {
      conComprobante.addSubquery('tperproveedor', 'nombre', 'npersonarecibido', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
      conComprobante.addSubquery('tperproveedor', 'identificacion', 'nidentificacionrecibido', 't.cpersonarecibido = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    }
    conComprobante.addSubquery('tconconcepto', 'nombre', 'nconcepto', 'i.cconcepto = t.cconcepto');
    conComprobante.addSubquery('tconplantilla', 'nombre', 'pnombre', 'i.cplantilla = t.cplantilla');
    conComprobante.addSubquery('tgensucursal', 'nombre', 'nsucursal', 't.csucursal = i.csucursal');
    conComprobante.addSubquery('tgenagencia', 'nombre', 'nagencia', 't.cagencia = i.cagencia  AND t.csucursal = i.csucursal ');
    this.addConsultaPorAlias(this.comprobanteComponent.alias, conComprobante);

    const conDetalle = this.detalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.detalleComponent.alias, conDetalle);
  }

  private fijarFiltrosConsulta() {
    this.comprobanteComponent.fijarFiltrosConsulta();
    this.detalleComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.comprobanteComponent.validaFiltrosRequeridos() && this.detalleComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.comprobanteComponent.postQuery(resp);
    this.detalleComponent.postQuery(resp);
    this.calcularTotalesDebitoCredito();
    this.nuevo = false;
    if (this.comprobanteComponent.registro.actualizosaldo === true) {
      this.actualizosaldo = true;
    }
    else {
      this.actualizosaldo = false;
    }
    if (this.comprobanteComponent.registro.eliminado === true) {
      this.eliminado = true;
    }
    else {
      this.eliminado = false;
    }
    this.comprobanteComponent.registro.comentario += " ";
  }

  // Fin CONSULTA *********************

  guardarCambios(): void {
    if (this.comprobanteComponent.registro.comentario === undefined) {
      this.comprobanteComponent.registro.comentario = "";
    }

    this.rqMantenimiento.cuadrado = false;
    // this.rqMantenimiento.actualizarsaldos = false;
    //this.rqMantenimiento.actualizarsaldos = true;
    this.grabar();
  }

  finalizarIngreso(): void {

    // if(this.comprobanteComponent.registro.numerodocumentobancario === null || this.comprobanteComponent.registro.numerodocumentobancario === undefined || this.comprobanteComponent.registro.numerodocumentobancario === ""){
    //   super.mostrarMensajeError('NO SE ENCUENTRA INGRESADO DOCUMENTO BANCARIO');
    //     return;
    // }
    this.rqMantenimiento.cuadrado = true;
    this.rqMantenimiento.actualizarsaldos = true;
    this.grabar();
  }

  eliminarComprobante(): void {
    this.comprobanteComponent.registro.comentario = this.comprobanteComponent.registro.comentario + " -- Comprobante eliminado";
    this.rqMantenimiento.cuadrado = false;
    this.rqMantenimiento.mdatos.eliminar = true;
    this.grabar();
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    const mensajeError = this.validarDatosComprobanteContable();
    if (mensajeError !== '') {
      super.mostrarMensajeError(mensajeError);
      return;
    }

    if (this.rqMantenimiento.cuadrado) {
      this.calcularTotalesDebitoCredito();
      //const resultado = Math.abs(this.totalesComprobanteDebito - this.totalesComprobanteCredito);
      if (this.totalesComprobanteDebito !== null && this.totalesComprobanteDebito !== undefined
        && this.totalesComprobanteCredito !== null && this.totalesComprobanteCredito !== undefined
        && this.redondear(this.totalesComprobanteDebito,2) !== this.redondear(this.totalesComprobanteCredito,2) ) {
        super.mostrarMensajeError('Sumatorio totales entre créditos y débitos no son iguales');
        return;
      }


      if ( ( this.redondear( this.totalPlanCuentasADF_Credito,2) !== this.redondear( this.totalPlanCuentasADF_Debito,2 ) ) ||
        ( this.redondear( this.totalPlanCuentasFA_Credito,2) !== this.redondear(this.totalPlanCuentasFA_Debito,2) ) ) {
        super.mostrarMensajeError('Sumatorio totales entre créditos y débitos por planes de cuenta no son iguales');
        return;
      }

      if (( this.redondear(this.totalCCAGYE_Credito,2) !== this.redondear(this.totalCCAGYE_Debito,2)) ||
        ( this.redondear(this.totalCCPC_Credito,2) !== this.redondear(this.totalCCPC_Debito,2)) ||
        ( this.redondear(this.totalCCSCPN_Credito,2) !== this.redondear(this.totalCCSCPN_Debito,2) )) {
        super.mostrarMensajeError('Sumatorio totales entre créditos y débitos por centros de costo no son iguales');
        return;
      }
    }

    this.rqMantenimiento.mdatos.tipodocumentocdetalle = this.comprobanteComponent.registro.tipodocumentocdetalle;
    this.rqMantenimiento.mdatos.ccomprobante = this.comprobanteComponent.registro.ccomprobante;
    this.rqMantenimiento.mdatos.fcontable = this.comprobanteComponent.registro.fcontable;

    this.lmantenimiento = []; // Encerar Mantenimiento

    if (this.nuevo) {
      this.comprobanteComponent.selectRegistro(this.comprobanteComponent.registro);
      this.comprobanteComponent.actualizar();
    }

    this.comprobanteComponent.registro.csucursal = this.mcampos.csucursal;
    this.comprobanteComponent.registro.cagencia = this.mcampos.cagencia;
    this.comprobanteComponent.registro.csucursalingreso = this.mcampos.csucursal;
    this.comprobanteComponent.registro.cagenciaingreso = this.mcampos.cagencia;
    this.comprobanteComponent.registro.montocomprobante = this.totalesComprobanteCredito;

    for (const i in this.detalleComponent.lregistros) {
      if (this.detalleComponent.lregistros.hasOwnProperty(i)) {
        this.detalleComponent.lregistros[i].fcontable = this.comprobanteComponent.registro.fcontable;
      }
    }

    super.addMantenimientoPorAlias(this.comprobanteComponent.alias, this.comprobanteComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    if (resp.cod === "OK") {
      this.mostrarMensajeSuccess("TRANSACCION FINALIZADA CORRECTAMENTE");
      this.comprobanteComponent.postCommit(resp, this.getDtoMantenimiento(this.comprobanteComponent.alias));
      this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.detalleComponent.alias));
      this.comprobanteComponent.registro.numerocomprobantecesantia = resp.numerocomprobantecesantia;
      this.comprobanteComponent.registro.comentario += " ";
      this.grabo = true;
      this.nuevo = false;
      this.enproceso = false;
      this.fijarLovComprobantesSelec(this.comprobanteComponent);
      if (resp.mayorizado === "OK"){
        this.descargarReporte();
        this.actualizosaldo = true;
      }

    } else {
      this.mostrarMensajeError(resp.msgusu);
    }

  }


  /**Muestra lov de concepto contables */
  mostrarlovcomprobantes(): void {

    this.lovcomprobantes.mfiltros.automatico = false;
    this.lovcomprobantes.mfiltros.actualizosaldo = false;
    this.lovcomprobantes.mfiltros.eliminado = false;
    this.lovcomprobantes.mfiltros.ccomprobante = undefined;
    this.lovcomprobantes.mfiltros.numerocomprobantecesantia = undefined;
    this.lovcomprobantes.showDialog();
    //this.lovcomprobantes.consultar();
  }


  /**Retorno de lov de concepto contables. */
  fijarLovComprobantesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      if (typeof reg.registro.fcontable !== 'number') {
        reg.registro.fcontable = reg.registro.fcontable.replace(/-/g, "");
      }

      this.comprobanteComponent.mfiltrosesp.ccomprobante = " = " + reg.registro.ccomprobante;
      this.comprobanteComponent.mfiltros.fcontable = reg.registro.fcontable;
      this.comprobanteComponent.mfiltros.particion = reg.registro.particion;
      this.comprobanteComponent.mfiltros.ccompania = reg.registro.ccompania;

      if (reg.registro.tipopersona === 'CL') { this.cliente = true; this.persona = false; this.proveedor = false; }
      else if (reg.registro.tipopersona === 'PR') { this.proveedor = true; this.persona = false; this.cliente = false; }
      else if (reg.registro.tipopersona == 'PE') { this.persona = true; this.proveedor = false; this.cliente = false; }
      else { this.persona = false; this.proveedor = false; this.cliente = false; }

      this.detalleComponent.mfiltrosesp.ccomprobante = " = " + reg.registro.ccomprobante;
      this.detalleComponent.mfiltros.fcontable = reg.registro.fcontable;
      this.detalleComponent.mfiltros.particion = reg.registro.particion;
      this.detalleComponent.mfiltros.ccompania = reg.registro.ccompania;

      this.msgs = [];
      this.consultar();
    }

  }

  /**Muestra lov de concepto contables */
  mostrarlovsucursales(): void {
    this.lovsucursales.showDialog();
  }


  /**Retorno de lov de concepto contables. */
  fijarLovSucursalesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nsucursal = reg.registro.nombre;
      this.mcampos.csucursal = reg.registro.csucursal;
      this.mcampos.cagencia = undefined;
      this.mcampos.nagencia = undefined;
    }
  }

  /**Muestra lov de concepto contables */
  mostrarlovagencias(): void {
    this.lovagencias.mfiltros.csucursal = this.mcampos.csucursal;
    this.lovagencias.consultar();
    this.lovagencias.showDialog();
  }


  /**Retorno de lov de concepto contables. */
  fijarLovAgenciasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nagencia = reg.registro.nombre;
      this.mcampos.cagencia = reg.registro.cagencia;
    }
  }

  /**Muestra lov de concepto contables */
  mostrarlovconceptoContable(): void {
    this.lovconceptoContables.showDialog();
  }


  /**Retorno de lov de concepto contables. */
  fijarLovConceptoContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.registro.mdatos.nconcepto = reg.registro.nombre;
      this.comprobanteComponent.registro.cconcepto = reg.registro.cconcepto;

    }
  }

  /**Muestra lov de partida presupuestaria */
  mostrarlovpartidapresupuestaria(): void {
    this.lovpartidapresupuestaria.showDialog();
  }


  /**Retorno de lov de partida presupuestaria . */
  fijarLovPartidaPresupuestariaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.registro.mdatos.nombre = reg.registro.nombre;

    }
  }

  /**Muestra lov de plantillas comprobante */
  mostrarlovplantillasComprobante(): void {
    this.lovplantillasComprobante.showDialog();
  }



  /**Retorno de lov de plantillas comprobante. */
  fijarLovPlantillasComprobante(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.registro.mdatos.pnombre = reg.registro.nombre;
      this.comprobanteComponent.registro.cplantilla = reg.registro.cplantilla;
      this.automaticoplantilla = reg.registro.automatico;
      this.consultarPlantilla();
    }
  }

  /**Muestra lov de cuentas contables */
  mostrarlovcuentasContables(): void {
    this.lovcuentasContables.showDialog(true);
  }

  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.ncuenta = reg.registro.nombre;
      this.registro.ccuenta = reg.registro.ccuenta;
      this.registro.cmoneda = reg.registro.cmoneda;
      this.registro.debito = false;

    }
  }

  /**Muestra lov de cuentas contables */
  mostrarlovcuentasContablesAux(): void {
    this.lovcuentasContablesAux.showDialog(true);
  }

  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelecAux(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.ncuenta = reg.registro.nombre;
      this.registro.ccuenta = reg.registro.ccuenta;
      this.registro.cmoneda = reg.registro.cmoneda;
      this.registro.debito = false;

    }
  }

  /**Muestra lov de personas */
  cambiartipopersona(event) {
    if (event === 'CL') {
      this.cliente = true;
      this.proveedor = false;
      this.persona = false;
    } else if (event === 'PR') {
      this.proveedor = true;
      this.persona = false;
      this.cliente = false;
    } else {
      this.persona = true;
      this.proveedor = false;
      this.cliente = false;
    }
    this.comprobanteComponent.registro.cpersonarecibido = undefined;
    this.comprobanteComponent.registro.mdatos.nidentificacionrecibido = '';
    this.comprobanteComponent.registro.mdatos.npersonarecibido = '';
  }

  mostrarlovpersonas(): void {
    this.lovpersonas.showDialog();
  }
  fijarLovPersonasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.registro.cpersonarecibido = reg.registro.cpersona;
      this.comprobanteComponent.registro.mdatos.npersonarecibido = reg.registro.nombre;
      this.comprobanteComponent.registro.mdatos.nidentificacionrecibido = reg.registro.identificacion;
    }
  }

  mostrarlovclientes(): void {
    this.lovclientes.showDialog();
  }

  fijarLovClientesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.registro.cpersonarecibido = reg.registro.cpersona;
      this.comprobanteComponent.registro.mdatos.npersonarecibido = reg.registro.mdatos.npersona;
      this.comprobanteComponent.registro.mdatos.npersonarecibido = reg.registro.nombre;
      this.comprobanteComponent.registro.mdatos.nidentificacionrecibido = reg.registro.identificacion;
    }
  }

  mostrarlovproveedores(): void {
    this.lovproveedores.showDialog();
  }
  fijarLovProveedoresSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.registro.cpersonarecibido = reg.registro.cpersona;
      this.comprobanteComponent.registro.mdatos.npersonarecibido = reg.registro.mdatos.npersona;
      this.comprobanteComponent.registro.mdatos.npersonarecibido = reg.registro.nombre;
      this.comprobanteComponent.registro.mdatos.nidentificacionrecibido = reg.registro.identificacion;
    }
  }



  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1003;
    const conTipoDocumento = this.catalogoDetalle.crearDtoConsulta();
    conTipoDocumento.cantidad = 10;
    this.addConsultaCatalogos('TIPODOCUMENTO', conTipoDocumento, this.ltipodocumentocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  consultarPlantilla(): void {
    this.encerarConsultaCatalogos();

    const detPlantillaComponent = new DetallePlantillasComprobanteComponent(this.router, this.dtoServicios);
    detPlantillaComponent.mfiltros.cplantilla = this.comprobanteComponent.registro.cplantilla;
    const detPlanCon = detPlantillaComponent.crearDtoConsulta();
    this.addConsultaCatalogos('DETALLEPLANTILLA', detPlanCon, null, this.llenarPlantilla, null, this.detalleComponent, null);
    this.ejecutarConsultaCatalogos();
  }


  public llenarPlantilla(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componente = null): any {
    const lreg = componente.clone(componente.lregistros);

    for (const i in lreg) {
      if (lreg.hasOwnProperty(i)) {
        const reg = lreg[i];
        componente.selectRegistro(reg);
        componente.eliminar();
      }
    }

    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg = pListaResp[i];
        //
        componente.crearNuevoRegistro();
        componente.registro.ccuenta = reg.ccuenta;
        componente.registro.mdatos.ncuenta = reg.mdatos.ncuenta;
        componente.registro.cmoneda = "USD";
        componente.registro.centrocostosccatalogo = 1002;
        componente.registro.centrocostoscdetalle = reg.centrocostoscdetalle;
        componente.registro.debito = reg.debito;
        componente.registro.ccompania = reg.ccompania;
        componente.actualizar();
      }
    }
  }

  fijarListaAgencias(csucursal: any) {
    if (this.nuevo) {
      this.lagencias = [];
      this.lagencias.push({ label: '...', value: null });
      for (const i in this.lagenciastotal) {
        if (this.lagenciastotal.hasOwnProperty(i)) {
          const reg: any = this.lagenciastotal[i];
          if (reg !== undefined && reg.value !== null && reg.csucursal === Number(csucursal)) {
            this.lagencias.push({ label: reg.nombre, value: reg.cagencia });
          }
        }
      }
    }

  }

  cambiaAgencia(cagencia: any) {
    if (this.nuevo) {
      this.detalleComponent.registro.cagencia = cagencia;
    }
  }

  tipoDocumentoSeleccionado() {
    this.comprobanteComponent.registro.csucursal = this.dtoServicios.mradicacion.csucursal;
    this.comprobanteComponent.registro.cagencia = this.dtoServicios.mradicacion.cagencia;
    this.tipodocumentoselecc = this.comprobanteComponent.registro.tipodocumentocdetalle;
    if (this.tipodocumentoselecc === "EGRESO") {
      this.requeridoegreso = true;
    } else {
      this.requeridoegreso = false;
    }
  }

  public calcularTotalesDebitoCredito() {
    let sumatoriodebito = 0;
    let sumatoriocredito = 0;
    let totalesdebito = 0;
    let totalescredito = 0;
    let monto = 0;
    this.totalPlanCuentasADF_Credito = 0;
    this.totalPlanCuentasADF_Debito = 0;
    this.totalPlanCuentasFA_Credito = 0;
    this.totalPlanCuentasFA_Debito = 0;
    this.totalCCPC_Debito = 0;
    this.totalCCPC_Credito = 0;
    this.totalCCAGYE_Debito = 0;
    this.totalCCAGYE_Credito = 0;
    this.totalCCSCPN_Debito = 0;
    this.totalCCSCPN_Credito = 0;

    //Fondos administrados
    // tslint:disable-next-line:forin
    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];
      if (reg.monto === null || reg.monto === undefined) {
        monto = 0
      } else {
        monto = reg.monto;
      }

      //SUMATORIO DE DEBITOS Y CREDITOS
      if (reg.debito === true) {
        sumatoriodebito = sumatoriodebito + monto;
      } else {
        sumatoriocredito = sumatoriocredito + monto;
      }

      //SUMATORIO DE DEBITOS Y CREDITOS POR PLAN DE CUENTAS
      if (reg.mdatos.tipoplancdetalle === "PC-ADF") {
        if (reg.debito) this.totalPlanCuentasADF_Debito += monto;
        else this.totalPlanCuentasADF_Credito += monto;
      } else if (reg.mdatos.tipoplancdetalle === "PC-FA") {
        if (reg.debito) this.totalPlanCuentasFA_Debito += monto;
        else this.totalPlanCuentasFA_Credito += monto;
      }

      //SUMATORIO DE DEBITOS Y CREDITOS POR CENTRO DE COSTOS
      if (reg.centrocostoscdetalle === 'CCAGYE') {
        if (reg.debito) this.totalCCAGYE_Debito += monto;
        else this.totalCCAGYE_Credito += monto;
      } else if (reg.centrocostoscdetalle === "CCPC") {
        if (reg.debito) this.totalCCPC_Debito += monto;
        else this.totalCCPC_Credito += monto;
      } else if (reg.centrocostoscdetalle === "CCSCPN") {
        if (reg.debito) this.totalCCSCPN_Debito += monto;
        else this.totalCCSCPN_Credito += monto;
      }

    }
    this.detalleComponent.totalCredito = sumatoriocredito;
    this.detalleComponent.totalDebito = sumatoriodebito;

    totalesdebito = totalesdebito + sumatoriodebito;
    totalescredito = totalescredito + sumatoriocredito;

    //Administradora de Fondos
    sumatoriodebito = 0;
    sumatoriocredito = 0;
    monto = 0;

    //Totales
    totalesdebito = totalesdebito + sumatoriodebito;
    totalescredito = totalescredito + sumatoriocredito;
    this.totalesComprobanteCredito = totalescredito;
    this.totalesComprobanteDebito = totalesdebito;
    this.totalesCombrobanteDiferencia = this.redondear(totalesdebito, 2) - this.redondear(totalescredito, 2);
  }

  cambiarValorAutomatico(): void {
    let valorautomatico = this.valorautomatico;
    //Fondos administrados
    // tslint:disable-next-line:forin
    for (const i in this.detalleComponent.lregistros) {
      this.detalleComponent.lregistros[i].monto = valorautomatico;
    }

    this.calcularTotalesDebitoCredito();
  }

  validarDatosComprobanteContable(): string {
    let mensaje = '';

    if (this.comprobanteComponent.registro.mdatos.fcontable == null) {
      mensaje += 'Fecha contable requerida  <br />';
    }

    if (this.comprobanteComponent.registro.tipodocumentocdetalle === null || this.comprobanteComponent.registro.tipodocumentocdetalle === undefined) {
      mensaje += 'Seleccione tipo de documento <br />';
    }

    if (this.comprobanteComponent.registro.cconcepto === null || this.comprobanteComponent.registro.cconcepto === undefined) {
      mensaje += 'Seleccione concepto <br />';
    }

    if (this.detalleComponent.lregistros.length === 0) {
      mensaje += 'Ingrese detalle de cuentas contables <br />';
    }

    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];
      if (reg.ccuenta === undefined || reg.ccuenta === '') {
        mensaje += 'Cuenta contable línea ' + (Number(i) + 1) + ' no puede estar en blanco<br />';
      }
      if (reg.centrocostoscdetalle === undefined || reg.centrocostoscdetalle === null) {
        mensaje += 'Centro de costos línea ' + (Number(i) + 1) + ' no puede estar en blanco<br />';
      }
    }
    return mensaje;
  }


  //#region Reporte
  descargarReporte(): void {
    if (this.comprobanteComponent.registro.ccomprobante === undefined) {
      super.mostrarMensajeError('Por favor seleccione un comprobante');
      return;
    }

    this.jasper.nombreArchivo = this.comprobanteComponent.registro.numerocomprobantecesantia;
    if (this.mcampos.nombre === undefined) {
      this.mcampos.nombre = '';
    }

    if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
      this.mcampos.rol = -1
    }

    let tipoComprobante = '';
    if (this.comprobanteComponent.registro.tipodocumentocdetalle === 'INGRES') {
      tipoComprobante = 'Ingreso';
    } else if (this.comprobanteComponent.registro.tipodocumentocdetalle === 'EGRESO') {
      tipoComprobante = 'Egreso';
    } else {
      tipoComprobante = 'Diario';
    }
    // Agregar parametros
    this.jasper.parametros['@i_ccomprobante'] = this.comprobanteComponent.registro.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }
  //#endregion
}
