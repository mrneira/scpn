import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-extracto',
  templateUrl: 'extracto.html'
})
export class ExtractoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public pConciliacionExtracto: any = [];
  public pTotales: any = [];

  fecha = new Date();
  public sortO: number = 1;
  public sortF: string = '';

  @Output() agregarHojaTrabajoExtractoEvent = new EventEmitter();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconconciliacionbancariaeb', 'EXTRACTO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    //super.init(this.formFiltros);
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

  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.fecha', this.mfiltros, {});

    consulta.cantidad = 5000;

    this.addConsulta(consulta);
    return consulta;
  }


  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  agregarhojatrabajo(reg: any) {
    this.selectRegistro(reg);
    this.eliminar();
    this.agregarHojaTrabajoExtractoEvent.emit({ registro: reg });
  }

  edit(row: any, index: number) {
    this.encerarMensajes();
    this.lregistros.splice(index, 1);
    let lIndice = this.pConciliacionExtracto.length;
    this.pConciliacionExtracto.push({
      cconconciliacionbancariaextracto: row.cconconciliacionbancariaextracto
    });
    this.pConciliacionExtracto[lIndice].mdatos = [];
    this.pConciliacionExtracto[lIndice].mdatos.ncuentabancaria = row.cuentabancaria;
    this.pConciliacionExtracto[lIndice].mdatos.nnumerodocumentobancario = row.numerodocumentobancario;
    this.pConciliacionExtracto[lIndice].mdatos.nfecha = row.fecha;
    this.pConciliacionExtracto[lIndice].mdatos.ncredencial = row.credencial;
    this.pConciliacionExtracto[lIndice].mdatos.nidentificacion = row.identificacion;
    this.pConciliacionExtracto[lIndice].mdatos.nnombre = row.nombre;
    this.pConciliacionExtracto[lIndice].mdatos.nvalorcredito = row.valorcredito;
    this.pConciliacionExtracto[lIndice].mdatos.nvalordebito = row.valordebito;
    this.pConciliacionExtracto[lIndice].mdatos.nconcepto = row.concepto;
    this.pConciliacionExtracto[lIndice].mdatos.ninformacion = row.informacion;
    this.pConciliacionExtracto[lIndice].estadoconciliacioncdetalleExt = row.estadoconciliacioncdetalle;

    this.pTotales[0].extdebito = this.pTotales[0].extdebito + row.valordebito;
    this.pTotales[0].extcredito = this.pTotales[0].extcredito + row.valorcredito;
    this.pTotales[0].saldo = this.pTotales[0].mayorcredito -
      this.pTotales[0].mayordebito -
      this.pTotales[0].extdebito + this.pTotales[0].extcredito;

  }

  changeSort(event) {
    if (!event.order) {
      this.sortF = 'fecha';
    } else {
      this.sortF = event.field;
    }
  }
}
