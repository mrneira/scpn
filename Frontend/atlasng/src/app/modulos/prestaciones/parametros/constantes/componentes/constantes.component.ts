import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-constantes',
  templateUrl: 'constantes.html'
})
export class ConstantesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public ljerarquia: SelectItem[] = [{ label: '...', value: null }];
  

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpreconstantes', 'CONSTANTES', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.mcampos.jerarquia = true;
    //this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    super.crearNuevo();
    this.registro.verreg = 0;
    this.registro.optlock = 0;
    this.registro.ccatalogojerarquia = 2701;
    this.registro.cdetallejerarquia = this.mfiltros.cdetallejerarquia;
    if (this.registro.cdetallejerarquia != 'OFI') {
      this.registro.cons8 = 0;
      this.registro.cons9 = 0;
    }
  }

  actualizar() {
    super.actualizar();
    super.registrarEtiqueta(this.registro, this.ljerarquia, 'cdetallejerarquia', 'njerarquia');
    this.grabar();

  }

  eliminar() {
    super.eliminar();
    this.grabar();
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.anio desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'njerarquia', 'i.ccatalogo = t.ccatalogojerarquia and i.cdetalle = t.cdetallejerarquia');
    consulta.cantidad = 10;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
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
    const mfiltrosEstUsr: any = { 'ccatalogo': 2701 };
    const consultaAccion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaAccion.cantidad = 50;
    this.addConsultaPorAlias('ACCION', consultaAccion);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ljerarquia, resp.ACCION, 'cdetalle');
    }
    this.lconsulta = [];
  }

  mostrar(event: any): any {
    if (this.registro.cdetallejerarquia === null || this.registro.cdetallejerarquia === undefined) {
      return;
    }
    this.mfiltros.cdetallejerarquia = this.registro.cdetallejerarquia;
    if (this.registro.cdetallejerarquia === 'OFI') {
      this.mcampos.jerarquia = true;
    }else{
      this.mcampos.jerarquia = false;
    }
    this.consultar();
  }
}
