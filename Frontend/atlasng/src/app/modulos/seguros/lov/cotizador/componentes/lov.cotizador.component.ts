import { Component, OnInit, Output, Input, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-lov-cotizador-seguros',
  templateUrl: 'lov.cotizador.html'
})

export class LovCotizadorSegurosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCotizaSeg = new EventEmitter();

  displayLov = false;
  public ivaporcentaje = 0;
  public lrubros: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'LOVCOTIZADORSEGUROS', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
    this.del = false;
  }

  showDialog() {
    this.displayLov = true;
    this.consultarCatalogos();
  }

  actualizar() {
    this.seleccionaRegistro(this.registro);
  }

  cancelar() {
    this.displayLov = false;
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
  }

  private fijarFiltrosConsulta() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.postQuery(resp);
  }

  // Inicia MANTENIMIENTO *********************
  grabar() {
    // No existe para el padre
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // No existe para el padre
  }
  // Fin MANTENIMIENTO *********************

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosTipoSeguro: any = { verreg: 0, ctiposeguro: this.registro.mdatos.ctiposeguro };
    const conTipoSeguro = new Consulta('TsgsTipoSeguroDetalle', 'Y', 't.nombre', mfiltrosTipoSeguro, {});
    conTipoSeguro.cantidad = 100;
    this.addConsultaCatalogos('TIPOSEGURO', conTipoSeguro, null, this.llenarTipoSeguroDetalle, 'ctiposeguro', this.componentehijo);

    const mfiltrosRub: any = { activo: true, ctiposeguro: this.registro.mdatos.ctiposeguro };
    const conRubSeguro = new Consulta('TsgsTipoSeguroRubros', 'Y', 't.orden', mfiltrosRub, {});
    conRubSeguro.cantidad = 100;
    this.addConsultaCatalogos('RUBROSSEGURO', conRubSeguro, null, this.llenarRubrosSeguro, 'secuencia', this.componentehijo);

    const mfiltrosParam: any = { codigo: 'IVA-SEGUROS' };
    const conParam = new Consulta('TcarParametros', 'N', 't.codigo', mfiltrosParam, {});
    conParam.cantidad = 100;
    this.addConsultaCatalogos('IVASEGUROS', conParam, null, this.llenarPorcentajeIva, 'numero', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  seleccionaRegistro(reg: any) {
    this.eventoCotizaSeg.emit({ registro: reg });
    // para ocultar el dialogo.
    this.displayLov = false;
  }

  public llenarTipoSeguroDetalle(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.mcampos.ntiposeguro = pListaResp[0].nombre;
    this.componentehijo.mcampos.tasa = pListaResp[0].tasa;
    this.componentehijo.calcularPrima();
  }

  public llenarRubrosSeguro(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.lrubros = pListaResp;
    this.componentehijo.calcularPrima();
  }

  public llenarPorcentajeIva(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.ivaporcentaje = pListaResp.numero;
    this.componentehijo.calcularPrima();
  }

  calcularPrima() {
    let totalrubros = 0;

    // Calcula primas
    this.mcampos.primaanual = (this.mcampos.tasa * this.registro.mdatos.monto) / 100;
    this.mcampos.primaprorrata = super.redondear(Number(this.mcampos.primaanual), 2);

    // Calcula rubros
    for (const i in this.lrubros) {
      if (this.lrubros.hasOwnProperty(i)) {
        const reg: any = this.lrubros[i];
        if (reg !== undefined && reg.value !== null) {
          if (reg.esporcentaje) {
            reg.mdatos.valorrubro = (reg.porcentaje * this.mcampos.primaprorrata) / 100;
          }
          if (reg.esvalor) {
            reg.mdatos.valorrubro = (reg.valor * this.mcampos.primaprorrata);
          }
          totalrubros = totalrubros + reg.mdatos.valorrubro;
        }
      }
    }

    // Calcula emision
    if (this.mcampos.primaprorrata <= 0) {
      this.mcampos.emision = 0;
    } else if (this.mcampos.primaprorrata <= 250) {
      this.mcampos.emision = 0.5;
    } else if (this.mcampos.primaprorrata <= 500) {
      this.mcampos.emision = 1;
    } else if (this.mcampos.primaprorrata <= 1000) {
      this.mcampos.emision = 3;
    } else if (this.mcampos.primaprorrata <= 2000) {
      this.mcampos.emision = 5;
    } else if (this.mcampos.primaprorrata <= 4000) {
      this.mcampos.emision = 7;
    } else if (this.mcampos.primaprorrata > 4000) {
      this.mcampos.emision = 9;
    }

    // Calcula subtotal
    this.mcampos.subtotal = super.redondear(Number(this.mcampos.primaprorrata), 2) + super.redondear(Number(totalrubros), 2) + this.mcampos.emision;

    // Calcula IVA
    this.mcampos.iva = super.redondear(Number(this.mcampos.subtotal), 2) * (this.ivaporcentaje / 100);

    // Calcula TOTAL
    this.registro.mdatos.total = super.redondear(Number(this.mcampos.subtotal), 2) + super.redondear(Number(this.mcampos.iva), 2);
  }

}
