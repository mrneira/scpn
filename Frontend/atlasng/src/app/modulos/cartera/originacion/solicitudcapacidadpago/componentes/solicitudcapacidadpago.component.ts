import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
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
import { GaranteComponent } from '../submodulos/garante/componentes/_garante.component';
import { EspecialComponent } from '../submodulos/especial/componentes/_especial.component';

@Component({
  selector: 'app-solicitud-capacidad-pago',
  templateUrl: 'solicitudcapacidadpago.html'
})
export class SolicitudCapacidadPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

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

  @ViewChild(GaranteComponent)
  garanteComponent: GaranteComponent;

  @ViewChild(EspecialComponent)
  especialComponent: EspecialComponent;

  private csolicitud = 0;
  private iniciosolicitud = false;
  private selectedPersona = true;
  private habilitaGarante = false;
  private habilitaCapacidad = false;
  private simulacion = false;
  private habilitagrabar = false;
  private lestadossocios: any = [];
  habilitamensaje = false;
  habilitamensajereincorporado = false;
  habilitamensajerestriccion = false;
  cumpleaportesminimos = 0;
  msgsreincorporado = '';
  msgsaportaciones = '';
  porcentajeconsolidado = 0;
  habilitaValidacion = false;
  revisarespeciales = false;
  private lvalidacionprestamototal: any = [];
  estadoNovedad: boolean = false; // RRO 20211104

  constructor(router: Router, dtoServicios: DtoServicios, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'CREASOLICITUDINGRESO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.consultarCatalogos();
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
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
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.simulacion = false;
    if (!this.estaVacio(this.mcampos.csolicitud)) {
      this.rqMantenimiento.csolicitud = this.mcampos.csolicitud;
    }

    if (!this.validaGrabar()) {
      return;
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
    this.rqMantenimiento['ctransaccion'] = 98;
    this.rqMantenimiento['essimulacion'] = false;
    this.rqMantenimiento['rollback'] = false;

    super.addMantenimientoPorAlias(this.solicitudComponent.alias, this.solicitudComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.capacidadPagoComponent.alias, this.capacidadPagoComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.capacidadPagoComponent.ingresosComponent.alias + this.capacidadPagoComponent.alias, this.capacidadPagoComponent.ingresosComponent.getMantenimiento(3));
    super.addMantenimientoPorAlias(this.capacidadPagoComponent.egresosComponent.alias + this.capacidadPagoComponent.alias, this.capacidadPagoComponent.egresosComponent.getMantenimiento(4));

    if (this.capacidadPagoComponent.habilitaAbsorcion) {
      this.capacidadPagoComponent.absorberOperacionesComponent.validaRegistros();
      this.rqMantenimiento.mdatos.montoabsorcionaportes = this.capacidadPagoComponent.absorberOperacionesComponent.montoabsorcionaportes;
      super.addMantenimientoPorAlias(this.capacidadPagoComponent.absorberOperacionesComponent.alias, this.capacidadPagoComponent.absorberOperacionesComponent.getMantenimiento(5));
    }

    if (this.habilitaGarante) {
      if (!this.estaVacio(this.garanteComponent.absorberGaranteComponent.lregistrosgarante)) {
        this.garanteComponent.registro.mdatos.labsorciongarante = this.garanteComponent.absorberGaranteComponent.lregistrosgarante;
      }
      this.garanteComponent.selectRegistro(this.garanteComponent.registro);
      this.garanteComponent.actualizar();
      this.garanteComponent.ingresosComponent.selectRegistro(this.garanteComponent.ingresosComponent.registro);
      this.garanteComponent.ingresosComponent.actualizar();
      this.garanteComponent.egresosComponent.selectRegistro(this.garanteComponent.egresosComponent.registro);
      this.garanteComponent.egresosComponent.actualizar();
      super.addMantenimientoPorAlias(this.garanteComponent.alias, this.garanteComponent.getMantenimiento(6));
      super.addMantenimientoPorAlias(this.garanteComponent.ingresosComponent.alias + this.garanteComponent.alias, this.garanteComponent.ingresosComponent.getMantenimiento(7));
      super.addMantenimientoPorAlias(this.garanteComponent.egresosComponent.alias + this.garanteComponent.alias, this.garanteComponent.egresosComponent.getMantenimiento(8));
    }

    if (this.capacidadPagoComponent.habilitaConsolidado) {
      super.addMantenimientoPorAlias(this.capacidadPagoComponent.consolidadoComponent.alias, this.capacidadPagoComponent.consolidadoComponent.getMantenimiento(9));
    }

    if (this.mcampos.reincorporado) {
      this.capacidadPagoComponent.reincorporadosComponent.actualizar();
      super.addMantenimientoPorAlias(this.capacidadPagoComponent.reincorporadosComponent.alias, this.capacidadPagoComponent.reincorporadosComponent.getMantenimiento(10));
    }
    super.grabar(this.iniciosolicitud);
  }

  grabarSolicitud(): void {
    this.grabar(); 
    if (this.validarEspecial()){
      super.mostrarMensajeError("VALIDAR CONDICIONES ESPECIALES");
      return;
    }
  }

  validarEspecial(): boolean {
    this.revisarespeciales = false;
    for (const i in this.componentehijo.especialComponent.lregistros) {
      if (this.componentehijo.especialComponent.lregistros.hasOwnProperty(i)) {
        const reg: any = this.componentehijo.especialComponent.lregistros[i];
        if (!reg.aprobado) {
            this.revisarespeciales = true;
        }
      }
    }
    return this.revisarespeciales;
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
    if (this.mcampos.reincorporado && (this.solicitudComponent.registro.montooriginal < this.mcampos.montoreincorporado) && this.estadoNovedad) { // RRO 20211104
      super.mostrarMensajeError("MONTO DE SOLICITUD ES MENOR AL VALOR ADEUDADO DE REINCORPORADOS");
      return;
    }

    if (this.cumpleaportesminimos === 0 && this.habilitaValidacion){
      super.mostrarMensajeError("NO CUMPLE CON EL MÍNIMO DE APORTES PARA ESTE TIPO DE PRODUCTO");
      return;
    }

    if (this.solicitudComponent.registro.cuotasgracia === null && this.habilitaValidacion){
      super.mostrarMensajeError("CUOTAS DE GRACIAS NECESARIAS PARA ESTE TIPO DE PRODUCTO");
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
    this.rqMantenimiento['ctransaccion'] = 98;
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
      if (this.habilitaGarante) {
        if (!this.garanteComponent.aprobado) {
          super.mostrarMensajeError("ANÁLISIS DE CAPACIDAD DE PAGO DEL GARANTE NO SE ENCUENTRA APROBADA");
          return false;
        }
        if (this.estaVacio(this.garanteComponent.registro.comentario)) {
          super.mostrarMensajeError("COMENTARIO DE ANÁLISIS DE CAPACIDAD DE PAGO DEL GARANTE ES REQUERIDO");
          return false;
        }
      }
      if (this.capacidadPagoComponent.habilitaConsolidado) {
        if (!this.capacidadPagoComponent.consolidadoComponent.existedetalle) {
          super.mostrarMensajeError("DETALLE DE DEUDAS ES REQUERIDO");
          return false;
        }
        if (this.capacidadPagoComponent.consolidadoComponent.totalporcentaje < this.porcentajeconsolidado) {
          super.mostrarMensajeError("TOTAL DE DEUDAS NO CUBRE EL PORCENTAJE REQUERIDO");
          return false;
        }
        if (this.capacidadPagoComponent.consolidadoComponent.totalconsolidado > this.solicitudComponent.registro.montooriginal) {
          super.mostrarMensajeError("MONTO TOTAL DE DEUDAS NO PUEDE SER MAYOR AL MONTO DE LA SOLICITUD");
          return false;
        }
      }
      return true;
    }
  }

  public postCommit(resp: any) {
    if (this.rqMantenimiento['ctransaccion'] === 98 && this.rqMantenimiento['essimulacion'] === true) {
      if (resp.cod === 'OK') {
        this.iniciosolicitud = true;
        this.habilitagrabar = true;
        this.habilitaCapacidad = true;
        if (!this.estaVacio(this.solicitudComponent.registro.mdatos.requieregarante) && (this.solicitudComponent.registro.mdatos.requieregarante)) {
          this.habilitaGarante = true;
          this.garanteComponent.lestadossocios = this.lestadossocios;
          this.garanteComponent.habilitaAbsorcionGarante = this.solicitudComponent.registro.mdatos.absorberoperaciones;
          this.garanteComponent.mcampos.cmodulo = this.solicitudComponent.registro.cmodulo;
          this.garanteComponent.mcampos.cproducto = this.solicitudComponent.registro.cproducto;
          this.garanteComponent.mcampos.ctipoproducto = this.solicitudComponent.registro.ctipoproducto;
        }
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
        this.porcentajeconsolidado = resp.porcentajeconsolidado;
        if (!this.estaVacio(this.capacidadPagoComponent.absorberOperacionesComponent.lregistros)) {
          this.capacidadPagoComponent.habilitaAbsorcion = this.solicitudComponent.registro.mdatos.absorberoperaciones;
        }
        if (!this.estaVacio(this.solicitudComponent.registro.mdatos.consolidado) && (this.solicitudComponent.registro.mdatos.consolidado)) {
          this.capacidadPagoComponent.habilitaConsolidado = true;
          this.capacidadPagoComponent.consolidadoComponent.montooriginal = this.solicitudComponent.registro.montooriginal;
          if (!this.estaVacio(this.capacidadPagoComponent.absorberOperacionesComponent.lregistrosgarante)) {
            this.capacidadPagoComponent.habilitaAbsorcion = this.solicitudComponent.registro.mdatos.absorberoperaciones;
          }
        }
        if (this.mcampos.reincorporado) {
          this.capacidadPagoComponent.reincorporadosComponent.registro.csolicitud = resp.csolicitud;
          this.capacidadPagoComponent.reincorporadosComponent.registro.monto = this.mcampos.montoreincorporado;
        }
        this.garanteComponent.registro.monto = this.solicitudComponent.registro.montooriginal;
        this.garanteComponent.registro.valorcuota = resp.TABLA[0].valcuo;
        this.garanteComponent.porcentajecapacidadpago = resp.porcentajecapacidadpago;

        this.capacidadPagoComponent.ingresosComponent.postQuery(resp);
        this.capacidadPagoComponent.egresosComponent.postQuery(resp);
        this.capacidadPagoComponent.ingresosComponent.porcentajecapacidadpago = resp.porcentajecapacidadpago;

        this.especialComponent.postQuery(resp);

        this.encerarMensajes();
      }
    }

    if (this.rqMantenimiento['ctransaccion'] === 98 && this.rqMantenimiento['essimulacion'] === false) {
      if (resp.cod === 'OK') {
        this.iniciosolicitud = false;
        this.cargarPagina(resp);
      }
    }
  }

  public cargarPagina(reg: any) {
    const opciones = {};
    const tran = 100;
    const tranpagina = 101;
    const titpagina = sessionStorage.getItem('m') + '-' + tranpagina + ' Buzón Solicitudes';
    opciones['path'] = sessionStorage.getItem('m') + '-' + tran;
    opciones['tit'] = sessionStorage.getItem('m') + '-' + tran + ' Ingreso de Solicitud';
    opciones['mod'] = sessionStorage.getItem('m');
    opciones['tran'] = tran;
    opciones['ac'] = 'false';
    opciones['ins'] = 'true';
    opciones['del'] = 'true';
    opciones['upd'] = 'true';

    sessionStorage.setItem('titulo', opciones['tit']);
    sessionStorage.setItem('m', opciones['mod']);
    sessionStorage.setItem('t', opciones['tran']);
    sessionStorage.setItem('ac', opciones['ac']);
    sessionStorage.setItem('ins', opciones['ins']);
    sessionStorage.setItem('del', opciones['del']);
    sessionStorage.setItem('upd', opciones['upd']);

    sessionStorage.setItem('path', opciones['path']);
    this.router.navigate([opciones['path']], {
      skipLocationChange: true, queryParams: {
        sol: JSON.stringify({
          mfiltros: reg.mfiltros, cpersona: this.registro.cpersona, identificacion: this.mcampos.identificacion, npersona: this.mcampos.nombre, csolicitud: reg.csolicitud,
          nsolicitud: this.solicitudComponent.registro.mdatos.nproducto + ' - ' + this.solicitudComponent.registro.mdatos.ntipoproducto, tran: tranpagina, tit: titpagina
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.habilitamensaje = false;
    this.habilitamensajereincorporado = false;
    this.habilitamensajerestriccion = false;
    this.cumpleaportesminimos = 0;
    this.lovPersonas.showDialog();
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.validaRegimen = true;
    this.estadoNovedad = false; // RRO 20211104
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

      this.garanteComponent.deudor = reg.registro.cpersona;

      this.capacidadPagoComponent.absorberOperacionesComponent.mcampos.cpersona = reg.registro.cpersona;
      this.capacidadPagoComponent.absorberOperacionesComponent.consultar();

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
                this.estadoNovedad = r.estado;
                if (r.reincorporado && r.valor > 0 && r.estado) { //RRO 20211104
                  this.msgsreincorporado = this.msgsreincorporado + 'y mantiene una deuda por ' + r.valor.toLocaleString('es') + ' **';
                } else {
                  this.msgsreincorporado = this.msgsreincorporado + 'y no registra deudas pendientes **';
                }
              }
              this.cumpleaportesminimos = r.cumpleaportesminimos;
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

    const mfiltrosProd: any = { 'cmodulo': 7 };
    const mfiltrosEspProd: any = { 'cproducto': 'not in (2)' };
    const consultaProd = new Consulta('TgenProducto', 'Y', 't.cproducto', mfiltrosProd, mfiltrosEspProd);
    consultaProd.cantidad = 100;
    this.addConsultaCatalogos('PRODUCTO', consultaProd, this.solicitudComponent.lproducto, super.llenaListaCatalogo, 'cproducto');

    const mfiltrosTipoProd: any = { 'cmodulo': 7, 'activo': true, 'verreg': 0 };
    const mfiltrosEspTipoProd: any = { "nombre": "<> '' and(convenio = 0 or convenio is null)" };
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

   // const mfiltrosValidacion: any = { 'activo': true };
   // const consultaValidacion = new Consulta('tcarvalidacion', 'Y', 'ctipoproducto', mfiltrosValidacion, {});
   // consultaValidacion.cantidad = 20;
   // this.addConsultaCatalogos('VALIDAPRESTAMO', consultaValidacion, this.lvalidacionprestamototal, this.llenarValidaciones, "", this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarTipoProducto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.solicitudComponent.ltipoproductototal = pListaResp;
  }

  public llenarValidaciones(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.solicitudComponent.lvalidacionprestamo = pListaResp;
  }

  limpiarSimulacion() {
    super.encerarMensajes();
    this.habilitagrabar = false;
    this.solicitudComponent.mcampos.tasa = null;
    this.solicitudComponent.registro.valorcuota = null;
    this.tablaAmortizacionComponent.lregistros = null;
    this.capacidadPagoComponent.habilitaAbsorcion = false;
    this.capacidadPagoComponent.habilitaConsolidado = false;
    this.capacidadPagoComponent.consolidadoComponent.existedetalle = false;
    this.capacidadPagoComponent.absorberOperacionesComponent.limpiarRegistros();
    this.capacidadPagoComponent.consolidadoComponent.lregistros = [];
    this.solicitudComponent.actualizar();
    this.tablaAmortizacionComponent.actualizar();
    this.garanteComponent.habilitaAbsorcionGarante = false;
    //this.solicitudComponent.registro.cuotasgracia = null;
  }

  recargarSimulacion() {
    this.limpiarSimulacion();
    this.habilitaCapacidad = false;
    this.habilitaGarante = false;
    //this.solicitudComponent.registro.cuotasgracia = null;
    this.validarPrestamo();
    super.encerarMensajes();
  }

  validarPrestamo() {
    this.habilitaValidacion = false;
    for (const i in this.componentehijo.solicitudComponent.lvalidacionprestamo) {
      if (this.componentehijo.solicitudComponent.lvalidacionprestamo.hasOwnProperty(i)) {
        const reg: any = this.componentehijo.solicitudComponent.lvalidacionprestamo[i];
        if (reg.cmodulo === 7 && reg.cproducto === this.solicitudComponent.registro.cproducto && reg.ctipoproducto === this.solicitudComponent.registro.ctipoproducto) {
            this.habilitaValidacion = true;
        }
      }
    }
  }
}
