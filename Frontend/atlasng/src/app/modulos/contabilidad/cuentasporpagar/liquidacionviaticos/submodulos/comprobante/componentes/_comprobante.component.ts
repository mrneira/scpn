import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';


@Component({
  selector: 'app-comprobante',
  templateUrl: '_comprobante.html'
})
export class ComprobanteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  //public fcontable: string;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconliquidaciongastos', 'CABECERA', true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.crearNuevo();
    //this.mcampos.camposfecha.fcontable = null;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.registro.estadoccatalogo = 1032;
    this.registro.centrocostosccatalogo = 1002;
    this.registro.estadocdetalle = "INGRES";
    this.registro.numeroviaticos = 0;
    this.registro.valorpordia = 0;
    this.registro.valortotal = 0;
    this.registro.valordocrespaldo = 0;
    this.registro.valor30 = 0;
    this.registro.valor70 = 0;
    this.registro.valortransporte = 0;
    this.registro.valorpagar = 0;
    this.registro.ruteopresupuesto = true;
    this.registro.optlock = 0;
    this.registro.ccompromiso = "";
    this.registro.tipoinstitucionccatalogo = 305;
    this.registro.tipocuentaccatalogo = 306;
  }

  actualizar() {
    if (this.registro.padre === undefined) {
      this.registro.padre = this.mfiltros.padre;
    }
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

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cliquidaciongastos', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tperpersonadetalle','nombre','nbeneficiario','t.cpersona = i.cpersona and i.verreg = 0');
    consulta.addSubquery('tperpersonadetalle','identificacion','nidentificacionbeneficiario','t.cpersona = i.cpersona and i.verreg = 0')
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
      this.mfiltrosesp.estadocdetalle = 'not in(\'ELIMIN\')';      
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

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }
}
