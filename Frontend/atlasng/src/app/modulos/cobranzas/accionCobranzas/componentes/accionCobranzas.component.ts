import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-accion-cobranzas',
  templateUrl: 'accionCobranzas.html'
})
export class AccionCobranzasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public laccion: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcobaccion', 'ACCIONES', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.mfiltros.cdetalletipoaccion === null || this.mfiltros.cdetalletipoaccion === undefined) {
      super.mostrarMensajeError("FILTRO DE CONSULTA REQUERIDO");
      return;
    }
    super.crearNuevo();
    this.registro.veractual = 0;
    this.registro.optlock = 0;
    this.registro.ccatalogotipoaccion = 800;
    this.registro.estado = false;
    this.registro.enviocorreo = false;
    this.registro.cdetalletipoaccion = this.mfiltros.cdetalletipoaccion;
  }

  actualizar() {
    super.actualizar();
    super.registrarEtiqueta(this.registro, this.laccion, 'cdetalletipoaccion', 'ntipoaccion');

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
    const consulta = new Consulta(this.entityBean, 'Y', 't.caccion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntipoaccion', 'i.ccatalogo = t.ccatalogotipoaccion and i.cdetalle = t.cdetalletipoaccion');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
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
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosEstUsr: any = { 'ccatalogo': 800 };
    const consultaAccion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaAccion.cantidad = 50;
    this.addConsultaPorAlias('ACCION', consultaAccion);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.laccion, resp.ACCION, 'cdetalle');
    }
    this.lconsulta = [];
  }

  mostrar(event: any): any {
    if (this.registro.cdetalletipoaccion === null || this.registro.cdetalletipoaccion === undefined) {
      return;
    }
    this.mfiltros.cdetalletipoaccion = this.registro.cdetalletipoaccion;
    this.consultar();
  }
}
