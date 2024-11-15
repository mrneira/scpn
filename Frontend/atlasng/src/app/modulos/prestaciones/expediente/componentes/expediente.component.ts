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
import { DatosComponent } from '../submodulos/datossocio/componentes/_datos.component';
import { ExpedientesComponent } from '../submodulos/datossocio/componentes/_expedientes.component';
import { AnticipoComponent } from '../submodulos/anticipo/componentes/anticipo.component';
import { AportesComponent } from './../submodulos/aportes/componentes/aportes.component';
import { PrestamosComponent } from '../submodulos/prestamos/componentes/prestamos.component';
import { NovedadessocioComponent } from '../submodulos/novedadessocio/componentes/novedadessocio.component';
import { RetencionesComponent } from '../submodulos/retenciones/componentes/retenciones.component';
import { CarrerahistoricoComponent } from '../submodulos/carrerahistorico/componentes/carrerahistorico.component';
import { JasperComponent } from '../../../../util/componentes/jasper/componentes/jasper.component';
import { BeneficiarioComponent } from '../submodulos/beneficiario/componentes/beneficiario.component';
import { DocumentosComponent } from '../submodulos/documentos/componentes/documentos.component';
import { ObservacionesComponent } from '../submodulos/observaciones/componentes/observaciones.component';
import { PagoInstitucionesComponent } from '../submodulos/pagoinstituciones/componentes/pagoInstituciones.component';
import { AppService } from '../../../../util/servicios/app.service';
import { MenuItem } from 'primeng/components/common/menuitem';
import { isArray } from 'util';


@Component({
  selector: 'app-expediente',
  templateUrl: 'expediente.html'
})
export class ExpedienteComponent extends BaseComponent implements OnInit, AfterViewInit {
  atencioncliente: any;

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  private lovSocios: LovPersonasComponent;

  @ViewChild(DatosComponent)
  datosComponent: DatosComponent;

  @ViewChild(ExpedientesComponent)
  expedientesComponent: ExpedientesComponent;

  @ViewChild(AnticipoComponent)
  anticipoComponent: AnticipoComponent;

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

  @ViewChild(BeneficiarioComponent)
  beneficiarioComponent: BeneficiarioComponent;

  @ViewChild(DocumentosComponent)
  documentosComponent: DocumentosComponent;

  @ViewChild(ObservacionesComponent)
  observacionesComponent: ObservacionesComponent;

  @ViewChild(PagoInstitucionesComponent)
  pagoInstitucionesComponent: PagoInstitucionesComponent;

