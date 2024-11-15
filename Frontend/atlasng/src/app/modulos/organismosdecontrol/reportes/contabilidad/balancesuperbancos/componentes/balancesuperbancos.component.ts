import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';


@Component({
  selector: 'app-balancesuperbancos',
  templateUrl: 'balancesuperbancos.html'
})
export class BalanceSuperBancosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lniveles: SelectItem[] = [{ label: '...', value: null }];
  public ltipoplancuentas: SelectItem[] = [{ label: '...', value: null }];
  public lperiodo: SelectItem[] = [{ label: '...', value: null }];
  public lCcostocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public mostrarFechas: boolean;


  private catalogoCcostoDetalle: CatalogoDetalleComponent;
  public valoradio = null;
  selectedmodelo: string;
  selectedconsaldo: string;
  cuentaresultados: string = '';

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
    this.jasper.nombreArchivo = 'ReporteBalanceSuperdeBancos';

    if (this.estaVacio(this.mcampos.nivel)) {
      this.mostrarMensajeError("SELECCIONE CAMPO NIVEL");
      return;
    }


    if (this.estaVacio(this.mcampos.tipoplancuenta)) {
      this.mostrarMensajeError("SELECCIONE EL TIPO DE PLAN");
      return;
    }

    if (this.estaVacio(this.mcampos.anio)) {
      this.mostrarMensajeError("INGRESE EL AÑO");
      return;
    }

    if (this.estaVacio(this.mcampos.mes)) {
      this.mostrarMensajeError("SELECCIONE EL MES");
      return;
    }


    // Agregar parametros
    this.jasper.formatoexportar = resp;
    this.jasper.parametros['@i_aniof'] = this.mcampos.anio;
    this.jasper.parametros['@i_mesf'] = this.mcampos.mes;
    this.jasper.parametros['@i_nivel'] = this.mcampos.nivel;
    this.jasper.parametros['@i_tipoplancdetalle'] = this.mcampos.tipoplancuenta;
    this.jasper.parametros['@i_cuentaresultados'] = this.consultarCuentaResultados();
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/OrganismosdeControl/rptOdcBalanceSuperBancos';

    this.jasper.generaReporteCore();
    this.mcampos.fperiodo = new Date().getFullYear();
  }

  consultarCuentaResultados() {
    const plan = "CCUENTA_RESULTADOS_EJERCICIO_" + this.mcampos.tipoplancuenta.replace('-', '');
    const consulta = new Consulta('tconparametros', 'N', '', { 'codigo': plan }, {});
    this.addConsultaPorAlias('PARAMETRO_CUENTA_RESULTADOS', consulta);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuesta(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuesta(resp: any) {
    if (resp.cod = 'OK') {
      this.cuentaresultados = resp.PARAMETRO_CUENTA_RESULTADOS.texto;
    }
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
    const consultaNivel = new Consulta('tconnivel', 'Y', 't.cnivel', {}, {});
    consultaNivel.cantidad = 100;
    this.addConsultaPorAlias('NIVEL', consultaNivel);

    const mfiltrosEstUsr: any = { 'ccatalogo': 1001 };
    const consultaTipoPlanCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaTipoPlanCuenta.cantidad = 50;
    this.addConsultaPorAlias('TIPOPLANCUENTA', consultaTipoPlanCuenta);

    const consultaPeriodo = new Consulta('tconcomprobante', 'Y', 't.particion', {}, {});
    consultaPeriodo.cantidad = 100;
    this.addConsultaPorAlias('PERIODO', consultaPeriodo);


  }
  public cambiaRadio() {
    this.mostrarFechas = !this.mostrarFechas;
    if (this.mostrarFechas) {
      this.mcampos.fperiodo = new Date().getFullYear();

    }
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
