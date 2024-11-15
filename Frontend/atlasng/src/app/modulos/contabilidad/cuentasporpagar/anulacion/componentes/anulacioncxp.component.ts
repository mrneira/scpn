import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovProveedoresComponent } from '../../../lov/proveedores/componentes/lov.proveedores.component';
import { ComprobanteComponent } from '../submodulos/comprobante/componentes/_comprobante.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { textChangeRangeIsUnchanged } from 'typescript';
import { AccordionModule } from 'primeng/primeng';
import { LovCuentasporpagarComponent } from '../../../lov/cuentasporpagar/componentes/lov.cuentasporpagar.component';
import { LovPlantillasComprobanteComponent } from '../../../lov/plantillascomprobante/componentes/lov.plantillasComprobante.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { FechaEnteroPipe } from '../../../../../util/pipe/fechaentero.pipe';
import { MovimientosContablesCarteraComponent } from '../../../../cartera/consultas/movimientosContables/componentes/movimientosContablesCartera.component';

@Component({
  selector: 'app-anulacioncxp',
  templateUrl: 'anulacioncxp.html'
})
export class AnulacioncxpComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(ComprobanteComponent)
  comprobanteComponent: ComprobanteComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(LovProveedoresComponent)
  lovproveedores: LovProveedoresComponent;

  @ViewChild(LovCuentasporpagarComponent)
  lovcuentasporpagar: LovProveedoresComponent;

  @ViewChild(LovPlantillasComprobanteComponent)
  private lovplantillasComprobante: LovPlantillasComprobanteComponent;

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

  public grabo = false;
  public requeridoegreso = false;
  public tipodocumentoselecc: string;
  public totalretenciones = 0;
  public totalretencionesiva = 0;
  public sumatoriobaseimpair = 0;
  public nuevo = true;
  public tieneComprobante = false;
  public eliminado = false;
  public anular = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREACUENTASPORPAGAR', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.mcampos.nsucursal = this.dtoServicios.mradicacion.nsucursal;
    this.mcampos.nagencia = this.dtoServicios.mradicacion.nagencia;
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
    conComprobante.addSubquery('tperproveedor', 'nombre', 'nproveedor', 'i.cpersona = t.cpersona');
    conComprobante.addSubquery('tperproveedor', 'identificacion', 'identificacion', 'i.cpersona = t.cpersona');
    conComprobante.addSubquery('tconcomprobante', 'numerocomprobantecesantia', 'numerocomprobantecesantia', 'i.ccomprobante = t.ccompcontable');
    conComprobante.addSubquery('tconcomprobante', 'fcontable', 'fcontable', 'i.ccomprobante = t.ccompcontable');
    conComprobante.addSubquery('tspitransaccion','cestado','cestadospi','t.cctaporpagar = i.referenciainterna and i.verreg = 0')
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
      this.baseimpgravable = this.comprobanteComponent.registro.baseimpgrav;
      this.detalleComponent.baseimpgravable = this.comprobanteComponent.registro.baseimpgrav;
      this.calcularTotalRetencionFuente();
      this.calcularTotalRetencionIVA();
      this.calcularTotalRetenciones();
      this.nuevo = false;
      if (this.comprobanteComponent.registro.ccompcontable !== null) {
        this.anular = true;
      } else {
        this.anular = false;
      }

      if (this.comprobanteComponent.registro.mdatos.cestadospi === '3' || this.comprobanteComponent.registro.mdatos.cestadospi === '4') {
        this.anular = false;
        super.mostrarMensajeError("LA TRANSACCION GENERADA POR SPI SE ENCUENTRA ACREDITADA, NO ES POSIBLE ANULAR CXP");
      } else {
        this.anular = true;
      }
  }

  // Fin CONSULTA *********************


  anularComprobante(): void {
    this.rqMantenimiento.cctaporpagar = this.comprobanteComponent.registro.cctaporpagar;
    this.rqMantenimiento.ccomprobante = this.comprobanteComponent.registro.ccompcontable;
    this.rqMantenimiento.fcontable = this.comprobanteComponent.registro.mdatos.fcontable;
    this.rqMantenimiento.ccompania = this.comprobanteComponent.registro.ccompania;
    this.rqMantenimiento.anular = true;
    this.comprobanteComponent.registro.estadocxpcdetalle = "ANULAD";
    this.grabar();
  }


  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
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
      this.anular = false;
      this.comprobanteComponent.registro.mdatos.ccomprobanteanulacion = resp.ccomprobanteEspejo;
      this.comprobanteComponent.registro.mdatos.numerocomprobantecesantiaanulacion = resp.numerocomprobantecesantiaEspejo;
    } else {
      super.mostrarMensajeError(resp.msgusu);
    }
  }

  /**Retorno de lov de partida presupuestaria . */
  fijarLovPartidaPresupuestariaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;

    }
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

  fijarLovProveedores(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.registro.cpersona = reg.registro.cpersona;
      this.comprobanteComponent.registro.mdatos.identificacion = reg.registro.identificacion;
      this.comprobanteComponent.registro.mdatos.nproveedor = reg.registro.nombre;
    }
  }

  mostrarlovproveedores(): void {
    this.lovproveedores.showDialog();
  }

  fijarLovCuentasporpagar(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.mfiltros.cctaporpagar = reg.registro.cctaporpagar;
      this.detalleComponent.mfiltros.cctaporpagar = reg.registro.cctaporpagar;
      this.msgs = [];
      this.consultar();
    }
  }

  mostrarlovcuentasporpagar(): void {
    this.lovcuentasporpagar.mfiltros.estadocxpcdetalle = 'PAGADO';
    this.lovcuentasporpagar.showDialog();
    this.lovcuentasporpagar.consultar();
  }

  /**Muestra lov de plantillas comprobante */
  mostrarlovplantillasComprobante(): void {
    this.lovplantillasComprobante.mfiltros.tipomovimientocdetalle = 'CXP';
    this.lovplantillasComprobante.consultar();
    this.lovplantillasComprobante.showDialog();
  }

  /**Retorno de lov de plantillas comprobante. */
  fijarLovPlantillasComprobante(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.registro.mdatos.pnombre = reg.registro.nombre;
      this.comprobanteComponent.registro.cplantilla = reg.registro.cplantilla;
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1007;
    const conTipoDocumento = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('TIPODOCUMENTO1', conTipoDocumento, this.ltcomprobantecdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1011;
    const conPorcentajeIVA = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('TIPODOCUMENTO2', conPorcentajeIVA, this.lporcentajeivacdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1010;
    const conPorcentajeICE = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('TIPODOCUMENTO3', conPorcentajeICE, this.lporcentajeicecdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1006;
    const conPorcentajeRetBienes = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('TIPODOCUMENTO4', conPorcentajeRetBienes, this.lporretbienescdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1004;
    const conPorcentajeRetServicios = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('TIPODOCUMENTO5', conPorcentajeRetServicios, this.lporretservicioscdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1009;
    const conFormaPago = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('TIPODOCUMENTO6', conFormaPago, this.lformapagocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1008;
    const conSustento = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('TIPODOCUMENTO7', conSustento, this.lsustentocdetalle, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }


  cargarIVAenBienes(obj: any) {
    if (obj === true) {
      this.comprobanteComponent.registro.montoivabienes = this.comprobanteComponent.registro.montoiva;
    } else {
      this.comprobanteComponent.registro.montoivaservicios = 0.00;
    }

  }

  cargarIVAenServicios(obj: any) {
    if (obj === true) {
      this.comprobanteComponent.registro.montoivaservicios = this.comprobanteComponent.registro.montoiva;
    } else {
      this.comprobanteComponent.registro.montoivaservicios = 0.00;
    }
  }

  //#region calcular porcentajes
  calcularImpuestosBaseImpGrav() {
    if (this.comprobanteComponent.registro.montoivabienes !== undefined) {
      this.comprobanteComponent.registro.montoivabienes = 0;
      this.comprobanteComponent.registro.valorretbienes = 0;
    }
    if (this.comprobanteComponent.registro.montoivaservicios !== undefined) {
      this.comprobanteComponent.registro.montoivaservicios = 0;
      this.comprobanteComponent.registro.valorretservicios = 0;
    }
    this.detalleComponent.baseimpgravable = this.comprobanteComponent.registro.baseimpgrav;
    this.calcularIVA();
    this.calcularICE();
  }

  calcularIVA() {
    const porcentaje = this.lporcentajeivacdetalle.find(x => x.value === this.comprobanteComponent.registro.porcentajeivacdetalle);
    if (porcentaje !== undefined) {
      this.comprobanteComponent.registro.montoiva = (Number(porcentaje.label) / 100) * this.comprobanteComponent.registro.baseimpgrav;
    }
  }

  calcularICE() {
    const porcentaje = this.lporcentajeicecdetalle.find(x => x.value === this.comprobanteComponent.registro.porcentajeicecdetalle);
    if (porcentaje !== undefined) {
      this.comprobanteComponent.registro.montoice = (Number(porcentaje.label) / 100) * this.comprobanteComponent.registro.baseimpgrav;
    }
  }

  calcularRetIVABienes() {
    const porcentaje = this.lporretbienescdetalle.find(x => x.value === this.comprobanteComponent.registro.porretbienescdetalle);
    this.comprobanteComponent.registro.valorretbienes = (Number(porcentaje.label) / 100) * this.comprobanteComponent.registro.montoivabienes;
    this.calcularTotalRetencionIVA();
  }

  calcularRetIVAServicios() {
    const porcentaje = this.lporretservicioscdetalle.find(x => x.value === this.comprobanteComponent.registro.porretservicioscdetalle);
    this.comprobanteComponent.registro.valorretservicios = (Number(porcentaje.label) / 100) * this.comprobanteComponent.registro.montoivaservicios;
    this.calcularTotalRetencionIVA();
  }

  //#endregion

  //#region CalcularTotales
  calcularTotalRetencionIVA() {
    if (this.comprobanteComponent.registro.valorretservicios === undefined) {
      this.comprobanteComponent.registro.valorretservicios = 0;
    }
    if (this.comprobanteComponent.registro.valorretbienes === undefined) {
      this.comprobanteComponent.registro.valorretbienes = 0;
    }
    this.totalretencionesiva = this.comprobanteComponent.registro.valorretservicios + this.comprobanteComponent.registro.valorretbienes;
    this.calcularTotalRetenciones();
  }

  calcularTotalRetencionFuente() {
    let sumatorioretencionesrenta = 0;
    this.sumatoriobaseimpair = 0;
    //Fondos administrados
    for (const i in this.detalleComponent.lregistros) {
      if (this.detalleComponent.lregistros.hasOwnProperty(i)) {
        const reg = this.detalleComponent.lregistros[i];
        sumatorioretencionesrenta += reg.valretair;
        this.sumatoriobaseimpair += reg.baseimpair;
      }
    }

    this.detalleComponent.totalRetencionesIR = sumatorioretencionesrenta;
    this.calcularTotalRetenciones();
  }

  calcularTotalRetenciones() {
    const baseimponible = this.comprobanteComponent.registro.baseimponible === undefined ? 0 : this.comprobanteComponent.registro.baseimponible;
    const montoiva = this.comprobanteComponent.registro.montoiva === undefined ? 0 : this.comprobanteComponent.registro.montoiva;
    const montoice = this.comprobanteComponent.registro.montoice === undefined ? 0 : this.comprobanteComponent.registro.montoice;
    this.totalretenciones = this.totalretencionesiva + this.detalleComponent.totalRetencionesIR;
    const totalretenciones = this.totalretenciones;
    this.comprobanteComponent.registro.valorpagar = (baseimponible + montoiva + montoice - totalretenciones);
  }

  //#endregion

  //#region Reporte
  descargarReporte(): void {
    if (this.comprobanteComponent.registro.cctaporpagar === undefined) {
      super.mostrarMensajeError('Por favor seleccione una cuenta por pagar');
      return;
    }

    this.jasper.nombreArchivo = "cxp_" + this.comprobanteComponent.registro.cctaporpagar;
    if (this.mcampos.nombre === undefined) {
      this.mcampos.nombre = '';
    }

    if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
      this.mcampos.rol = -1
    }

    // Agregar parametros
    this.jasper.parametros['@i_ccuentaporpagar'] = this.comprobanteComponent.registro.cctaporpagar;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/PresConsultaCuentaxPagar';
    this.jasper.generaReporteCore();
  }
  //#endregion

  //#region Validaciones
  validarDatosCuentaPorPagar(): string {
    let mensaje = '';
    if (this.comprobanteComponent.registro.cplantilla === null || this.comprobanteComponent.registro.cplantilla === undefined) {
      mensaje += 'Seleccione plantilla <br />';
    }

    if (this.comprobanteComponent.registro.autorizacionsustento.length != 10 &&
      this.comprobanteComponent.registro.autorizacionsustento.length != 37 &&
      this.comprobanteComponent.registro.autorizacionsustento.length != 50) {
      mensaje += 'Longitud de campo autorización es 10 o 37 o 50 <br />';
    }
    var fechaNow = new Date(Date.now());
    if (this.comprobanteComponent.registro.ffacturasustento.getMonth() !== fechaNow.getMonth()) {
      mensaje += 'El mes de la fecha de factura se encuentra extemporáneo';
    }
    if (this.comprobanteComponent.registro.fcaducidadsustento <= this.comprobanteComponent.registro.ffacturasustento) {
      mensaje += 'Fecha de caducidad debe ser mayor a fecha factura';
    }
    if (this.comprobanteComponent.registro.fpagovencimiento <= this.comprobanteComponent.registro.ffacturasustento) {
      mensaje += 'Fecha de pago vencimiento debe ser mayor a fecha factura';
    }
    if (this.comprobanteComponent.registro.montoiva >= 0 && this.totalretencionesiva === 0) {
      mensaje += 'Ingrese retención en bienes o servicios <br />';
    }
    if (this.comprobanteComponent.registro.baseimpgrav >= 0 && this.totalretenciones === 0) {
      mensaje += 'Ingrese al menos una retención en la fuente <br />';
    }

    const montoivabienes = this.comprobanteComponent.registro.montoivabienes === undefined ? 0 : this.comprobanteComponent.registro.montoivabienes;
    const montoivaservicios = this.comprobanteComponent.registro.montoivaservicios === undefined ? 0 : this.comprobanteComponent.registro.montoivaservicios;
    if (this.comprobanteComponent.registro.montoiva !== (montoivabienes + montoivaservicios)) {
      mensaje += 'Monto iva bienes y monto iva servicios deben ser igual a monto iva (' + this.comprobanteComponent.registro.montoiva + ')' + '<br />';
    }

    if (this.sumatoriobaseimpair !== this.comprobanteComponent.registro.baseimpgrav) {
      mensaje += 'Sumatorio de base imponibles en retenciones a la renta debe ser igual a la base imponible gravable de la cuenta por pagar (' +
        this.comprobanteComponent.registro.baseimpgrav + ')' + '<br />';
    }
    return mensaje;
  }
  //#endregion
}
