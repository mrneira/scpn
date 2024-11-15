import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { AccordionModule } from 'primeng/primeng';

@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @Output() calcularTotalesEvent = new EventEmitter();
  @Input() valorpagarcxp = 0;

  public linstfinanciera: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  totalDetalleCxp = 0;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcxpmigjudicdetalle', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.valorpagarcxp)){
      super.mostrarMensajeError('SELECCIONE UNA CUENTA POR PAGAR');
      return;
    }
    super.crearNuevo();
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
    this.calcularTotales();
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tpptpartidagasto', 'nombre', 'npartida', 'i.cpartidagasto = t.cpartidagasto');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
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


  crearNuevoRegistro() {
    super.crearnuevoRegistro();
  }


  /**Muestra lov de Partida Gasto */

  /**Retorno de lov de Partida Gasto. */
  fijarLovPartidaGastoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpartidagasto = reg.registro.cpartidagasto;
      this.registro.mdatos.vasignacioninicial = reg.registro.vasignacioninicial;
      this.registro.mdatos.vmodificado = reg.registro.vmodificado;
      this.registro.mdatos.vcodificado = reg.registro.vcodificado;
      this.registro.mdatos.vcomprometido = reg.registro.vcomprometido;
      this.registro.mdatos.vdevengado = reg.registro.vdevengado;
      this.registro.mdatos.vpagado = reg.registro.vpagado;
      this.registro.mdatos.vsaldoporcomprometer = reg.registro.vsaldoporcomprometer;
      this.registro.mdatos.vsaldopordevengar = reg.registro.vsaldopordevengar;
      this.registro.mdatos.vsaldoporpagar = reg.registro.vsaldoporpagar;
      this.registro.mdatos.npartida = reg.registro.nombre;
    }

  }

  consultarCatalogos(): void {
  }

  // cerrarDialogo(): void {
  //   this.calcularTotales();
  // }

  debitoChange(reg: any, index: number, value: boolean) {
    this.cambiarValor();
  }

  cambiarValor(): void {
    this.calcularTotales();
  }

  calcularTotales(): void {
    this.totalDetalleCxp = 0;
    for (const i in this.lregistros) {
      const reg = this.lregistros[i];
      this.totalDetalleCxp += reg.valorpagar;

      if (i === "1"){
        super.mostrarMensajeError('NO PUEDE INGRESAR MAS DE UN BENEFICIARIO');  
      }
    }

    if (this.valorpagarcxp < this.totalDetalleCxp){
      super.mostrarMensajeError('SUMATORIO DE DETALLE DE PAGOS A BENEFICIARIOS ES MAYOR AL VALOR DE LA CUENTA POR PAGAR');
    }
  }


  validarSaldoPorReformar(): void {
    // this.msgs = [];
    // if (this.registro.decremento === true) {
    //   if (this.registro.valor > this.registro.mdatos.vsaldoporcomprometer) {
    //     super.mostrarMensajeError("VALOR NO PUEDE SUPERAR EL SALDO POR COMPROMETER");
    //     this.registro.valor = undefined;
    //     return;
    //   }
    // }
  }

  cerrarDialogo() {
    this.registro.mdatos.nbancocdetalle = this.linstfinanciera.find(x => x.value === this.registro.tipoinstitucioncdetalle).label;
    this.registro.mdatos.ntipocuentacdetalle = this.ltipocuenta.find(x => x.value === this.registro.tipocuentacdetalle).label;
    this.calcularTotales();
  }

  // calcularTotales(): void {
  //   this.totaldecremento = 0;
  //   this.totalincremento = 0;
  //   for (const i in this.lregistros) {
  //     const reg = this.lregistros[i];
  //     if (reg.decremento) {
  //       this.totaldecremento += reg.valor;
  //     } else {
  //       this.totalincremento += reg.valor;
  //     }
  //   }
  // }

  // validarSaldoCXP(): void {
  //   this.msgs = [];
  //   if (this.registro.decremento === true) {
  //     if (this.registro.valor > this.registro.mdatos.vsaldoporcomprometer) {
  //       super.mostrarMensajeError("VALOR NO PUEDE SUPERAR EL SALDO POR COMPROMETER");
  //       this.registro.valor = undefined;
  //       return;
  //     }
  //   }
  // }
}
