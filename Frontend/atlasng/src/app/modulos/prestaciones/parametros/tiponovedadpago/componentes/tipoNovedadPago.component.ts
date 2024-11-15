import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovProveedoresComponent } from '../../../../contabilidad/lov/proveedores/componentes/lov.proveedores.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-tipo-novedad-pago',
  templateUrl: 'tipoNovedadPago.html'
})
export class TipoNovedadPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ltiponovedad: SelectItem[] = [{ label: '...', value: null }];
  public ltiponovedadvalor: SelectItem[] = [{ label: '...', value: null }];
  public ltiponovedadpago: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(LovProveedoresComponent)
  private lovProveedores: LovProveedoresComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tprePago', 'TNOVPAGO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }

    super.crearNuevo();
    this.registro.ccatalogonovedad = 220;
    this.registro.rubrovalorccatalogo=220;
    this.registro.rubropagoccatalogo=220;    
    this.registro.cpersona = this.mfiltros.cpersona;
   
    
  }

  actualizar() {
    super.actualizar();
    // this.registrarEtiqueta(this.registro,this.ltipoliquidacion,'cdetalletipoexp','nliquidacion');
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
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cpersona', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntiponovedad', 't.ccatalogonovedad = i.ccatalogo and t.cdetallenovedad = i.cdetalle');
    //   consulta.addSubquery('tsoctipobaja', 'nombre', 'ntipobaja', 't.ctipobaja = i.ctipobaja');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    // this.mfiltros.ccatalogotipoexp = 2802;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
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
    this.encerarConsultaCatalogos();

    const mfiltroTipoNovedad: any = { 'ccatalogo': 220 };
    const mfiltrosespEstUsr2: any = { 'clegal': 'is null', 'cdetalle': `not in ('21','22')` };
    
    const mfiltrosesrubropago: any = { 'clegal': 'is not null' };

    const conTipoNovedad = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoNovedad, mfiltrosespEstUsr2);
    conTipoNovedad.cantidad = 50;
    this.addConsultaCatalogos('TIPONOVEDAD', conTipoNovedad, this.ltiponovedad, super.llenaListaCatalogo, 'cdetalle');

    const conTipoNovedadpago = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoNovedad, mfiltrosesrubropago);
    conTipoNovedadpago.cantidad = 50;
    this.addConsultaCatalogos('TIPONOVEDADPAGO', conTipoNovedadpago, this.ltiponovedadpago, super.llenaListaCatalogo, 'cdetalle');

    const conTipoNovedadvalor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoNovedad, mfiltrosesrubropago);
    conTipoNovedadvalor.cantidad = 50;
    this.addConsultaCatalogos('TIPONOVEDADVALOR', conTipoNovedadvalor, this.ltiponovedadvalor, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();

  }

  /**Muestra lov de proveedores */
  mostrarLovProveedor(): void {
    this.lovProveedores.showDialog();
  }

  /**Retorno de lov de proveedores. */
  fijarLovProveedoresSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.mcampos.nproveedor = reg.registro.nombre;

      this.consultar();
    }
  }

}
