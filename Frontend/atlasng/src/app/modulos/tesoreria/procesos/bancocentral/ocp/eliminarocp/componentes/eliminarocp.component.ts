import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../../../util/componentes/jasper/componentes/jasper.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-eliminarocp',
  templateUrl: 'eliminarocp.html'
})
export class EliminarOcpComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lreferenciapagos: SelectItem[] = [{ label: '...', value: null }];
  public lreferenciapagostotal: any[];
  public lreferenciaactual: any[];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttestransaccion', 'ELIMINARBCE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.componentehijo.grabar.false;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    //this.fijarListaAgencias();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {
    if (!this.validaFiltrosConsulta()) {
      return;

    }
    this.crearDtoConsulta();
    super.consultar();
    //this.consultarDocumentos();
    //super.consultar();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const mfiltrosMod: any= {estado: 2, tipotransaccion: 'C'};
    const conReferenciasPagos = new Consulta('ttesenvioarchivo', 'Y', 't.numeroreferencia', mfiltrosMod, {});
    conReferenciasPagos.cantidad = 100;
    this.addConsultaCatalogos('REFERENCIAPAGOS', conReferenciasPagos, this.lreferenciapagostotal, this.llenarReferencias, '', this.componentehijo);


    this.ejecutarConsultaCatalogos();
  }

  public llenarReferencias(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.lreferenciapagostotal = pListaResp;
    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg: any = pListaResp[i];
        if (!this.componentehijo.estaVacio(reg)) {
          this.componentehijo.lreferenciapagos.push({ label: ' ' + reg.numeroreferencia + ' - [' + this.componentehijo.calendarToFechaString(new Date(reg.fingreso)) + ']', value: reg.numeroreferencia });
        }
      }
    }
  }

  //MÉTODO PARA CONSULTAR DATOS DEL DOCUMENTOS AUTORIZADOS -- COMPONENTE DE CONSULTA
  grabar(): void {
    if (!this.validaFiltrosConsulta()) {
      return;}
    this.RegistrosEliminar();
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.observacion= this.mcampos.observacion;
    this.rqMantenimiento.mdatos.tipotransaccion  = 'C';
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    this.crearDtoMantenimiento();
    super.grabar();

  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.recargar();
    }
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    this.mfiltros.verreg = 0;
    this.mfiltros.cestado = 2;
    this.mfiltros.tipotransaccion = 'C';
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctestransaccion', this.mfiltros, {});
    consulta.addSubquery('tgenmodulo', 'nombre', 'modulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'institucion', 'i.ccatalogo = t.institucionccatalogo and i.cdetalle = t.institucioncdetalle ');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'tipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle ');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    //  this.mfiltros.activo = 0;
  }

  cambiarReferenciaPago(event: any): any {
    if (this.estaVacio(this.mfiltros.numeroreferencia)) {
      return;
    }
    this.lreferenciaactual = this.lreferenciapagostotal.find(x => x.numeroreferencia === (event.value));
    this.rqMantenimiento.mdatos.numeroreferencia= event.value;
    this.consultar();
  }

  RegistrosEliminar() {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        reg.mdatos.eliminar = true;
      }
    }
  }

  eliminarLote() {
    if (!this.validaFiltrosConsulta()) {
      return;}
    this.grabar();
  }

  
}
