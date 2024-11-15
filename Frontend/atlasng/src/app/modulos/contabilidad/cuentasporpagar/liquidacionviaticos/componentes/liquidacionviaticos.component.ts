import { Component, OnInit, AfterViewInit, ViewChild, trigger } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
//import { LovProveedoresComponent } from '../../../lov/proveedores/componentes/lov.proveedores.component';
import { ComprobanteComponent } from '../submodulos/comprobante/componentes/_comprobante.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
//import { textChangeRangeIsUnchanged } from 'typescript';
//import { AccordionModule } from 'primeng/primeng';
//import { LovCuentasporpagarComponent } from '../../../lov/cuentasporpagar/componentes/lov.cuentasporpagar.component';
///import { LovPlantillasComprobanteComponent } from '../../../lov/plantillascomprobante/componentes/lov.plantillasComprobante.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
//import { FechaEnteroPipe } from '../../../../../util/pipe/fechaentero.pipe';
//import { MovimientosContablesCarteraComponent } from '../../../../cartera/consultas/movimientosContables/componentes/movimientosContablesCartera.component';
//import { LovCuentasContablesComponent } from '../../../lov/cuentascontables/componentes/lov.cuentasContables.component';
import { LovLiquidacionesComponent } from '../../../lov/liquidaciones/componentes/lov.liquidaciones.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';