  public collapsed = false;
  public habilitarliq = false;
  public habilitaranular = false;
  public habilitaretapa = false;
  public habilitararchivo = false;
  public habilitaranticipo = false;
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
  public ltipoliquidacion: SelectItem[] = [{ label: '...', value: null }];
  selectedValues: string[] = [];
  public registroExpediente: any = { 'mdatos': {} };
  public rqManexp: any = { 'mdatos': {} };
  public rollback = true;
  public mostrarDialogConfirmacion = false;
  public lregistrosRequisito: any = [];
  public edited = false;
  public mensaje = '';
  public aprobar = false;
  public mostrarcomentario = false;
  private anular = false;
  private steppeOnlyTwo = false;
  public ntotal = '';

  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'EXPEDIENTE', false);

  }

  ngOnInit() {
    this.componentehijo = this;
    this.mcampos.valorsolicitado = 0;
    super.init(this.formFiltros, this.route);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    this.route['queryParams'].subscribe((p: any) => {
      if (p.exp) {
        const exp = JSON.parse(p.exp);
        this.mfiltrosBandeja = exp.mfiltros;
        this.lflujonormal = exp.lflujonormal;
        this.mcampos.cdetalletipoexp = exp.cdetalletipoexp;
        this.mcampos.ncdetalletipoexp = exp.ntipo;
        this.mcampos.identificacion = exp.identificacion;
        this.mcampos.cpersona = exp.cpersona;
        this.mcampos.npersona = exp.npersona;
        this.mcampos.cexpediente = exp.cexpediente;
        this.expedientesComponent.mfiltros.cpersona = exp.cpersona;
        this.expedientesComponent.mfiltros.cdetalletipoexp = exp.cdetalletipoexp;
        this.expedientesComponent.mcampos.cdetalleetapa = exp.mfiltros.cdetalleetapa;
        this.aportesComponent.mfiltros.cpersona = exp.cpersona;
        this.novedadessocioComponent.mfiltros.cpersona = exp.cpersona;
        this.retencionesComponent.mfiltros.cpersona = exp.cpersona;
        this.carrerahistoricoComponent.mfiltros.cpersona = exp.cpersona;
        this.prestamosComponent.mfiltros.cpersona = exp.cpersona;
        this.documentosComponent.mfiltros.cmodulo = sessionStorage.getItem('m');
        this.documentosComponent.mcampos.identificacion = this.mcampos.identificacion;
        this.documentosComponent.mcampos.cdetalletipoexp = exp.cdetalletipoexp;
        this.beneficiarioComponent.mcampos.cdetalleetapa = exp.mfiltros.cdetalleetapa;
        this.pagoInstitucionesComponent.mcampos.cdetalleetapa = exp.mfiltros.cdetalleetapa;
        this.anticipoComponent.mfiltros.cpersona = exp.cpersona;
        this.observacionesComponent.mfiltros.cpersona = exp.cpersona;

        this.bandeja = true;
        if (exp.mfiltros.cdetalleetapa !== '2') {
          this.habilitaranticipo = true;
        }
        this.consultar();
      }
    });
  }

  crearNuevo() {

  }
  // Inicia CONSULTA *********************

  recargar() {
    super.recargar();
  }

  consultar() {
    this.crearDtoConsulta();
  }

  cancelar() {
    super.cancelar();
    this.mostrarDialogConfirmacion = false;
  }

  consultaDatos() {
    this.aportesComponent.consultar();
    this.prestamosComponent.consultar();
    this.novedadessocioComponent.mcampos.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.novedadessocioComponent.consultar();
    this.retencionesComponent.mcampos.bandeja = this.bandeja;
    this.retencionesComponent.mcampos.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.retencionesComponent.mcampos.fechaalta = this.mcampos.fechaAlta;
    this.retencionesComponent.mcampos.fechabaja = this.mcampos.fechaBaja;
    this.retencionesComponent.mcampos.coeficiente = this.mcampos.coeficiente
    this.retencionesComponent.mcampos.cdetallejerarquia = this.mcampos.cjerarquia;
    this.retencionesComponent.rqConsulta.secuencia = this.expedientesComponent.registro.secuencia;
    this.beneficiarioComponent.mfiltros.secuencia = this.expedientesComponent.registro.secuencia;
    this.pagoInstitucionesComponent.mfiltros.secuencia = this.expedientesComponent.registro.secuencia;
    this.retencionesComponent.consultar();
    this.carrerahistoricoComponent.consultar();
    this.documentosComponent.consultar();
    this.observacionesComponent.consultar();
    if (this.mcampos.cdetalletipoexp != 'ANT') {
      this.anticipoComponent.mfiltros.cpersona = this.mcampos.cpersona;
      this.anticipoComponent.consultar();
    }
    if (this.expedientesComponent.registro.secuencia > 0) {
      this.beneficiarioComponent.consultar();
      this.pagoInstitucionesComponent.consultar();
    }
  }

  public crearDtoConsulta() {
    this.rqConsulta = [];
    this.fijarFiltrosConsulta();
    // Consulta datos.
    this.datosComponent.bandeja = this.bandeja;
    //const conExpedientes = this.expedientesComponent.crearDtoConsulta();
    //this.addConsultaPorAlias(this.expedientesComponent.alias, conExpedientes);
    this.consultarSocio();
  }

  consultarSocio() {
    this.rqConsulta = [];
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 201;
    this.rqConsulta.CODIGOCONSULTA = 'DATOSEXPEDIENTE';
    this.rqConsulta.cpersona = this.mcampos.cpersona;
    this.rqConsulta.bandeja = this.bandeja;
    this.rqConsulta.etapa = "2";
    if (!this.estaVacio(this.mcampos.cdetalletipoexp)) {
      this.rqConsulta.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    }
    if (this.bandeja) {
      this.rqConsulta.cexpediente = this.mcampos.cexpediente;
      this.rqConsulta.cdetalletipoexp = this.mcampos.cdetalletipoexp;
      this.rqConsulta.etapa = this.expedientesComponent.mcampos.cdetalleetapa;
    }
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod === 'OK') {
            this.manejaRespuestaDatosSocio(resp);
            this.crearBeneficiario(resp);
            if (this.estaVacio(this.mcampos.cdetalletipoexp)) {
              this.mcampos.cdetalletipoexp = 'CES'
            }
            this.manejaRespuestaRequisitos(resp);
            this.manejaRespuestaExpediente(resp);

            if (this.bandeja) {
              this.getAnioBaja();
              this.habilitaranular = false;
              if (this.estaVacio(this.mcampos.cdetalletipoexp)) {
                this.collapsed = false;
                this.habilitarliq = false;
                return;
              }
              if (this.expedientesComponent.registro.cdetalleetapa === '2') {
                this.habilitaranular = true;
              }
              this.consultaDatos();
              this.estadoListaTipos = false;
              this.cargarFlujo();
              this.collapsed = true;
              this.habilitarliq = true;
              this.habilitaretapa = true;
            }


            if (this.rollback) {
              this.enproceso = false;
              this.grabarexpe(true);
            } else {
              return;
            }
          } else {
            this.ltipoliquidacion = [];
            this.ltipoliquidacion.push({ label: '...', value: null });
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });

  }

  crearBeneficiario(resp: any) {
    this.beneficiarioComponent.lregistros = [];
    const mcat = resp.TIPLIQUID;
    const msocio = resp.DATOSSOCIO[0];
    for (const i in mcat) {
      if (mcat.hasOwnProperty(i)) {
        const reg: any = mcat[i];
        if (reg.cdetalle === this.mcampos.cdetalletipoexp) {
          this.beneficiarioComponent.mcampos.beneficiariosocio = reg.mdatos.beneficiariosocio;
          if (!reg.mdatos.beneficiariosocio) {
            this.beneficiarioComponent.crearNuevo();
            this.beneficiarioComponent.registro.identificacion = msocio.identificacion;
            this.beneficiarioComponent.registro.primernombre = msocio.primernombre;
            this.beneficiarioComponent.registro.segundonombre = msocio.segundonombre;
            this.beneficiarioComponent.registro.primerapellido = msocio.apellidopaterno;
            this.beneficiarioComponent.registro.segundoapellido = msocio.apellidomaterno;
            this.beneficiarioComponent.registro.fechanacimiento = msocio.fnacimiento;
            this.beneficiarioComponent.registro.tipoinstitucioncdetalle = msocio.tipoinstitucioncdetalle;
            this.beneficiarioComponent.registro.tipocuentacdetalle = msocio.tipocuentacdetalle;
            this.beneficiarioComponent.registro.numerocuenta = msocio.numero;

            this.beneficiarioComponent.registrarEtiqueta(this.beneficiarioComponent.registro, this.beneficiarioComponent.lparentezco, 'cdetalleparentesco', 'nparentezco');
            this.beneficiarioComponent.registrarEtiqueta(this.beneficiarioComponent.registro, this.beneficiarioComponent.lbancos, 'tipoinstitucioncdetalle', 'nbanco');
            this.beneficiarioComponent.registrarEtiqueta(this.beneficiarioComponent.registro, this.beneficiarioComponent.ltipocuenta, 'tipocuentacdetalle', 'ncuenta');
            this.beneficiarioComponent.actualizar();
          } else {
            this.beneficiarioComponent.selectRegistro(this.beneficiarioComponent.registro);
            this.beneficiarioComponent.cancelar();
          }
        }
      }
    }
  }

  manejaRespuestaDatosSocio(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      const msocio = resp.DATOSSOCIO[0];
      this.mcampos.identificacion = msocio.identificacion;
      if (msocio.liquidado) {
        this.mcampos.fechaAlta = msocio.falta < msocio.fingreso ? msocio.fingreso : msocio.falta;
      } else {
        this.mcampos.fechaAlta = msocio.falta > msocio.fingreso ? msocio.fingreso : msocio.falta;
      }
      this.mcampos.grado = msocio.grado;
      this.mcampos.cjerarquia = msocio.cjerarquia;
      this.mcampos.fingreso = msocio.fingreso;
      this.mcampos.fechaBaja = new Date(msocio.fbaja);
      this.mcampos.fnacimiento = msocio.fnacimiento;
      this.mcampos.tiemposervicio = msocio.tiemposervico;
      this.mcampos.edad = msocio.edad;
      this.mcampos.coeficiente = msocio.coeficiente;
      this.mcampos.tipobaja = msocio.tipobaja;
      this.mcampos.ctipobaja = msocio.ctipobaja;
      this.devolucion = msocio.devolucion;
      this.cesantia = msocio.cesantia;
      this.expedientesComponent.mcampos.cjerarquia = this.mcampos.cjerarquia
      this.expedientesComponent.mcampos.tipoinstitucioncdetalle = msocio.tipoinstitucioncdetalle;
      this.expedientesComponent.mcampos.cpersona = this.mcampos.cpersona;
      this.expedientesComponent.mcampos.tipocuentacdetalle = msocio.tipocuentacdetalle;
      this.expedientesComponent.mcampos.numerocuentabancaria = msocio.numero;
      if (!this.estaVacio(this.mcampos.tipobaja) && !this.bandeja) {
        this.estadoListaTipos = true;
      }
      this.mcampos.estadoSocio = msocio.estadosocio;
      this.mcampos.genero = msocio.genero;
      this.mcampos.numaportaciones = msocio.totalaportes;
      this.mcampos.aporteacumuladoCabecera = msocio.acumuladoaportes;

      const mcat = resp.TIPLIQUID;
      this.fijarListaTipoLiquidacion(mcat, msocio);

    }
    this.lconsulta = [];
  }

  /**Manejo respuesta de consulta de requisitos. */
  private manejaRespuestaRequisitos(resp: any) {
    if (resp.cod === 'OK') {
      this.lregistrosRequisito = resp.DATOSREQUISITO
    }
  }

  private fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  getAnioBaja() {
    const fechabaja = new Date(this.mcampos.fechaBaja);
    const year = fechabaja.getFullYear();
    this.expedientesComponent.mcampos.year = year;
  }

  private manejaRespuestaExpediente(resp: any) {
    const exp = resp.EXPEDIENTE;
    if (this.estaVacio(exp)) {
      this.expedientesComponent.registro.secuencia = 0;
      //  return;
    } else {
      this.expedientesComponent.registro.secuencia = exp.secuencia;
      this.expedientesComponent.registro.cexpediente = exp.cexpediente;
      this.expedientesComponent.registro.numerocarpeta = exp.numerocarpeta;
      //this.expedientesComponent.registro.fechaliquidacion = exp.fechaliquidacion;
      this.expedientesComponent.registro.optlock = exp.optlock;
      this.expedientesComponent.registro.subtotal = exp.subtotal;
      this.expedientesComponent.registro.totalliquidacion = exp.totalliquidacion;
      this.expedientesComponent.registro.totalsolicitado = exp.totalsolicitado;
      this.expedientesComponent.registro.cdetalleetapa = exp.cdetalleetapa;
      this.mcampos.valorsolicitado = exp.totalsolicitado;
    }

  }

  private manejaRespuestaBeneficiario(resp: any) {
    this.beneficiarioComponent.alias = 'BENEFICIARIOSFINAL';
    for (const i in resp.BENEFICIARIOSFINAL) {
      resp.BENEFICIARIOSFINAL[i].fechanacimiento = new Date(resp.BENEFICIARIOSFINAL[i].fechanacimiento);
    }
    this.beneficiarioComponent.postQuery(resp);

  }

  private manejoRespuestaPagoInstituciones(resp: any) {
    this.pagoInstitucionesComponent.alias = 'BENEFICIARIOSFINALINST';
    for (const i in resp.BENEFICIARIOSFINALINST) {
      resp.BENEFICIARIOSFINALINST[i].fechanacimiento = new Date(resp.BENEFICIARIOSFINALINST[i].fechanacimiento);
    }
    this.pagoInstitucionesComponent.postQuery(resp);
  }

  private manejaRespuestaSimulacion(resp: any): boolean {
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
      this.mcampos.taportesd = this.redondear(msimulacion.daportes * 100 / 20, 2);
      this.mcampos.taportesi = this.redondear(msimulacion.TAPORTE - this.mcampos.taportesd, 2);
      this.mcampos.aporteacumulado = msimulacion.TAPORTE;
      this.mcampos.valorinteres = msimulacion.interes;
      this.mcampos.porcentaje = msimulacion.porcentaje;
      this.mcampos.nporcentaje = msimulacion.nporcentaje;
      this.mcampos.valorsolicitado = msimulacion.totalsolicitado;

      this.mcampos.valordescuentossim = this.mcampos.tprestamos + this.mcampos.tnovedades + this.mcampos.tretenciones;// + this.mcampos.daportes;

      if (mbonificacion[4]) {
        this.mcampos.tiempomixto = "SI";
      }
      this.mcampos.cuantiaBasica = mbonificacion[1];
      this.mcampos.vbonificacion = mbonificacion[3];
    }
    this.lconsulta = [];
    if (this.llenarMensaje()) {
      return true;
    } else {
      return false;
    }
  }

  private llenarMensaje(): boolean {
    this.mcampos.mensaje = "";
    if (this.mcampos.cdetalletipoexp === "ANT" && !this.devolucion) {
      this.mcampos.mensaje = "Nota: ";
      if (!this.estaVacio(this.mcampos.nporcentaje)) {
        this.mcampos.mensaje = this.mcampos.mensaje + " - " + this.mcampos.nporcentaje
        this.mostrarMensajeError(this.mcampos.mensaje);
        this.habilitarliq = false;
        return true;
      } else {
        this.mcampos.mensaje = this.mcampos.mensaje + " - Valor correponde al " + this.mcampos.porcentaje + " de la liquidación";
        if (this.rollback) {
          this.habilitarliq = true;
        }
        return false;
      }
    }
  }

  public postQuery(resp: any) {
    // this.expedientesComponent.postQuery(resp);
    this.consultarSocio();

    if (this.bandeja) {
      this.getAnioBaja();
      this.habilitaranular = false;
      if (this.estaVacio(this.mcampos.cdetalletipoexp)) {
        this.collapsed = false;
        this.habilitarliq = false;
        return;
      }
      if (this.expedientesComponent.registro.cdetalleetapa === '2') {
        this.habilitaranular = true;
      }
      this.consultaDatos();
      this.estadoListaTipos = false;
      this.cargarFlujo();
      this.collapsed = true;
      this.habilitarliq = true;
      this.habilitaretapa = true;
    }
  }

  // Fin CONSULTA *********************

  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovSocios.mfiltros.csocio = 1;
    this.lovSocios.mcampos.identificacion = undefined;
    this.lovSocios.mcampos.nombre = undefined;
    this.lovSocios.showDialog();
  }

  /**Carga el flujo de la solicitud. */
  cargarFlujo(): any {

    this.itemsPasos = this.lflujonormal;
    this.lflujo = this.lflujonormal;

    this.idpaso = this.lflujo.find(x => x.value.estado === this.expedientesComponent.registro.cdetalleetapa).value.paso;
    if (this.idpaso !== 5) {
      this.siguienteestatus = this.lflujo.find(x => Number(x.value.paso) === Number(this.idpaso) + 1).value.estado;
    } else {
      this.habilitararchivo = true;
    }
    this.idpaso = this.idpaso - 1;
    if (Number(this.idpaso) > 0) {
      this.anteriorestatus = this.lflujo.find(x => Number(x.value.paso) === Number(this.idpaso)).value.estado;
    }
  }

  descargarReporteEcxel() {
    this.jasper.formatoexportar = 'xls';
    this.descargarReporte();
  }

  descargarReporte() {
    let path = '';
    if (this.estaVacio(this.mcampos.identificacion)) {
      this.mostrarMensajeError("SELECCIONES UN SOCIO");
      return;
    }
    switch (this.mcampos.cdetalletipoexp) {
      case 'CES':
        path = '/CesantiaReportes/Prestaciones/ExpedientePolicia';
        break;
      case 'CEF':
        path = '/CesantiaReportes/Prestaciones/ExpedientePolicia';
        break;
      case 'DEV':
        path = '/CesantiaReportes/Prestaciones/DevolucionAportes';
        break;
      case 'DEH':
        path = '/CesantiaReportes/Prestaciones/DevolucionAportes';
        break;
      case 'ANT':
        path = '/CesantiaReportes/Prestaciones/AnticipoCesantia';
        break;
    }


    this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
    this.jasper.parametros['@i_cdetalletipoexp'] = this.mcampos.cdetalletipoexp;
    this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['@w_falta'] = this.calendarToFechaString(new Date(this.mcampos.fechaAlta));
    this.jasper.parametros['@w_tservicio'] = this.mcampos.tiemposervicio;
    this.jasper.parametros['archivoReporteUrl'] = path;
    //this.jasper.formatoexportar = 'pdf';
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

  /**Retorno de lov de personas. */
  fijarLovSociosSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.estadoListaTipos = true;
      this.mcampos.cdetalletipoexp = null
      this.collapsed = false;
      this.habilitarliq = false;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.anticipoComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.aportesComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.novedadessocioComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.retencionesComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.carrerahistoricoComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.prestamosComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.documentosComponent.mfiltros.cmodulo = sessionStorage.getItem('m');
      this.documentosComponent.mcampos.identificacion = this.mcampos.identificacion;
      this.observacionesComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.expedientesComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.steppeOnlyTwo = false;
      this.rollback = true;
      this.consultar();
    }
  }

  recalcularBeneficiario(reg: any): void {
    if (reg.registro !== undefined) {
      if (reg.registro) {
        this.grabarexpe(false);
      }
    }
  }

  recalcularNovedades(reg: any): void {
    if (reg.registro !== undefined) {
      if (reg.registro) {
        this.grabarexpe(false);
      } else {
        this.grabarexpe(true);
      }
    }
  }

  recalcularRetenciones(reg: any): void {
    if (reg.registro !== undefined) {
      if (reg.registro) {
        this.grabarexpe(false);
      } else {
        this.grabarexpe(true);
      }
    }
  }

  recalcularPrestamos(reg: any): void {
    if (reg.error !== undefined) {
      if (reg.error) {
        return;
      }
    }

    if (reg.registro !== undefined) {
      if (reg.registro) {
        this.grabarexpe(false);
      } else {
        this.grabarexpe(true);
      }
    }
  }

  // calcularAnticipo() {
  //   if (this.bandeja) {
  //     this.grabarexpe(false);
  //   } else {
  //     this.grabarexpe(true);
  //   }
  // }
  ValidarValorSolicitado() {
    this.encerarMensajes();
    if (this.mcampos.valorsolicitado < 0) {
      this.mostrarMensajeError("VALOR SOLICITADO NO PUEDE SER MENOR A CERO: " + this.mcampos.valorsolicitado);
    }
    if (this.mcampos.total < this.mcampos.valorsolicitado) {
      this.mostrarMensajeError("VALOR SOLICITADO: " + this.mcampos.valorsolicitado + " NO PUEDE SER MENOR AL TOTAL A RECIBIR: " + this.mcampos.total);
    }
  }



  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltroInsFin: any = { 'ccatalogo': 305,'activo': true };
    const consultaInsFin = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroInsFin, {});
    consultaInsFin.cantidad = 500;
    this.addConsultaCatalogos('INSFINR', consultaInsFin, this.retencionesComponent.lbancos, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('INSFINN', consultaInsFin, this.novedadessocioComponent.lbancos, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('INSFINN1', consultaInsFin, this.beneficiarioComponent.lbancos, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('INSFINN2', consultaInsFin, this.pagoInstitucionesComponent.lbancos, super.llenaListaCatalogo, 'cdetalle');

    const mfiltroTipoCuenta: any = { 'ccatalogo': 306 };
    const consultaTipoCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoCuenta, {});
    consultaTipoCuenta.cantidad = 20;
    this.addConsultaCatalogos('TIPCUENTAR', consultaTipoCuenta, this.retencionesComponent.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('TIPCUENTAN', consultaTipoCuenta, this.novedadessocioComponent.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('TIPCUENTAN1', consultaTipoCuenta, this.beneficiarioComponent.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('TIPCUENTAN2', consultaTipoCuenta, this.pagoInstitucionesComponent.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosProf: any = { 'ccatalogo': 220 };
    //const mfiltrosespProf: any = { 'clegal': 'is null' };
    const mfiltrosespProf: any = { 'clegal': 'is null', 'cdetalle': `not in ('15','16','17','18','21','22')` };
    const consultaProf = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosProf, mfiltrosespProf);
    consultaProf.cantidad = 50;
    this.addConsultaCatalogos('TIPONOVEDADN', consultaProf, this.novedadessocioComponent.ltipoNovedad, super.llenaListaCatalogo, 'cdetalle');
    this.addConsultaCatalogos('TIPORETENCION', consultaProf, this.retencionesComponent.ltipoNovedad, super.llenaListaCatalogo, 'cdetalle');


    const mfiltrosParent: any = { 'ccatalogo': 1126 };
    const consultaParent = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosParent, {});
    consultaParent.cantidad = 50;
    this.addConsultaCatalogos('PARETNZCO', consultaParent, this.beneficiarioComponent.lparentezco, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();

  }

  fijarListaTipoLiquidacion(resp: any, msocio: any) {
    this.ltipoliquidacion = [];

    this.ltipoliquidacion.push({ label: '...', value: null });
    for (const i in resp) {
      if (resp.hasOwnProperty(i)) {
        const reg: any = resp[i];
        this.ltipoliquidacion.push({ label: reg.nombre, value: reg.cdetalle });
      }
    }
    if (!this.bandeja && this.estaVacio(this.mcampos.cdetalletipoexp)) {
      this.mcampos.cdetalletipoexp = msocio.cdetalletipoexp;
    }
    this.expedientesComponent.mcampos.cdetalletipoexp = this.mcampos.cdetalletipoexp;
  }

  //activar boton nuevo en beneficiarios al tener tipo de baja fallecido

  //Mantenimiento

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  CambiarEtiqueta() {
    if (this.mcampos.cdetalletipoexp === 'ANT') {
      this.expedientesComponent.lblnoexpediente = 'Nro. Solicitud';
    } else {
      this.expedientesComponent.lblnoexpediente = 'Nro. Expediente';
    }

    if (this.cesantia) {
      this.ntotal = 'Total Cesantia:';
      if (this.mcampos.cdetalletipoexp === 'ANT') {
        this.ntotal = 'Total Anticipo:';
      }
    } else {
      this.ntotal = 'Total Devolución:';
    }
  }

  grabarexpe(rollback = false): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.CambiarEtiqueta();

    this.fijarValoresGrabarExpediente(rollback);
    this.expedientesComponent.selectRegistro(this.expedientesComponent.registro);
    this.expedientesComponent.fijarValoresGrabarExpediente();
    this.expedientesComponent.actualizar();
    super.addMantenimientoPorAlias(this.expedientesComponent.alias, this.expedientesComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.beneficiarioComponent.alias, this.beneficiarioComponent.getMantenimiento(2));
    let dataSend = this.getRequestMantenimiento();
    if (
      dataSend['CODMODULOORIGEN'] == "28" &&
      dataSend['CODTRANSACCIONORIGEN'] == "2" &&
      !this.estaVacio(dataSend['DATOSEXPEDIENTE']['ins']) &&
      isArray(dataSend['DATOSEXPEDIENTE']['ins']) &&
      dataSend['DATOSEXPEDIENTE']['ins'].length > 0 &&
      dataSend['DATOSEXPEDIENTE']['ins'][0]['cexpediente'] &&
      (String(dataSend['DATOSEXPEDIENTE']['ins'][0]['cexpediente']).split("/")).length === 2
    ){
      dataSend = {
        ...dataSend, 
        DATOSEXPEDIENTEASIGNACION:{ 
          ins:[], 
          upd:[{cexpediente:dataSend['DATOSEXPEDIENTE']['ins'][0]['cexpediente'], estadoasignacion:true}], 
          del:[], 
          enviarSP:false, 
          esMonetario:false, 
          pos:1, 
          bean: "tpreexpedienteasignacion"
        }
      };
      dataSend['DATOSEXPEDIENTE']['ins'][0]['cexpediente'] = String(dataSend['DATOSEXPEDIENTE']['ins'][0]['cexpediente']).split("/")[0];
    }
    this.dtoServicios.ejecutarRestMantenimiento(dataSend)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false, false);
          if (resp.cod === 'OK') {
            let statusvalidation = true;
            if(resp['asignacionexpediente']){
              this.datosComponent.cexpediente = resp['asignacionexpediente'];
            }
            else if(resp['EXPEDIENTE']['cexpediente']) {
              this.datosComponent.cexpediente = resp['EXPEDIENTE']['cexpediente'];
            }
            else {
              this.datosComponent.cexpediente = "No existe una asignación de expediente";
              statusvalidation = false;
            }
            if(statusvalidation){
              this.habilitarliq = true;
              this.datosComponent.desEditar = true;
              this.enproceso = false;
              if (this.manejaRespuestaSimulacion(resp)) {
                return;
              }
              if (!rollback) {
                this.manejaRespuestaExpediente(resp);
                this.manejaRespuestaBeneficiario(resp);
                this.manejoRespuestaPagoInstituciones(resp);
                this.msgs = [];
                this.msgs.push({ severity: 'success', summary: 'TRANSACCIÓN FINALIZADA CORRECTAMENTE', detail: '' });
                //this.msgs.push({ severity: 'success', summary: 'EXPEDIENTE No '+resp.EXPEDIENTE.cexpediente+' SE ENCUENTRA EN ETAPA PRESTACIONES', detail: '' });
                this.dtoServicios.mostrarMensaje(this.msgs);
                this.habilitarliq = false;
                //this.expedientesComponent.consultar();
              } else {
                if (this.estaVacio(this.mcampos.cdetalletipoexp)) {
                  this.collapsed = false;
                  this.habilitarliq = false;
                  return;
                }
                this.consultaDatos();
                // this.consultarSocio()
                this.collapsed = true;
                this.habilitarliq = true;
                this.expedientesComponent.mfiltros.cdetalletipoexp = this.mcampos.cdetalletipoexp;
                this.expedientesComponent.consultar();
                this.expedientesComponent.mcampos.bandeja = this.bandeja;
                this.beneficiarioComponent.mcampos.bandeja = this.bandeja;
                this.pagoInstitucionesComponent.mcampos.bandeja = this.bandeja;
                this.novedadessocioComponent.mcampos.bandeja = this.bandeja;
                this.retencionesComponent.mcampos.bandeja = this.bandeja;
                this.beneficiarioComponent.mcampos.secuencia = this.expedientesComponent.registro.secuencia;
                this.beneficiarioComponent.mcampos.identificacion = this.mcampos.identificacion;
                this.pagoInstitucionesComponent.mcampos.secuencia = this.expedientesComponent.registro.secuencia;
                this.pagoInstitucionesComponent.mcampos.identificacion = this.mcampos.identificacion;
                this.prestamosComponent.mcampos.cjerarquia = this.mcampos.cjerarquia;
                this.prestamosComponent.mcampos.bandeja = this.bandeja;
                this.documentosComponent.mcampos.cdetalletipoexp = this.mcampos.cdetalletipoexp;
                this.getAnioBaja();
              }
              //this.manejaRespuestaSimulacion(resp);
            }else{
              this.dtoServicios.manejoError({message: "No es posible crear el expediente; No se asigando un expediente previamente"});
            }
          } else {
            this.collapsed = false;
            this.habilitarliq = false;
            this.datosComponent.desEditar = false;
            this.estadoListaTipos = true;
            this.getAnioBaja();
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }


  fijarValoresGrabarExpediente(rollback): void {
    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');
    this.rqMantenimiento.validaexp = true;
    switch (this.expedientesComponent.registro.cdetalleetapa) {
      case '5':
        this.rqMantenimiento.validaexp = false;
    }
    this.rqMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    this.rqMantenimiento['cmodulo'] = 28;
    this.rqMantenimiento['ctransaccion'] = 2;
    this.rqMantenimiento['rollback'] = rollback;
    if (this.estaVacio(this.expedientesComponent.registro.cdetalleetapa)) {
      this.rqMantenimiento.etapa = '2';
    } else {
      this.rqMantenimiento.etapa = this.expedientesComponent.registro.cdetalleetapa;
    }
    this.rqMantenimiento.bandeja = this.bandeja;
    if (this.estaVacio(this.mcampos.porcentaje)) {
      this.rqMantenimiento.porcentaje = 0;
    } else {
      this.rqMantenimiento.porcentaje = this.mcampos.porcentaje
    }
    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.rqMantenimiento.cdetallejerarquia = this.mcampos.cjerarquia;
    this.rqMantenimiento.fechaalta = this.mcampos.fingreso;
    this.rqMantenimiento.fechabaja = this.mcampos.fechaBaja;
    this.rqMantenimiento.coeficiente = this.mcampos.coeficiente;
    this.rqMantenimiento.siguienteestatus = '2';
    this.rqMantenimiento.anteriorestatus = '1';
    this.rqMantenimiento.lregistrosRequisito = this.lregistrosRequisito;
    this.rqMantenimiento.valorsolicitado = this.mcampos.valorsolicitado;
    this.rqMantenimiento.ctipobaja = this.mcampos.ctipobaja;
    this.expedientesComponent.mcampos.numerocarpeta = this.expedientesComponent.registro.numerocarpeta;
    this.expedientesComponent.mcampos.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.expedientesComponent.mcampos.fechaAlta = this.mcampos.fechaAlta;
    this.expedientesComponent.mcampos.fechaBaja = this.mcampos.fechaBaja;
    this.expedientesComponent.mcampos.tiemposervicio = this.mcampos.tiemposervicio;
  }


  validaGrabar() {
    return true
  }

  public postCommit(resp: any) {
    if (resp.cod === 'OK') {
      this.prestamosComponent.postCommit(resp);
      this.habilitaranular = false;
      this.habilitaretapa = false;
      this.habilitararchivo = true;
      this.habilitarliq = true;
      if (!this.estaVacio(resp.ccomprobante)) {
        this.mcampos.ccomprobante = resp.ccomprobante;
        this.descargarReporteComprobanteContable();
      }
    } else {
      this.habilitaretapa = false;
      this.habilitararchivo = true;
    }
  }

  descargarReporteComprobanteContable(): void {
    let tipoComprobante = '';
    tipoComprobante = 'Diario';
    // Agregar parametros
    this.jasper.parametros['@i_ccomprobante'] = this.mcampos.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }


  retornoBuzon(): void {
    this.cargarPagina();
  }

  aprobarEtapa(): void {
    super.encerarMensajes();
    //this.rqMantenimiento = [];
    this.rqMantenimiento.comentario = null;
    this.mostrarDialogConfirmacion = true;
    this.mcampos.msg = "Está seguro que desea aprobar el expediente. ?";
    this.aprobar = true;
    this.mostrarcomentario = false;
    let ctransaccion = 120;
    switch (this.expedientesComponent.registro.cdetalleetapa) {
      case '3':
        ctransaccion = 123;
        this.mostrarcomentario = true;
        break;
      case '4':
        ctransaccion = 124;
        this.mostrarcomentario = true;
        this.rqMantenimiento.total = this.mcampos.total;
        this.rqMantenimiento.total = this.mcampos.valorsolicitado;
    }

    // Ejecuta transaccion interna
    this.rqMantenimiento['CODMODULOORIGEN'] = sessionStorage.getItem('m');
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = sessionStorage.getItem('t');
    this.rqMantenimiento['cmodulo'] = 28;
    this.rqMantenimiento['ctransaccion'] = ctransaccion;
    this.rqMantenimiento['rollback'] = false;
    this.rqMantenimiento.secuencia = this.expedientesComponent.registro.secuencia;
    this.rqMantenimiento.siguienteestatus = this.siguienteestatus;
    this.rqMantenimiento.anteriorestatus = this.anteriorestatus;
    this.rqMantenimiento.generarcomprobante = true;
    this.rqMantenimiento.cdetalletipoexp = this.mcampos.cdetalletipoexp;
  }

  rechazarEtapa(): void {
    super.encerarMensajes();
    //this.rqMantenimiento = [];
    if (this.anteriorestatus === '1') {
      super.mostrarMensajeError("NO EXISTE ETAPA ANTERIOR");
      return;
    }
    this.rqMantenimiento.comentario = null;
    this.mostrarDialogConfirmacion = true;
    this.mcampos.msg = "Está seguro que desea rechazar el expediente. ?";
    this.aprobar = false;
    this.mostrarcomentario = true;
    // Ejecuta transaccion interna
    this.rqMantenimiento['CODMODULOORIGEN'] = sessionStorage.getItem('m');
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = sessionStorage.getItem('t');
    this.rqMantenimiento['cmodulo'] = 28;
    this.rqMantenimiento['ctransaccion'] = 121;
    this.rqMantenimiento['rollback'] = false;
    this.rqMantenimiento.secuencia = this.expedientesComponent.registro.secuencia;
    this.rqMantenimiento.siguienteestatus = this.siguienteestatus;
    this.rqMantenimiento.anteriorestatus = this.anteriorestatus;
  }

  anularExpediente(): void {
    super.encerarMensajes();
    this.rqMantenimiento.comentario = null;
    this.mostrarDialogConfirmacion = true;
    this.mostrarcomentario = true;
    this.mcampos.msg = "Está seguro que desea anular el expediente. ?";
    this.anular = true;
    this.aprobar = false;
    // Ejecuta transaccion interna
    this.rqMantenimiento['CODMODULOORIGEN'] = sessionStorage.getItem('m');
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = sessionStorage.getItem('t');
    this.rqMantenimiento['cmodulo'] = 28;
    this.rqMantenimiento['ctransaccion'] = sessionStorage.getItem('t');
    this.rqMantenimiento['rollback'] = false;
  }

  confirmarEtapa() {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.expedientesComponent.selectRegistro(this.expedientesComponent.registro);
    if (this.anular) {
      this.expedientesComponent.registro.cdetalleestado = 'NEG';
      this.expedientesComponent.registro.observacion = this.rqMantenimiento.comentario;//MNE 20240910
      this.rqMantenimiento.DATOSEXPEDIENTEASIGNACION = {
        ins:[],
        upd:[
          {
            cexpediente: this.expedientesComponent.registro.cexpediente,
            cdetalleestadoregistro: 'NEG'
          }
        ],
        del:[],
        esMonetario:false,
        enviarSP: false,
        bean: 'tpreexpedienteasignacion',
        pos: 1
      };
    } else {
      if (this.aprobar) {
        if (this.expedientesComponent.registro.cdetalleetapa === '2') {
          this.expedientesComponent.registro.fechaliquidacion = this.fechaactual;
        }
        if (this.expedientesComponent.registro.cdetalleetapa === '4') {
          if (!this.ValidarBeneficiario()) {
            this.mostrarDialogConfirmacion = false;
            return;
          }
          this.expedientesComponent.registro.cdetalleestado = 'CAN';
          this.expedientesComponent.registro.fechafin = this.fechaactual;
          this.rqMantenimiento.DATOSEXPEDIENTEASIGNACION = {
            ins:[],
            upd:[
              {
                cexpediente: this.expedientesComponent.registro.cexpediente,
                cdetalleestadoregistro: 'CAN'
              }
            ],
            del:[],
            esMonetario:false,
            enviarSP: false,
            bean: 'tpreexpedienteasignacion',
            pos: 1
          };
        }
        this.expedientesComponent.registro.cdetalleetapa = this.siguienteestatus;
      } else {
        this.expedientesComponent.registro.cdetalleetapa = this.anteriorestatus;
      }
    }
    this.expedientesComponent.actualizar();
    this.expedientesComponent.formvalidado = true;
    super.addMantenimientoPorAlias(this.expedientesComponent.alias, this.expedientesComponent.getMantenimiento(1));
    this.mostrarDialogConfirmacion = false;
    super.grabar();
  }

  MostrarRequisitos(rollback = false) {
    this.expedientesComponent.registro.cexpediente = (this.datosComponent.cexpediente != "No existe una asignación de expediente")? this.datosComponent.cexpediente : undefined;
    this.rollback = rollback;
    super.encerarMensajes();

    if (this.mcampos.cdetalletipoexp !== 'ANT') {
      //Valida que los valores vencidos de prestamos sean cancelados
    if (Number(this.prestamosComponent.totalvencido) > 0) {
      this.mostrarMensajeError('SE REQUIERE CANCELAR LOS VALORES VENCIDOS DE PRÉSTAMOS');
      return;
    }
      // if (this.expedientesComponent.mcampos.year >= 2019) {
      //   if (this.estaVacio(this.expedientesComponent.registro.numerocarpeta)
      //     && !rollback) {
      //     this.mostrarMensajeError('INGRESE LOS DATOS OBLIGATORIOS');
      //     return;
      //   }
      // } else {
      //   if ((this.estaVacio(this.expedientesComponent.registro.numerocarpeta) || this.estaVacio(this.expedientesComponent.registro.cexpediente))
      //     && !rollback) {
      //     this.mostrarMensajeError('INGRESE LOS DATOS OBLIGATORIOS');
      //     return;
      //   }
      // }
      if ((this.estaVacio(this.expedientesComponent.registro.numerocarpeta) || this.estaVacio(this.expedientesComponent.registro.cexpediente)) && !rollback) {
        this.mostrarMensajeError('INGRESE LOS DATOS OBLIGATORIOS');
        return;
      }
    } else if (this.estaVacio(this.expedientesComponent.registro.cexpediente) && !rollback) {
        this.mostrarMensajeError('INGRESE LOS DATOS OBLIGATORIOS');
        this.rollback = true;
        return;
      }

    this.mostrarDialogoGenerico = true;
  }

  ValidarBeneficiario(): boolean {
    if (this.beneficiarioComponent.lregistros.length === 0) {
      return true;
    }

    let cont = 0;

    for (const i in this.beneficiarioComponent.lregistros) {
      if (this.beneficiarioComponent.lregistros.hasOwnProperty(i)) {
        const reg: any = this.beneficiarioComponent.lregistros[i];
        if (reg !== undefined && reg.estado && reg.valorliquidacion > 0) {
          if (this.estaVacio(reg.tipoinstitucioncdetalle) || this.estaVacio(reg.tipocuentacdetalle) || this.estaVacio(reg.numerocuenta)) {
            cont = cont + 1;
          }


        }
      }
    }

    if (cont > 0) {
      this.mostrarMensajeError('ALGÚN BENEFICIARIOS NO TIENEN LAS REFERENCIAS BANCARIAS');
      return false;
    } else {
      this.encerarMensajes();
      return true;
    }

  }

  ValidarRequisitos() {
    for (const i in this.lregistrosRequisito) {
      if (this.lregistrosRequisito.hasOwnProperty(i)) {
        const reg: any = this.lregistrosRequisito[i];
        if (reg !== undefined && reg.mdatos.verificada !== null && reg.mdatos.verificada === false) {
          if (reg.opcional === false) {
            this.mostrarMensajeRequisitos('FALTAN REQUISITOS HA VALIDAR');
            return;
          }
        }
      }
    }
    this.mostrarDialogoGenerico = false;
    this.grabarexpe();
  }

  mostrarMensajeRequisitos(mns: string) {
    this.mensaje = mns;//"INGRESE EL VALOR DE LA NOVEDAD";
    this.edited = true;
    //wait 3 Seconds and hide
    setTimeout(function () {
      this.edited = false;
    }.bind(this), 5000);
  }

  public cargarPagina() {
    const opciones = {};
    const etapa = this.expedientesComponent.registro.cdetalleetapa;
    let tran;
    switch (etapa) {
      case '1':
        tran = 1;
        break;
      case '2':
        tran = 26;
        break;
      case '3':
        tran = 27;
        break;
      case '4':
        tran = 28;
        break;
      case '5':
        tran = 1;
    }

    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = sessionStorage.getItem('m') + '-' + tran + ' Bandeja';
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'false';
    opciones['del'] = 'false';
    opciones['upd'] = 'false';

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);
    sessionStorage.setItem('path', opciones['path']);

    this.router.navigate([opciones['path']], {
      skipLocationChange: true,
      queryParams: {
        band: JSON.stringify({})
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }

}
