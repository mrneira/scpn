import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-autorizacionviaticos',
  templateUrl: 'autorizacionviaticos.html'
})
export class AutorizacionviaticosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  selectedRegistros: any = [];
 
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public linstfinanciera: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconliquidaciongastos', 'tconliquidaciongastos', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1);
    this.mcampos.fliquidacionini = finicio;
    this.mcampos.fliquidacionfin = this.fechaactual;
    this.consultarCatalogos();
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

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cliquidaciongastos', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tperpersonadetalle','nombre','npersona','t.cpersona = i.cpersona and i.verreg = 0');
    consulta.addSubquery('tconcomprobante','numerocomprobantecesantia','numerocomprobantecesantia','t.ccomprobante = i.ccomprobante');
    consulta.addSubquery('tconcomprobante','aprobadopresupuesto','aprobadopresupuesto','t.ccomprobante = i.ccomprobante');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipocuentacdetalle', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nbancocdetalle', 'i.ccatalogo = t.tipoinstitucionccatalogo and i.cdetalle = t.tipoinstitucioncdetalle');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    if (!this.estaVacio(this.mcampos.fliquidacionini) && !this.estaVacio(this.mcampos.fliquidacionfin)){
      this.mfiltrosesp.fliquidacion = ' between \'' + this.calendarToFechaString(this.mcampos.fliquidacionini) + '\' and \'' + this.calendarToFechaString(this.mcampos.fliquidacionfin) + '\'';
    }
    // this.mfiltrosesp.ccomprobante = ' is not null';
    // this.mfiltrosesp.ccompromiso = '<> \'\'';
    this.mfiltros.estadocdetalle = 'CONTAB';
  }


  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    const lista : any = [];
    for (const i in resp.tconliquidaciongastos){
      const reg = resp.tconliquidaciongastos[i];
      if (reg.mdatos.aprobadopresupuesto === true) lista.push(reg);
    }
    resp.tconliquidaciongastos = lista;
    super.postQueryEntityBean(resp);
  }
  //#endregion

  //Inicia MANTENIMIENTO *********************
  grabar(): void {

    if (this.selectedRegistros.length === 0 || this.estaVacio(this.selectedRegistros)) {
      super.mostrarMensajeError("NO EXISTEN REGISTROS SELECCIONADOS PARA AUTORIZAR LIQUIDACION DE VIATICOS");
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
    this.descargarReporte();
  }


  //#region Reporte
  descargarReporte(): void {
    const reg = this.selectedRegistros;
    // Agregar parametros
    let tipoComprobante = 'Diario';
    this.jasper.parametros['@i_ccomprobante'] = reg.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
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
    const mfiltroInsFin: any = { 'ccatalogo': 305,'activo': true };
    const consultaInsFin = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroInsFin, {});
    consultaInsFin.cantidad = 500;
    this.addConsultaPorAlias('INSFIN', consultaInsFin);

    const mfiltroTipoCuenta: any = { 'ccatalogo': 306 };
    const consultaTipoCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoCuenta, {});
    consultaTipoCuenta.cantidad = 20;
    this.addConsultaPorAlias('TIPCUENTA', consultaTipoCuenta);

  }


  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.linstfinanciera, resp.INSFIN, 'cdetalle');
      this.llenaListaCatalogo(this.ltipocuenta, resp.TIPCUENTA, 'cdetalle');
    }
    this.lconsulta = [];
  }

  cerrarDialogo() {
    //this.selectedRegistros.mdatos.nbancocdetalle = this.linstfinanciera.find(x => x.value === this.selectedRegistros.tipoinstitucioncdetalle).label;
    //this.selectedRegistros.mdatos.ntipocuentacdetalle = this.ltipocuenta.find(x => x.value === this.selectedRegistros.tipocuentacdetalle).label;
    // this.selectedRegistros.numerocuenta = this.registro.numerocuenta;
    // this.selectedRegistros.cedula = this.registro.cedula;
    this.mostrarDialogoGenerico = false;
  }

  cancelarDialogo() {
    this.selectedRegistros.tipoinstitucioncdetalle = undefined;
    this.selectedRegistros.tipocuentacdetalle = undefined;
    this.selectedRegistros.numerocuenta = undefined;
    this.selectedRegistros.cedula = undefined;
    this.selectedRegistros.mdatos.nbancocdetalle = undefined;
    this.selectedRegistros.mdatos.ntipocuentacdetalle = undefined;
    this.mostrarDialogoGenerico = false;
  }

  onRowSelect($event){
    //this.selectRegistro(this.selectedRegistros);
    this.mostrarDialogoGenerico = true;
  }

  onRowUnselect($event){
    
  }
}
