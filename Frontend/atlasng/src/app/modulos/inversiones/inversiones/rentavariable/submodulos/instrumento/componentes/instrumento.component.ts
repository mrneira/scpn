import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovAgentesbolsaComponent } from '../../../../../../inversiones/lov/agentesbolsa/componentes/lov.agentesbolsa.component';
import { ValoresRentaVariable } from './../../../componentes/_valoresrentavariable.service';

@Component({
  selector: 'app-instrumento',
  templateUrl: 'instrumento.html'
})
export class InstrumentoComponent extends BaseComponent implements OnInit, AfterViewInit {

  public pEditable: number = 0;

  public lPortafolio: SelectItem[] = [{ label: '...', value: null }];
  public lBanco: SelectItem[] = [{ label: '...', value: null }];
  public lMercado: SelectItem[] = [{ label: '...', value: null }];
  public lSistemaColocacion: SelectItem[] = [{ label: '...', value: null }];
  public lEmisor: SelectItem[] = [{ label: '...', value: null }];
  public lInstrumento: SelectItem[] = [{ label: '...', value: null }];
  public lMoneda: SelectItem[] = [{ label: '...', value: null }];
  public lBolsaValores: SelectItem[] = [{ label: '...', value: null }];
  public lClasificacion: SelectItem[] = [{ label: '...', value: null }];
  public lPeriodos: SelectItem[] = [{ label: '...', value: null }];
  public lCupon: SelectItem[] = [{ label: '...', value: null }];
  public lEstado: SelectItem[] = [{ label: '...', value: null }];
  public lCasaValores: SelectItem[] = [{ label: '...', value: null }];
  public lRiesgo: SelectItem[] = [{ label: '...', value: null }];
  public lSector: SelectItem[] = [{ label: '...', value: null }];

  lCuentaContable: number = 0;

  @ViewChild(LovAgentesbolsaComponent)
  lovAgentesBolsa: LovAgentesbolsaComponent;

  @Input()
  natural: BaseComponent;

  @Input()
  detalle: BaseComponent;

