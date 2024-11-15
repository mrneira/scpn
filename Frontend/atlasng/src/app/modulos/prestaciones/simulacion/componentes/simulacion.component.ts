import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { LovPersonasComponent } from './../../../personas/lov/personas/componentes/lov.personas.component';
import { AportesComponent } from './../submodulos/aportes/componentes/aportes.component';
import { PrestamosComponent } from '../submodulos/prestamos/componentes/prestamos.component';
import { NovedadessocioComponent } from '../submodulos/novedadessocio/componentes/novedadessocio.component';
import { RetencionesComponent } from '../submodulos/retenciones/componentes/retenciones.component';
import { CarrerahistoricoComponent } from '../submodulos/carrerahistorico/componentes/carrerahistorico.component';
import { ObservacionesComponent } from '../submodulos/observaciones/componentes/observaciones.component';
import { JasperComponent } from '../../../../util/componentes/jasper/componentes/jasper.component';
import { AppService } from '../../../../util/servicios/app.service';
import { MenuItem } from 'primeng/components/common/menuitem';

@Component({
  selector: 'app-simulacion',
  templateUrl: 'simulacion.html'
})
export class SimulacionComponent extends BaseComponent implements OnInit, AfterViewInit {
  atencioncliente: any;

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  private lovSocios: LovPersonasComponent;

  @ViewChild(AportesComponent)
  aportesComponent: AportesComponent;

  @ViewChild(PrestamosComponent)
  prestamosComponent: PrestamosComponent;

  @ViewChild(NovedadessocioComponent)
  novedadessocioComponent: NovedadessocioComponent;

  @ViewChild(RetencionesComponent)
  retencionesComponent: RetencionesComponent;

  @ViewChild(CarrerahistoricoComponent)
  carrerahistoricoComponent: CarrerahistoricoComponent;

  @ViewChild(ObservacionesComponent)
  observacionesComponent: ObservacionesComponent

