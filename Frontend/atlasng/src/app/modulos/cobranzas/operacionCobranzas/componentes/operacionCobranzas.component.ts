import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { AppService } from '../../../../util/servicios/app.service';
import { LovOperacionCobranzaComponent } from '../../lov/operacion/componentes/lov.operacionCobranza.component';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { LovPersonaVistaComponent } from '../../../personas/lov/personavista/componentes/lov.personaVista.component';
import { JasperComponent } from '../../../../util/componentes/jasper/componentes/jasper.component'
import { DireccionComponent } from './_direccion.component';

@Component({
  selector: 'app-operacion-cobranzas',
  templateUrl: 'operacionCobranzas.html'
})
export class OperacionCobranzasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public laccion: SelectItem[] = [{ label: '...', value: null }];
  public laccionMora: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild('vistadeudor')
  private lovPersonaVista: LovPersonaVistaComponent;

  @ViewChild(LovOperacionCobranzaComponent)
  private lovOperacion: LovOperacionCobranzaComponent;

  @ViewChild(DireccionComponent)
  private direccion: DireccionComponent;

  @ViewChild(JasperComponent)
  public reporte: JasperComponent;

  habilitagrabar = true;
  public acitvation = false;
  private print = false;
  public impresion = false;
  private nombreAccion;
  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService) {
    super(router, dtoServicios, 'TcobCobranzaAccion', 'INGRESOACCIONES', true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros, this.route);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    this.route['queryParams'].subscribe((p: any) => {
      if (p.cob) {
        const cob = JSON.parse(p.cob);
        this.mcampos.cpersona = cob.cpersona;
        this.mcampos.identificacion = cob.identificacion;
        this.mcampos.nombre = cob.npersona;
        this.mcampos.celular = cob.celular;
        this.mcampos.email = cob.email;
        this.registro.mdatos.nombre = cob.npersona;
        //NCH 20220810
        this.registro.mdatos.identificacion = cob.identificacion; 
        this.registro.mdatos.coperacion = cob.coperacion;
        this.registro.mdatos.saldovencido = cob.montovencido;
        this.registro.mdatos.numcuotavencido = cob.cuotasvencidas;
        this.registro.mdatos.diasvencido = cob.diasvencidos;
        this.registro.mdatos.ntipoprod = cob.ncobranza;
        this.registro.mdatos.estado = cob.estado;
        this.registro.mdatos.coperacion = cob.coperacion;
        //
        this.registro.ccobranza = cob.ccobranza;
        this.registro.coperacion = cob.coperacion;
        this.mcampos.ntipoprod = cob.ncobranza;
        this.registro.saldovencido = cob.montovencido;
        this.registro.diasvencido = cob.diasvencidos;
        this.registro.numcuotavencido = cob.cuotasvencidas;
        this.registro.ccatalogo = null;
        this.registro.cdetalle = null;

        this.direccion.mfiltros.cpersona = cob.cpersona;
        this.direccion.consultar();
      }
    });
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.verreg = 0;
    this.registro.fingreso = this.dtoServicios.mradicacion.fcontable;
  }

  actualizar() {
    if (this.registro.fcompromisopago < this.fechaactual) {
      super.mostrarMensajeWarn("FECHA INGRESADA INCORRECTA");
      this.editable = true;
    }
    else {
      super.actualizar();
    }
  }

  habilitarEdicion() {
    if (this.registro.ccobranza === undefined || this.registro.ccobranza === null) {
      super.mostrarMensajeWarn("SELECCIONE PERSONA Y COBRANZA");
    } else {
      super.habilitarEdicion();
    }
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.mfiltros.verreg = 0;
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacion', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.coperacion = this.registro.coperacion;
    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.mdatos.ccobranza = this.registro.ccobranza;
    this.registro.cusuarioaccion = this.dtoServicios.mradicacion.cusuario;
    this.crearDtoMantenimiento();

    super.grabar(false);

    if (this.registro.cdetalletipoaccion == 2) {
      this.print = true;
    }
    else {
      this.print = false;
    }
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === 'OK') {
      this.habilitagrabar = false;
    }
  }
  // Fin MANTENIMIENTO *********************

  /**Muestra lov de personas */
  mostrarlovpersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;
      this.registro.mdatos.nombre = reg.registro.nombre;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.celular = reg.registro.celular;
      this.mcampos.email = reg.registro.email;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mostrarLovOperacion();
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

  /**Muestra lov de operaciones */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.mfiltros.cestatus = 'ASI';
    this.lovOperacion.mfiltros.cusuarioasignado = this.dtoServicios.mradicacion.cusuario;
    this.lovOperacion.showDialog();
    this.lovOperacion.consultar();
  }

  /**Retorno de lov de operacion. */
  fijarLovOperacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccobranza = reg.registro.ccobranza;
      this.registro.coperacion = reg.registro.coperacion;
      this.mcampos.ntipoprod = reg.registro.coperacion + ' - ' + reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    }
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
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
    const mfiltrosEstUsr: any = { 'estado': true, 'verreg': 0 };
    const consultaAccion = new Consulta('tcobaccion', 'Y', 't.nombre', mfiltrosEstUsr, {});
    const consultaMotivoMora = new Consulta('tgencatalogodetalle', 'Y', 'cdetalle', {ccatalogo:802}, {});
    consultaAccion.cantidad = 50;
    consultaMotivoMora.cantidad = 10;
    this.addConsultaPorAlias('ACCION', consultaAccion);
    this.addConsultaPorAlias('MORA', consultaMotivoMora);
  }

  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      for (const i in resp.ACCION) {
        if (resp.ACCION.hasOwnProperty(i)) {
          const reg = resp.ACCION[i];
          this.laccion.push({ label: reg.nombre, value: { caccion: reg.caccion, correo: reg.enviocorreo, cdetalletipoaccion: reg.cdetalletipoaccion } });
        }
      }
      for (const i in resp['MORA']) {
        if ((resp['MORA']).hasOwnProperty(i)) {
          const reg = resp['MORA'][i];
          this.laccionMora.push({ label: reg['nombre'], value:{ccatalogo: reg['ccatalogo'], cdetalle: reg['cdetalle']}});
        }
      }
    }
    this.lconsulta = [];
  }

  habilitarCorreo(data: any) {

    this.registro.caccion = data.value.caccion;
    this.registro.mdatos.enviocorreo = data.value.correo;
    this.registro.cdetalletipoaccion = data.value.cdetalletipoaccion;
    if (!data.value.correo) {
      this.registro.correo = null;
    }
    else {
      this.registro.correo = this.mcampos.email;
    }
    if (this.registro.cdetalletipoaccion == 1) {
      this.acitvation = true;
      this.registro.telefono = this.mcampos.celular;
    }
    else {
      this.registro.telefono = null;
      this.acitvation = false;
    }
  }

  habilitarNotificacion(data: any) {
    for (const i in this.laccion) {
      if (this.laccion.hasOwnProperty(i)) {
        const reg = this.laccion[i];
        if (reg.value != null && reg.value.caccion === data.value.caccion) {
          this.nombreAccion = reg.label;
        }
      }
    }
  }

  selectMotivoMora(mora: any){
    for (const i in this.laccionMora) {
      if (this.laccionMora.hasOwnProperty(i)) {
        try {
          if(this.laccionMora[i]['value']['cdetalle'] === mora['value']['cdetalle']){
            this.registro.ccatalogo = mora['value']['ccatalogo'];
            this.registro.cdetalle = mora['value']['cdetalle'];
            break;
          }
        } catch (error) {
          this.registro.ccatalogo = null;
          this.registro.cdetalle = null;
        }
      }
    }
  }//MNR 20230718

  retornoBuzon(): void {
    this.cargarPagina();
  }

  descargarReporte() {
    this.impresion = true;
    this.reporte.nombreArchivo = 'ReporteSimulacion';

    // Agregar parametros
    this.reporte.parametros['@i_cpersona'] = this.mcampos.cpersona;
    this.reporte.parametros['@i_tipo'] = this.nombreAccion;
    this.reporte.parametros['@i_cusuario'] = this.dtoServicios.mradicacion.np;
    this.reporte.parametros['archivoReporteUrl'] = '/CesantiaReportes/Cobranzas/rptCobNotificaciones';
    this.reporte.generaReporteCore();
    this.print = false;
  }

  public cargarPagina() {
    const opciones = {};
    const tran = 3;
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
