import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-convenio',
  templateUrl: 'convenioIngreso.html'
})
export class ConvenioIngresoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  public CATALOGO_IDENTIFICACION = 303;
  public CATALOGO_INSTITUCION = 305;
  public CATALOGO_CUENTA = 306;
  public ltipoidentificacion: SelectItem[] = [{ label: '...', value: null }];
  public ltipoinstitucion: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarConvenio', 'CONVENIO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.ccatalogoidentificacion = this.CATALOGO_IDENTIFICACION;
    this.registro.ccatalogoinstitucion = this.CATALOGO_INSTITUCION;
    this.registro.ccatalogocuenta = this.CATALOGO_CUENTA;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable);
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

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  // Fin MANTENIMIENTO *********************

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltroIdentificacion: any = { 'ccatalogo': this.CATALOGO_IDENTIFICACION };
    const consultaIdentificacion = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltroIdentificacion, {});
    consultaIdentificacion.cantidad = 100;
    this.addConsultaCatalogos('TIPOIDENTIFICACION', consultaIdentificacion, this.ltipoidentificacion, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosInstitucion: any = { 'ccatalogo': this.CATALOGO_INSTITUCION };
    const consultaInstitucion = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosInstitucion, {});
    consultaInstitucion.cantidad = 100;
    this.addConsultaCatalogos('TIPOINSTITUCION', consultaInstitucion, this.ltipoinstitucion, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosCuenta: any = { 'ccatalogo': this.CATALOGO_CUENTA };
    const consultaCuenta = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosCuenta, {});
    consultaCuenta.cantidad = 100;
    this.addConsultaCatalogos('TIPOCUENTA', consultaCuenta, this.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
}
