import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AppService } from '../../../../../util/servicios/app.service';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovPersonaVistaComponent } from '../../../../personas/lov/personavista/componentes/lov.personaVista.component';
import { CondicionesArregloPagoComponent } from './../submodulos/condiciones/componentes/_condicionesArregloPago.component';
import { CapacidadDeudorComponent } from '../submodulos/capacidaddeudor/componentes/_capacidadDeudor.component';
import { CapacidadGaranteComponent } from '../submodulos/capacidadgarante/componentes/_capacidadGarante.component';
import { OperacionRubrosArregloPagoComponent } from './_operacionRubrosArregloPago.component';
import { RubrosArregloPagoComponent } from './_rubrosArregloPago.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-ing-arreglo-pagos',
  templateUrl: 'ingresoArregloPago.html'
})
export class IngresoArregloPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovPersonaVistaComponent)
  private lovPersonaVista: LovPersonaVistaComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  @ViewChild(CondicionesArregloPagoComponent)
  condicionesArreglo: CondicionesArregloPagoComponent;

  @ViewChild(OperacionRubrosArregloPagoComponent)
  operacionRubrosArreglo: OperacionRubrosArregloPagoComponent;

  @ViewChild(RubrosArregloPagoComponent)
  rubrosArreglo: RubrosArregloPagoComponent;

  @ViewChild(CapacidadDeudorComponent)
  capacidadDeudor: CapacidadDeudorComponent;

  @ViewChild(CapacidadGaranteComponent)
  capacidadGarante: CapacidadGaranteComponent;

  public paramrenovacion: any;
  public ltipoarreglo: SelectItem[] = [{ label: '...', value: null }];
  public ltipoarreglototal: any = [];
  public lrubrosarreglo: any = [];
  public tipoarreglo: any;
  public condiciones = false;
  public montooperacionap=0; //CCA 20221025
  private montooperacion = 0;
  private cmodulo = 0;
  private cproducto = 0;
  private ctipoproducto = 0;
  private SALDOCAPITAL = "CAP";
  private SALDOCXP = "CXP";
  private lestadossocios: any = [];
  habilitamensaje = false;
  habilitamensajerestriccion = false;
  habilitaGarante = false;
  public respCalificacion: any; //CCA 20221117

  constructor(router: Router, dtoServicios: DtoServicios, public appService: AppService) {
    super(router, dtoServicios, 'ABSTRACT', 'INGRESOARREGLOPAGO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  eliminar() {
    super.eliminar();
  }

  // Inicia CONSULTA *********************
  consultar() {
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    const conCondicionesArreglo = this.condicionesArreglo.crearDtoConsulta();
    this.addConsultaPorAlias(this.condicionesArreglo.alias, conCondicionesArreglo);

    const conrubrosArreglo = this.rubrosArreglo.crearDtoConsulta();
    this.addConsultaPorAlias(this.rubrosArreglo.alias, conrubrosArreglo);
  }

  private fijarFiltrosConsulta() {
    this.condicionesArreglo.fijarFiltrosConsulta();
    this.rubrosArreglo.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.condicionesArreglo.validaFiltrosRequeridos() &&
      this.rubrosArreglo.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    this.condicionesArreglo.postQuery(resp);
    this.rubrosArreglo.postQuery(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    super.encerarMensajes();

    if (this.estaVacio(this.condicionesArreglo.registro.coperacion)) {
      this.mostrarMensajeError('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }
    if (this.estaVacio(this.condicionesArreglo.registro.numerocuotas) && this.estaVacio(this.condicionesArreglo.registro.valorcuota)) {
      this.mostrarMensajeError('NÚMERO DE CUOTAS O VALOR DE CUOTA REQUERIDOS');
      return;
    }
    if (!this.capacidadDeudor.aprobado) {
      super.mostrarMensajeError("ANÁLISIS DE CAPACIDAD DE PAGO DE DEUDOR NO SE ENCUENTRA APROBADA");
      return;
    }
    if (this.estaVacio(this.capacidadDeudor.registro.comentario)) {
      super.mostrarMensajeError("COMENTARIO DE ANÁLISIS DE CAPACIDAD DE PAGO DEL DEUDOR ES REQUERIDO");
      return;
    }
    if (this.estaVacio(this.condicionesArreglo.ltabla)) {
      this.mostrarMensajeError('SIMULACIÓN REQUERIDA');
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.monto = this.condicionesArreglo.registro.mdatos.monto;
    this.mcampos.simulacion = false;

    this.condicionesArreglo.registro.esnuevo = true;
    this.condicionesArreglo.selectRegistro(this.condicionesArreglo.registro);
    this.condicionesArreglo.actualizar();

    this.capacidadDeudor.selectRegistro(this.capacidadDeudor.registro);
    this.capacidadDeudor.actualizar();
    this.capacidadDeudor.ingresosCapacidadComponent.selectRegistro(this.capacidadDeudor.ingresosCapacidadComponent.registro);
    this.capacidadDeudor.ingresosCapacidadComponent.actualizar();
    this.capacidadDeudor.egresosCapacidadComponent.selectRegistro(this.capacidadDeudor.egresosCapacidadComponent.registro);
    this.capacidadDeudor.egresosCapacidadComponent.actualizar();

    if (this.capacidadDeudor.habilitaAbsorcion) {
      this.capacidadDeudor.absorberComponent.validaRegistros();
      this.capacidadDeudor.absorberComponent.saldoabsorveneg;//CCA 202209
      this.rqMantenimiento.mdatos.montoabsorcionaportes = this.operacionRubrosArreglo.totalprecancelacion+this.capacidadDeudor.absorberComponent.saldoabsorveneg;//CCA 202209
      //this.rqMantenimiento.mdatos.montoabsorcionaportes = this.operacionRubrosArreglo.totalprecancelacion;
      super.addMantenimientoPorAlias(this.capacidadDeudor.absorberComponent.alias, this.capacidadDeudor.absorberComponent.getMantenimiento(6));
    }

    super.addMantenimientoPorAlias(this.condicionesArreglo.alias, this.condicionesArreglo.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.rubrosArreglo.alias, this.rubrosArreglo.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.capacidadDeudor.alias, this.capacidadDeudor.getMantenimiento(3));
    super.addMantenimientoPorAlias(this.capacidadDeudor.ingresosCapacidadComponent.alias + this.capacidadDeudor.alias, this.capacidadDeudor.ingresosCapacidadComponent.getMantenimiento(4));
    super.addMantenimientoPorAlias(this.capacidadDeudor.egresosCapacidadComponent.alias + this.capacidadDeudor.alias, this.capacidadDeudor.egresosCapacidadComponent.getMantenimiento(5));

    if (this.habilitaGarante) {
      if (!this.estaVacio(this.capacidadGarante.registro.cpersona)) {
        this.capacidadGarante.selectRegistro(this.capacidadGarante.registro);
        this.capacidadGarante.actualizar();
        this.capacidadGarante.ingresosComponent.selectRegistro(this.capacidadGarante.ingresosComponent.registro);
        this.capacidadGarante.ingresosComponent.actualizar();
        this.capacidadGarante.egresosComponent.selectRegistro(this.capacidadGarante.egresosComponent.registro);
        this.capacidadGarante.egresosComponent.actualizar();
        super.addMantenimientoPorAlias(this.capacidadGarante.alias, this.capacidadGarante.getMantenimiento(7));
        super.addMantenimientoPorAlias(this.capacidadGarante.ingresosComponent.alias + this.capacidadGarante.alias, this.capacidadGarante.ingresosComponent.getMantenimiento(8));
        super.addMantenimientoPorAlias(this.capacidadGarante.egresosComponent.alias + this.capacidadGarante.alias, this.capacidadGarante.egresosComponent.getMantenimiento(9));
      }
    }
    super.addMantenimientoPorAlias(this.capacidadDeudor.consolidadoComponent.alias, this.capacidadDeudor.consolidadoComponent.getMantenimiento(10)); //CCA 20221025 envia datos consolidado

    super.grabar();
  }

  grabarSimulacion(): void {
    this.verificaAplicaCalificacion();//CCA 20221117
    this.condicionesArreglo.grabarSimulacion();
    this.capacidadGarante.lestadossocios = this.lestadossocios;
    this.capacidadGarante.deudor = this.mcampos.cpersona;
    this.capacidadGarante.mcampos.cmodulo = this.cmodulo;
    this.capacidadGarante.mcampos.cproducto = this.cproducto;
    this.capacidadGarante.mcampos.ctipoproducto = this.ctipoproducto;
  }

  validaGrabar() {
    return this.condicionesArreglo.validaGrabar() && this.rubrosArreglo.validaGrabar();
  }

  public postCommit(resp: any) {
    if (resp.cod === 'OK') {
      this.cargarPagina(resp);
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
          mfiltros: reg.mfiltros, cpersona: this.mcampos.cpersona, identificacion: this.mcampos.identificacion, npersona: this.mcampos.nombre,
          csolicitud: reg.csolicitud, nsolicitud: this.mcampos.ntipoprod, tran: tranpagina, tit: titpagina
        })
      }
    });
    this.appService.titulopagina = opciones['tit'];
  }
  // Fin MANTENIMIENTO *********************

  /**Retorno de condiciones. */
  fijarCapacidad(resp: any): void {
    if (!this.estaVacio(resp)) {
      this.capacidadDeudor.registro.cpersona = this.mcampos.cpersona;
      this.capacidadDeudor.registro.nproducto = this.mcampos.nproducto;
      this.capacidadDeudor.registro.ntipoproducto = this.mcampos.ntipoproducto;
      this.capacidadDeudor.registro.monto = this.condicionesArreglo.registro.mdatos.monto;
      this.capacidadDeudor.registro.numerocuotas = resp.TABLA.length;
      this.capacidadDeudor.registro.tasa = this.mcampos.tasa;
      this.capacidadDeudor.registro.valorcuota = resp.TABLA[0].valcuo;
      this.capacidadDeudor.registro.destino = this.condicionesArreglo.mcampos.destino;

      this.capacidadGarante.registro.monto = this.condicionesArreglo.registro.mdatos.monto;
      this.capacidadDeudor.consolidadoComponent.montooperacionap=this.condicionesArreglo.registro.mdatos.monto;//CCA 20221025 nuevo monto
      this.capacidadGarante.registro.valorcuota = resp.TABLA[0].valcuo;
      this.capacidadGarante.porcentajecapacidadpago = resp.porcentajecapacidadpago;

      this.capacidadDeudor.porcentajecapacidadpago = resp.porcentajecapacidadpago;
      this.capacidadDeudor.ingresosCapacidadComponent.porcentajecapacidadpago = resp.porcentajecapacidadpago;
      this.capacidadDeudor.habilitaAbsorcion = resp.absorberoperaciones;
      this.capacidadDeudor.ingresosCapacidadComponent.postQuery(resp);
      this.capacidadDeudor.egresosCapacidadComponent.postQuery(resp);
    }
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const consultaTipoArreglo = new Consulta('TcarTipoArregloPago', 'Y', 't.nombre', {}, {});
    consultaTipoArreglo.cantidad = 30;
    this.addConsultaCatalogos('TIPOARREGLO', consultaTipoArreglo, this.ltipoarreglototal, super.llenaListaCatalogo, 'ctipoarreglopago');

    const consultaEstadoSocio = new Consulta('TcarCondicionSocio', 'Y', 'cestadosocio', {}, {});
    consultaEstadoSocio.cantidad = 100;
    this.addConsultaCatalogos('ESTADOSOCIO', consultaEstadoSocio, this.lestadossocios, super.llenaListaCatalogo, 'cestadosocio', null, false);

    const consultaTipoTamortizacion = new Consulta('TcarTipoTablaAmortizacion', 'Y', 't.nombre', {}, {});
    consultaTipoTamortizacion.cantidad = 100;
    this.addConsultaCatalogos('TIPOTABLAAMORTIZACION', consultaTipoTamortizacion, this.condicionesArreglo.ltablaamortizacion, super.llenaListaCatalogo, 'ctabla');

    this.ejecutarConsultaCatalogos();
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.validaRegimen = true;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.cestadosocio = reg.registro.mdatos.cestadosocio;

      this.lovOperacion.mfiltrosesp.cestatus = 'not in (\'APR\',\'CAN\')';
      this.lovOperacion.mfiltrosesp.fapertura = '!= ' + this.dtoServicios.mradicacion.fcontable;
      this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;

      this.consultarConyuge();
      this.consultarReincorporados();

      this.lovOperacion.consultar();
      this.lovOperacion.showDialog();
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

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.condicionesArreglo.postQuery(reg);
    this.condicionesArreglo.registro.coperacion = reg.registro.coperacion;
    this.condicionesArreglo.registro.mdatos.ctabla = reg.registro.ctabla;
    this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    this.mcampos.nproducto = reg.registro.mdatos.nproducto;
    this.mcampos.ntipoproducto = reg.registro.mdatos.ntipoproducto;
    this.mcampos.tasa = reg.registro.tasa;
    this.montooperacion = reg.registro.montooriginal;
    this.cmodulo = reg.registro.cmodulo;
    this.cproducto = reg.registro.cproducto;
    this.ctipoproducto = reg.registro.ctipoproducto;
    this.fijarListaTipoArregloPago(reg.registro.mdatos.ccalificacion);
  }

  public fijarListaTipoArregloPago(ccalificacion) {
    super.limpiaLista(this.ltipoarreglo);

    if (this.estaVacio(ccalificacion)) {
      super.mostrarMensajeError("OPERACIÓN NO TIENE CALIFICACIÓN");
      return;
    }

    const mfiltrosCalificacion: any = { 'ccalificacion': ccalificacion };
    const consultaCalificacion = new Consulta('TcarCalificacionArregloPago', 'Y', 't.ccalificacion', mfiltrosCalificacion, {});
    consultaCalificacion.cantidad = 100;
    this.addConsultaPorAlias("CALIFICACIONARREGLOPAGO", consultaCalificacion);

    const mfiltrosProducto: any = { 'cproducto': this.cproducto, 'ctipoproducto': this.ctipoproducto, 'verreg': 0 };
    const consultaProducto = new Consulta('TcarProducto', 'Y', 't.cproducto', mfiltrosProducto, {});
    consultaProducto.cantidad = 100;
    this.addConsultaPorAlias("PRODUCTOCARTERA", consultaProducto);

    const mfiltrosparam: any = { 'codigo': 'CODIGO-RENOVACION' };
    const consultarParametro = new Consulta('TcarParametros', 'Y', 't.codigo', mfiltrosparam, {});
    this.addConsultaPorAlias("CODIGORENOVACION", consultarParametro);

    const mfiltrosCalificaHist: any = { 'coperacion': this.condicionesArreglo.registro.coperacion}; //CCA 20221117
    const mfiltrosEspCalificaHist: any = { 'fcalificacion': ">=20220101"};
    const consultaCalificaHist = new Consulta('tcaroperacioncalificahistoria', 'Y', 't.coperacion', mfiltrosCalificaHist, mfiltrosEspCalificaHist);
    consultaCalificaHist.cantidad = 400;
    this.addConsultaPorAlias("CALIFICAHISTORIA", consultaCalificaHist);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        if (resp.cod === 'OK') {
          this.manejaRespuestaTipoArreglo(resp);
        }
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  private manejaRespuestaTipoArreglo(resp: any) {
    const producto = resp.PRODUCTOCARTERA[0];
    const renovacion = producto.renovacion;
    this.paramrenovacion = resp.CODIGORENOVACION[0].texto;
    this.respCalificacion = resp.CALIFICAHISTORIA; //CCA 20221117
    this.capacidadDeudor.habilitaConsolidado= resp.PRODUCTOCARTERA[0].consolidado;//CCA 20221025
    this.habilitaGarante = producto.requieregarante;
    this.capacidadGarante.habilitaAbsorcionGarante = producto.absorberoperaciones;
    for (const i in resp.CALIFICACIONARREGLOPAGO) {
      if (resp.CALIFICACIONARREGLOPAGO.hasOwnProperty(i)) {
        const reg: any = resp.CALIFICACIONARREGLOPAGO[i];

        for (const j in this.ltipoarreglototal) {
          if (this.ltipoarreglototal.hasOwnProperty(j)) {
            const arr: any = this.ltipoarreglototal[j];
            if (!this.estaVacio(arr) && reg.ctipoarreglopago === arr.value) {
              if (reg.ctipoarreglopago === this.paramrenovacion) {
                if (renovacion) {
                  this.ltipoarreglo.push(arr);
                }
              } else {
                this.ltipoarreglo.push(arr);
              }
            }
          }
        }

      }
    }
  }

  consultarRubrosArregloParam(): any {
    if (this.estaVacio(this.condicionesArreglo.registro.coperacion) || this.estaVacio(this.tipoarreglo)) {
      return;
    }

    this.habilitamensaje = false;
    this.condiciones = false;
    this.condicionesArreglo.registro.ctipoarreglopago = this.tipoarreglo;
    this.encerarConsultaCatalogos();

    const mfiltros = { 'ctipoarreglopago': this.tipoarreglo };
    const consultarRubrosArreglo = new Consulta('TcarRubrosArregloPago', 'Y', 't.csaldo', mfiltros, null);
    consultarRubrosArreglo.addSubquery('TmonSaldo', 'nombre', 'nsaldo', 'i.csaldo=t.csaldo');
    consultarRubrosArreglo.addSubquery('TmonSaldo', 'nombre', 'nsaldodestino', 'i.csaldo=t.csaldodestino');
    consultarRubrosArreglo.cantidad = 100;
    this.addConsultaCatalogos('RUBROSARREGLO', consultarRubrosArreglo, this.ltipoarreglo, this.llenarRubrosArreglo, null, this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarRubrosArreglo(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    for (const item of componentehijo.rubrosArreglo.lregistros) {
      componentehijo.rubrosArreglo.selectRegistro(item);
      componentehijo.rubrosArreglo.eliminar();
    }

    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const item = pListaResp[i];
        componentehijo.rubrosArreglo.crearNuevo();

        componentehijo.rubrosArreglo.registro.coperacion = componentehijo.condicionesArreglo.registro.coperacion;
        componentehijo.rubrosArreglo.registro.ctipoarreglopago = componentehijo.condicionesArreglo.registro.ctipoarreglopago;
        componentehijo.rubrosArreglo.registro.csaldo = item.csaldo;
        componentehijo.rubrosArreglo.registro.csaldodestino = item.csaldodestino;
        componentehijo.rubrosArreglo.registro.pagoobligatorio = item.pagoobligatorio;
        componentehijo.rubrosArreglo.registro.mdatos.nsaldo = item.mdatos.nsaldo;
        componentehijo.rubrosArreglo.registro.mdatos.nsaldodestino = item.mdatos.nsaldodestino;

        componentehijo.rubrosArreglo.selectRegistro(componentehijo.rubrosArreglo.registro);
        componentehijo.rubrosArreglo.actualizar();
      }
    }
    componentehijo.consultaOperacionRubros();
    componentehijo.lrubrosarreglo = pListaResp;
  }

  consultaOperacionRubros() {
    const rqConsulta: any = new Object();
    let montocapital = 0;
    let montopago = 0;
    let montogastos = 0;
    let montocxp = 0;
    rqConsulta.coperacion = this.condicionesArreglo.registro.coperacion;
    rqConsulta.CODIGOCONSULTA = 'RUBROSPRECANCELACIONCARTERA';

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod === 'OK') {
            this.condiciones = true;
            for (const i in resp.RUBROS) {
              if (resp.RUBROS.hasOwnProperty(i)) {
                const reg: any = resp.RUBROS[i];

                // Rubros no aplica renovacion
                if (reg.ctiposaldo === this.SALDOCAPITAL) {
                  montocapital = montocapital + reg.monto;
                } else {
                  if (reg.ctiposaldo === this.SALDOCXP) {
                    montocxp = montocxp + reg.monto;
                  }
                }

                let existerubro = false;
                for (const a in this.lrubrosarreglo) {
                  if (this.lrubrosarreglo.hasOwnProperty(a)) {
                    const arr: any = this.lrubrosarreglo[a];

                    if (!this.estaVacio(reg) && !this.estaVacio(arr) && reg.csaldo === arr.csaldo) {
                      existerubro = true;
                      reg.csaldodestino = arr.csaldodestino;
                      if (arr.pagoobligatorio) {
                        reg.pagoobligatorio = arr.pagoobligatorio;
                        montopago = super.redondear(Number(montopago), 2) + super.redondear(Number(reg.monto), 2);
                        break;
                      } else {
                        reg.pagoobligatorio = false;
                        montogastos = super.redondear(Number(montogastos), 2) + super.redondear(Number(reg.monto), 2);
                      }
                    }
                  }
                }

                if (!existerubro) {
                  if (reg.ctiposaldo !== this.SALDOCAPITAL && reg.ctiposaldo !== this.SALDOCXP) {
                    super.mostrarMensajeError("EL RUBRO [" + reg.nombre + "] DE LA OPERACION NO TIENE RUBRO DESTINO");
                    return;
                  }
                }
              }
            }

            // Datos de operacion original
            this.operacionRubrosArreglo.lregistros = resp.RUBROS;
            this.operacionRubrosArreglo.totalprecancelacion = resp.TOTALPRECANCELACION;
            this.operacionRubrosArreglo.montooperacion = super.redondear(Number(this.montooperacion), 2);
            this.operacionRubrosArreglo.montopago = super.redondear(Number(montopago), 2);
            this.operacionRubrosArreglo.montocapital = super.redondear(Number(montocapital), 2);
            this.operacionRubrosArreglo.montogastos = super.redondear(Number(montogastos), 2);
            this.operacionRubrosArreglo.montocxp = super.redondear(Number(montocxp), 2);
            this.operacionRubrosArreglo.montoarreglopago = super.redondear(Number(montocapital), 2) + super.redondear(Number(montogastos), 2);

            // Condiciones de nueva opeacion
            this.condicionesArreglo.larreglorubros = resp.RUBROS;
            this.condicionesArreglo.registro.mdatos.montoanterior = montocapital;
            if (this.tipoarreglo === this.paramrenovacion) {
              this.condicionesArreglo.esrenovacion = true;
            } else {
              this.condicionesArreglo.esrenovacion = false;
            }

            // Valida estado del socio para renovaciones
            if (this.condicionesArreglo.esrenovacion) {
              this.capacidadDeudor.absorberComponent.mcampos.cpersona = this.mcampos.cpersona;
              this.capacidadDeudor.absorberComponent.mcampos.coperacion = this.condicionesArreglo.registro.coperacion;
              this.capacidadDeudor.absorberComponent.consultar();
              if (!this.validaCondicionesSocio(this.mcampos.cestadosocio)) {
                this.habilitamensaje = true;
                return;
              }
            }

            this.condicionesArreglo.limpiar();
            this.condicionesArreglo.registro.mdatos.monto = this.condicionesArreglo.registro.mdatos.montoanterior;
            this.condicionesArreglo.calcularMonto();
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

  consultarConyuge(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.capacidadDeudor.ingresosCapacidadComponent.lconyuge = [];

    const mfiltrosSueldo: any = { 'cpersona': this.mcampos.cpersona, 'verreg': 0 };
    const consultaConyuge = new Consulta('TperReferenciaPersonales', 'Y', 't.cpersona', mfiltrosSueldo, {});
    consultaConyuge.cantidad = 100;
    this.addConsultaPorAlias("CONYUGE", consultaConyuge);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.capacidadDeudor.ingresosCapacidadComponent.lconyuge = resp.CONYUGE;
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  /**Consulta de reincorporados. */
  consultarReincorporados(): any {
    this.msgs = [];
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'REINCORPORADO';
    rqConsulta.cpersona = this.mcampos.cpersona;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          if (resp.cod === 'OK') {
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

  public verificaAplicaCalificacion(){
    //CCA 20221117
    var calificacionFecha = [];
    var calificacionFinal = [];
    
    for(var i= 0; i < this.respCalificacion.length; i++) {
      calificacionFecha.push({ 
          "fcalificacion"    : this.respCalificacion[i].fcalificacion,
          "ccalificacion"  : this.respCalificacion[i].ccalificacion
      });
    }
    for (const i in calificacionFecha) {
      var fechaFinMes ="";
      var fechaCalificacion;
      var fechaFinPorMes;
      
      fechaFinMes = ""+calificacionFecha[i].fcalificacion+"";
          
      if(fechaFinMes!="0")
      {
        fechaCalificacion = fechaFinMes.substring(0,4)+"-"+fechaFinMes.substring(4,6)+"-"+fechaFinMes.substring(6,8);
        var fechaDate = new Date(fechaCalificacion)
        var ultimoDia = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0);
        fechaFinPorMes =fechaFinMes.substring(0,4)+"-"+fechaFinMes.substring(4,6)+"-"+ultimoDia.getDate()
        if(fechaCalificacion==fechaFinPorMes){
          if(calificacionFecha[i].ccalificacion!="A-1"){
            calificacionFinal.push(calificacionFecha[i].ccalificacion);            
          }
        }

      }
      
    }
    this.capacidadDeudor.condicionCalicacDeudor = calificacionFinal.length;
  }

}
