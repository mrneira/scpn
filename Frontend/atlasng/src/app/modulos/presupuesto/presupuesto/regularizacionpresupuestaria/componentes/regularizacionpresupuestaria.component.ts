import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ComprobanteComponent } from '../submodulos/comprobante/componentes/_comprobante.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { textChangeRangeIsUnchanged } from 'typescript';
import { AccordionModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { elementAt } from 'rxjs/operator/elementAt';
import { forEach } from '@angular/router/src/utils/collection';
import {AppService} from 'app/util/servicios/app.service';

@Component({
  selector: 'app-regularizacionpresupuestaria',
  templateUrl: 'regularizacionpresupuestaria.html'
})
export class RegularizacionPresupuestariaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(ComprobanteComponent)
  comprobanteComponent: ComprobanteComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipopersona: SelectItem[] = [{ label: '...', value: null }, { label: 'CLIENTE', value: 'CL' }, { label: 'PROVEEDOR', value: 'PR' }, { label: 'PERSONA', value: 'PE' }];
  public grabo = false;
  public totalesComprobanteDebito = 0;
  public totalesComprobanteCredito = 0;
  public nuevo = true;
  public persona = false;
  public proveedor = false;
  public cliente = false;
  cmodulo: number; 

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'CREANATURALES', false);
  }

  ngOnInit() {
    this.componentehijo = this;
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
    conComprobante.addSubquery('tgencatalogodetalle', 'nombre', 'ndocumento', 'i.ccatalogo = t.tipodocumentoccatalogo and i.cdetalle = t.tipodocumentocdetalle');
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
    return true;
  }

  codigoBlur(event) {
    if (this.comprobanteComponent.registro.ccomprobante === undefined ) {
      return;
    }
    this.consultaComprobante(this.comprobanteComponent.registro.ccomprobante);
  }

  consultaComprobante(ccomprobante){
    const conComprobante = new Consulta('tconcomprobante','N','ccomprobante',
                    {ccomprobante:ccomprobante, actualizosaldo: true, ruteopresupuesto: false, anulado: false, eliminado: false}
                    ,{});
    this.addConsultaPorAlias('TCONCOMPROBANTE', conComprobante);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuesta(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuesta(resp: any) {
    let reg = resp.TCONCOMPROBANTE;
    if (reg === undefined || reg === null ) {
      this.recargar();
      super.mostrarMensajeError("NO EXISTE COMPROBANTE, O COMPROBANTE NO ESTA MAYORIZADO");
      return;      
    }else{
      reg.registro = reg;
      this.fijarLovComprobantesSelec(reg);
    }
  }

  
  /**Retorno de lov de concepto contables. */
  fijarLovComprobantesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.comprobanteComponent.mfiltros.ccomprobante = reg.registro.ccomprobante;
      this.comprobanteComponent.mfiltros.fcontable = reg.registro.fcontable;
      this.comprobanteComponent.mfiltros.particion = reg.registro.particion;
      this.comprobanteComponent.mfiltros.ccompania = reg.registro.ccompania;

      if (reg.registro.tipopersona === 'CL') { this.cliente = true; this.persona = false; this.proveedor = false; }
      else if (reg.registro.tipopersona === 'PR') { this.proveedor = true; this.persona = false; this.cliente = false; }
      else if (reg.registro.tipopersona == 'PE') { this.persona = true; this.proveedor = false; this.cliente = false; }
      else { this.persona = false; this.proveedor = false; this.cliente = false; }

      this.detalleComponent.mfiltros.ccomprobante = reg.registro.ccomprobante;
      this.detalleComponent.mfiltros.fcontable = reg.registro.fcontable;
      this.detalleComponent.mfiltros.particion = reg.registro.particion;
      this.detalleComponent.mfiltros.ccompania = reg.registro.ccompania;

      this.msgs = [];

      this.consultar();
    }

  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.comprobanteComponent.postQuery(resp);
    const compro = resp.CABECERA;
    this.mcampos.nconcepto = compro[0].mdatos.nconcepto;
    this.mcampos.npersonarecibido = compro[0].mdatos.npersonarecibido;
    this.mcampos.pnombre = compro[0].mdatos.pnombre;
    this.mcampos.nsucursal = compro[0].mdatos.nsucursal;
    this.mcampos.csucursal = compro[0].csucursal;
    this.mcampos.nagencia = compro[0].mdatos.nagencia;
    this.mcampos.cagencia = compro[0].cagencia;
    this.mcampos.ndocumento = compro[0].mdatos.ndocumento;
    this.detalleComponent.postQuery(resp);
    this.calcularTotalesDebitoCredito();
    this.nuevo = false;
  }

  // Fin CONSULTA *********************

  guardarCambios(): void {
    this.grabar();
  }


  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.comprobanteComponent.registro.aprobadopresupuesto = true;
    this.rqMantenimiento.mdatos.ccomprobante = this.comprobanteComponent.registro.ccomprobante;
    this.rqMantenimiento.mdatos.fcontable = this.comprobanteComponent.registro.fcontable;
    this.rqMantenimiento.mdatos.ccompania = this.comprobanteComponent.registro.ccompania;
    this.lmantenimiento = []; // Encerar Mantenimiento
    super.addMantenimientoPorAlias(this.comprobanteComponent.alias, this.comprobanteComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el
    if (resp.cod === "OK"){

    } else {
      this.mostrarMensajeError(resp.msgusu);
    }

  }


  descargarReporteAfectacion(){
    
    this.jasper.nombreArchivo = 'rptPptAfectacionPresupuestaria';
    this.jasper.parametros['@i_ccompromiso'] = this.detalleComponent.registro.ccompromiso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptAfectacionPresupuestaria';
    this.jasper.generaReporteCore();
  }

  regresarABuzon(){
    const opciones = {};
    const tran = 21 ;
    opciones['path'] = sessionStorage.getItem('m') + '-'+ tran;
    opciones['tit'] = sessionStorage.getItem('m') + '-'+ tran + ' Acciones';
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'true';
    opciones['del'] = 'true';
    opciones['upd'] = 'true';

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);
    sessionStorage.setItem('path', opciones['path']);

    this.router.navigate([opciones['path']], {skipLocationChange: true, 
                                              queryParams: {buzon: JSON.stringify({cmodulo: this.cmodulo })}});
    this.appService.titulopagina = opciones['tit'];  
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

  public calcularTotalesDebitoCredito() {
    let sumatoriodebito = 0;
    let sumatoriocredito = 0;
    let totalesdebito = 0;
    let totalescredito = 0;
    let monto = 0;

    //Fondos administrados
    // tslint:disable-next-line:forin
    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];
      if (reg.monto === null || reg.monto === undefined) {
        monto = 0
      } else {
        monto = reg.monto;
      }

      if (reg.debito === true) {
        sumatoriodebito = sumatoriodebito + monto;
      } else {
        sumatoriocredito = sumatoriocredito + monto;
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

  }

  validarDatosComprobanteContable(): string{
    let mensaje = '';
    
    if (this.comprobanteComponent.registro.mdatos.fcontable == null) {
      mensaje += 'Fecha contable requerida  <br />';
    }

    if (this.comprobanteComponent.registro.tipodocumentocdetalle === null || this.comprobanteComponent.registro.tipodocumentocdetalle === undefined) {
      mensaje +=  'Seleccione tipo de documento <br />';
    }

    if (this.comprobanteComponent.registro.cconcepto === null || this.comprobanteComponent.registro.cconcepto === undefined) {
      mensaje +=  'Seleccione concepto <br />';
    }

    if (this.detalleComponent.lregistros.length === 0 ) {
      mensaje +=  'Ingrese detalle de cuentas contables <br />';
    }

    for (const i in this.detalleComponent.lregistros){
      const reg = this.detalleComponent.lregistros[i];
      if (reg.ccuenta === undefined || reg.ccuenta === '')
        mensaje +=  'Cuenta contable línea ' +  (Number(i)+1) + ' no puede estar en blanco<br />';
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
    if (this.comprobanteComponent.registro.ccomprobante.tipodocumentocdetalle === 'INGRES') {
      tipoComprobante = 'Ingreso';
    } else if (this.comprobanteComponent.registro.ccomprobante.tipodocumentocdetalle === 'EGRESO') {
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
