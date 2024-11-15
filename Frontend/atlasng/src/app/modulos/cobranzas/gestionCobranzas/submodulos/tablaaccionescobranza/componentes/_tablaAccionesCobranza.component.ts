import { Component, OnInit, Output, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-tabla-acciones',
  templateUrl: '_tablaAccionesCobranza.html'
})
export class TablaAccionesCobranzaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  @Output() eventoCliente = new EventEmitter();
  
  public laccion: SelectItem[] = [{ label: '...', value: null }];
  public laccionMora: SelectItem[] = [{ label: '...', value: null }];
  public mostrarDialogoAccionCobranza = false;
  public lregistrosDireccion = [];
  public acitvation = false;
  public print = false;
  private nombreAccion;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcobCobranzaAccion', 'TABLA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {}

  crearNuevo() {}

  actualizar() {}

  eliminar() {}

  cancelar() {}

  public selectRegistro(registro: any) {}

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
    consultaMotivoMora.cantidad = 500;
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

  consultar() {
    this.mostrarDialogoAccionCobranza = false;
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.fingreso desc, t.secuencia desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tcobaccion', 'nombre', 'naccion', 'i.caccion = t.caccion and i.verreg = 0');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public consultarAnterior() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.consultarAnterior();
  }

  public consultarSiguiente() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.consultarSiguiente();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    this.acitvation = false;
    this.mcampos.celular =   null;
    this.mcampos.email =   null;
    this.lregistrosDireccion = [];
    this.msgs = [];
    this.lconsulta = [];
    const consultaDataPersona = new Consulta('TperPersonaDetalle', 'Y', 't.verreg', {cpersona: this.mcampos.cpersona, verreg: 0}, {});
    const consultaDireccion = new Consulta('TperPersonaDireccion', 'Y', 't.secuencia', {ccompania: this.dtoServicios.mradicacion.ccompania, verreg: 0}, {});
    consultaDireccion.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipodireccion', 'i.ccatalogo = t.tipodireccionccatalogo and i.cdetalle = t.tipodireccioncdetalle');
    const consultaOperacionCobranza = new Consulta("TcobCobranza", 'Y', 't.diasvencidos, t.fultmodificacion, t.fasignacion, cpersona', {coperacion: this.mcampos.coperacion}, {});
    consultaOperacionCobranza.addSubquery('TCobEstatus', 'nombre', 'nestadocobranza', 'i.cestatus = t.cestatus');
    this.addConsultaPorAlias('DIRECCIONES', consultaDireccion);
    this.addConsultaPorAlias('CLIENTE', consultaDataPersona);
    this.addConsultaPorAlias('COBRANZA', consultaOperacionCobranza);
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          if(resp && resp["cod"] === "OK"){
            this.mcampos.celular = resp["CLIENTE"][0]["celular"];
            this.mcampos.email = resp["CLIENTE"][0]["email"];
            this.lregistrosDireccion = resp["DIRECCIONES"];
            this.eventoCliente.emit({
              estadoactualoperacion: (resp["COBRANZA"] && (resp["COBRANZA"]).length == 1 && resp["COBRANZA"][0]["mdatos"] && resp["COBRANZA"][0]["mdatos"]["nestadocobranza"]) ? resp["COBRANZA"][0]["mdatos"]["nestadocobranza"] : "N/A"
            });
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
    super.postQueryEntityBean(resp);
  }

  consultarAccionesCobranzasPosteriorAgregacion(){
    this.lconsulta = [];
    const accionesCobranzas = new Consulta(this.entityBean, 'Y', 't.fingreso desc, t.secuencia desc', this.mfiltros, this.mfiltrosesp);
    accionesCobranzas.addSubquery('tcobaccion', 'nombre', 'naccion', 'i.caccion = t.caccion and i.verreg = 0');
    accionesCobranzas.cantidad = 500;
    this.addConsultaPorAlias('ACCIONESCOBRANZAS', accionesCobranzas);
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          if(resp && resp["cod"] === "OK"){
            this.lregistros = resp["ACCIONESCOBRANZAS"];
            this.mostrarDialogoAccionCobranza = false;
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === 'OK') {
      this.consultarAccionesCobranzasPosteriorAgregacion();
      this.print = true;
    }
  }

  public agregarAccionCobranza(){
    this.acitvation = false;
    if (!this.validaFiltrosRequeridos()) {
      return;
    }else if(this.mcampos.cestatusoperacion != 'VIG' && this.mcampos.cestatusoperacion != 'VIGENTE' && this.mcampos.cestatusoperacion != 'VEN' && this.mcampos.cestatusoperacion != 'VENCIDA'){
      this.mostrarMensajeError("NO ES POSIBLE AGREGAR ACCIONES DE COBRANZA; LA OPERACIÓN NO SE ENCUENTRA VIGENTE O VENCIDA.");
      return;
    }
    this.print = false;
    this.acitvation = false;
    this.registro.fcompromisopago = null;
    this.registro.caccion = null;
    this.registro.mdatos.enviocorreo = null;
    this.registro.cdetalletipoaccion = null;
    this.nombreAccion = null;
    this.registro.tipoaccionselected = null;
    this.registro.tipomoraselected = null;
    this.msgs = [];
    this.lconsulta = [];
    const consultaOperacionCobranza = new Consulta("TcobCobranza", 'Y', 't.diasvencidos, t.fultmodificacion, t.fasignacion, cpersona', {coperacion: this.mcampos.coperacion}, {});
    consultaOperacionCobranza.addSubquery('TCobEstatus', 'nombre', 'nestadocobranza', 'i.cestatus = t.cestatus');
    this.addConsultaPorAlias('COBRANZA', consultaOperacionCobranza);
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          if(resp && resp["cod"] === "OK"){
            const estadCobranza = (resp["COBRANZA"] && (resp["COBRANZA"]).length == 1 && resp["COBRANZA"][0]["mdatos"] && resp["COBRANZA"][0]["mdatos"]["nestadocobranza"]) ? resp["COBRANZA"][0]["mdatos"]["nestadocobranza"] : "N/A";
            this.eventoCliente.emit({
              estadoactualoperacion: estadCobranza
            });
            /*if(estadCobranza == "JUDICIAL"){
              this.mostrarMensajeError("NO ES POSIBLE AGREGAR ACCIONES DE COBRANZA; LA OPERACIÓN SE ENCUENTRA JUDICIALIZADA.");
              return;
            }else */if(estadCobranza == "N/A"){
              this.mostrarMensajeError("LA OPERACIÓN NO SE ENCUENTRA REGISTRADA EN COBRANZAS.");
              return;
            }else if(resp["COBRANZA"][0]["diasvencidos"] <= 0){ //MNE 20240911
              this.mostrarMensajeError("NO ES POSIBLE AGREGAR ACCIONES DE COBRANZA; LA OPERACIÓN NO POSEE DÍAS VENCIDOS.");
              return;
            }
            else{
              this.registro.ccobranza = resp["COBRANZA"][0]["ccobranza"];
              this.registro.saldovencido = resp["COBRANZA"][0]["montovencido"];
              this.registro.diasvencido = resp["COBRANZA"][0]["diasvencidos"];
              this.registro.numcuotavencido = resp["COBRANZA"][0]["cuotasvencidas"];
              this.registro.observacion = null;
              this.mostrarDialogoAccionCobranza = true;
            }
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  public guardarAccionCobranza(){
    if(!this.registro.tipoaccionselected){
      this.mostrarMensajeError("ES OBLIGATORIO QUE SELECCIONE UN TIPO DE ACCIÓN.");
      return;
    }
    if((this.registro.tipoaccionselected.caccion == 1 || this.registro.tipoaccionselected.caccion == 2) && (!this.registro.telefono || String(this.registro.telefono).trim().length <= 0)){
      this.mostrarMensajeError("EL NÚMERO TELEFÓNICO ES OBLIGATORIO.");
      return;
    }
    if((this.registro.tipoaccionselected.caccion != 1 && this.registro.tipoaccionselected.caccion != 2) && (!this.registro.correo || String(this.registro.correo).trim().length <= 0)){
      this.mostrarMensajeError("EL CORREO ELECTRÓNICO ES OBLIGATORIO.");
      return;
    }
    if(!this.registro.observacion || String(this.registro.observacion).trim().length <= 0){
      this.mostrarMensajeError("EL COMENTARIO DE OBSERVACIONES ES OBLIGATORIO.");
      return;
    }
    this.lmantenimiento = [];
    this.rqMantenimiento.coperacion = this.registro.coperacion;
    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.mdatos.ccobranza = this.registro.ccobranza;
    this.registro.cusuarioaccion = this.dtoServicios.mradicacion.cusuario;
    const mantenimiento = super.getMantenimiento(1);
    const dateNow = new Date();
    mantenimiento.ins.push({
      actualizar: false,
      caccion: this.registro.caccion,
      ccatalogo: this.registro.ccatalogo,
      ccobranza: this.registro.ccobranza,
      cdetalle: this.registro.cdetalle,
      cdetalletipoaccion: this.registro.cdetalletipoaccion,
      coperacion: this.mcampos.coperacion,
      correo: this.registro.correo,
      cusuarioaccion: this.registro.cusuarioaccion,
      diasvencido: this.registro.diasvencido,
      esnuevo: true,
      fingreso: dateNow.getFullYear() + "" + (((dateNow.getMonth() + 1) < 10) ? "0" + (dateNow.getMonth() + 1) : (dateNow.getMonth() + 1)) + "" + ((dateNow.getDate() < 10) ? "0" + dateNow.getDate() : dateNow.getDate()),
      fcompromisopago: this.registro.fcompromisopago,//MNE 20241014
      idreg: this.registro.idreg,
      mdatos: this.registro.mdatos,
      numcuotavencido:this.registro.numcuotavencido,
      observacion: this.registro.observacion,
      saldovencido: this.registro.saldovencido,
      telefono:this.registro.telefono,
      verreg:0
    });
    mantenimiento.upd = [];
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
    super.grabar();
  }

  public cerrarDialogoAccionesCobranza() {
    this.mostrarDialogoAccionCobranza = false;
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
  }

  descargarReporte() {
    if(this.print){
      this.jasper.nombreArchivo = 'ReporteSimulacion';
      this.jasper.parametros['@i_cpersona'] = this.mcampos.cpersona;
      this.jasper.parametros['@i_tipo'] = this.nombreAccion;
      this.jasper.parametros['@i_cusuario'] = this.dtoServicios.mradicacion.np;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Cobranzas/rptCobNotificaciones';
      this.jasper.formatoexportar = 'pdf';
      this.jasper.generaReporteCore();
    }else{
      this.mostrarMensajeError("NO A REGISTRADO UNA ACCIÓN DE COBRANZA.");
      return; 
    }
  }
}