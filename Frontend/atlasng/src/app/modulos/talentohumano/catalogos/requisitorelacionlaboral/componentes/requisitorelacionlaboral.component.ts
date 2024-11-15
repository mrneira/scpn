import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovTipoRelacionLaboralComponent } from '../../../lov/tiporelacionlaboral/componentes/lov.tiporelacionlaboral.component';

@Component({
  selector: 'app-requisitorelacionlaboral',
  templateUrl: 'requisitorelacionlaboral.html'
})
export class RequisitoRelacionLaboralComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovTipoRelacionLaboralComponent)
  private lovTipoRelacionLaboral: LovTipoRelacionLaboralComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthrequisitorelacionlaboral', 'REQUISITORELACIONLABORAL', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.crearNuevo();
    this.registro.ctiporelacionlaboral = this.mfiltros.ctiporelacionlaboral;
    this.registro.documentoccatalogo = 1104;
    this.registro.obligatorio=false;
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
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.crequisitorelacionlaboral', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'dcatalogo', 'i.ccatalogo = t.documentoccatalogo and i.cdetalle = t.documentocdetalle');

    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
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

  llenarConsultaCatalogos(): void {
    const mfiltrosDocumentoCatalogo: any = { 'ccatalogo': 1104 };
    const consultaDocumentoCatalogo = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosDocumentoCatalogo, {});
    consultaDocumentoCatalogo.cantidad = 50;
    this.addConsultaPorAlias('DOCUMENTOCATALOGO', consultaDocumentoCatalogo);
  }

  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ltipo, resp.DOCUMENTOCATALOGO, 'cdetalle');

    }
    this.lconsulta = [];
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }
  mostrarLovTipoRelacionLaboral(): void {
    this.lovTipoRelacionLaboral.showDialog();
  }

  /**Retorno de lov de tipos de relacionlaboral. */
  fijarLovTipoRelacionLaboral(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.ctiporelacionlaboral = reg.registro.ctiporelacionlaboral;
      this.mcampos.nrelacionlaboral = reg.registro.nombre;
      this.consultar();
    }
  }
}
