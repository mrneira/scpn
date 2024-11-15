import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-reporte-conciliacion-seguros',
  templateUrl: 'conciliacionSeguros.html'
})
export class ConciliacionSegurosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public ltiposeguro: SelectItem[] = [{ label: '...', value: null }];
  public laseguradora: SelectItem[] = [{ label: '...', value: null }];
  public lproducto: SelectItem[] = [{ label: '...', value: null }];
  public lpagos: SelectItem[] = [{ label: '...', value: null }];
  public lpagostotal: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CONCILIACIONSEGUROS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  imprimir(): void {

    if ((this.mcampos.finicio != null && this.mcampos.ffin == null) || (this.mcampos.finicio == undefined && this.mcampos.ffin == undefined) || (this.mcampos.finicio == null && this.mcampos.ffin != null) || (this.mcampos.finicio > this.mcampos.ffin)) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
      return;
    }

    if(this.mfiltros.cpago === null || this.mfiltros.cpago === undefined){
      this.mfiltros.cpago = -1;
    }
    if(this.mcampos.cproducto === null || this.mcampos.cproducto === undefined){
      this.mcampos.cproducto = -1;
    }


    this.jasper.nombreArchivo = 'ReporteConciliacionSeguros-' + this.dtoServicios.mradicacion.fcontable;
    this.jasper.parametros['@i_producto'] = this.mcampos.cproducto;
    this.jasper.parametros['@i_cpado'] = this.mfiltros.cpago;
    this.jasper.parametros['@i_finicio'] = this.fechaToInteger(this.mcampos.finicio);
    this.jasper.parametros['@i_ffin'] = this.fechaToInteger(this.mcampos.ffin);
    this.jasper.formatoexportar = 'xls';
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Seguros/rptSgsConciliacion';

    this.jasper.generaReporteCore();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
  
    const mfiltrosproducto: any = { cmodulo: 7 };
    const conProducto = new Consulta('tGenProducto', 'Y', 't.nombre', mfiltrosproducto, {});
    conProducto.cantidad = 100;
    this.addConsultaCatalogos('PRODUCTO', conProducto, this.lproducto, super.llenaListaCatalogo, 'cproducto');

    const mfiltrosAseguradora: any = { 'activo': true };
    const consultaAseguradora = new Consulta('TsgsAseguradora', 'Y', 't.nombre', mfiltrosAseguradora, {});
    consultaAseguradora.cantidad = 100;
    this.addConsultaCatalogos('ASEGURADORAS', consultaAseguradora, this.laseguradora, super.llenaListaCatalogo, 'caseguradora');

    const consultaPagos = new Consulta('TsgsPago', 'Y', 't.freal', {}, {});
    consultaPagos.cantidad = 100;
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
          this.lpagos.push({ label: ' ' + reg.cpago + ' - [' + this.calendarToFechaString(new Date(reg.freal)) + ']', value: reg.cpago });
        }
      }
    }
  }

  cambiarPago(event: any): any {
    if (this.estaVacio(this.mfiltros.cpago)) {
      return;
    }
    this.consultar();
  }

}

