import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovEstadoTransaccionComponent } from "../../../../../lov/estadotransaccion/componentes/lov.estadotransaccion.component";

@Component({
  selector: 'app-agregarocp',
  templateUrl: 'agregarocp.html'
})
export class AgregarOcpComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovEstadoTransaccionComponent)
  lovEstadoTransaccion: LovEstadoTransaccionComponent;

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
    //this.fijarListaAgencias();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {


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
    coninstitucion.cantidad = 100;
    this.addConsultaCatalogos('INSTITUCION', coninstitucion, this.linstitucion, super.llenaListaCatalogo, 'cdetalle');

    const mfiltroTIPOIDENTIF: any = { 'ccatalogo': this.codCatalogoTipoIdentificacion };
    const consultaTIPOIDENTIF = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltroTIPOIDENTIF, {});
    coninstitucion.cantidad = 100;
    this.addConsultaCatalogos('TIPOIDENTIFICACION', consultaTIPOIDENTIF, this.ltipoidentificacion, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

  grabar(): void {
    if (!this.estaVacio(this.registro.email)) {
      if (!this.validaFiltrosConsulta()) {
        return;
      }
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
      this.registro.secuenciainterna,
      this.registro.email,
      this.registro.telefono,
      this.registro.numerosuministro,
      'C');
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

  mostrarLovEstadoTransaccion(): void {
    this.lovEstadoTransaccion.habilitarfiltros = true;
    this.lovEstadoTransaccion.verreg = 0;
    this.lovEstadoTransaccion.modulo = -1;
    this.lovEstadoTransaccion.cestado = '';
    this.lovEstadoTransaccion.fcontable = -1;
    this.lovEstadoTransaccion.tipotransaccion = 'P';

    this.lovEstadoTransaccion.showDialog(true);
  }

  fijarLovEstadoTransaccionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.msgs = [];
      this.mcampos.ccuenta = reg.registro.ccuenta;
      this.mcampos.ncuenta = reg.registro.nombre;
    }
  }
}
