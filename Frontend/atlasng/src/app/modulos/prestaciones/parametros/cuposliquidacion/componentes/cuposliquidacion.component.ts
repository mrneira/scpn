import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';

@Component({
  selector: 'app-cupos-liquidacion',
  templateUrl: 'cuposliquidacion.html'
})
export class CuposLiquidacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tprecuposliquidacion', 'CUPOS', false, true);
    this.componentehijo = this;
  }

  private catalogoDetalle: CatalogoDetalleComponent;
  public ltipojerarquiacdetalle: SelectItem[] = [{ label: '...', value: null }];
  public ltipocupocdetalle: SelectItem[] = [{ label: '...', value: null }];

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.cuposusado = 0;
    this.registro.tipocupoccatalogo = 2802;
    this.registro.tipojerarquiaccatalogo = 2701;
    //this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso= this.fechaactual;
    
  }

  actualizar() {
    super.actualizar();
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
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo = t.tipocupoccatalogo and i.cdetalle = t.tipocupocdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'njerarquia', 'i.ccatalogo = t.tipojerarquiaccatalogo and i.cdetalle = t.tipojerarquiacdetalle');
    
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
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 2701;
    const conTipoJerarquia = this.catalogoDetalle.crearDtoConsulta();
    conTipoJerarquia.cantidad = 20;
    this.addConsultaCatalogos('TIPOJERARQUIA', conTipoJerarquia, this.ltipojerarquiacdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 2802;
    const conTipoCupo = this.catalogoDetalle.crearDtoConsulta();
    conTipoCupo.cantidad = 20;
    this.addConsultaCatalogos('TIPOCUPO', conTipoCupo, this.ltipocupocdetalle, super.llenaListaCatalogo, 'cdetalle');
 
    this.ejecutarConsultaCatalogos();
  }

  cerrarDialogo(): void{

  }
}
