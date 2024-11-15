import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCatalogosDetalleComponent } from '../../../../../generales/lov/catalogosdetalle/componentes/lov.catalogosDetalle.component';

@Component({
  selector: 'app-datosRe',
  template: `<app-lov-catalogos-detalle (eventoCliente)=fijarLovCatalogosSelec($event)></app-lov-catalogos-detalle>`
})
export class CamposGarComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovCatalogosDetalleComponent)
  private lovCatalogosDetalle: LovCatalogosDetalleComponent;

  public lclasecredito: SelectItem[] = [{ label: '...', value: null }];

  public regcatalogoselect: any = null;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgarOperacionInfAdicional', 'TGAROPERACIONINFADICIONAL', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();

    this.camposdinamicos = true;
    this.mcampos.camposfecha.valor = null;
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

  // Inicia CONSULTA *********************
  consultar() {
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.orden', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ncatalogo', 'i.ccatalogo = t.valorccatalogo and i.cdetalle = t.valorcdetalle');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    if (this.estaVacio(this.lregistros)) {
      this.consultarCamposParametros();
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[DATOS GENERAL]');
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }

  public consultarCamposParametros() {
    if (this.estaVacio(this.mcampos.ctipogarantia)) {
      return;
    }

    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');
    const rqConsulta: any = new Object();
    rqConsulta.CODMODULOORIGEN = cmoduloorg;
    rqConsulta.CODTRANSACCIONORIGEN = ctransaccionorg;
    rqConsulta.CODIGOCONSULTA = 'CONSULTAGARCAMPOS';
    rqConsulta.ctipogarantia = this.mcampos.ctipogarantia;
    rqConsulta.ctipobien = this.mcampos.ctipobien;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod !== 'OK') {
            return;
          }
          this.manejaRespuestaCampos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  public manejaRespuestaCampos(resp: any) {
    while (this.lregistros.length > 0) {
      this.selectRegistro(this.lregistros.pop());
      this.eliminar();
    }

    const lcampos = resp.lcampos;
    for (const i in lcampos) {
      if (lcampos.hasOwnProperty(i)) {
        const item = lcampos[i];
        this.crearNuevo();
        this.registro.ccampo = item.ccampo;
        this.registro.tipodatoccatalogo = item.tipodatoccatalogo;
        this.registro.tipodatocdetalle = item.tipodatocdetalle;
        this.registro.nombre = item.nombre;
        this.registro.longitud = item.longitud;
        this.registro.requerido = item.requerido;
        this.registro.valorccatalogo = item.ccatalogo;
        this.registro.orden = item.orden;
        this.selectRegistro(this.registro);
        this.actualizar();
      }
    }
  }

  /**Muestra lov de catalogos detalle */
  mostrarLovCatalogos(reg: any): void {
    this.regcatalogoselect = reg;
    this.lovCatalogosDetalle.mdesabilitaFiltros['ccatalogo'] = true;
    this.lovCatalogosDetalle.mfiltros.ccatalogo = this.regcatalogoselect.valorccatalogo;

    this.lovCatalogosDetalle.consultar();
    this.lovCatalogosDetalle.showDialog();
  }

  /**Retorno de lov de catalogos detalle */
  fijarLovCatalogosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.regcatalogoselect.valorccatalogo = reg.registro.ccatalogo;
      this.regcatalogoselect.valorcdetalle = reg.registro.cdetalle;
      this.regcatalogoselect.mdatos.ncatalogo = reg.registro.nombre;
    }
  }

}
