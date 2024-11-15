import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { AppService } from 'app/util/servicios/app.service';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionGarComponent } from '../../../../garantias/lov/operacion/componentes/lov.operacionGar.component';
import { LovCotizadorSegurosComponent } from '../../../../seguros/lov/cotizador/componentes/lov.cotizador.component';
import { LovPersonaVistaComponent } from '../../../../personas/lov/personavista/componentes/lov.personaVista.component';
import { DatosGeneralesComponent } from '../submodulos/datosgenerales/componentes/_datosGenerales.component';
import { SolicitudComponent } from '../submodulos/datosgenerales/componentes/_solicitud.component';
import { TablaAmortizacionComponent } from '../../solicitudingreso/submodulos/tablaamortizacion/componentes/_tablaAmortizacion.component';
import { CapacidadPagoComponent } from '../submodulos/capacidadpago/componentes/_capacidadPago.component';
import { CotizadorComponent } from '../submodulos/cotizador/componentes/_cotizador.component';

@Component({
  selector: 'app-solicitud-prendario',
  templateUrl: 'solicitudPrendario.html'
})
export class SolicitudPrendarioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovPersonaVistaComponent)
  private lovPersonaVista: LovPersonaVistaComponent;

  @ViewChild(LovOperacionGarComponent)
  private lovGarantias: LovOperacionGarComponent;

  @ViewChild(LovCotizadorSegurosComponent)
  private lovSeguros: LovCotizadorSegurosComponent;

  @ViewChild(DatosGeneralesComponent)
  datosGeneralesComponent: DatosGeneralesComponent;

  @ViewChild(SolicitudComponent)
  solicitudComponent: SolicitudComponent;

  @ViewChild(TablaAmortizacionComponent)
  tablaAmortizacionComponent: TablaAmortizacionComponent;

  @ViewChild(CapacidadPagoComponent)
  capacidadPagoComponent: CapacidadPagoComponent;

  @ViewChild(CotizadorComponent)
  cotizadorComponent: CotizadorComponent;

  private csolicitud = 0;
  private iniciosolicitud = false;
  private selectedPersona = true;
  private habilitaCapacidad = false;
  private simulacion = false;
  private habilitagrabar = false;
  private garantia: any;
  private lestadossocios: any = [];
  habilitamensaje = false;

  constructor(router: Router, dtoServicios: DtoServicios, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'CREASOLICITUDPRENDARIO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.consultarCatalogos();
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
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

  /**Se llama automaticamente luego de ejecutar una consulta. */
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
    this.rqMantenimiento['ctransaccion'] = 95;
    this.rqMantenimiento['essimulacion'] = false;
    this.rqMantenimiento['rollback'] = false;

    super.addMantenimientoPorAlias(this.solicitudComponent.alias, this.solicitudComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.capacidadPagoComponent.alias, this.capacidadPagoComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.capacidadPagoComponent.ingresosComponent.alias + this.capacidadPagoComponent.alias, this.capacidadPagoComponent.ingresosComponent.getMantenimiento(3));
    super.addMantenimientoPorAlias(this.capacidadPagoComponent.egresosComponent.alias + this.capacidadPagoComponent.alias, this.capacidadPagoComponent.egresosComponent.getMantenimiento(4));

    super.addMantenimientoPorAlias(this.cotizadorComponent.alias, this.cotizadorComponent.getMantenimiento(5));

    super.grabar(this.iniciosolicitud);
  }

  grabarSolicitud(): void {
    this.grabar();
  }

  grabarSimulacion(): void {
    super.encerarMensajes();
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.simulacion = true;
    if (!this.estaVacio(this.mcampos.csolicitud)) {
      this.rqMantenimiento.csolicitud = this.mcampos.csolicitud;
    }
    if (this.solicitudComponent.registro.montooriginal <= 0 || this.solicitudComponent.registro.numerocuotas <= 0) {
      super.mostrarMensajeError("MONTO Y NÚMERO DE CUOTAS REQUERIDOS");
      return;
    }

    this.solicitudComponent.registro.csolicitud = this.csolicitud;
    this.solicitudComponent.formvalidado = true;
    this.solicitudComponent.registro.monto = this.solicitudComponent.registro.montooriginal
    this.solicitudComponent.selectRegistro(this.solicitudComponent.registro);
    this.solicitudComponent.actualizar();

    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');
    this.rqMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    this.rqMantenimiento['cmodulo'] = 7;
    this.rqMantenimiento['ctransaccion'] = 95;
    this.rqMantenimiento['essimulacion'] = true;
    this.rqMantenimiento['rollback'] = true;
    this.rqMantenimiento.mdatos.aprobar = true;

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
    if (this.rqMantenimiento['ctransaccion'] === 95 && this.rqMantenimiento['essimulacion'] === true) {
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

        this.capacidadPagoComponent.registro.cpersona = this.mcampos.cpersona;;
        this.capacidadPagoComponent.registro.ntipoproducto = this.solicitudComponent.registro.mdatos.ntipoproducto;
        this.capacidadPagoComponent.registro.nproducto = this.solicitudComponent.registro.mdatos.nproducto;
        this.capacidadPagoComponent.registro.ntipoproducto = this.solicitudComponent.registro.mdatos.ntipoproducto;
        this.capacidadPagoComponent.registro.monto = this.solicitudComponent.registro.montooriginal;
        this.capacidadPagoComponent.registro.numerocuotas = this.solicitudComponent.registro.numerocuotas;
        this.capacidadPagoComponent.registro.tasa = resp.tasa;
        this.capacidadPagoComponent.registro.valorcuota = resp.TABLA[0].valcuo;
        this.capacidadPagoComponent.registro.destino = "COMPRA DE VEHÍCULO";
        this.capacidadPagoComponent.porcentajecapacidadpago = resp.porcentajecapacidadpago;
        this.capacidadPagoComponent.ingresosComponent.postQuery(resp);
        this.capacidadPagoComponent.egresosComponent.postQuery(resp);
        this.capacidadPagoComponent.ingresosComponent.porcentajecapacidadpago = resp.porcentajecapacidadpago;

        this.encerarMensajes();
      }
    }

    if (this.rqMantenimiento['ctransaccion'] === 95 && this.rqMantenimiento['essimulacion'] === false) {
      if (resp.cod === 'OK') {
        this.iniciosolicitud = false;
        const respuesta = resp;
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

      this.selectedPersona = false;
    }
  }


  /**Muestra lov de garantias */
  mostrarLovGarantias(): void {
    super.encerarMensajes();
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeError('PERSONA REQUERIDA');
      return;
    }
    this.lovGarantias.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovGarantias.mfiltros.cestatus = 'ING';
    this.lovGarantias.mfiltros.ctipogarantia = 'A12';
    this.lovGarantias.consultar();
    this.lovGarantias.showDialog();
  }

  /**Retorno de lov de garantias. */
  fijarLovGarantiasSelec(reg: any): void {
    if (!this.estaVacio(reg.registro)) {
      if (this.estaVacio(reg.registro.mdatos.monto)) {
        this.mostrarMensajeError('AVALÚO DE GARANTÍA NO INGRESADO');
        return;
      }

      if (reg.registro.mdatos.aplicaseguro) {
        this.mostrarLovCotizadorSeguros(reg);
      } else {
        this.llenarRegistro(reg);
      }
    }
  }

  /**Muestra lov de seguros */
  mostrarLovCotizadorSeguros(reg: any): void {
    super.encerarMensajes();
    this.lovSeguros.registro = reg.registro;
    this.lovSeguros.showDialog();
  }

  /**Retorno de lov de seguros. */
  fijarLovSeguroSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.llenarRegistro(reg);
    }
  }

  /**Llenar datos registro */
  llenarRegistro(reg: any): void {
    this.cotizadorComponent.crearNuevo();
    this.cotizadorComponent.selectRegistro(this.cotizadorComponent.registro);
    this.cotizadorComponent.registro.coperaciongarantia = reg.registro.coperacion;
    this.cotizadorComponent.registro.mdatos.valorprima = (this.estaVacio(reg.registro.mdatos.total)) ? 0 : reg.registro.mdatos.total;
    this.cotizadorComponent.actualizar();

    //Calcula datos de cotizador
    this.cotizadorComponent.registroSeguro.formapago = 'A'; // Forma de pago anticipado
    this.cotizadorComponent.registroSeguro.valorvehiculo = super.redondear(Number(reg.registro.mdatos.monto), 2);
    this.cotizadorComponent.registroSeguro.valorseguro = (this.estaVacio(reg.registro.mdatos.total)) ? 0 : super.redondear(Number(reg.registro.mdatos.total), 2);
    this.cotizadorComponent.registroSeguro.valorvehiculoseguro = super.redondear(Number(this.cotizadorComponent.registroSeguro.valorvehiculo + this.cotizadorComponent.registroSeguro.valorseguro), 2);
    this.cotizadorComponent.registroSeguro.montoanticipo = super.redondear(Number((this.cotizadorComponent.registroSeguro.valorvehiculoseguro * 10) / 100), 2);
    this.cotizadorComponent.registroSeguro.valorconsiderar = super.redondear(Number(this.cotizadorComponent.registroSeguro.valorvehiculoseguro - this.cotizadorComponent.registroSeguro.montoanticipo), 2);
    this.cotizadorComponent.registroSeguro.ajusteanticipo = 0;
    this.actualizarPrestamo();
  }

  actualizarPrestamo() {
    this.recargarSimulacion();
    this.cotizadorComponent.registroSeguro.valordeposito = super.redondear(Number(this.cotizadorComponent.registroSeguro.montoanticipo + this.cotizadorComponent.registroSeguro.ajusteanticipo), 2);
    this.cotizadorComponent.registroSeguro.valorprestamo = super.redondear(Number(this.cotizadorComponent.registroSeguro.valorconsiderar - this.cotizadorComponent.registroSeguro.ajusteanticipo), 2);
    this.solicitudComponent.registro.montooriginal = this.cotizadorComponent.registroSeguro.valorprestamo;
    this.cotizadorComponent.registro.mdatos.registroSeguro = this.cotizadorComponent.registroSeguro;
    this.solicitudComponent.montoprestamo = this.cotizadorComponent.registroSeguro.valorprestamo;
    this.solicitudComponent.cargarCuotas(this.solicitudComponent.registro.montooriginal);
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

  validaCondicionesSocio(cestadosocio): boolean {
    if (this.lestadossocios.some(x => Number(x.value) === Number(cestadosocio))) {
      return true;
    }
    return false;
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosProd: any = { 'cmodulo': 7, 'cproducto': 2 };
    const consultaProd = new Consulta('TgenProducto', 'Y', 't.nombre', mfiltrosProd, {});
    consultaProd.cantidad = 100;
    this.addConsultaCatalogos('PRODUCTO', consultaProd, this.solicitudComponent.lproducto, super.llenaListaCatalogo, 'cproducto');

    const mfiltrosTipoProd: any = { 'cmodulo': 7, 'activo': true, 'verreg': 0 };
    const consultaTipoProd = new Consulta('TcarProducto', 'Y', 't.nombre', mfiltrosTipoProd, {});
    consultaTipoProd.cantidad = 100;
    this.addConsultaCatalogos('TIPOPRODUCTO', consultaTipoProd, this.solicitudComponent.ltipoproducto, this.llenarTipoProducto, '', this.componentehijo);

    const consultaTipoTamortizacion = new Consulta('TcarTipoTablaAmortizacion', 'Y', 't.nombre', {}, {});
    consultaTipoTamortizacion.cantidad = 100;
    this.addConsultaCatalogos('TIPOTABLAAMORTIZACION', consultaTipoTamortizacion, this.solicitudComponent.ltablaamortizacion, super.llenaListaCatalogo, 'ctabla');

    const mfiltrosFlujoPrendario: any = { 'ccatalogo': 706 };
    const consultaFlujoPrendario = new Consulta('TgenCatalogoDetalle', 'Y', 'convert(int,t.cdetalle)', mfiltrosFlujoPrendario, {});
    consultaFlujoPrendario.cantidad = 100;
    this.addConsultaCatalogos('FLUJOPRENDARIO', consultaFlujoPrendario, this.solicitudComponent.lflujoprendario, super.llenaListaCatalogo, 'cdetalle', null, false);

    const consultaEstadoSocio = new Consulta('TcarCondicionSocio', 'Y', 'cestadosocio', {}, {});
    consultaEstadoSocio.cantidad = 100;
    this.addConsultaCatalogos('ESTADOSOCIO', consultaEstadoSocio, this.lestadossocios, super.llenaListaCatalogo, 'cestadosocio', null, false);

    this.ejecutarConsultaCatalogos();
  }

  public llenarTipoProducto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.solicitudComponent.ltipoproductototal = pListaResp;
  }

  limpiarSimulacion() {
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
