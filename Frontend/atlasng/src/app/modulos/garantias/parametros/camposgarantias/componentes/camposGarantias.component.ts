import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovCatalogosDetalleComponent } from '../../../../generales/lov/catalogosdetalle/componentes/lov.catalogosDetalle.component';
import { SelectItem } from 'primeng/primeng';
import { LovCatalogosComponent } from '../../../../generales/lov/catalogos/componentes/lov.catalogos.component';

@Component({
  selector: 'app-tipo-gar-campo',
  templateUrl: 'camposGarantias.html'
})
export class CamposGarantiasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovCatalogosDetalleComponent)
  private lovCatalogosDetalle: LovCatalogosDetalleComponent;

  @ViewChild(LovCatalogosComponent)
  private lovCatalogos: LovCatalogosComponent;

  public ltipogarantia: SelectItem[] = [{ label: '...', value: null }];
  public ltipobientotal = [];
  public ltipobien: SelectItem[] = [{ label: '...', value: null }];
  public lcampos: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgarTipoBienCampo', 'TIPOBIENCAMPO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();

    this.lovCatalogosDetalle.mdesabilitaFiltros['ccatalogo'] = true;
    this.lovCatalogosDetalle.mfiltros.ccatalogo = 6;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.ctipogarantia)) {
      this.mostrarMensajeError('TIPO DE GARANTÍA REQUERIDA');
      return;
    }
    if (this.estaVacio(this.mfiltros.ctipobien)) {
      this.mostrarMensajeError('TIPO DE BIEN REQUERIDO');
      return;
    }
    super.crearNuevo();
    this.registro.ctipogarantia = this.mfiltros.ctipogarantia;
    this.registro.ctipobien = this.mfiltros.ctipobien;
    this.registrarEtiqueta(this.registro, this.ltipogarantia, 'ctipogarantia', 'ntipogar');
    this.registrarEtiqueta(this.registro, this.ltipobien, 'ctipobien', 'ntipobien');
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.orden', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgarTipoGarantia', 'nombre', 'ntipogar', 'i.ctipogarantia = t.ctipogarantia');
    consulta.addSubquery('TgarTipoBien', 'nombre', 'ntipobien', 'i.ctipogarantia = t.ctipogarantia and i.ctipobien = t.ctipobien');
    consulta.addSubquery('TgenCatalogo', 'nombre', 'ncatalogo', 'i.ccatalogo = t.ccatalogo');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipodato', 'i.ccatalogo = t.tipodatoccatalogo and i.cdetalle = t.tipodatocdetalle');

    consulta.cantidad = 30;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
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

  /**Muestra lov de catalogos detalle */
  mostrarLovTipodato(): void {
    this.lovCatalogosDetalle.consultar();
    this.lovCatalogosDetalle.showDialog();
  }

  /**Retorno de lov de catalogos detalle */
  fijarLovTipodatoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.tipodatoccatalogo = reg.registro.ccatalogo;
      this.registro.tipodatocdetalle = reg.registro.cdetalle;
      this.registro.mdatos.ntipodato = reg.registro.nombre;
      if (this.registro.tipodatocdetalle !== 5) {
        this.registro.ccatalogo = null;
        this.registro.mdatos.ncatalogo = null;
        this.registro.longitud = null;
      }
    }
  }

  /**Muestra lov de catalogos */
  mostrarLovCatalogos(): void {
    this.lovCatalogos.mfiltros.cmodulo = sessionStorage.getItem('m');
    this.lovCatalogos.showDialog();
    this.lovCatalogos.consultar();
  }

  /**Retorno de lov de catalogos. */
  fijarLovCatalogosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccatalogo = reg.registro.ccatalogo;
      this.registro.mdatos.ncatalogo = reg.registro.nombre;
    }
  }

  cambiaTipoGarantia() {
    this.llenatipoBien(this.mfiltros.ctipogarantia);
  }

  llenatipoBien(ctipogarantia: string) {
    super.limpiaLista(this.ltipobien);

    if (this.estaVacio(ctipogarantia)) {
      this.ltipobien.push({ label: '...', value: null });
      return;
    }

    for (const i in this.ltipobientotal) {
      if (this.ltipobientotal.hasOwnProperty(i) && this.ltipobientotal[i].ctipogarantia === ctipogarantia) {
        this.ltipobien.push({ label: this.ltipobientotal[i].nombre, value: this.ltipobientotal[i].ctipobien });
      }
    }

    if (this.estaVacio(this.ltipobien)) {
      this.mfiltros.ctipobien = null;
      this.ltipobien.push({ label: '...', value: null });
    } else {
      this.mfiltros.ctipobien = this.ltipobien[0].value;
    }

    this.consultar();
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const consultaTipogar = new Consulta('TgarTipoGarantia', 'Y', 't.nombre', null, null);
    consultaTipogar.cantidad = 50;
    this.addConsultaCatalogos('TIPOGAR', consultaTipogar, this.ltipogarantia, this.llenaListaGar, 'ctipogarantia', this.componentehijo);

    const consultaTipoBean = new Consulta('TgarTipoBien', 'Y', 't.nombre', null, null);
    consultaTipoBean.cantidad = 50;
    this.addConsultaCatalogos('TIPOBIEN', consultaTipoBean, null, this.llenaListaTipoBien, 'ctipobien', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenaListaGar(pLista: any, pListaResp, campopk = 'pk', agregaRegistroVacio = true, componentehijo = null): any {
    super.llenaListaCatalogo(pLista, pListaResp, campopk, agregaRegistroVacio, componentehijo);
  }

  public llenaListaTipoBien(pLista: any, pListaResp, campopk = 'pk', agregaRegistroVacio = true, componentehijo = null): any {
    componentehijo.ltipobientotal = pListaResp;
    componentehijo.llenatipoBien(componentehijo.mfiltros.ctipogarantia);
  }

}
