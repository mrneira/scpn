import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component'

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'estadoResultadosReporte.html'
})
export class EstadoResultadosReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  public lniveles: SelectItem[] = [{ label: '...', value: null }];
  public ltipoplancuentas: SelectItem[] = [{ label: '...', value: null }];
  public lperiodo: SelectItem[] = [{ label: '...', value: null }];
  public lCcostocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public mostrarFechas: boolean;

  private catalogoCcostoDetalle: CatalogoDetalleComponent;

  public valoradio = null;
  selectedmodelo: string;
  consaldo = "";
  connotas = "";
  index = 0;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEBALANCEGENERAL', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.anio = this.anioactual;
    this.consultarCatalogos();
    this.consultarCatalogosGenerales();
  }

  ngAfterViewInit() {
  }

  handleChange(e) {
    this.index = e.index;
  }

  consultarCatalogosGenerales() {
    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'EstadoResultados';
    this.jasper.parametros['@i_fechai'] = undefined;
    this.jasper.parametros['@i_fechaf'] = undefined;    
    this.jasper.parametros['@i_anio'] = undefined;
    this.jasper.parametros['@i_mes'] = undefined;
    this.jasper.parametros['@i_centrocostoscdetalle'] = undefined;
    
    let mensaje = "";
    switch (this.index) {
      case 0:
        mensaje = this.validarAcumulado();
        if (mensaje !== "") {
          super.mostrarMensajeError(mensaje);
          return;
        }
        this.jasper.parametros['@i_anio'] = this.mcampos.anio;
        this.jasper.parametros['@i_mes'] = this.mcampos.mes;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConEstadoDeResultadosAcumulado';
        break;

      case 1:
        mensaje = this.validarSinSaldoInicial();
        if (mensaje !== "") {
          super.mostrarMensajeError(mensaje);
          return;
        }
        this.jasper.parametros['@i_fechai'] = this.mcampos.fechai;
        this.jasper.parametros['@i_fechaf'] = this.mcampos.fechaf;
        this.jasper.parametros['@i_centrocostoscdetalle'] = this.estaVacio(this.mcampos.centrocostoscdetalle)? '': this.mcampos.centrocostoscdetalle;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConEstadoDeResultadosSinSaldoInicial';
        break;
    }

    this.jasper.formatoexportar = resp;
    this.jasper.parametros['@i_tipoplancdetalle'] = this.mcampos.tipoplancuenta;
    this.jasper.parametros['@i_nivel'] = this.mcampos.nivel;
    this.jasper.parametros['@i_consaldo'] = this.consaldo !== "" ? true : false;
    this.jasper.parametros['@i_notabalance'] = this.connotas !== "" ? true : false;
    // Agregar parametros


    //if (this.selectedmodelo === 'modelo2') this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConEstadoDeResultadosModelo2';

    this.jasper.generaReporteCore();

    //this.mcampos.fperiodo = new Date().getFullYear();
  }

  validarAcumulado(): string {
    let mensaje = "";
    mensaje = this.validarFormulario();
    if (this.estaVacio(this.mcampos.anio)) mensaje += "INGRESE EL AÑO  <br />";
    if (this.estaVacio(this.mcampos.mes)) mensaje += "SELECCIONE EL MES  <br />";
    return mensaje;
  }

  validarSinSaldoInicial(): string {
    let mensaje = "";
    mensaje = this.validarFormulario();
    if (this.estaVacio(this.mcampos.fechai)) mensaje += "SELECCIONE LA FECHA INICIO  <br />";
    if (this.estaVacio(this.mcampos.fechaf)) mensaje += "SELECCIONE LA FECHA FIN  <br />";
    return mensaje;
  }

  validarFormulario(): string {
    let mensaje = "";
    if (this.estaVacio(this.mcampos.tipoplancuenta)) mensaje += "SELECCIONE EL TIPO DE PLAN DE CUENTAS  <br />";
    if (this.estaVacio(this.mcampos.nivel)) mensaje += "SELECCIONE EL NIVEL  <br />";
    return mensaje;
  }

  public cambiaRadio() {
    this.mostrarFechas = !this.mostrarFechas;
    if (this.mostrarFechas) {
      this.mcampos.fperiodo = new Date().getFullYear();

    }
  }

  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovPersonas.mfiltros.tipodepersona = 'N';
    this.lovPersonas.showDialog();
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.catalogoCcostoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoCcostoDetalle.mfiltros.ccatalogo = 1002;
    const Ccosto = this.catalogoCcostoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('CENTROCOSTO', Ccosto, this.lCcostocdetalle, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {
    const consultaNivel = new Consulta('tconnivel', 'Y', 't.nombre', {}, {});
    consultaNivel.cantidad = 100;
    this.addConsultaPorAlias('NIVEL', consultaNivel);

    const mfiltrosEstUsr: any = { 'ccatalogo': 1001 };
    const consultaTipoPlanCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaTipoPlanCuenta.cantidad = 50;
    this.addConsultaPorAlias('TIPOPLANCUENTA', consultaTipoPlanCuenta);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lniveles, resp.NIVEL, 'cnivel');
      this.llenaListaCatalogo(this.ltipoplancuentas, resp.TIPOPLANCUENTA, 'cdetalle');
      this.llenaListaCatalogo(this.lperiodo, resp.PERIODO, 'ccomprobante');
    }
    this.lconsulta = [];
  }
}
