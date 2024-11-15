import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CabeceraComponent } from '../submodulos/cabecera/componentes/_cabecera.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { textChangeRangeIsUnchanged } from 'typescript';
import { AccordionModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovEgresosComponent } from '../../../lov/egresos/componentes/lov.egresos.component';
import { LovFuncionariosComponent } from '../../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';

export enum KEY_CODE {
  FLECHA_ABAJO = 40
}
@Component({
  selector: 'app-egresosuministros',
  templateUrl: 'egresosuministros.html'
})
export class EgresoSuministrosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(DetalleComponent)
  detalleComponent1: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovEgresosComponent)
  private lovegresos: LovEgresosComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionario: LovFuncionariosComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipoegresocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];

  public nuevo = true;
  public eliminado = false;
  public tienekardex = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {


    if (event.keyCode === KEY_CODE.FLECHA_ABAJO && event.ctrlKey) {
      this.detalleComponent.agregarFila();
    }

  }
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREAREGRESO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.cabeceraComponent.registro.fecha = this.fechaactual;
    this.consultarCatalogos();
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
    const conComprobante = this.cabeceraComponent.crearDtoConsulta();
    conComprobante.addSubquery('tconcomprobante', 'numerocomprobantecesantia', 'numerocomprobantecesantia', 't.ccomprobante = i.ccomprobante');
    this.addConsultaPorAlias(this.cabeceraComponent.alias, conComprobante);
    const conDetalle = this.detalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.detalleComponent.alias, conDetalle);
  }

  consultarDatosFuncionario() {
    this.rqConsulta.CODIGOCONSULTA = 'AF_OBTDATFUNCIONARIO';
    this.rqConsulta.storeprocedure = "sp_AcfConObtenerDatosFuncionario";
    this.rqConsulta.parametro_cegreso = this.cabeceraComponent.mfiltros.cegreso;

    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaFuncionario(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
    this.rqConsulta.CODIGOCONSULTA = undefined;
  }

  private manejaRespuestaFuncionario(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.AF_OBTDATFUNCIONARIO;
      this.registro.mdatos.nfuncionario = resp.AF_OBTDATFUNCIONARIO[0].nfuncionario;
      this.registro.mdatos.ccargo = resp.AF_OBTDATFUNCIONARIO[0].ccargo;
      this.registro.mdatos.ncargo = resp.AF_OBTDATFUNCIONARIO[0].ncargo;
      this.registro.mdatos.cproceso = resp.AF_OBTDATFUNCIONARIO[0].cproceso;
      this.registro.mdatos.nproceso = resp.AF_OBTDATFUNCIONARIO[0].nproceso;
    }
  }

  private fijarFiltrosConsulta() {
    this.cabeceraComponent.fijarFiltrosConsulta();
    this.detalleComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.cabeceraComponent.postQuery(resp);
    this.detalleComponent.postQuery(resp);
    this.detalleComponent.calcularTotales();
    this.nuevo = false;
    this.eliminado = this.cabeceraComponent.registro.eliminado;
    this.tienekardex = this.cabeceraComponent.registro.tienekardex;
    if (this.cabeceraComponent.registro.ccomprobante !== null) {
      this.mcampos.ccomprobante = this.cabeceraComponent.registro.ccomprobante;
      this.mcampos.numerocomprobantecesantia = this.cabeceraComponent.registro.mdatos.numerocomprobantecesantia;
    } else {
      this.mcampos.ccomprobante = undefined;
      this.mcampos.numerocomprobantecesantia = undefined;
    }

    this.consultarDatosFuncionario();
  }

  // Fin CONSULTA *********************

  guardarCambios(): void {
    if (this.cabeceraComponent.registro.comentario === undefined) {
      this.cabeceraComponent.registro.comentario = "";
    }
    this.grabar();
  }

  finalizarEgreso(): void {
    this.rqMantenimiento.mdatos.kardex = true;
    this.cabeceraComponent.registro.tienekardex = true;
    this.rqMantenimiento.mdatos.generarcomprobante = true;
    this.grabar();
  }

  eliminarEgreso(): void {
    this.rqMantenimiento.mdatos.eliminar = true;
    this.grabar();
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento
    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
    }
    if (!this.validarRegistrosDetalle()) {
      super.mostrarMensajeError('DETALLE DE EGRESO TIENE PRODUCTOS SIN CODIGO');
      return;
    }
    if (this.nuevo) {
      this.cabeceraComponent.selectRegistro(this.cabeceraComponent.registro);
      this.cabeceraComponent.actualizar();
      this.cabeceraComponent.registro.cusuarioing = '';
    } else {
      this.cabeceraComponent.registro.cusuariomod = 'user';
      this.cabeceraComponent.registro.fmodificacion = this.fechaactual;
    }


    this.cabeceraComponent.registro.optlock = 0;
    this.cabeceraComponent.registro.verreg = 0;
    this.cabeceraComponent.registro.tipoegresoccatalogo = 1305;
    this.cabeceraComponent.registro.estadoccatalogo = 1306;
    this.cabeceraComponent.registro.estadocdetalle = 'EGRESA';
    this.cabeceraComponent.registro.carea = this.registro.mdatos.cproceso;
    this.cabeceraComponent.registro.ccargo = this.registro.mdatos.ccargo;
    this.cabeceraComponent.registro.movimiento = 'S';
    this.rqMantenimiento.mdatos.fecha = this.cabeceraComponent.registro.fecha;
    super.addMantenimientoPorAlias(this.cabeceraComponent.alias, this.cabeceraComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  validarRegistrosDetalle(): boolean {
    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];
      if (reg.mdatos.codigo === undefined) {
        return false;
      }
    }
    return true;
  }

  validarGrabar(): string {
    let mensaje: string = '';

    if (this.cabeceraComponent.registro.numeromemo === null || this.cabeceraComponent.registro.numeromemo === undefined) {
      mensaje += 'INGRESE EL MEMO DE AUTORIZACIÓN <br />';
    }
    if (this.cabeceraComponent.registro.tipoegresocdetalle === null || this.cabeceraComponent.registro.tipoegresocdetalle === undefined) {
      mensaje += 'SELECCIONE EL TIPO DE EGRESO <br />';
    }
    if (this.cabeceraComponent.registro.numerooficio === null || this.cabeceraComponent.registro.numerooficio === undefined) {
      mensaje += 'INGRESE EL NUMERO DE OFICIO <br />';
    }
    if (this.cabeceraComponent.registro.fecha === null || this.cabeceraComponent.registro.fecha === undefined) {
      mensaje += 'INGRESE LA FECHA DE EGRESO <br />';
    }
    if (this.detalleComponent.lregistros.length === 0) {
      mensaje += 'NO HA INGRESADO DETALLE DE PRODUCTOS <br />';
    }
    return mensaje;
  }
  validarInventarioCongelado() {
    const consulta = new Consulta('tacfinventariocongelado', 'Y', '', { 'congelasuministros': true }, {});
    this.addConsultaPorAlias('CONGELAINVENTARIO', consulta);

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
    if (resp.CONGELAINVENTARIO !== undefined && resp.CONGELAINVENTARIO !== null) {
      if (resp.CONGELAINVENTARIO.length > 0) {
        super.mostrarMensajeError('INVENTARIO CONGELADO, POR FAVOR TERMINAR PROCESO DE AJUSTE PARA CONTINUAR');
        return;
      }
    }
  }
  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el
    if (resp.cod === 'OK') {
      this.cabeceraComponent.postCommit(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
      this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.detalleComponent.alias));
      this.cabeceraComponent.registro.cegreso = resp.cegreso;
      this.cabeceraComponent.mfiltros.cegreso = resp.cegreso;
      this.detalleComponent.mfiltros.cegreso = resp.cegreso;
      if (resp.mayorizado === 'OK') {
        this.mcampos.ccomprobante = resp.ccomprobante;
        this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
        this.descargarReporteComprobanteContable();
      }
      this.msgs = [];
      this.grabo = true;
      this.nuevo = false;
      this.tienekardex = this.cabeceraComponent.registro.tienekardex;
      this.enproceso = false;

      this.consultar();
    }
  }


  /**Muestra lov de Egresos */
  mostrarlovegresos(): void {
    this.lovegresos.mfiltros.movimiento = 'S';
    this.lovegresos.showDialog(true);
  }


  /**Retorno de lov de Egresos */
  fijarLovEgresosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.cegreso = reg.registro.cegreso;
      this.detalleComponent.mfiltros.cegreso = reg.registro.cegreso;
      this.msgs = [];
      this.consultar();
    }
  }



  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1305;
    const conTipoEgreso = this.catalogoDetalle.crearDtoConsulta();
    conTipoEgreso.cantidad = 20;
    this.addConsultaCatalogos('TIPOEGRESO', conTipoEgreso, this.ltipoegresocdetalle, this.llenaListaTipoEgreso, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1306;
    const conEstadoEgreso = this.catalogoDetalle.crearDtoConsulta();
    conEstadoEgreso.cantidad = 20;
    this.addConsultaCatalogos('ESTADOEGRESO', conEstadoEgreso, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
  public llenaListaTipoEgreso(pLista: any, pListaResp, campopk = 'pk', agregaRegistroVacio = true, componentehijo = null): any {
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      if (reg.cdetalle !== 'ACTBAJ' && reg.cdetalle !== 'DEVCOM') {
        pLista.push({ label: reg.nombre, value: reg.cdetalle });
      }
    }
  }

  mostrarLovFuncionario(): void {
    this.lovFuncionario.showDialog();
  }

  /**Retorno de lov de Funcionarios. */
  fijarLovFuncionario(reg: any): void {

    if (reg.registro !== undefined) {
      this.cabeceraComponent.registro.cusuariorecibe = reg.registro.cpersona;
      this.registro.mdatos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.cabeceraComponent.registro.mdatos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;

      this.registro.mdatos.ccargo = reg.registro.mdatos.ccargo;
      this.registro.mdatos.ncargo = reg.registro.mdatos.ncargo;
      this.registro.mdatos.cproceso = reg.registro.mdatos.cproceso;
      this.registro.mdatos.nproceso = reg.registro.mdatos.nproceso;

    }
  }

  public llenaListaCatalogo(pLista: any, pListaResp): any {

  }
  //#region Reporte
  descargarReporte(): void {
    this.jasper.parametros = new Object();
    this.jasper.parametros['reportes'] = [];
    if (this.cabeceraComponent.registro.cegreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un egreso');
      return;
    }

    this.jasper.nombreArchivo = this.cabeceraComponent.registro.cegreso;
    if (this.mcampos.nombre === undefined) {
      this.mcampos.nombre = '';
    }

    if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
      this.mcampos.rol = -1
    }

    // Agregar parametros
   
    this.jasper.parametros['@i_cegreso'] = this.cabeceraComponent.registro.cegreso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfComprobanteEgresoDeBodega';
    this.jasper.generaReporteCore();
  }

  descargarReporteComprobanteContable(): void {
    let tipoComprobante = '';
    tipoComprobante = 'Diario';
    // Agregar parametros
    this.jasper.parametros = new Object();
    this.jasper.parametros['reportes'] = [];
    this.jasper.parametros['@i_ccomprobante'] = this.mcampos.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }
  //#endregion

  calcularTotales() {

  }

}
