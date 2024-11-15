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
import { DocumentoDirective } from '../../../../../../../util/directivas/documento.directive';

@Component({
  selector: 'app-agregarpagospi',
  templateUrl: 'agregarpagospi.html'
})
export class AgregarPagoSpiComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public linstitucion: SelectItem[] = [{ label: '...', value: null }];
  public ltipoidentificacion: SelectItem[] = [{ label: '...', value: null }];
  public codCatalogoInstitucion = 305;
  public codCatalogoTipoCuenta = 306;
  public codCatalogoTipoIdentificacion = 303;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttestransaccion', 'GENERARPAGOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
   
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {
    if (!this.validaFiltrosConsulta()) {
      return;

    }
    super.consultar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  actualizar() {
    super.actualizar();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltroscuenta: any = { 'ccatalogo': this.codCatalogoTipoCuenta };
    const concuenta = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltroscuenta, {});
    concuenta.cantidad = 100;
    this.addConsultaCatalogos('TIPOCUENTA', concuenta, this.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosIns: any = { 'ccatalogo': this.codCatalogoInstitucion };
    const coninstitucion = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosIns, {});
    coninstitucion.cantidad = 200;
    this.addConsultaCatalogos('INSTITUCION', coninstitucion, this.linstitucion, super.llenaListaCatalogo, 'cdetalle');

    const mfiltroTIPOIDENTIF: any = { 'ccatalogo': this.codCatalogoTipoIdentificacion };
    const consultaTIPOIDENTIF = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltroTIPOIDENTIF, {});
    consultaTIPOIDENTIF.cantidad = 100;
    this.addConsultaCatalogos('TIPOIDENTIFICACION', consultaTIPOIDENTIF, this.ltipoidentificacion, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

  grabar(): void {
    if (!this.validaFiltrosConsulta()) {
      this.mostrarMensajeError("CAMPOS OBLIGATORIOS");
      return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.esmanual = true;
    this.lregistrosbce = [];
    super.crearBce(this.registro,
      this.registro.idbeneficiario,
      this.registro.nombrebeneficiario,
      this.registro.numerocuentabeneficiario,
      this.registro.codigobeneficiario,
      this.registro.tipocuenta,
      this.codCatalogoTipoCuenta,
      this.registro.institucionbancaria,
      this.codCatalogoInstitucion,
      this.registro.valorpago,
      this.registro.referenciainterna,
    null,null,null,null,'P');
    this.rqMantenimiento.mdatos.GENERARBCE = this.lregistrosbce;
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.registro = [];
    }
  }
}
