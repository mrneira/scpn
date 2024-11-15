import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovPersonasComponent} from '../../../../personas/lov/personas/componentes/lov.personas.component'

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'balanceComparativoReporte.html'
})
export class BalanceComparativoReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  public lniveles: SelectItem[] = [{label: '...', value: null}];
  public ltipoplancuentas: SelectItem[] = [{label: '...', value: null}];
  public lmesesini: SelectItem[] = [{label: '...', value: null}];
  public lmesesfin: SelectItem[] = [{label: '...', value: null}];
  public lCcostocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public mostrarFechas: boolean;
  public valoradio = null;
  selectedvalue: string;

  private catalogoCcostoDetalle: CatalogoDetalleComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEBALANCECOMPARATIVO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.anioi = this.anioactual;
    this.mcampos.aniof = (this.mesactual==12)?(this.anioactual+1):this.anioactual;
    this.mcampos.mesi = 1;
    this.mcampos.mesf = this.mesactual;
    this.consultarCatalogosGenerales();
    this.consultarCatalogos();
  }

  consultarCatalogosGenerales(){
    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');

    // this.catalogoCcostoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    // this.catalogoCcostoDetalle.mfiltros.ccatalogo = 1002;
    // const Ccosto = this.catalogoCcostoDetalle.crearDtoConsulta();
    // this.addConsultaCatalogos('CENTROCOSTO', Ccosto, this.lCcostocdetalle, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {

    this.jasper.nombreArchivo = 'BalanceComparativo';
    if (this.estaVacio(this.mcampos.nivel)) {
      this.mostrarMensajeError("SELECCIONE CAMPOS");
      return;
    }


    if (this.estaVacio(this.mcampos.tipoplancuenta)) {
      this.mostrarMensajeError("SELECCIONE EL TIPO DE PLAN");
      return;
    }

    if (this.estaVacio(this.mcampos.anioi)) {
      this.mostrarMensajeError("INGRESE EL AÑO DE INICIO");
      return;
    }

    if (this.estaVacio(this.mcampos.mesi)) {
      this.mostrarMensajeError("SELECCIONE EL MES DE INICIO");
      return;
    }

    if (this.estaVacio(this.mcampos.aniof)) {
      this.mostrarMensajeError("INGRESE EL AÑO DE FIN");
      return;
    }

    if (this.estaVacio(this.mcampos.mesf)) {
      this.mostrarMensajeError("SELECCIONE EL MES DE FIN");
      return;
    }


    // Agregar parametros
    this.jasper.parametros['@i_mesi'] = this.mcampos.mesi;
    this.jasper.parametros['@i_anioi'] = this.mcampos.anioi;
    this.jasper.parametros['@i_mesf'] = this.mcampos.mesf;
    this.jasper.parametros['@i_aniof'] = this.mcampos.aniof;
    this.jasper.parametros['@i_nivel'] = this.mcampos.nivel;
    this.jasper.parametros['@i_tipoplancdetalle'] = this.mcampos.tipoplancuenta;
    this.jasper.parametros['@i_comparacion'] = this.selectedvalue;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConBalanceComparativo';
    this.jasper.formatoexportar=resp;
    this.jasper.generaReporteCore();
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

     const mfiltrosEstUsr: any = {'ccatalogo': 1001};
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
    }
    this.lconsulta = [];
  }
  fijarListaMeses() {
    this.lmesesini.push({ label: "ENERO", value: 1 });
    this.lmesesini.push({ label: "FEBRERO", value: 2 });
    this.lmesesini.push({ label: "MARZO", value: 3 });
    this.lmesesini.push({ label: "ABRIL", value: 4 });
    this.lmesesini.push({ label: "MARZO", value: 5 });
    this.lmesesini.push({ label: "JUNIO", value: 6 });
    this.lmesesini.push({ label: "JULIO", value: 7 });
    this.lmesesini.push({ label: "AGOSTO", value: 8 });
    this.lmesesini.push({ label: "SEPTIEMBRE", value: 9 });
    this.lmesesini.push({ label: "OCTUBRE", value: 10 });
    this.lmesesini.push({ label: "NOVIEMBRE", value: 11 });
    this.lmesesini.push({ label: "DICIEMBRE", value: 12 });
  }

  public cambiaRadio() {
    this.mostrarFechas = !this.mostrarFechas;
    if(this.mostrarFechas){
      this.mcampos.fperiodo= new Date().getFullYear();

    }
  }
}