  public collapsed = false;
  public bandeja = false;
  public estadoListaTipos = false;
  public mostrarDialogoSimulacion = false;
  devolucion = false;
  cesantia = false;
  public mfiltrosBandeja: any = {};
  public idpaso;
  public siguienteestatus = "";
  public anteriorestatus = "";
  public itemsPasos: MenuItem[];
  public lflujonormal: any = [];
  public lflujo: any = [];
  public lflujohipotecario: any = [];
  public ltipoliquidacion: SelectItem[] = [{ label: '...', value: null }];
  public ltipobaja: SelectItem[] = [{ label: '...', value: null }];
  selectedValues: string[] = [];
  public edited = false;
  public mensaje = "";
  public registroExpediente: any = { 'mdatos': {} };
  public rqManexp: any = { 'mdatos': {} };
  public ntotal = '';

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'EXPEDIENTE', false);

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

    this.aportesComponent.consultar();
    this.prestamosComponent.consultar();
    this.novedadessocioComponent.mcampos.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.novedadessocioComponent.consultar();
    this.retencionesComponent.mcampos.bandeja = this.bandeja;
    this.retencionesComponent.mcampos.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.retencionesComponent.mcampos.fechaalta = this.mcampos.fechaAlta;
    this.retencionesComponent.mcampos.fechabaja = this.mcampos.fechaBaja;
    this.retencionesComponent.mcampos.coeficiente = this.mcampos.coeficiente
    this.retencionesComponent.mcampos.cdetallejerarquia = this.registro.mdatos.cjerarquia;
    this.retencionesComponent.consultar();
    this.carrerahistoricoComponent.consultar();
    this.observacionesComponent.consultar();
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

  private fijarFiltrosSimulacion() {
    this.rqConsulta = [];
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 205;
    this.rqConsulta.porcentaje = 10;
    this.rqConsulta.CODIGOCONSULTA = 'SIMULARPRESTACIONES';
    this.rqConsulta.cpersona = this.mcampos.cpersona;
    this.rqConsulta.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.rqConsulta.cdetallejerarquia = this.registro.mdatos.cjerarquia;
    this.rqConsulta.fechaalta = this.mcampos.fingreso;
    this.rqConsulta.fechabaja = this.mcampos.fechaBaja;
    this.rqConsulta.coeficiente = this.mcampos.coeficiente;
    this.registro.cdetalletipoexp = this.mcampos.cdetalletipoexp;

  }

  Simular() {
    this.rqConsulta.selectedValues = undefined;
    this.rqConsulta.fechabaja = this.mcampos.fechaBaja;
    this.rqConsulta.ctipobaja = this.mcampos.ctipobaja;
    if (!this.estaVacio(this.selectedValues)) {
      this.rqConsulta.selectedValues = this.selectedValues;
    }
    this.CambiarEtiqueta();
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {

          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod === 'OK') {
            this.manejaRespuestaSimulacion(resp);
            this.consultaDatos();
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  Ocultar() {
    this.mostrarDialogoSimulacion = false;
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
      this.mcampos.subtotal = msimulacion.totalingresos - msimulacion.daportes;
      this.mcampos.total = msimulacion.total;
      this.mcampos.tprestamos = msimulacion.tprestamos;
      this.mcampos.tnovedades = msimulacion.tnovedades;
      this.mcampos.tretenciones = msimulacion.tretenciones;
      this.mcampos.daportes = msimulacion.daportes;
      this.mcampos.taportesd = msimulacion.daportes * 100 / 20;
      this.mcampos.taportesi = msimulacion.TAPORTE - this.mcampos.taportesd;
      this.mcampos.aporteacumulado = msimulacion.TAPORTE;
      this.mcampos.valorinteres = msimulacion.interes;
      this.mcampos.porcentaje = msimulacion.porcentaje;
      this.devolucion = msimulacion.devolucion;
      this.cesantia = msimulacion.cesantia;
      this.llenarMensaje();
      this.mcampos.valordescuentossim = this.mcampos.tprestamos + this.mcampos.tnovedades + this.mcampos.tretenciones;// + this.mcampos.daportes;

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
      this.mcampos.mensaje = this.mcampos.mensaje + " - Valor correponde al " + this.mcampos.porcentaje + " de la liquidación";
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
      this.mcampos.mensaje = this.mcampos.mensaje + " - No incluye valor de Préstamos ";
    }
  }

  public postQuery(resp: any) {
    if (resp.cod === 'OK') {
      this.manejaRespuestaDatosSocio(resp);
      this.fijarFiltrosSimulacion();
      this.Simular();
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
        this.mcampos.fechaAlta = new Date(msocio.falta) < msocio.fingreso ? msocio.fingreso : msocio.falta;
      } else {
        this.mcampos.fechaAlta = new Date(msocio.falta) > msocio.fingreso ? msocio.fingreso : msocio.falta;
      }
      this.registro.mdatos.jerarquia = msocio.jerarquia;
      this.registro.mdatos.cjerarquia = msocio.cjerarquia;
      this.registro.mdatos.grado = msocio.grado;
      this.mcampos.esbaja = msocio.esbaja;
      this.mcampos.fechaBaja = msocio.esbaja === true ? new Date(msocio.fbaja) : this.mcampos.fechacalculo;
      this.mcampos.nfbaja = msocio.esbaja === true ? 'Fecha Baja' : 'Fecha Cálculo';
      this.mcampos.fnacimiento = msocio.fnacimiento;
      this.mcampos.tiemposervicio = msocio.tiemposervico;
      this.mcampos.edad = msocio.edad;
      this.mcampos.coeficiente = msocio.coeficiente;
      this.mcampos.tipobaja = msocio.tipobaja;
      this.mcampos.ctipobaja = msocio.ctipobaja;
      this.devolucion = msocio.devolucion;
      this.cesantia = msocio.cesantia;
      this.mcampos.cdetalletipoexp = msocio.cdetalletipoexp;
      this.mcampos.estadoSocio = msocio.estadosocio;
      this.registro.mdatos.genero = msocio.genero;
      this.mcampos.numaportaciones = msocio.totalaportes;
      this.mcampos.aporteacumuladoCabecera = msocio.acumuladoaportes;
      this.mcampos.mensaje = msocio.mensaje;
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
    this.lovSocios.mfiltros.csocio = 1;
    this.lovSocios.mcampos.identificacion = undefined;
    this.lovSocios.mcampos.nombre = undefined;
    this.lovSocios.showDialog();
  }


  public crearDtoConsultaReporte() {
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 204;
    this.rqConsulta.CODIGOCONSULTA = 'EXPEDIENTEPRESTAMOS';
    this.rqConsulta.cpersona = this.mcampos.cpersona;
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod === 'OK') {
            //super.postQueryEntityBean(resp);
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }



  descargarReporte() {
    let path = '';
    const noTruncarDecimales = { maximumFractionDigits: 20 };
    if (this.estaVacio(this.mcampos.identificacion)) {
      this.mostrarMensajeError("SELECCIONES UN SOCIO");
      return;
    }
    this.limpiarparametros();
    switch (this.mcampos.cdetalletipoexp) {
      case 'CES':
        path = '/CesantiaReportes/Prestaciones/ExpedientePoliciaSimulacion';
        this.jasper.parametros['@w_vcuantia'] = this.redondear(this.mcampos.cuantiaBasica, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_vbonificacion'] = this.redondear(this.mcampos.vbonificacion, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_subtotal'] = this.redondear(this.mcampos.subtotal, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_total'] = this.redondear(this.mcampos.total, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_tdescuentos'] = this.redondear(this.mcampos.valordescuentossim, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_nota'] = this.mcampos.mensaje;
        this.jasper.parametros['@w_nota'] = this.mcampos.mensaje;
        this.jasper.parametros['@w_vaporteacumulado'] = this.redondear(this.mcampos.aporteacumuladoCabecera, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_tiemposervicio'] = this.mcampos.tiemposervicio;
        break;
      case 'CEF':
        path = '/CesantiaReportes/Prestaciones/ExpedientePoliciaSimulacion';
        this.jasper.parametros['@w_vcuantia'] = this.redondear(this.mcampos.cuantiaBasica, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_vbonificacion'] = this.redondear(this.mcampos.vbonificacion, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_subtotal'] = this.redondear(this.mcampos.subtotal, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_total'] = this.redondear(this.mcampos.total, 2);
        this.jasper.parametros['@w_tdescuentos'] = this.redondear(this.mcampos.valordescuentossim, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_nota'] = this.mcampos.mensaje;
        this.jasper.parametros['@w_vaporteacumulado'] = this.redondear(this.mcampos.aporteacumuladoCabecera, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_tiemposervicio'] = this.mcampos.tiemposervicio;
        break;
      case 'DEV':
        path = '/CesantiaReportes/Prestaciones/DevolucionAportesSimulacion';
        this.jasper.parametros['@w_daportes'] = this.redondear(this.mcampos.daportes, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_tdaportes'] = this.redondear(this.mcampos.taportesd, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_taportes'] = this.redondear(this.mcampos.taportesi, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_interes'] = this.redondear(this.mcampos.valorinteres, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_total'] = this.redondear(this.mcampos.total, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_tdescuentos'] = this.redondear(this.mcampos.valordescuentossim, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_stdaportes'] = this.redondear(this.mcampos.taportesd - this.mcampos.daportes, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_subtotal'] = this.redondear(this.mcampos.taportesd - this.mcampos.daportes + this.mcampos.taportesi + this.mcampos.valorinteres, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_nota'] = this.mcampos.mensaje;
        this.jasper.parametros['@w_vaporteacumulado'] = this.redondear(this.mcampos.aporteacumuladoCabecera, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_tiemposervicio'] = this.mcampos.tiemposervicio;
        break;
      case 'DEH':
        path = '/CesantiaReportes/Prestaciones/DevolucionAportesSimulacion';
        this.jasper.parametros['@w_daportes'] = this.redondear(this.mcampos.daportes, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_tdaportes'] = this.redondear(this.mcampos.taportesd, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_taportes'] = this.redondear(this.mcampos.taportesi, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_interes'] = this.redondear(this.mcampos.valorinteres, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_total'] = this.redondear(this.mcampos.total, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_tdescuentos'] = this.redondear(this.mcampos.valordescuentossim, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_stdaportes'] = this.redondear(this.mcampos.taportesd - this.mcampos.daportes, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_subtotal'] = this.redondear(this.mcampos.taportesd - this.mcampos.daportes + this.mcampos.taportesi + this.mcampos.valorinteres, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_nota'] = this.mcampos.mensaje;
        this.jasper.parametros['@w_vaporteacumulado'] = this.redondear(this.mcampos.aporteacumuladoCabecera, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_tiemposervicio'] = this.mcampos.tiemposervicio;
        break;
      case 'ANT':
        path = '/CesantiaReportes/Prestaciones/AnticipoCesantiaSimulacion';
        this.jasper.parametros['@w_vcuantia'] = this.redondear(this.mcampos.cuantiaBasica, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_vbonificacion'] = this.redondear(this.mcampos.vbonificacion, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_subtotal'] = this.redondear(this.mcampos.subtotal, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_total'] = this.redondear(this.mcampos.total, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_nota'] = this.mcampos.mensaje;
        this.jasper.parametros['@w_vaporteacumulado'] = this.redondear(this.mcampos.aporteacumuladoCabecera, 2).toLocaleString('en-US', noTruncarDecimales);
        this.jasper.parametros['@w_tiemposervicio'] = this.mcampos.tiemposervicio;
        this.jasper.parametros['@w_porcentaje'] = this.mcampos.porcentaje;
        break;
    }

    this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
    this.jasper.parametros['@i_cdetalletipoexp'] = this.mcampos.cdetalletipoexp;
    this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = path;
    this.jasper.parametros['@w_falta'] = this.calendarToFechaString(this.mcampos.fechaAlta);
    this.jasper.formatoexportar = 'pdf';
    this.jasper.generaReporteCore();
  }

  public calendarToFechaString(fecha: Date): string {
    if (this.estaVacio(fecha)) {
      return null;
    }
    const f = fecha;
    const curr_date = f.getDate();
    const curr_month = f.getMonth() + 1;
    const curr_year = f.getFullYear();
    let monthstr = '' + curr_month;
    let daystr = '' + curr_date;
    if (curr_month < 10) { monthstr = '0' + curr_month; }
    if (curr_date < 10) { daystr = '0' + curr_date; }
    return (daystr + '/' + monthstr + '/' + curr_year);
  }

  limpiarparametros() {
    this.jasper.parametros['@w_vcuantia'] = undefined;
    this.jasper.parametros['@w_vbonificacion'] = undefined;
    this.jasper.parametros['@w_subtotal'] = undefined;
    this.jasper.parametros['@w_total'] = undefined;
    this.jasper.parametros['@w_tdescuentos'] = undefined;
    this.jasper.parametros['@w_nota'] = undefined;
    this.jasper.parametros['@w_vaporteacumulado'] = undefined;
    this.jasper.parametros['@w_daportes'] = undefined;
    this.jasper.parametros['@w_tdaportes'] = undefined;
    this.jasper.parametros['@w_taportes'] = undefined;
    this.jasper.parametros['@w_interes'] = undefined;
    this.jasper.parametros['@w_tiemposervicio'] = undefined;
    this.jasper.parametros['@w_stdaportes'] = undefined;
  }

  /**Retorno de lov de personas. */
  fijarLovSociosSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.mcampos.cdetalletipoexp = null
      this.collapsed = false;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.aportesComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.novedadessocioComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.retencionesComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.carrerahistoricoComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.prestamosComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.observacionesComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.consultar();
      this.crearDtoConsultaReporte();

    }
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltroInsFin: any = { 'ccatalogo': 305,'activo': true };
    const consultaInsFin = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroInsFin, {});
    consultaInsFin.cantidad = 500;
    this.addConsultaCatalogos('INSFINR', consultaInsFin, this.retencionesComponent.lbancos, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('INSFINN', consultaInsFin, this.novedadessocioComponent.lbancos, super.llenaListaCatalogo, 'cdetalle');

    const mfiltroTipoCuenta: any = { 'ccatalogo': 306 };
    const consultaTipoCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoCuenta, {});
    consultaTipoCuenta.cantidad = 20;
    this.addConsultaCatalogos('TIPCUENTAR', consultaTipoCuenta, this.retencionesComponent.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('TIPCUENTAN', consultaTipoCuenta, this.novedadessocioComponent.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosProf: any = { 'ccatalogo': 220 };
    const consultaProf = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosProf, {});
    consultaProf.cantidad = 50;
    this.addConsultaCatalogos('TIPONOVEDADN', consultaProf, this.novedadessocioComponent.ltipoNovedad, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('TIPORETENCION', consultaProf, this.retencionesComponent.ltipoNovedad, super.llenaListaCatalogo, 'cdetalle');

    const mfiltroTipoLiquidacion: any = { 'ccatalogo': 2802 };
    const consultaTipoLiq = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoLiquidacion, {});
    this.addConsultaCatalogos('TIPLIQUID', consultaTipoLiq, this.ltipoliquidacion, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();

  }

  //activar boton nuevo en beneficiarios al tener tipo de baja fallecido

  //Mantenimiento

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  CambiarEtiqueta() {
    if (this.cesantia) {
      this.ntotal = 'Total Cesantia:';
      if (this.mcampos.cdetalletipoexp === 'ANT') {
        this.ntotal = 'Total Anticipo:';
      }
    } else {
      this.ntotal = 'Total Devolución:';
    }
  }

  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    super.addMantenimientoPorAlias(this.novedadessocioComponent.alias, this.novedadessocioComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.retencionesComponent.alias, this.retencionesComponent.getMantenimiento(2));
    super.grabar();
  }
}
