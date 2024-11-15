
import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { InversionesServicios } from './../../../../../servicios/_invservicios.service';

@Component({
  selector: 'app-sbs',
  templateUrl: 'sbs.html'
})

export class SbsComponent extends BaseComponent implements OnInit, AfterViewInit {

  public pEditable: number = 0;

  public pTasaclasificacioncdetalle: string = "";

  public lBaseDiasInteres: SelectItem[] = [{ label: '...', value: null }];

  @Input()
  natural: BaseComponent;

  @Input()
  detalle: BaseComponent;

  constructor(router: Router, dtoServicios: DtoServicios, private inversionesServicios: InversionesServicios) {
    super(router, dtoServicios, 'tinvinversion', 'SBS', false, false);
  }

  ngOnInit() {

    this.componentehijo = this;
    super.init();
    this.asignarCatalogoInicial();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    this.registro = [];
    this.asignarCatalogoInicial();
    this.registro.cinversion = 0;
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

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
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

  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lBaseDiasInteres, resp.BASEDIASINTERES, 'cdetalle');
    }
    this.lconsulta = [];
  }


  llenarConsultaCatalogos(): void {

    const mfiltrosBaseDiasInteres: any = { 'ccatalogo': this.registro.basediasinteresccatalogo };
    const consultaBaseDiasInteres = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosBaseDiasInteres, {});
    consultaBaseDiasInteres.cantidad = 50;
    this.addConsultaPorAlias('BASEDIASINTERES', consultaBaseDiasInteres);

  }


  asignarCatalogoInicial() {

    this.registro.basediasinteresccatalogo = 1222;

  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
}
