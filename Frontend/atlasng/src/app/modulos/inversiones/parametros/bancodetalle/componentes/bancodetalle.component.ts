
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
  selector: 'app-bancodetalle',
  templateUrl: 'bancodetalle.html'
})
export class BancodetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  fecha = new Date();


  @ViewChild('formFiltros') formFiltros: NgForm;

  public lBanco: SelectItem[] = [{ label: '...', value: null }];

  private catalogoDetalle: CatalogoDetalleComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
   
    super(router, dtoServicios, 'tinvbancodetalle', 'BANCODETALLE', false, false);
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
      this.registro.bancoccatalogo = 305;
      this.registro.fingreso = this.fecha;
      this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;


  }

  actualizar() {

    this.registro.bancoccatalogo = 305;

    this.registro.fmodificacion = this.fecha;
    this.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;

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
    this.lregistros = [];
      this.crearDtoConsulta();
      super.consultar();
  }

  public crearDtoConsulta(): Consulta {

    this.mfiltros.bancoccatalogo = 305;

    

    const consulta = new Consulta(this.entityBean, 'Y', 't.bancocdetalle', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nBanco', ' t.bancoccatalogo = i.ccatalogo and t.bancocdetalle = i.cdetalle');

    consulta.cantidad = 10;

    this.addConsulta(consulta);
    return consulta;
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
   
    const mfiltrosrubro = { 'ccatalogo': 305,'activo': true };
    const consEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosrubro, {});
    consEmisor.cantidad = 1000000;
    this.addConsultaPorAlias('BANCO', consEmisor);

    this.ejecutarConsultaCatalogos();
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lBanco, resp.BANCO, 'cdetalle');
    }
    this.lconsulta = [];
  }


  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

  }


  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);

  }

  private fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return true;
    
  }


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


}
