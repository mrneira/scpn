import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-mayor',
  templateUrl: 'mayor.html'
})
export class MayorComponent extends BaseComponent implements OnInit, AfterViewInit {

  public pConciliacionMayor: any = [];
  public pTotales: any = [];
  public pCcuenta: string;

  @ViewChild('formFiltros') formFiltros: NgForm;

  fecha = new Date();
  public sortO: number = 1;
  public sortF: string = '';

  yearTimeout: any;

  @Output() agregarHojaTrabajoMayorEvent = new EventEmitter();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconconciliacionbancariamayor', 'MAYOR', false, false);
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
  }

  public crearDtoConsulta() {
    const rqConsulta: any = new Object();

    rqConsulta.ccuenta = this.mcampos.ccuenta;
    rqConsulta.CODIGOCONSULTA = 'CONCILIACIONMAYOR';

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod !== 'OK') {
          return;
        }
        this.lregistros = resp.CONCILIACIONMAYOR;
      },
      error => {
        this.dtoServicios.manejoError(error);
      });

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

  agregarhojatrabajo(reg :any) {
    this.selectRegistro(reg);
    this.eliminar();
    this.agregarHojaTrabajoMayorEvent.emit({ registro: reg });
  }

  edit(row: any, index: number) {
    this.encerarMensajes();

    this.lregistros.splice(index, 1);
    let lIndice = this.pConciliacionMayor.length;
    this.pConciliacionMayor.push({
      cconciliacionbancariamayor: row.cconciliacionbancariamayor
    });
    this.pConciliacionMayor[lIndice].mdatos = [];

    this.pConciliacionMayor[lIndice].mdatos.nccomprobante = row.ccomprobante;


    this.pConciliacionMayor[lIndice].mdatos.nfcontable = row.fcontable;
    this.pConciliacionMayor[lIndice].mdatos.nsecuencia = row.secuencia;
    this.pConciliacionMayor[lIndice].mdatos.nfreal = row.freal;
    this.pConciliacionMayor[lIndice].mdatos.ndebito = row.debito;
    this.pConciliacionMayor[lIndice].mdatos.nmonto = row.monto;
    this.pConciliacionMayor[lIndice].mdatos.ncomentario = row.comentario;

    this.pConciliacionMayor[lIndice].estadoconciliacioncdetalleMay = row.estadoconciliacioncdetalle;
    
    this.pConciliacionMayor[lIndice].mdatos.nnumerodocumentobancario = row.numerodocumentobancario;

    this.pConciliacionMayor[lIndice].mdatos.nidentificacion = row.identificacion;

    this.pConciliacionMayor[lIndice].mdatos.nnombre = row.nombre;
    
    this.pConciliacionMayor[lIndice].mdatos.ncredencial = row.credencial;
    
    if (row.debito) {
      this.pTotales[0].mayordebito = this.pTotales[0].mayordebito + row.monto;
    }
    else {
      this.pTotales[0].mayorcredito = this.pTotales[0].mayorcredito + row.monto;

    }


    this.pTotales[0].saldo = this.pTotales[0].mayorcredito -
      this.pTotales[0].mayordebito -
      this.pTotales[0].extdebito + this.pTotales[0].extcredito;
  }

  changeSort(event) {
    if (!event.order) {
      this.sortF = 'mfcontable';
    } else {
      this.sortF = event.field;
    }
}

}
