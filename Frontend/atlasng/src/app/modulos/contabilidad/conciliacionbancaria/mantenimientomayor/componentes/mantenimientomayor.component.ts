import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-mantenimientomayor',
  templateUrl: 'mantenimientomayor.html'
})
export class MantenimientomayorComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  public editable = true;
  fecha = new Date();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcomprobantedetalle', 'MAYOR', false, false);

    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.editable = true;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
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

  consultar() {
    if (this.mcampos.ccuenta != undefined && this.mcampos.fechainicial != undefined && this.mcampos.fechafinal != undefined) {


      if (this.mcampos.fechafinal < this.mcampos.fechainicial) {
        this.mostrarMensajeError("LA FECHA FINAL DEBE SER IGUAL O MAYOR A LA FECHA INICIAL");
        return;
      }

      this.crearDtoConsulta();
      super.consultar();
    }
  }

  public crearDtoConsulta(): Consulta {

    let lstrTipoPersona: string = "'PE'";

    let lfechainicial: number = (this.mcampos.fechainicial.getFullYear() * 10000) + ((this.mcampos.fechainicial.getMonth() + 1) * 100) + this.mcampos.fechainicial.getDate();
    let lfechafinal: number = (this.mcampos.fechafinal.getFullYear() * 10000) + ((this.mcampos.fechafinal.getMonth() + 1) * 100) + this.mcampos.fechafinal.getDate();
    this.mfiltrosesp.ccuenta = " = '" + this.mcampos.ccuenta + "' ";
    this.mfiltrosesp.fcontable = ' between ' + lfechainicial + ' and ' + lfechafinal + ' ';
    this.mfiltrosesp.ccomprobante = ' not in (select c.ccomprobante from tconcomprobante c where c.anulado = 1 or c.eliminado = 1 union select d.ccomprobanteanulacion from tconcomprobante d where d.ccomprobanteanulacion is not null) ';
    const consulta = new Consulta(this.entityBean, 'Y', 't.fcontable', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconcomprobante', 'numerodocumentobancario', 'nnumerodocumentobancario', 'i.ccomprobante = t.ccomprobante and i.fcontable = t.fcontable and i.ccompania = t.ccompania and i.particion = t.particion');
    consulta.addSubqueryPorSentencia(' select (year(j.freal) * 10000) + (month(j.freal) * 100) + day(j.freal) from tconcomprobante j where j.ccomprobante = t.ccomprobante ', 'freal');
    consulta.addSubqueryPorSentencia('select case when tcc.tipopersona = ' + lstrTipoPersona + ' then (select tsocces.identificacion from tperpersonadetalle tsocces where tsocces.cpersona = tcc.cpersonarecibido and tsocces.verreg = 0 and tsocces.ccompania = tcc.ccompania) when tcc.tipopersona is not null then (select tsocces.identificacion from tperproveedor tsocces where tsocces.cpersona = tcc.cpersonarecibido and tsocces.verreg = 0 and tsocces.ccompania = tcc.ccompania) else null end from tconcomprobante tcc where tcc.ccomprobante = t.ccomprobante and tcc.fcontable = t.fcontable and tcc.ccompania = t.ccompania and tcc.particion = t.particion', 'ncedula');
    consulta.addSubqueryPorSentencia('select case when tcc.tipopersona = ' + lstrTipoPersona + ' then (select tsocces.nombre from tperpersonadetalle tsocces where tsocces.cpersona = tcc.cpersonarecibido and tsocces.verreg = 0 and tsocces.ccompania = tcc.ccompania) when tcc.tipopersona is not null then (select tsocces.nombre from tperproveedor tsocces where tsocces.cpersona = tcc.cpersonarecibido and tsocces.verreg = 0 and tsocces.ccompania = tcc.ccompania) else null end from tconcomprobante tcc where tcc.ccomprobante = t.ccomprobante and tcc.fcontable = t.fcontable and tcc.ccompania = t.ccompania and tcc.particion = t.particion', 'nnombre');
    consulta.addSubqueryPorSentencia('select tsocces.credencial from tconcomprobante tcc inner join (select cpersona, ccompania, credencial from tsoccesantia where verreg = 0) tsocces on tsocces.cpersona = tcc.cpersonarecibido and tsocces.ccompania = tcc.ccompania where tcc.ccomprobante = t.ccomprobante and tcc.fcontable = t.fcontable and tcc.ccompania = t.ccompania and tcc.particion = t.particion and tcc.tipopersona = ' + lstrTipoPersona, 'ncredencial');
    consulta.addSubquery('tconcomprobante', 'comentario', 'comentario', 'i.ccomprobante = t.ccomprobante and i.fcontable = t.fcontable and i.ccompania = t.ccompania and i.particion = t.particion');
    this.addConsulta(consulta);

    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  grabar(): void {
    this.lmantenimiento = []; 
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

  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true); 
  }

  /**Retorno de lov de cuantas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {

    if (reg.registro !== undefined) {

      this.msgs = [];
      this.mcampos.ccuenta = reg.registro.ccuenta;
      this.mcampos.ncuenta = reg.registro.nombre;
      this.consultar();

    }
  }
}
