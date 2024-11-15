import { SelectItem } from 'primeng/primeng';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { PolizaComponent } from './_poliza.component';

@Component({
  selector: 'app-pago-seguro',
  templateUrl: 'pagoSeguro.html'
})
export class PagoSeguroComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(PolizaComponent)
  polizaComponent: PolizaComponent;

  public laseguradora: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsPago', 'PAGOSEGURO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    this.polizaComponent.consultar();
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.cpago', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.estaVacio(this.mcampos.caseguradora)) {
      this.mostrarMensajeError("ASEGURADORA ES REQUERIDA");
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.lregistrosbce = [];
    this.rqMantenimiento.mdatos.caseguradora = this.mcampos.caseguradora;
    //super.crearBce(this.registro, null, null, null, this.mcampos.caseguradora, null, null, null, null, this.polizaComponent.mcampos.total, null,null,null,null,null,'P');

    this.polizaComponent.validaRegistros();
    super.addMantenimientoPorAlias(this.polizaComponent.alias, this.polizaComponent.getMantenimiento(1));
    super.grabar(false);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (!this.estaVacio(resp.ccomprobante)) {
      this.mcampos.ccomprobante = resp.ccomprobante;
      this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
      this.recargar();
    }
  }
  // Fin MANTENIMIENTO *********************

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosAseguradora: any = { 'activo': true };
    const consultaAseguradora = new Consulta('TsgsAseguradora', 'Y', 't.nombre', mfiltrosAseguradora, {});
    consultaAseguradora.cantidad = 100;
    this.addConsultaCatalogos('ASEGURADORAS', consultaAseguradora, this.laseguradora, super.llenaListaCatalogo, 'caseguradora');

    this.ejecutarConsultaCatalogos();
  }
}
