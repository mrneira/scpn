import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from './../../../personas/lov/personas/componentes/lov.personas.component';
import { AppService } from '../../../../util/servicios/app.service';
import { ExpedienteComponent } from '../submodulos/expediente/componentes/expediente.component';
import { AnticipoComponent } from '../submodulos/anticipos/componentes/anticipo.component';
import { LiquidaciomComponent } from '../submodulos/liquidacion/componentes/liquidacion.component';
import { PrestamosComponent } from '../submodulos/prestamos/componentes/prestamos.component';
import { NovedadessocioComponent } from '../submodulos/novedadessocio/componentes/novedadessocio.component';
import { RetencionesComponent } from '../submodulos/retenciones/componentes/retenciones.component';
import { BeneficiarioComponent } from '../submodulos/beneficiario/componentes/beneficiario.component';
import { ObservacionesComponent } from '../submodulos/observaciones/componentes/observaciones.component';
import { SelectItem } from 'primeng/primeng';
import { MenuItem } from 'primeng/components/common/menuitem';

@Component({
  selector: 'app-consulta-expediente',
  templateUrl: 'consultaExpediente.html'
})
export class ConsultaExpedienteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovSocios: LovPersonasComponent;

  @ViewChild(PrestamosComponent)
  prestamosComponent: PrestamosComponent;

  @ViewChild(NovedadessocioComponent)
  novedadessocioComponent: NovedadessocioComponent;

  @ViewChild(RetencionesComponent)
  retencionesComponent: RetencionesComponent;

  @ViewChild(ExpedienteComponent)
  expedienteComponent: ExpedienteComponent;

  @ViewChild(AnticipoComponent)
  anticipoComponent: AnticipoComponent

  @ViewChild(LiquidaciomComponent)
  liquidaciomComponent: LiquidaciomComponent;

  @ViewChild(BeneficiarioComponent)
  beneficiarioComponent: BeneficiarioComponent;

  @ViewChild(ObservacionesComponent)
  observacionesComponent: ObservacionesComponent

  public collapsed = false;
  public bandeja = false;
  public estadoListaTipos = false;
  public mostrarDialogoSimulacion = false;
  devolucion = false;
  cesantia = false;
  public mfiltrosBandeja: any = {};
  loperaciones: any = [];
  public idpaso;
  public siguienteestatus = "";
  public anteriorestatus = "";
  public itemsPasos: MenuItem[];
  public lflujonormal: any = [];
  public lflujo: any = [];
  public lflujohipotecario: any = [];
  public ltipoliquidacion: SelectItem[] = [{ label: '...', value: null }];
  selectedValues: string[] = [];
  public edited = false;
  public mensaje = "";
  public registroExpediente: any = { 'mdatos': {} };
  public rqManexp: any = { 'mdatos': {} };

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CONSULTAEXPEDIENTE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros, this.route);
    this.mcampos.fechacalculo = this.fechaactual;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {

  }

  crearNuevo() {

  }
  // Inicia CONSULTA *********************

  recargar() {
    super.recargar();
  }

  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  consultaDatos() {
    this.collapsed = true;
    if (this.estaVacio(this.mcampos.cdetalletipoexp)) {
      this.collapsed = false;
      return;
    }
    this.prestamosComponent.consultar();
    this.novedadessocioComponent.mcampos.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.novedadessocioComponent.consultar();
    this.expedienteComponent.consultar();
    this.anticipoComponent.consultar();
    this.liquidaciomComponent.mfiltros.secuencia = this.mcampos.secuencia;
    this.liquidaciomComponent.consultar();
    this.retencionesComponent.mcampos.bandeja = this.bandeja;
    this.retencionesComponent.mcampos.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.retencionesComponent.mcampos.fechaalta = this.mcampos.fechaAlta;
    this.retencionesComponent.mcampos.fechabaja = this.mcampos.fechaBaja;
    this.retencionesComponent.mcampos.coeficiente = this.mcampos.coeficiente
    this.retencionesComponent.mcampos.cdetallejerarquia = this.registro.mdatos.cjerarquia;
    this.retencionesComponent.consultar();
    this.observacionesComponent.consultar();
    this.beneficiarioComponent.mfiltros.secuencia = this.mcampos.secuencia;
    if (!this.estaVacio(this.mcampos.secuencia)) {
      this.beneficiarioComponent.consultar();
    }

  }

  public crearDtoConsulta() {
    this.rqConsulta = [];
    this.fijarFiltrosConsulta();
    this.rqConsulta.cmodulo = 27;
    this.rqConsulta.ctransaccion = 201;
    this.rqConsulta.CODIGOCONSULTA = 'DATOSSOCIO';
    this.rqConsulta.cpersona = this.mcampos.cpersona;
    this.rqConsulta.bandeja = false;
  }

  private fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return true;
  }


  private manejaRespuestaSimulacion(resp: any) {
    this.estadoListaTipos = true;
    this.mcampos.valorinteres = 0.00;
    this.mcampos.tiempomixto = "NO";
    this.mcampos.valoranticipo = 0.00;
    this.mcampos.tprestamos = 0.00;
    this.mcampos.tnovedades = 0.00;
    this.mcampos.tretenciones = 0.00;
    this.mcampos.daportes = 0.00;
    this.mcampos.porcentaje = 10.00;
    const msgs = [];
    if (resp.cod === 'OK') {
      const msimulacion = resp.SIMULACION[0];
      const mbonificacion = resp.BONIFICACION;
      this.cesantia = msimulacion.cesantia;
      this.devolucion = msimulacion.devolucion;
      this.mcampos.subtotal = msimulacion.totalingresos;
      this.mcampos.total = msimulacion.total;
      this.mcampos.tprestamos = msimulacion.tprestamos;
      this.mcampos.tnovedades = msimulacion.tnovedades;
      this.mcampos.tretenciones = msimulacion.tretenciones;
      this.mcampos.daportes = msimulacion.daportes;
      this.mcampos.aporteacumulado = msimulacion.TAPORTE;
      this.mcampos.valorinteres = msimulacion.interes;
      this.mcampos.porcentaje = msimulacion.porcentaje;
      this.devolucion = msimulacion.devolucion;
      this.cesantia = msimulacion.cesantia;
      this.llenarMensaje();
      this.mcampos.valordescuentossim = this.mcampos.tprestamos + this.mcampos.tnovedades + this.mcampos.tretenciones + this.mcampos.daportes;

      if (mbonificacion[4]) {
        this.mcampos.tiempomixto = "SI";
      }
      this.mcampos.cuantiaBasica = mbonificacion[1];
      this.mcampos.vbonificacion = mbonificacion[3];
      this.mostrarDialogoSimulacion = true;
    }
    this.lconsulta = [];
  }

  private llenarMensaje() {
    this.mcampos.mensaje = "Nota: ";
    if (this.registro.cdetalletipoexp === "ANT" && !this.devolucion) {
      this.mcampos.mensaje = this.mcampos.mensaje + " - Valor correponde al " + this.mcampos.porcentaje + "% de la liquidación";
    }

    const a = this.selectedValues.indexOf("pagonovedades"); { }
    if (a < 0) {
      this.mcampos.mensaje = this.mcampos.mensaje + " - No incluye valor de Novedades";
    }

    const b = this.selectedValues.indexOf("pagoretenciones");
    if (b < 0) {
      this.mcampos.mensaje = this.mcampos.mensaje + " - No incluye valor de Retenciones";
    }

    const c = this.selectedValues.indexOf("pagoprestamos");
    if (c < 0) {
      this.mcampos.mensaje = this.mcampos.mensaje + " - No incluye valor de Prestamos ";
    }
  }

  public postQuery(resp: any) {
    if (resp.cod === 'OK') {
      this.manejaRespuestaDatosSocio(resp);
      this.consultaDatos();
     
    }




  }
  // Fin CONSULTA *********************

  manejaRespuestaDatosSocio(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      const msocio = resp.DATOSSOCIO[0];
      this.registro.mdatos.identificacion = msocio.identificacion;
      this.mcampos.fingreso = msocio.fingreso;
      if (msocio.liquidado && msocio.secuencia != -1) {
        this.mcampos.fechaAlta = msocio.falta < msocio.fingreso ? msocio.fingreso : msocio.falta;
        //this.mcampos.fechaAlta = msocio.falta > msocio.fingreso ? msocio.fingreso : msocio.falta;
      } else {
        this.mcampos.fechaAlta = msocio.falta > msocio.fingreso ? msocio.fingreso : msocio.falta;
      }
      this.registro.mdatos.grado = msocio.grado;
      this.registro.mdatos.cjerarquia = msocio.cjerarquia;
      this.mcampos.esbaja = msocio.esbaja;
      this.mcampos.fechaBaja = msocio.esbaja === true ? new Date(msocio.fbaja) : this.mcampos.fechacalculo;
      this.mcampos.nfbaja = msocio.esbaja === true ? 'Fecha Baja' : 'Fecha Baja';
      this.mcampos.fnacimiento = msocio.fnacimiento;
      this.mcampos.tiemposervicio = msocio.tiemposervico;
      this.mcampos.edad = msocio.edad;
      this.mcampos.coeficiente = msocio.coeficiente;
      this.mcampos.tipobaja = msocio.tipobaja;
      this.devolucion = msocio.devolucion;
      this.cesantia = msocio.cesantia;
      this.mcampos.cdetalletipoexp = msocio.cdetalletipoexp;
      this.mcampos.estadoSocio = msocio.estadosocio;
      this.registro.mdatos.genero = msocio.genero;
      this.mcampos.numaportaciones = msocio.totalaportes;
      this.mcampos.aporteacumuladoCabecera = msocio.acumuladoaportes;
      this.mcampos.secuencia = msocio.secuencia;
      this.mcampos.mensaje = msocio.mensaje;
      this.mcampos.ccomprobante = msocio.ccomprobante;
      if (!this.estaVacio(this.mcampos.mensaje)) {
        this.mensaje = this.mcampos.mensaje;
        this.edited = true;
        return;
      }
      else {
        this.edited = false;
        this.mensaje = '';
      }
    }
    this.lconsulta = [];
  }
  // Fin CONSULTA *********************

  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
   // this.lovSocios.mfiltros.csocio = 1;
    this.lovSocios.mcampos.identificacion = undefined;
    this.lovSocios.mcampos.nombre = undefined;
    this.lovSocios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovSociosSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.mcampos.cdetalletipoexp = null
      this.collapsed = false;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.prestamosComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.novedadessocioComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.retencionesComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.expedienteComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.anticipoComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.liquidaciomComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.observacionesComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.consultar();
    }
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltroInsFin: any = { 'ccatalogo': 305,'activo': true };
    const consultaInsFin = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroInsFin, {});
    consultaInsFin.cantidad = 500;
    this.addConsultaCatalogos('INSFINR', consultaInsFin, this.retencionesComponent.lbancos, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('INSFINN', consultaInsFin, this.novedadessocioComponent.lbancos, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('INSFINN', consultaInsFin, this.beneficiarioComponent.lbancos, super.llenaListaCatalogo, 'cdetalle');

    const mfiltroTipoCuenta: any = { 'ccatalogo': 306 };
    const consultaTipoCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoCuenta, {});
    consultaTipoCuenta.cantidad = 20;
    this.addConsultaCatalogos('TIPCUENTAR', consultaTipoCuenta, this.retencionesComponent.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('TIPCUENTAN', consultaTipoCuenta, this.novedadessocioComponent.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('TIPCUENTAN', consultaTipoCuenta, this.beneficiarioComponent.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosProf: any = { 'ccatalogo': 220 };
    const consultaProf = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosProf, {});
    consultaProf.cantidad = 50;
    this.addConsultaCatalogos('TIPONOVEDADN', consultaProf, this.novedadessocioComponent.ltipoNovedad, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('TIPORETENCION', consultaProf, this.retencionesComponent.ltipoNovedad, super.llenaListaCatalogo, 'cdetalle');

    const mfiltroTipoLiquidacion: any = { 'ccatalogo': 2802 };
    const consultaTipoLiq = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoLiquidacion, {});
    this.addConsultaCatalogos('TIPLIQUID', consultaTipoLiq, this.ltipoliquidacion, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosParent: any = { 'ccatalogo': 1126 };
    const consultaParent = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosParent, {});
    consultaProf.cantidad = 50;
    this.addConsultaCatalogos('PARETNZCO', consultaParent, this.beneficiarioComponent.lparentezco, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();

  }

  //activar boton nuevo en beneficiarios al tener tipo de baja fallecido

  //Mantenimiento

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }
}
