import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { AppService } from 'app/util/servicios/app.service';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovPersonaVistaComponent } from '../../../../personas/lov/personavista/componentes/lov.personaVista.component';
import { DatosGeneralesComponent } from '../submodulos/datosgenerales/componentes/_datosGenerales.component';
import { SolicitudComponent } from '../submodulos/datosgenerales/componentes/_solicitud.component';
import { TablaAmortizacionComponent } from '../../solicitudingreso/submodulos/tablaamortizacion/componentes/_tablaAmortizacion.component';
import { CapacidadPagoComponent } from '../submodulos/capacidadpago/componentes/_capacidadPago.component';

@Component({
  selector: 'app-solicitud-capacidad-pago',
  templateUrl: 'solicitudConvenio.html'
})
export class SolicitudConvenioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild('vistadeudor')
  private lovPersonaVista: LovPersonaVistaComponent;

  @ViewChild(DatosGeneralesComponent)
  datosGeneralesComponent: DatosGeneralesComponent;

  @ViewChild(SolicitudComponent)
  solicitudComponent: SolicitudComponent;

  @ViewChild(TablaAmortizacionComponent)
  tablaAmortizacionComponent: TablaAmortizacionComponent;

  @ViewChild(CapacidadPagoComponent)
  capacidadPagoComponent: CapacidadPagoComponent;

  private csolicitud = 0;
  private iniciosolicitud = false;
  private selectedPersona = true;
  private habilitaCapacidad = false;
  private simulacion = false;
  private habilitagrabar = false;
  private lestadossocios: any = [];
  habilitamensaje = false;
  habilitamensajereincorporado = false;
  habilitamensajerestriccion = false;
  msgsreincorporado = '';
  public lrequisitossolicitud: any = [];

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'CREASOLICITUDINGRESO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.consultarCatalogos();
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  cancelar() {
    this.mostrarDialogoGenerico = false;
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    // Consulta datos.
    const conSol = this.solicitudComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.solicitudComponent.alias, conSol);

    this.tablaAmortizacionComponent.mcampos.csolicitud = this.csolicitud;
  }

  private fijarFiltrosConsulta() {
    this.solicitudComponent.mfiltros.csolicitud = this.csolicitud;
    this.solicitudComponent.mfiltros.cpersona = this.registro.cpersona;
    this.solicitudComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.solicitudComponent.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    this.solicitudComponent.postQuery(resp);

    if (this.csolicitud !== 0) {
      this.editable = false;
    }

    this.solicitudComponent.mfiltros.cpersona = this.solicitudComponent.registro.cpersona;
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    super.encerarMensajes();
    this.lmantenimiento = []; // Encerar Mantenimiento
    if (!this.estaVacio(this.mcampos.csolicitud)) {
      this.rqMantenimiento.csolicitud = this.mcampos.csolicitud;
    }

    this.solicitudComponent.selectRegistro(this.solicitudComponent.registro);
    this.solicitudComponent.actualizar();
    this.capacidadPagoComponent.selectRegistro(this.capacidadPagoComponent.registro);
    this.capacidadPagoComponent.actualizar();
    this.capacidadPagoComponent.ingresosComponent.selectRegistro(this.capacidadPagoComponent.ingresosComponent.registro);
    this.capacidadPagoComponent.ingresosComponent.actualizar();
    this.capacidadPagoComponent.egresosComponent.selectRegistro(this.capacidadPagoComponent.egresosComponent.registro);
    this.capacidadPagoComponent.egresosComponent.actualizar();

    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');
    this.rqMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    this.rqMantenimiento['cmodulo'] = 7;
    this.rqMantenimiento['ctransaccion'] = 93;
    this.rqMantenimiento['essimulacion'] = false;
    this.rqMantenimiento['rollback'] = false;

    this.rqMantenimiento.mdatos.REQUISITOS = this.lrequisitossolicitud;
    super.addMantenimientoPorAlias(this.solicitudComponent.alias, this.solicitudComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.capacidadPagoComponent.alias, this.capacidadPagoComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.capacidadPagoComponent.ingresosComponent.alias + this.capacidadPagoComponent.alias, this.capacidadPagoComponent.ingresosComponent.getMantenimiento(3));
    super.addMantenimientoPorAlias(this.capacidadPagoComponent.egresosComponent.alias + this.capacidadPagoComponent.alias, this.capacidadPagoComponent.egresosComponent.getMantenimiento(4));

    if (this.mcampos.reincorporado) {
      this.capacidadPagoComponent.reincorporadosComponent.actualizar();
      super.addMantenimientoPorAlias(this.capacidadPagoComponent.reincorporadosComponent.alias, this.capacidadPagoComponent.reincorporadosComponent.getMantenimiento(10));
    }
    super.grabar(this.iniciosolicitud);
  }

  grabarSolicitud(): void {
    super.encerarMensajes();
    this.simulacion = false;
    if (!this.validaGrabar()) {
      return;
    }
    this.lrequisitossolicitud = this.solicitudComponent.lrequisitos;
    this.mostrarDialogoGenerico = true;
  }

  grabarSimulacion(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.simulacion = true;
    if (!this.estaVacio(this.mcampos.csolicitud)) {
      this.rqMantenimiento.csolicitud = this.mcampos.csolicitud;
    }
    if (this.solicitudComponent.registro.montooriginal <= 0 || this.solicitudComponent.registro.numerocuotas <= 0) {
      super.mostrarMensajeError("MONTO Y NÚMERO DE CUOTAS REQUERIDOS");
      return;
    }
    if (this.mcampos.reincorporado && (this.solicitudComponent.registro.montooriginal < this.mcampos.montoreincorporado)) {
      super.mostrarMensajeError("MONTO DE SOLICITUD ES MENOR AL VALOR ADEUDADO DE REINCORPORADOS");
      return;
    }

    this.solicitudComponent.registro.csolicitud = this.csolicitud;
    this.solicitudComponent.formvalidado = true;
    this.solicitudComponent.registro.monto = this.solicitudComponent.registro.montooriginal;
    this.solicitudComponent.selectRegistro(this.solicitudComponent.registro);
    this.solicitudComponent.actualizar();

    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');
    this.rqMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    this.rqMantenimiento['cmodulo'] = 7;
    this.rqMantenimiento['ctransaccion'] = 93;
    this.rqMantenimiento['essimulacion'] = true;
    this.rqMantenimiento['rollback'] = true;

    super.addMantenimientoPorAlias(this.solicitudComponent.alias, this.solicitudComponent.getMantenimiento(1));
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  validaGrabar() {
    if (this.simulacion) {
      return this.solicitudComponent.validaGrabar();
    } else {
      if (!this.capacidadPagoComponent.aprobado) {
        super.mostrarMensajeError("ANÁLISIS DE CAPACIDAD DE PAGO DE DEUDOR NO SE ENCUENTRA APROBADA");
        return false;
      }
      if (this.estaVacio(this.capacidadPagoComponent.registro.comentario)) {
        super.mostrarMensajeError("COMENTARIO DE ANÁLISIS DE CAPACIDAD DE PAGO DEL DEUDOR ES REQUERIDO");
        return false;
      }
      return true;
    }
  }

  public postCommit(resp: any) {
    if (this.rqMantenimiento['ctransaccion'] === 93 && this.rqMantenimiento['essimulacion'] === true) {
      if (resp.cod === 'OK') {
        this.iniciosolicitud = true;
        this.habilitagrabar = true;
        this.habilitaCapacidad = true;
        this.tablaAmortizacionComponent.mcampos.csolicitud = resp.csolicitud;
        this.tablaAmortizacionComponent.postQuery(resp);
        this.solicitudComponent.mcampos.tasa = resp.tasa;
        this.solicitudComponent.mcampos.plazo = resp.plazo;
        this.solicitudComponent.registro.valorcuota = resp.TABLA[0].valcuo;

        super.registrarEtiqueta(this.solicitudComponent.registro, this.solicitudComponent.lproducto, "cproducto", "nproducto");
        super.registrarEtiqueta(this.solicitudComponent.registro, this.solicitudComponent.ltipoproducto, "ctipoproducto", "ntipoproducto");

        this.capacidadPagoComponent.registro.cpersona = this.mcampos.cpersona;
        this.capacidadPagoComponent.registro.ntipoproducto = this.solicitudComponent.registro.mdatos.ntipoproducto;
        this.capacidadPagoComponent.registro.nproducto = this.solicitudComponent.registro.mdatos.nproducto;
        this.capacidadPagoComponent.registro.ntipoproducto = this.solicitudComponent.registro.mdatos.ntipoproducto;
        this.capacidadPagoComponent.registro.monto = this.solicitudComponent.registro.montooriginal;
        this.capacidadPagoComponent.registro.numerocuotas = this.solicitudComponent.registro.numerocuotas;
        this.capacidadPagoComponent.registro.tasa = resp.tasa;
        this.capacidadPagoComponent.registro.valorcuota = resp.TABLA[0].valcuo;
        this.capacidadPagoComponent.registro.destino = this.solicitudComponent.registro.mdatos.destino;
        this.capacidadPagoComponent.porcentajecapacidadpago = resp.porcentajecapacidadpago;
        if (this.mcampos.reincorporado) {
          this.capacidadPagoComponent.reincorporadosComponent.registro.csolicitud = resp.csolicitud;
          this.capacidadPagoComponent.reincorporadosComponent.registro.monto = this.mcampos.montoreincorporado;
        }

        this.capacidadPagoComponent.ingresosComponent.postQuery(resp);
        this.capacidadPagoComponent.egresosComponent.postQuery(resp);
        this.capacidadPagoComponent.ingresosComponent.porcentajecapacidadpago = resp.porcentajecapacidadpago;

        this.encerarMensajes();
      }
    }

    if (this.rqMantenimiento['ctransaccion'] === 93 && this.rqMantenimiento['essimulacion'] === false) {
      if (resp.cod === 'OK') {
        this.iniciosolicitud = false;
        this.confirmationService.confirm({
          message: 'Se ha registrado la solicitud [ <b>' + resp.csolicitud + '</b> ] exitosamente..!!',
          icon: 'ui-icon-save',
          header: 'Convenios',
          acceptLabel: 'Aceptar',
          rejectVisible: false,
          accept: () => {
            this.recargar();
          }
        });
      }
    }
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.habilitamensaje = false;
    this.habilitamensajereincorporado = false;
    this.habilitamensajerestriccion = false;
    this.lovPersonas.showDialog();
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.validaRegimen = true;
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpersona = reg.registro.cpersona;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.csolicitud = null;

      if (!this.validaCondicionesSocio(reg.registro.mdatos.cestadosocio)) {
        this.habilitamensaje = true;
        return;
      }

      this.solicitudComponent.registro.cpersona = reg.registro.cpersona;
      this.solicitudComponent.mfiltros.cpersona = reg.registro.cpersona;

      this.datosGeneralesComponent.habilitarEdicion();
      this.solicitudComponent.selectRegistro(this.solicitudComponent.registro);

      this.consultarConyuge();
      this.consultarReincorporados();

      this.selectedPersona = false;
    }
  }

  /**Muestra lov de persona vista */
  mostrarLovPersonaVista(): void {
    this.lovPersonaVista.showDialog();
    this.lovPersonaVista.mcampos.cpersona = this.mcampos.cpersona;
    this.lovPersonaVista.mcampos.identificacion = this.mcampos.identificacion;
    this.lovPersonaVista.mcampos.nombre = this.mcampos.nombre;
    this.lovPersonaVista.consultar();
  }

  consultarConyuge(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.capacidadPagoComponent.ingresosComponent.lconyuge = [];

    const mfiltrosSueldo: any = { 'cpersona': this.mcampos.cpersona, 'verreg': 0 };
    const consultaConyuge = new Consulta('TperReferenciaPersonales', 'Y', 't.cpersona', mfiltrosSueldo, {});
    consultaConyuge.cantidad = 100;
    this.addConsultaPorAlias("CONYUGE", consultaConyuge);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.capacidadPagoComponent.ingresosComponent.lconyuge = resp.CONYUGE;
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  /**Consulta de reincorporados. */
  consultarReincorporados(): any {
    this.msgs = [];
    this.msgsreincorporado = "";
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'REINCORPORADO';
    rqConsulta.cpersona = this.mcampos.cpersona;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          if (resp.cod === 'OK') {
            if (!this.estaVacio(resp.REINCORPORADO)) {
              const r = resp.REINCORPORADO;
              if (r.reincorporado) {
                this.mcampos.reincorporado = r.reincorporado;
                this.mcampos.montoreincorporado = r.valor;
                this.habilitamensajereincorporado = true;
                this.msgsreincorporado = '** Socio es reincorporado ';
                if (r.reincorporado && r.valor > 0) {
                  this.msgsreincorporado = this.msgsreincorporado + 'y mantiene una deuda por ' + r.valor.toLocaleString('es') + ' **';
                } else {
                  this.msgsreincorporado = this.msgsreincorporado + 'y no registra deudas pendientes **';
                }
              }
            }
            if (!this.estaVacio(resp.NOVEDADRESTRICCION)) {
              const n = resp.NOVEDADRESTRICCION;
              this.habilitamensajerestriccion = n.novedad;
            }
          } else {
            super.mostrarMensajeError(resp.msgusu);
            return;
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  /**Validacion de condiciones de socio. */
  validaCondicionesSocio(cestadosocio): boolean {
    if (this.lestadossocios.some(x => Number(x.value) === Number(cestadosocio))) {
      return true;
    }
    return false;
  }

  /**Consulta de catalogos. */
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosProd: any = { 'cmodulo': 7, 'cproducto': 1 };
    const consultaProd = new Consulta('TgenProducto', 'Y', 't.cproducto', mfiltrosProd, {});
    consultaProd.cantidad = 100;
    this.addConsultaCatalogos('PRODUCTO', consultaProd, this.solicitudComponent.lproducto, super.llenaListaCatalogo, 'cproducto');

    const mfiltrosTipoProd: any = { 'cmodulo': 7, 'activo': true, 'verreg': 0, 'convenio': true };
    const mfiltrosEspTipoProd: any = {
      'cconvenio': 'in (select distinct cconvenio from tcarconveniousuario where cusuario = \'' + this.dtoServicios.mradicacion.cusuario + '\' and activo = 1)'
    };
    const consultaTipoProd = new Consulta('TcarProducto', 'Y', 't.ctipoproducto', mfiltrosTipoProd, mfiltrosEspTipoProd);
    consultaTipoProd.cantidad = 100;
    this.addConsultaCatalogos('TIPOPRODUCTO', consultaTipoProd, this.solicitudComponent.ltipoproducto, this.llenarTipoProducto, '', this.componentehijo);

    const consultaTipoTamortizacion = new Consulta('TcarTipoTablaAmortizacion', 'Y', 't.nombre', {}, {});
    consultaTipoTamortizacion.cantidad = 100;
    this.addConsultaCatalogos('TIPOTABLAAMORTIZACION', consultaTipoTamortizacion, this.solicitudComponent.ltablaamortizacion, super.llenaListaCatalogo, 'ctabla');

    const mfiltrosFlujoNormal: any = { 'ccatalogo': 700 };
    const consultaFlujoNormal = new Consulta('TgenCatalogoDetalle', 'Y', 'convert(int,t.cdetalle)', mfiltrosFlujoNormal, {});
    consultaFlujoNormal.cantidad = 100;
    this.addConsultaCatalogos('FLUJOQUIROGRAFARIO', consultaFlujoNormal, this.solicitudComponent.lflujoquirografario, super.llenaListaCatalogo, 'cdetalle', null, false);

    const mfiltrosFlujoHipotecario: any = { 'ccatalogo': 701 };
    const consultaFlujoHipotecario = new Consulta('TgenCatalogoDetalle', 'Y', 'convert(int,t.cdetalle)', mfiltrosFlujoHipotecario, {});
    consultaFlujoHipotecario.cantidad = 100;
    this.addConsultaCatalogos('FLUJOHIPOTECARIO', consultaFlujoHipotecario, this.solicitudComponent.lflujohipotecario, super.llenaListaCatalogo, 'cdetalle', null, false);

    const mfiltrosFlujoPrendario: any = { 'ccatalogo': 706 };
    const consultaFlujoPrendario = new Consulta('TgenCatalogoDetalle', 'Y', 'convert(int,t.cdetalle)', mfiltrosFlujoPrendario, {});
    consultaFlujoPrendario.cantidad = 100;
    this.addConsultaCatalogos('FLUJOPRENDARIO', consultaFlujoPrendario, this.solicitudComponent.lflujoprendario, super.llenaListaCatalogo, 'cdetalle', null, false);

    const consultaEstadoSocio = new Consulta('TcarCondicionSocio', 'Y', 'cestadosocio', {}, {});
    consultaEstadoSocio.cantidad = 100;
    this.addConsultaCatalogos('ESTADOSOCIO', consultaEstadoSocio, this.lestadossocios, super.llenaListaCatalogo, 'cestadosocio', null, false);

    const mfiltrosRequisitos: any = { 'cmodulo': 7, 'cproducto': 1, 'activo': true, 'verreg': 0 };
    const mfiltrosEspRequisitos: any = { 'ctipoproducto': 'in (select distinct ctipoproducto from tcarproducto where verreg = 0 and convenio = 1)' };
    const consultaRequisitos = new Consulta('TcarProductoRequisitos', 'Y', 't.orden', mfiltrosRequisitos, mfiltrosEspRequisitos);
    consultaRequisitos.addSubquery('TcarRequisitos', 'nombre', 'nrequisito', 't.crequisito = i.crequisito');
    consultaRequisitos.cantidad = 100;
    this.addConsultaCatalogos('REQUISITOS', consultaRequisitos, this.solicitudComponent.lrequisitos, this.llenarRequisitos, '', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarTipoProducto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.solicitudComponent.ltipoproductototal = pListaResp;
  }

  public llenarRequisitos(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.solicitudComponent.lrequisitostotal = pListaResp;
  }

  limpiarSimulacion() {
    super.encerarMensajes();
    this.habilitagrabar = false;
    this.solicitudComponent.mcampos.tasa = null;
    this.solicitudComponent.registro.valorcuota = null;
    this.tablaAmortizacionComponent.lregistros = null;
    this.solicitudComponent.actualizar();
    this.tablaAmortizacionComponent.actualizar();
  }

  recargarSimulacion() {
    this.limpiarSimulacion();
    this.habilitaCapacidad = false;
    super.encerarMensajes();
  }
}
