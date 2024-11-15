import { SelectItem } from 'primeng/primeng';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-consulta-pago',
  templateUrl: 'consultaPago.html'
})
export class ConsultaPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public laseguradora: SelectItem[] = [{ label: '...', value: null }];
  public lpagos: SelectItem[] = [{ label: '...', value: null }];
  public lpagostotal: any = [];
  public pago;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsPoliza', 'POLIZASPAGO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.fingreso', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TsgsTipoSeguroDetalle', 'nombre', 'ntiposeguro', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    consulta.addSubqueryPorSentencia('SELECT p.identificacion FROM tcaroperacion o, tperpersonadetalle p WHERE o.cpersona = p.cpersona AND p.verreg = 0 AND o.coperacion = t.coperacioncartera', 'identificacion');
    consulta.addSubqueryPorSentencia('SELECT p.nombre FROM tcaroperacion o, tperpersonadetalle p WHERE o.cpersona = p.cpersona AND p.verreg = 0 AND o.coperacion = t.coperacioncartera', 'npersona');
    consulta.cantidad = 50000;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (resp.cod === "OK") {
      this.getTotal(resp.POLIZASPAGO)
    }
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  public postCommit(resp: any) {
  }
  // Fin MANTENIMIENTO *********************

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosAseguradora: any = { 'activo': true };
    const consultaAseguradora = new Consulta('TsgsAseguradora', 'Y', 't.nombre', mfiltrosAseguradora, {});
    consultaAseguradora.cantidad = 1000;
    this.addConsultaCatalogos('ASEGURADORAS', consultaAseguradora, this.laseguradora, super.llenaListaCatalogo, 'caseguradora');

    const consultaPagos = new Consulta('TsgsPago', 'Y', 't.freal', {}, {});
    consultaPagos.addSubquery("TconComprobante", "numerocomprobantecesantia", "numerocomprobantecesantia", "t.numeroreferencia = i.ccomprobante");
    consultaPagos.cantidad = 50000;
    this.addConsultaCatalogos('PAGOS', consultaPagos, this.lpagostotal, this.llenarPagos, '', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarPagos(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.lpagostotal = pListaResp;
  }

  cambiarAseguradora(event: any): any {
    if (this.estaVacio(this.mcampos.caseguradora)) {
      this.lpagos = [];
      this.lpagos.push({ label: '...', value: null });
      return;
    }
    this.fijarListaPagos(Number(event.value));
  }

  fijarListaPagos(caseguradora: any) {
    this.lpagos = [];
    this.lpagos.push({ label: '...', value: null });
    this.registro.ctipoproducto = null;

    for (const i in this.lpagostotal) {
      if (this.lpagostotal.hasOwnProperty(i)) {
        const reg: any = this.lpagostotal[i];
        if (reg !== undefined && reg.value !== null && reg.caseguradora === Number(caseguradora)) {
          this.lpagos.push({ label: ' ' + reg.cpago + ' - [' + this.calendarToFechaString(new Date(reg.freal)) + ']', value: reg });
        }
      }
    }
  }

  cambiarPago(event: any): any {
    if (this.estaVacio(event.value.cpago)) {
      return;
    }
    this.mfiltros.cpago = event.value.cpago;
    this.mcampos.ccomprobante = event.value.numeroreferencia;
    this.mcampos.numerocomprobantecesantia = event.value.mdatos.numerocomprobantecesantia;
    this.consultar();
  }

  getTotal(lista: any) {
    this.mcampos.total = 0;
    for (const i in lista) {
      if (lista.hasOwnProperty(i)) {
        const reg: any = lista[i];
        this.mcampos.total = super.redondear(this.mcampos.total + reg.valorprima, 2);
      }
    }
  }
}