  constructor(router: Router, dtoServicios: DtoServicios, private valoresRentaVariable: ValoresRentaVariable) {
    super(router, dtoServicios, 'tinvinversion', 'INSTRUMENTO', false, false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
    this.asignarCatalogoInicial();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
   
    this.registro = [];
    this.asignarCatalogoInicial();
    this.registro.cinversion = 0;
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.encerarMensajes();
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        this.manejaRespuestaCatalogos(resp);

      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lPortafolio, resp.PORTAFOLIO, 'cdetalle');
      this.llenaListaCatalogo(this.lBanco, resp.BANCO, 'cdetalle');
      this.llenaListaCatalogo(this.lMercado, resp.MERCADO, 'cdetalle');
      this.llenaListaCatalogo(this.lSistemaColocacion, resp.COLOCACION, 'cdetalle');
      this.llenaListaCatalogo(this.lEmisor, resp.EMISOR, 'cdetalle');
      this.llenaListaCatalogo(this.lInstrumento, resp.INSTRUMENTO, 'cdetalle');
      this.llenaListaCatalogo(this.lMoneda, resp.MONEDA, 'cdetalle');
      this.llenaListaCatalogo(this.lBolsaValores, resp.BOLSAVALORES, 'cdetalle');
      this.llenaListaCatalogo(this.lClasificacion, resp.CLASIFICACION, 'cdetalle');
      this.llenaListaCatalogo(this.lPeriodos, resp.PERIODOS, 'cdetalle');
      this.llenaListaCatalogo(this.lCupon, resp.CUPON, 'cdetalle');
      this.llenaListaCatalogo(this.lEstado, resp.ESTADO, 'cdetalle');
      this.llenaListaCatalogo(this.lCasaValores, resp.CASAVALORES, 'cdetalle');
      this.llenaListaCatalogo(this.lRiesgo, resp.RIESGO, 'cdetalle');
      this.llenaListaCatalogo(this.lSector, resp.SECTOR, 'cdetalle');

    }
    this.lconsulta = [];
  }


  llenarConsultaCatalogos(): void {

    const mfiltrosProf: any = { 'ccatalogo': this.registro.portafolioccatalogo };
    const consultaProf = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosProf, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('PORTAFOLIO', consultaProf);

    const mfiltrosMercado: any = { 'ccatalogo': this.registro.mercadotipoccatalogo };
    const consultaMercado = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosMercado, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('MERCADO', consultaMercado);

    const mfiltrosBanco: any = { 'ccatalogo': this.registro.bancoccatalogo };
    const consultaBanco = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosBanco, {});
    consultaBanco.cantidad = 50;
    this.addConsultaPorAlias('BANCO', consultaBanco);

    const mfiltrosSistemaColocacion: any = { 'ccatalogo': this.registro.sistemacolocacionccatalogo };
    const consultaSistemaColocacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosSistemaColocacion, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('COLOCACION', consultaSistemaColocacion);

    const mfiltrosEmisor: any = { 'ccatalogo': this.registro.emisorccatalogo };
    const consultaEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEmisor, {});
    consultaEmisor.cantidad = 50;
    this.addConsultaPorAlias('EMISOR', consultaEmisor);

    const mfiltrosInstrumento: any = { 'ccatalogo': this.registro.instrumentoccatalogo };
    const mfiltrosInsEsp: any = { 'cdetalle': " in ('ACCION','ACCOPP') " };
    const consultaInstrumento = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosInstrumento, mfiltrosInsEsp);
    consultaInstrumento.cantidad = 50;
    this.addConsultaPorAlias('INSTRUMENTO', consultaInstrumento);

    const mfiltrosMoneda: any = { 'ccatalogo': this.registro.monedaccatalogo };
    const consultaMoneda = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosMoneda, {});
    consultaMoneda.cantidad = 50;
    this.addConsultaPorAlias('MONEDA', consultaMoneda);

    const mfiltrosCasaValores: any = { 'ccatalogo': this.registro.bolsavaloresccatalogo };
    const consultaCasaValores = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosCasaValores, {});
    consultaCasaValores.cantidad = 50;
    this.addConsultaPorAlias('BOLSAVALORES', consultaCasaValores);

    const mfiltrosClasificacion: any = { 'ccatalogo': this.registro.clasificacioninversionccatalogo };
    const consultaClasificacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosClasificacion, {});
    consultaClasificacion.cantidad = 50;
    this.addConsultaPorAlias('CLASIFICACION', consultaClasificacion);

    const mfiltrosPeriodos: any = { 'ccatalogo': this.registro.periodicidadpagoscapitalccatalogo };
    const consultaPeriodos = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosPeriodos, {});
    consultaPeriodos.cantidad = 50;
    this.addConsultaPorAlias('PERIODOS', consultaPeriodos);

    const mfiltrosCupon: any = { 'ccatalogo': this.registro.compracuponccatalogo };
    const consultaCupon = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosCupon, {});
    consultaCupon.cantidad = 50;
    this.addConsultaPorAlias('CUPON', consultaCupon);

    const mfiltrosEstado: any = { 'ccatalogo': this.registro.estadoccatalogo };
    const consultaEstado = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstado, {});
    consultaEstado.cantidad = 50;
    this.addConsultaPorAlias('ESTADO', consultaEstado);

    const mfiltrosDesicion: any = { 'ccatalogo': this.registro.casavaloresccatalogo };
    const consultaDesicion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosDesicion, {});
    consultaDesicion.cantidad = 50;
    this.addConsultaPorAlias('CASAVALORES', consultaDesicion);

    const mfiltrosRiesgo: any = { 'ccatalogo': this.registro.calificacionriesgoinicialccatalogo };
    const consultaRiesgo = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosRiesgo, {});
    consultaRiesgo.cantidad = 50;
    this.addConsultaPorAlias('RIESGO', consultaRiesgo);

    const mfiltrosSector: any = { 'ccatalogo': this.registro.sectorccatalogo };
    const consultaSector = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosSector, {});
    consultaSector.cantidad = 50;
    this.addConsultaPorAlias('SECTOR', consultaSector);
  }

  mostrarLovAgentesBolsa(): void {
    this.lovAgentesBolsa.showDialog(); 
  }


  fijarLovAgentesBolsaSelect(reg: any): void {

    if (reg.registro !== undefined) {

      this.msgs = [];
      this.mcampos.cinvagentebolsa = reg.registro.cinvagentebolsa;
      this.mcampos.nombres = reg.registro.nombres;
      this.registro.cinvagentebolsa = reg.registro.cinvagentebolsa;

    }
  }

  asignarCatalogoInicial() {

    this.registro.tasaclasificacionccatalogo = 1210;
    this.registro.bolsavaloresccatalogo = 1215;
    this.registro.calificacionriesgoinicialccatalogo = 1207;
    this.registro.casavaloresccatalogo = 1217;
    this.registro.clasificacioninversionccatalogo = 1203;
    this.registro.compracuponccatalogo = 1216;
    this.registro.emisorccatalogo = 1213;
    this.registro.instrumentoccatalogo = 1202;
    this.registro.mercadotipoccatalogo = 1211;
    this.registro.monedaccatalogo = 1214;
    this.registro.periodicidadpagoscapitalccatalogo = 1206;
    this.registro.periodicidadpagosinteresccatalogo = 1206;
    this.registro.portafolioccatalogo = 1201;
    this.registro.sectorccatalogo = 1205;
    this.registro.sistemacolocacionccatalogo = 1212;
    this.registro.bancoccatalogo = 1224;
    this.registro.estadoccatalogo = 1204;
    this.registro.tasaclasificacioncdetalle = "VAR";

  }

  totalizaComisiones() {

    if (this.pEditable != 0)
    {
      this.valoresRentaVariable.Contabilizar();
    }
    
    let ltotal: number = 0;
    if (!this.estaVacio(this.registro.comisionbolsavalores)) {
      ltotal = Number(this.registro.comisionbolsavalores);
    }

    if (!this.estaVacio(this.registro.comisionoperador)) {
      ltotal = ltotal + Number(this.registro.comisionoperador);
    }

    if (!this.estaVacio(this.registro.comisionretencion)) {
      ltotal = ltotal - Number(this.registro.comisionretencion);
    }
    this.registro.comisiontotal = ltotal;

    this.registro.comisionesnegociacion = ltotal;

    this.calcularTotalAPagar();

  }

  calcularTotalAPagar() {

    let ltotal: number = 0;
    if (!this.estaVacio(this.registro.efectivonegociado)) {
      ltotal = Number(this.registro.efectivonegociado);
    }

    if (!this.estaVacio(this.registro.interesesnegociacion)) {
      ltotal = ltotal + Number(this.registro.interesesnegociacion);
    }

    if (!this.estaVacio(this.registro.comisionretencion)) {
      ltotal = ltotal - Number(this.registro.comisionretencion);
    }
    this.registro.totalapagar = ltotal;

  }

  contabilizar()
  {
    this.valoresRentaVariable.pCapital = this.registro.preciocompra;
    this.valoresRentaVariable.Contabilizar();
    
  }

  comisionBolsaContabiliza()
  {
    this.valoresRentaVariable.pComisionBolsa = this.registro.comisionbolsavalores;
    this.totalizaComisiones();  
  }

  comisionOperadorContabiliza()
  {
    this.valoresRentaVariable.pComisionOperador = this.registro.comisionoperador;
    this.totalizaComisiones();  
  }

  comisionRetencionContabiliza()
  {
    this.valoresRentaVariable.pRetencion = this.registro.comisionretencion;
    this.totalizaComisiones();  
  }


}