@Component({
  selector: 'app-liquidacionviaticos',
  templateUrl: 'liquidacionviaticos.html'
})
export class LiquidacionViaticosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(ComprobanteComponent)
  comprobanteComponent: ComprobanteComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(LovPersonasComponent)
  private lovpersonas: LovPersonasComponent;

  // @ViewChild(LovCuentasporpagarComponent)
  // lovcuentasporpagar: LovProveedoresComponent;

  @ViewChild(LovLiquidacionesComponent)
  private lovliquidaciones: LovLiquidacionesComponent;

  // @ViewChild(LovCuentasContablesComponent)
  // private lovcuentascontables: LovCuentasContablesComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  private catalogoDetalle: CatalogoDetalleComponent;
  public baseimpgravable = 0;

  public lregplantilla: any = [];
  public ltcomprobantecdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lporcentajeivacdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lporcentajeicecdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lporretbienescdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lporretservicioscdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lformapagocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lsustentocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lcentrocostoscdetalle: SelectItem[] = [{ label: '...', value: null }];

  public grabo = false;
  public requeridoegreso = false;
  public tipodocumentoselecc: string;
  public totalretenciones = 0;
  public totalretencionesiva = 0;
  public sumatoriobaseimpair = 0;
  public nuevo = true;
  public tieneComprobante = false;
  public eliminado = false;
  public permiteEliminarLiq = false;
  public totalnotascredito = 0;
  //NUEVA PARAMETRIZACIÓN DINÁMICA
  public porcentaje = false;
  public valorjustificar = 0;
  public valornojustificar = 0;
  public lporcentaje: any = [];
  public lvalorjustificar: any = [];
  public lvalornojustificar: any = [];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREACUENTASPORPAGARVIATICOS', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    //this.mcampos.nsucursal = this.dtoServicios.mradicacion.nsucursal;
    // this.mcampos.nagencia = this.dtoServicios.mradicacion.nagencia;
    // this.mcampos.totalfactura = 0;

    // this.comprobanteComponent.registro.baseimponible = 0;
    // this.comprobanteComponent.registro.valormulta = 0;
    // this.comprobanteComponent.registro.valornotascredito = 0;
    // this.comprobanteComponent.registro.ruteopresupuesto = true;
    // this.comprobanteComponent.registro.exentoretencion = false;
    this.consultarCatalogos();
    this.comprobanteComponent.crearNuevo();
  }

  ngAfterViewInit() {

  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
    this.comprobanteComponent.crearNuevo();
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
    const conComprobante = this.comprobanteComponent.crearDtoConsulta();
    //conComprobante.addSubquery('tconcomprobante', 'numerocomprobantecesantia', 'numerocomprobantecesantia', 'i.ccomprobante = t.ccompcontable');
    this.addConsultaPorAlias(this.comprobanteComponent.alias, conComprobante);
    const conDetalle = this.detalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.detalleComponent.alias, conDetalle);
  }

  private fijarFiltrosConsulta() {
    this.comprobanteComponent.fijarFiltrosConsulta();
    this.detalleComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return true;
    //return this.comprobanteComponent.validaFiltrosRequeridos() && this.detalleComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {


    this.comprobanteComponent.postQuery(resp);
    this.detalleComponent.postQuery(resp);
    if (this.comprobanteComponent.registro.estadocdetalle === 'CONTAB' || this.comprobanteComponent.registro.estadocdetalle === 'INGRES') {
      this.permiteEliminarLiq = true;
    }
    //this.baseimpgravable = this.comprobanteComponent.registro.baseimpgrav;
    //this.detalleComponent.baseimpgravable = this.comprobanteComponent.registro.baseimpgrav;
    //this.calcularTotalRetencionFuente();
    //this.calcularTotalRetencionIVA();
    //this.calcularTotalRetenciones();
    this.calcularViaticos();
    this.nuevo = false;
    if (this.comprobanteComponent.registro.ccomprobante !== null) {
      this.tieneComprobante = true;
    } else {
      this.tieneComprobante = false;
    }

  }

  // Fin CONSULTA *********************

  guardarCambios(): void {
    this.calcularViaticos();
    const mensajeError = this.validarDatosCuentaPorPagar();
    if (mensajeError !== '') {
      super.mostrarMensajeError(mensajeError);
      return;
    }
    this.rqMantenimiento.generarcomprobante = false;
    this.grabar();
  }

  generarComprobante(): void {
    this.calcularViaticos();
    const mensajeError = this.validarDatosCuentaPorPagar();
    if (mensajeError !== '') {
      super.mostrarMensajeError(mensajeError);
      return;
    }
    // if (this.estaVacio(this.comprobanteComponent.registro.ccompromiso)){
    //   super.mostrarMensajeError('NO HA INGRESADO COMPROMISO');
    //   return;
    // }
    this.rqMantenimiento.generarcomprobante = true;
    this.comprobanteComponent.registro.estadocdetalle = "CONTAB";
    this.grabar();
  }

  eliminarliquidacion(): void {
    this.rqMantenimiento.generarcomprobante = false;
    this.comprobanteComponent.registro.estadocdetalle = "ELIMIN";
    this.rqMantenimiento.mdatos.eliminar = true;
    this.eliminado = true;
    this.grabar();
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.nuevo) {
      this.comprobanteComponent.actualizar();
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.comprobanteComponent.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    super.addMantenimientoPorAlias(this.comprobanteComponent.alias, this.comprobanteComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el pk.

    if (resp.cod === 'OK') {
      this.comprobanteComponent.postCommit(resp, this.getDtoMantenimiento(this.comprobanteComponent.alias));
      this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.detalleComponent.alias));
      this.grabo = true;
      this.nuevo = false;

      if (!this.estaVacio(resp.cliquidaciongastos)) {
        this.comprobanteComponent.registro.cliquidaciongastos = resp.cliquidaciongastos;
        this.comprobanteComponent.registro.ccomprobante = resp.ccomprobante;
        this.comprobanteComponent.registro.mdatos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
      }

      if (!this.estaVacio(this.comprobanteComponent.registro.ccomprobante)) {
        this.tieneComprobante = true;
        this.descargarReporteComprobanteContable();
      } else {
        this.tieneComprobante = false;
      }
      this.enproceso = false;
      this.fijarLovLiquidaciones(this.comprobanteComponent.registro);
    } else {
      super.mostrarMensajeError(resp.msgusu);
    }
  }


  mostrarlovpersonas(): void {
    this.lovpersonas.showDialog();
  }

  fijarLovPersonasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.registro.cpersona = reg.registro.cpersona;
      this.comprobanteComponent.registro.mdatos.nidentificacionbeneficiario = reg.registro.nombre;
      this.comprobanteComponent.registro.mdatos.nbeneficiario = reg.registro.identificacion;
    }
  }

  /**Retorno de lov de partida presupuestaria . */
  // fijarLovPartidaPresupuestariaSelec(reg: any): void {
  //   if (reg.registro !== undefined) {
  //     this.mcampos.nombre = reg.registro.nombre;

  //   }
  // }

  /**Muestra lov de cuentas contables */
  mostrarlovliquidaciones(): void {
    //this.lovliquidaciones.consultar();
    //this.lovliquidaciones.mfiltros.estadocdetalle = 'INGRES';
    this.lovliquidaciones.showDialog();
  }

  // /**Muestra lov de cuentas contables */

  // consultarDatosFacturaBienes(reg: any) {
  //   const conFacturaBienes = new Consulta('tacfingreso', 'N', '', { cingreso: reg.cingreso }, {}, {});
  //   this.addConsultaPorAlias('FACTURABIENES', conFacturaBienes);

  //   this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
  //     .subscribe(
  //       resp => {
  //         this.manejaRespuesta(resp);
  //       },
  //       error => {
  //         this.dtoServicios.manejoError(error);
  //       });
  // }

  // private manejaRespuesta(resp: any) {
  //   if (resp.FACTURABIENES !== null && resp.FACTURABIENES !== undefined) {
  //     const reg = resp.FACTURABIENES;
  //     this.comprobanteComponent.registro.numdocumentosustento = reg.facturanumero;
  //     this.comprobanteComponent.registro.ffacturasustento = reg.fechafactura;
  //     this.comprobanteComponent.registro.baseimponible = reg.subtotal;
  //     this.comprobanteComponent.registro.baseimpgrav = reg.subtotal;
  //     this.comprobanteComponent.registro.porcentajeivacdetalle = this.lporcentajeivacdetalle.find(x => x.label === reg.porcentajeiva);
  //     this.comprobanteComponent.registro.montoiva = reg.valoriva;
  //     this.comprobanteComponent.registro.baseimpice = reg.baseice;
  //     this.comprobanteComponent.registro.montoice = reg.valorice;
  //     this.detalleComponent.baseimpgravable = this.comprobanteComponent.registro.baseimpgrav;
  //     this.rqMantenimiento.mdatos.cingreso = reg.cingreso;
  //     return;
  //   }
  //   super.mostrarMensajeError('FACTURA DE PROVEEDOR NO ENCONTRADA');
  //   return;
  // }


  /**Retorno de lov de cuentas contables. */
  // fijarLovCuentasContablesSelec(reg: any): void {
  //   if (reg.registro !== undefined) {
  //     this.comprobanteComponent.registro.mdatos.ncuenta = reg.registro.nombre;
  //     this.comprobanteComponent.registro.ccuentaafectacion = reg.registro.ccuenta;
  //   }
  // }


  // fijarLovProveedores(reg: any): void {
  //   if (reg.registro !== undefined) {
  //     this.comprobanteComponent.registro.cpersona = reg.registro.cpersona;
  //     this.comprobanteComponent.registro.mdatos.identificacion = reg.registro.identificacion;
  //     this.comprobanteComponent.registro.mdatos.nproveedor = reg.registro.nombre;
  //     this.comprobanteComponent.registro.mdatos.contribuyenteespecial = reg.registro.contribuyentespecial;
  //     this.comprobanteComponent.registro.numdocumentosustento = undefined;
  //   }
  // }


  fijarLovLiquidaciones(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.mfiltrosesp.cliquidaciongastos = " = " + reg.registro.cliquidaciongastos;
      this.detalleComponent.mfiltrosesp.cliquidaciongastos = " = " + reg.registro.cliquidaciongastos;
      //this.comprobanteComponent.registro.mdatos.nbeneficiario = reg.registro.mcampos.nbeneficiario;
      this.msgs = [];
      this.consultar();
    }
  }

  // mostrarlovcuentasporpagar(): void {
  //   this.lovcuentasporpagar.mfiltros.tipocxp = 'S';
  //   this.lovcuentasporpagar.consultar();
  //   this.lovcuentasporpagar.showDialog();
  // }

  /**Muestra lov de plantillas comprobante */
  // mostrarlovplantillasComprobante(): void {
  //   this.lovplantillasComprobante.mfiltros.tipomovimientocdetalle = '1022';


  //   this.lovplantillasComprobante.consultar();
  //   this.lovplantillasComprobante.showDialog();
  // }

  /**Retorno de lov de plantillas comprobante. */
  fijarLovPlantillasComprobante(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.registro.mdatos.pnombre = reg.registro.nombre;
      this.comprobanteComponent.registro.cplantilla = reg.registro.cplantilla;
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    // this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    // this.catalogoDetalle.mfiltros.ccatalogo = 1007;
    // const conTipoDocumento = this.catalogoDetalle.crearDtoConsulta();
    // this.addConsultaCatalogos('TIPODOCUMENTO1', conTipoDocumento, this.ltcomprobantecdetalle, super.llenaListaCatalogo, 'cdetalle');

    // this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    // this.catalogoDetalle.mfiltros.ccatalogo = 1011;
    // const conPorcentajeIVA = this.catalogoDetalle.crearDtoConsulta();
    // this.addConsultaCatalogos('TIPODOCUMENTO2', conPorcentajeIVA, this.lporcentajeivacdetalle, super.llenaListaCatalogo, 'cdetalle');

    // this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    // this.catalogoDetalle.mfiltros.ccatalogo = 1010;
    // const conPorcentajeICE = this.catalogoDetalle.crearDtoConsulta();
    // this.addConsultaCatalogos('TIPODOCUMENTO3', conPorcentajeICE, this.lporcentajeicecdetalle, super.llenaListaCatalogo, 'cdetalle');

    // this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    // this.catalogoDetalle.mfiltros.ccatalogo = 1006;
    // const conPorcentajeRetBienes = this.catalogoDetalle.crearDtoConsulta();
    // this.addConsultaCatalogos('TIPODOCUMENTO4', conPorcentajeRetBienes, this.lporretbienescdetalle, super.llenaListaCatalogo, 'cdetalle');

    // this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    // this.catalogoDetalle.mfiltros.ccatalogo = 1004;
    // const conPorcentajeRetServicios = this.catalogoDetalle.crearDtoConsulta();
    // this.addConsultaCatalogos('TIPODOCUMENTO5', conPorcentajeRetServicios, this.lporretservicioscdetalle, super.llenaListaCatalogo, 'cdetalle');

    // this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    // this.catalogoDetalle.mfiltros.ccatalogo = 1009;
    // const conFormaPago = this.catalogoDetalle.crearDtoConsulta();
    // this.addConsultaCatalogos('TIPODOCUMENTO6', conFormaPago, this.lformapagocdetalle, super.llenaListaCatalogo, 'cdetalle');

    // this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    // this.catalogoDetalle.mfiltros.ccatalogo = 1008;
    // const conSustento = this.catalogoDetalle.crearDtoConsulta();
    // this.addConsultaCatalogos('TIPODOCUMENTO7', conSustento, this.lsustentocdetalle, super.llenaListaCatalogo, 'cdetalle');

    const conporcentajefiltros: any = { 'codigo': 'VIATICOS_PORCENTAJE' };
    const conPorcentaje = new Consulta('tpptparametros', 'Y', 't.codigo', conporcentajefiltros, {});
    conPorcentaje.cantidad = 10;
    this.addConsultaCatalogos('PORCENTAJE', conPorcentaje, this.lporcentaje, super.llenaListaCatalogo, 'numero', this, false);

    const mfiltrosparam = { 'codigo': 'VIATICOS_JUSTIFICAR' };
    const consultarParametro = new Consulta('tpptparametros', 'Y', 't.codigo', mfiltrosparam, null);
    consultarParametro.cantidad = 100;
    this.addConsultaCatalogos('VALORJUSTIFICAR', consultarParametro, this.lvalorjustificar, super.llenaListaCatalogo, 'numero', this, false);

    const mfiltrosvalnojustificar = { 'codigo': 'VIATICOS_NO_JUSTIFICAR' };
    const consultarParametronoJustificar = new Consulta('tpptparametros', 'Y', 't.codigo', mfiltrosvalnojustificar, null);
    consultarParametronoJustificar.cantidad = 100;
    this.addConsultaCatalogos('VALORNOJUSTIFICAR', consultarParametronoJustificar, this.lvalornojustificar, super.llenaListaCatalogo, 'numero', this, false);


    const conCentroCostosmfiltros: any = { 'ccatalogo': 1002 };
    const conCentroCostos = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', conCentroCostosmfiltros, {});
    conCentroCostos.cantidad = 10;
    this.addConsultaCatalogos('CENTROCOSTOS', conCentroCostos, this.lcentrocostoscdetalle, super.llenaListaCatalogo, 'cdetalle');


    this.ejecutarConsultaCatalogos();
  }

  // replicarValor() {
  //   this.comprobanteComponent.registro.baseimpgrav = this.comprobanteComponent.registro.baseimponible;
  //   this.calcularImpuestosBaseImpGrav();
  // }

  // cargarIVAenBienes(obj: any) {
  //   if (obj === true) {
  //     this.comprobanteComponent.registro.montoivabienes = this.comprobanteComponent.registro.montoiva;
  //   } else {
  //     this.comprobanteComponent.registro.montoivaservicios = 0.00;
  //   }

  // }

  // cargarIVAenServicios(obj: any) {
  //   if (obj === true) {
  //     this.comprobanteComponent.registro.montoivaservicios = this.comprobanteComponent.registro.montoiva;
  //   } else {
  //     this.comprobanteComponent.registro.montoivaservicios = 0.00;
  //   }
  // }

  //#region calcular porcentajes
  // calcularImpuestosBaseImpGrav() {
  //   if (this.comprobanteComponent.registro.montoivabienes !== undefined) {
  //     this.comprobanteComponent.registro.montoivabienes = 0;
  //     this.comprobanteComponent.registro.valorretbienes = 0;
  //   }
  //   if (this.comprobanteComponent.registro.montoivaservicios !== undefined) {
  //     this.comprobanteComponent.registro.montoivaservicios = 0;
  //     this.comprobanteComponent.registro.valorretservicios = 0;
  //   }
  //   this.detalleComponent.baseimpgravable = this.comprobanteComponent.registro.baseimpgrav;
  //   this.calcularIVA();
  //   this.calcularICE();
  //   this.calcularTotalFactura();
  // }

  // calcularTotalFactura(){
  //   this.mcampos.totalfactura = this.comprobanteComponent.registro.baseimponible +
  //                               this.comprobanteComponent.registro.montoiva +
  //                               this.comprobanteComponent.registro.montoice;
  // }
  // calcularIVA() {
  //   const porcentaje = this.lporcentajeivacdetalle.find(x => x.value === this.comprobanteComponent.registro.porcentajeivacdetalle);
  //   if (porcentaje !== undefined) {
  //     this.comprobanteComponent.registro.montoiva = (Number(porcentaje.label) / 100) * this.comprobanteComponent.registro.baseimpgrav;
  //   }
  //   this.calcularTotalFactura();
  // }

  // calcularICE() {
  //   const porcentaje = this.lporcentajeicecdetalle.find(x => x.value === this.comprobanteComponent.registro.porcentajeicecdetalle);
  //   if (porcentaje !== undefined) {
  //     this.comprobanteComponent.registro.montoice = (Number(porcentaje.label) / 100) * this.comprobanteComponent.registro.baseimpgrav;
  //   }
  //   this.calcularTotalFactura();
  // }

  // calcularRetIVABienes() {
  //   const porcentaje = this.lporretbienescdetalle.find(x => x.value === this.comprobanteComponent.registro.porretbienescdetalle);

  //   this.comprobanteComponent.registro.valorretbienes = (Number(porcentaje.label === "..." ? 0 : porcentaje.label) / 100) * this.comprobanteComponent.registro.montoivabienes;
  //   this.calcularTotalRetencionIVA();
  // }

  // calcularRetIVAServicios() {
  //   const porcentaje = this.lporretservicioscdetalle.find(x => x.value === this.comprobanteComponent.registro.porretservicioscdetalle);
  //   this.comprobanteComponent.registro.valorretservicios = (Number(porcentaje.label === "..." ? 0 : porcentaje.label) / 100) * this.comprobanteComponent.registro.montoivaservicios;
  //   this.calcularTotalRetencionIVA();
  // }

  //#endregion

  // //#region CalcularTotales
  // calcularTotalRetencionIVA() {
  //   if (this.comprobanteComponent.registro.valorretservicios === undefined) {
  //     this.comprobanteComponent.registro.valorretservicios = 0;
  //   }
  //   if (this.comprobanteComponent.registro.valorretbienes === undefined) {
  //     this.comprobanteComponent.registro.valorretbienes = 0;
  //   }
  //   this.totalretencionesiva = this.comprobanteComponent.registro.valorretservicios + this.comprobanteComponent.registro.valorretbienes;
  //   this.calcularTotalRetenciones();
  // }

  // calcularTotalRetencionFuente() {
  //   let sumatorioretencionesrenta = 0;
  //   this.sumatoriobaseimpair = 0;
  //   //Fondos administrados
  //   for (const i in this.detalleComponent.lregistros) {
  //     if (this.detalleComponent.lregistros.hasOwnProperty(i)) {
  //       const reg = this.detalleComponent.lregistros[i];
  //       sumatorioretencionesrenta += reg.valretair;
  //       this.sumatoriobaseimpair += reg.baseimpair;
  //     }
  //   }

  //   this.detalleComponent.totalRetencionesIR = sumatorioretencionesrenta;
  //   this.calcularTotalRetenciones();
  // }

  // calcularTotalRetenciones() {
  //   const baseimponible = this.comprobanteComponent.registro.baseimponible === undefined ? 0 : this.comprobanteComponent.registro.baseimponible;
  //   const montoiva = this.comprobanteComponent.registro.montoiva === undefined ? 0 : this.comprobanteComponent.registro.montoiva;
  //   const montoice = this.comprobanteComponent.registro.montoice === undefined ? 0 : this.comprobanteComponent.registro.montoice;
  //   this.totalretenciones = this.totalretencionesiva + this.detalleComponent.totalRetencionesIR;
  //   const totalretenciones = this.totalretenciones;
  //   this.comprobanteComponent.registro.valorpagar = (baseimponible + montoiva + montoice -
  //     totalretenciones - this.comprobanteComponent.registro.valormulta);
  // }

  //#endregion

  //#region Reporte
  descargarReporte(): void {
    if (this.comprobanteComponent.registro.cliquidaciongastos === undefined) {
      super.mostrarMensajeError('Por favor seleccione una liquidación');
      return;
    }

    // Agregar parametros
    this.jasper.parametros['@i_cliquidaciongastos'] = this.comprobanteComponent.registro.cliquidaciongastos;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptLiquidacionViaticos';
    this.jasper.generaReporteCore();
  }

  descargarReporteComprobanteContable(): void {
    this.jasper.nombreArchivo = "Diario de liquidación de viáticos";
    // Agregar parametros
    let tipoComprobante = 'Diario';
    this.jasper.parametros['@i_ccomprobante'] = this.comprobanteComponent.registro.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }
  //#endregion

  //#region Validaciones
  validarDatosCuentaPorPagar(): string {
    let mensaje = '';
    if (this.estaVacio(this.comprobanteComponent.registro.cpersona)) {
      mensaje += 'Seleccione beneficiario <br />';
    }

    if (this.estaVacio(this.comprobanteComponent.registro.comentario)) {
      mensaje += 'Ingrese comentario <br />';
    }

    if (this.estaVacio(this.comprobanteComponent.registro.fliquidacion)) {
      mensaje += 'Ingrese fecha de liquidación <br />';
    }

    return mensaje;
  }

  setvalortotal(): void {

    this.comprobanteComponent.registro.valortotal = this.comprobanteComponent.registro.numeroviaticos * this.comprobanteComponent.registro.valorpordia;
    if (this.estaVacio(this.lporcentaje[0].value) || this.estaVacio(this.lvalorjustificar[0].value) || this.estaVacio(this.lvalornojustificar[0].value)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO EL TIPO DE CÁLCULO DE VIATICOS O LOS PARÁMETROS NO CONTIENEN VALORES");
    } else {
      this.porcentaje = (this.lporcentaje[0].value == 0) ? false : true;
      this.valorjustificar = this.lvalorjustificar[0].value;
      this.valornojustificar = this.lvalornojustificar[0].value;
    }

    if (this.porcentaje) {
      let valor100 = this.valorjustificar + this.valornojustificar;
      let valordiv = 1;
      if (valor100 === 1 || valor100 === 100) {
        valordiv = (valor100 == 100) ? 100 : 1;
        this.comprobanteComponent.registro.valor70 = this.redondear(this.comprobanteComponent.registro.valortotal * (this.valorjustificar / valordiv), 2);
        this.comprobanteComponent.registro.valor30 = this.redondear(this.comprobanteComponent.registro.valortotal * (this.valornojustificar / valordiv), 2);
      } else {
        super.mostrarMensajeError("LOS PORCENTAJES ASIGNADOS NO SUMAN EL 100% VALIDAR EN LOS PARÁMETROS");
        this.comprobanteComponent.registro.valor70 = 0;
        this.comprobanteComponent.registro.valor30 = 0;

      }

    } else {
      this.comprobanteComponent.registro.valor70 = this.valorjustificar * Number(this.comprobanteComponent.registro.numeroviaticos);
      this.comprobanteComponent.registro.valor30 = this.valornojustificar * Number(this.comprobanteComponent.registro.numeroviaticos);
    }

  }

  calcularViaticos(): void {
    this.comprobanteComponent.registro.valordocrespaldo = this.detalleComponent.totalvalido;
    this.comprobanteComponent.registro.valortransporte = this.detalleComponent.totaltransporte;
    if ((this.comprobanteComponent.registro.valordocrespaldo + this.comprobanteComponent.registro.valor30) >=
      this.comprobanteComponent.registro.valortotal) {
      this.comprobanteComponent.registro.valorpagar = this.comprobanteComponent.registro.valortotal;
    } else {
      this.comprobanteComponent.registro.valorpagar = this.comprobanteComponent.registro.valordocrespaldo + this.comprobanteComponent.registro.valor30;
    }
    this.comprobanteComponent.registro.valorliquidacion = this.comprobanteComponent.registro.valorpagar + this.comprobanteComponent.registro.valortransporte;

  }
}
