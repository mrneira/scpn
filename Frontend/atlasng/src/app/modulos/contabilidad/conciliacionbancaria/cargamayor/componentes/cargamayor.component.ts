import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-cargamayor',
  templateUrl: 'cargamayor.html'
})
export class CargamayorComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public lbancos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public ltipoNovedad: SelectItem[] = [{ label: '...', value: null }];

  fecha = new Date();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcomprobantedetalle', 'COMPROBANTEDETALLE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.llenarEstado();
    this.consultarCatalogos();


  }

  ngAfterViewInit() {
  }

  crearNuevo() {
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

  consultar() {


    if (this.mcampos.ccuenta != undefined && this.mcampos.fechainicial != undefined && this.mcampos.fechafinal != undefined) {

      if (this.mcampos.fechafinal < this.mcampos.fechainicial) {
          this.mostrarMensajeError("LA FECHA FINAL DEBE SER IGUAL O MAYOR A LA FECHA INICIAL");
          return;
      }

      this.crearDtoConsulta();
      super.consultar();

    }
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();

    let lfechainicial: number = (this.mcampos.fechainicial.getFullYear() * 10000) + ((this.mcampos.fechainicial.getMonth() + 1) * 100) + this.mcampos.fechainicial.getDate();

    let lfechafinal: number = (this.mcampos.fechafinal.getFullYear() * 10000) + ((this.mcampos.fechafinal.getMonth() + 1) * 100) + this.mcampos.fechafinal.getDate();

    this.mfiltrosesp.fcontable = 'between ' + lfechainicial + ' and ' + lfechafinal + ' ';

    const consulta = new Consulta(this.entityBean, 'Y', 't.fcontable, t.ccomprobante, t.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia('select (year(i.freal) * 10000) + (month(i.freal) * 100) + day(i.freal) from tconcomprobante i where i.ccomprobante = t.ccomprobante and i.fcontable = t.fcontable and i.particion = t.particion and i.ccompania = t.ccompania', 'nfreal');
    consulta.addSubquery('tconcomprobante', 'comentario', 'ncomentario', 'i.ccomprobante = t.ccomprobante and i.fcontable = t.fcontable and i.particion = t.particion and i.ccompania = t.ccompania');
    consulta.addSubquery('tconcomprobante', 'actualizosaldo', 'nactualizosaldo', 'i.ccomprobante = t.ccomprobante and i.fcontable = t.fcontable and i.particion = t.particion and i.ccompania = t.ccompania');
    consulta.addSubquery('tconcomprobante', 'eliminado', 'neliminado', 'i.ccomprobante = t.ccomprobante and i.fcontable = t.fcontable and i.particion = t.particion and i.ccompania = t.ccompania');
    consulta.addSubquery('tconcomprobante', 'anulado', 'nanulado', 'i.ccomprobante = t.ccomprobante and i.fcontable = t.fcontable and i.particion = t.particion and i.ccompania = t.ccompania');
    consulta.addSubquery('tconconciliacionbancariamayor', 'estadoconciliacioncdetalle', 'nestadoconciliacioncdetalle', 'i.ccomprobante = t.ccomprobante and i.fcontable = t.fcontable and i.particion = t.particion and i.secuencia = t.secuencia and i.ccompania = t.ccompania');
    consulta.addSubqueryPorSentencia('select max(a.ccomprobante) from tconcomprobante a where a.ccomprobanteanulacion = t.ccomprobante', 'ncomprobanteanulacion');


    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {

    super.postQueryEntityBean(resp);

    this.rowVisible();

  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    if (this.rqMantenimiento.lregistros.length == 0) {
      this.mostrarMensajeError("NO EXISTEN REGISTROS QUE CUMPLAN CON EL FILTRO DE SELECCIÓN.");
    }
    else {

      this.lmantenimiento = []; // Encerar Mantenimiento
      this.crearDtoMantenimiento();
      super.grabar();

      this.mcampos.ccuenta = "";
      this.mcampos.ncuenta = "";
      this.mcampos.fechainicial = "";
      this.mcampos.fechafinal = "";
      this.rqMantenimiento.lregistros = [];
    }
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);

    let mantenimientoAux: any = mantenimiento;

    mantenimientoAux.lregistros = this.lregistros;

    super.addMantenimientoPorAlias(this.alias, mantenimientoAux);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }


  /**Muestra lov de cuentas contables */

  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true); // con true solo muestra cuentas de movimiento.
  }

  /**Retorno de lov de cuantas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {

    if (reg.registro !== undefined) {

      this.msgs = [];
      this.mfiltros.ccuenta = reg.registro.ccuenta
      this.mcampos.ccuenta = reg.registro.ccuenta;
      this.mcampos.ncuenta = reg.registro.nombre;
      this.consultar();

    }
  }


  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.encerarMensajes();
        this.dtoServicios.llenarMensaje(resp, false); 
        this.manejaRespuestaCatalogos(resp);

      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosProf: any = { 'ccatalogo': 220 };
    const consultaProf = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosProf, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('TIPONOVEDAD', consultaProf);

    const mfiltrosBanco: any = { 'ccatalogo': 305, 'activo': true };
    const consultaBanco = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosBanco, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('BANCO', consultaBanco);

    const mfiltrosTipoCuenta: any = { 'ccatalogo': 306 };
    const consultaTipoCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoCuenta, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('TIPOCUENTA', consultaTipoCuenta);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.ltipoNovedad, resp.TIPONOVEDAD, 'cdetalle');
      this.llenaListaCatalogo(this.lbancos, resp.BANCO, 'cdetalle');
      this.llenaListaCatalogo(this.ltipocuenta, resp.TIPOCUENTA, 'cdetalle');

    }
    this.lconsulta = [];
  }

  llenarEstado() {
    this.lestado = [];
    this.lestado.push({ label: '...', value: null });
    this.lestado.push({ label: 'ACTIVO', value: 'ACT' });
    this.lestado.push({ label: 'INACTIVO', value: 'INA' });
  }

  private rowVisible() {

    let lregistrosAux: any = [];
    let j: number = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        if (this.lregistros[i].mdatos.nactualizosaldo == 1 &&
          this.lregistros[i].mdatos.neliminado == 0 &&
          this.lregistros[i].mdatos.nanulado == 0 &&
          this.lregistros[i].mdatos.nestadoconciliacioncdetalle == null &&
          this.lregistros[i].mdatos.ncomprobanteanulacion == null) {
          lregistrosAux[j] = this.lregistros[i];
          j++;
        }
      }
    }
    this.rqMantenimiento.lregistros = lregistrosAux;
  }


}
