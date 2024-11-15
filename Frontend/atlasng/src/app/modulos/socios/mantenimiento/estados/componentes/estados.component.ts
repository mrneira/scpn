import { AccionesRegistroComponent } from './../../../../../util/shared/componentes/accionesRegistro.component';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
@Component({
  selector: "app-estados",
  templateUrl: "estados.html"
})
export class EstadosComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros") formFiltros: NgForm;
  public lestadoActivo: SelectItem[] = [{ label: "...", value: null }];
  @ViewChild(LovPersonasComponent) lovPersonas: LovPersonasComponent;
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  public ltipoEstado: SelectItem[] = [{ label: "...", value: null }];
  public ltipoGradoActual: SelectItem[] = [{ label: "...", value: null }];
  public ltipoGradoProximo: SelectItem[] = [{ label: "...", value: null }];
  public ltipoNovedad: SelectItem[] = [{ label: "...", value: null }];
  public ltipoSubEstado: SelectItem[] = [{ label: "...", value: null }];
  public consulta = false;
  public mostrargrado = true;
  private resphisactaul: any = [];
  fecha = new Date();
  public regActual: any;
  public maxSecuenciaAct: any;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, "tsoccesantiahistorico", "HISTORICO", false, false);
    this.componentehijo = this;
  }

  fechaactual = new Date();
  fmin = new Date();
  factiva = false;

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();

  }
  validarFecha() {
    if (!this.estaVacio(this.registro.festado)) {
      this.fmin = new Date(this.registro.festado);
      this.fmin.setDate(this.fmin.getDate());
      this.factiva = true;
    }
    this.registro.fordengen = null;
  }






  ngAfterViewInit() {
    //this.mfiltros.cpersona = 0;
  }
  Busqueda() {
    this.lovPersonas.mfiltros.identificacion = this.mcampos.identificacion;
    this.lovPersonas.consultar();

  }
  crearNuevo() {
    this.encerarMensajes();
    this.mostrargrado = true;
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeError("DEBE ESCOGER UN SOCIO");
      return;
    }

    super.crearNuevo();
    this.registro.activo = true;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.optlock = 0;
    this.registro.verreg = 0;
    this.registro.cpersona = this.mfiltros.cpersona;
    var maxSecuencia = 1;
    var regActual;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.secuencia >= maxSecuencia && reg.activo === true) {
          maxSecuencia = reg.secuencia;
          regActual = reg;
        }
      }
    }
    this.registro.cgradoactual = regActual.cgradoactual;
    this.registro.cgradoproximo = regActual.cgradoproximo;
  }


  actualizar() {
    this.encerarMensajes();
    this.mostrargrado = true;
    /*
    if (this.registro.festado > this.registro.fordengen) {
      this.mostrarMensajeError('FECHA DE SOLICITUD: ' + this.calendarToFechaString(this.registro.festado) + ' NO PUEDE SER MAYOR A FECHA DE ORDEN : ' + this.calendarToFechaString(this.registro.fordengen));
      this.mostrarDialogoGenerico = true;
      return;
    }*/

    if (!this.estaVacio(this.resphisactaul.HISTORICOACTUAL)) {
      if (this.registro.cestadosocio === 1 && this.resphisactaul.HISTORICOACTUAL.cestadosocio >= this.registro.cestadosocio) {
        this.mostrarMensajeError('EL SOCIO YA TIENE UNA ALTA REGISTRADA');
        return;
      }

      /* if (this.resphisactaul.HISTORICOACTUAL.cestadosocio === 3) {
         if (this.registro.cestadosocio !== 8 ) {
           this.mostrarMensajeError('EL SOCIO ESTÁ DADO DE BAJA, SOLO PUEDE PASAR A ESTADO REINCORPORADO');
           return;
         }
       }*/

      if (this.resphisactaul.HISTORICOACTUAL.cestadosocio === 8) {
        if (this.registro.cestadosocio === 1) {
          this.mostrarMensajeError('EL SOCIO ESTÁ REINCORPORADO, NO PUEDE PASAR A ESTADO ALTA');
          return;
        }
      }

     // if (this.resphisactaul.HISTORICOACTUAL.cestadosocio !== 3 && this.registro.cestadosocio === 8) {
     //   this.mostrarMensajeError('NO PUEDE PASAR A ESTADO REINCORPORADO');
     //   return;
     // }

      this.mostrarDialogoGenerico = true;
    }

    super.actualizar();
    this.registrarEtiqueta(this.registro, this.ltipoGradoActual, "cgradoactual", "ngradoactual");
    this.grabar();
  }

  eliminar() {
    if ((this.maxSecuenciaAct + 1 === this.registro.secuencia) || this.registro.cestadosocio === 1) {
      this.mostrarMensajeError("NO PUEDE ELIMINAR ESTE REGISTRO");
      this.mostrarDialogoGenerico = false;
      return;
    }
    super.eliminar();

    this.grabar();
  }

  cancelar() {
    this.encerarMensajes();
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    this.resphisactaul = [];
    this.mostrargrado = true;
    super.selectRegistro(registro);
    this.maxSecuenciaAct = 1;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.secuencia >= this.maxSecuenciaAct && reg.activo === true) {
          this.maxSecuenciaAct = reg.secuencia;
          this.regActual = reg;
          this.resphisactaul.HISTORICOACTUAL = reg;
        }
      }
    }
    this.maxSecuenciaAct = this.maxSecuenciaAct - 1;

  }

  // Inicia CONSULTA *********************
  consultar() {
    this.rqConsulta.CODIGOCONSULTA = null;
    this.crearDtoConsulta();
    super.consultar();

  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, "Y", "t.secuencia", this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery("tsocestadosocio", "nombre", "ntipoestado", "i.cestadosocio = t.cestadosocio");
    consulta.addSubquery("tsoctipogrado", "nombre", "ngradoactual", "i.cgrado =t.cgradoactual");
    consulta.addSubquery("tsoctipogrado", "nombre", "ngradoproximo", "i.cgrado =t.cgradoproximo");
    consulta.addSubquery("tsoctipobaja", "nombre", "nsubestado", "i.ctipobaja=t.csubestado");
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    // resp.alias = 'HISTORICO';
    // for (const i in resp.HISTORICO) {
    //   resp.HISTORICO[i].festado = this.calendarToFechaString(resp.HISTORICO[i].festado);
    //   resp.HISTORICO[i].fechaproceso = this.calendarToFechaString(resp.HISTORICO[i].fechaproceso);
    //   resp.HISTORICO[i].fmodificacion = this.calendarToFechaString(resp.HISTORICO[i].fmodificacion);
    //   resp.HISTORICO[i].fordengen = this.calendarToFechaString(resp.HISTORICO[i].fordengen);
    // }
    super.postQueryEntityBean(resp);
    this.enproceso = false;
    if (this.consulta) {
      this.mostrarMensajeSuccess("TRANSACCIÓN FINALIZADA CORRECTAMENTE");
    }

  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.registro.csubestado = this.registro.csubestado;
    //this.registro.ccdetalleestado=
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
    this.consulta = false;
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    if (resp.cod != 'OK') {
      super.mostrarMensajeError(resp.msgusu);
      return;
    }
    super.postCommitEntityBean(resp);
    this.enproceso = false;
    this.consulta = true;
    this.consultar();

  }

  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovPersonas.mfiltros.tipodepersona = "N";
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  imprimir() {
    if (this.mcampos.identificacion === undefined) {
      this.mostrarMensajeError("SELECCIONES UN SOCIO");
      return;
    }

    this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Socios/HistoricoSocios';
    this.jasper.formatoexportar = 'pdf';
    this.jasper.generaReporteCore();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.registro.cusuario = reg.registro.mdatos.cusuario;
      this.rqConsulta.cpersona = reg.registro.cpersona;
      this.rqConsulta.ccompania = reg.registro.ccompania;
      this.consultar();
      this.consultarHistoricoActualReg();
    }
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios
      .ejecutarConsultaRest(this.getRequestConsulta("C"))
      .subscribe(
        resp => {
          this.encerarMensajes();
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        }
      );
  }

  llenarConsultaCatalogos(): void {
    // const mfiltrosProf: any = {ccatalogo: 24,activo: true};
    const consultaProf = new Consulta("tsocestadosocio", "Y", "t.nombre", {}, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias("TIPOESTADOS", consultaProf);

    //const mfiltrosBaja: any = { estado: 1 };
    const consultaBaja = new Consulta("tsoctipobaja", "Y", "t.ctipobaja", {}, {});
    consultaBaja.cantidad = 50;
    this.addConsultaPorAlias("TIPOSBAJAS", consultaBaja);

    const consultaTipoGradoActual = new Consulta("tsoctipogrado", "Y", "t.cgrado", {}, {});
    consultaTipoGradoActual.cantidad = 50;
    this.addConsultaPorAlias("TIPOGRADOACTUAL", consultaTipoGradoActual);

    const consultaTipoGradoProximo = new Consulta("tsoctipogrado", "Y", "t.nombre", {}, {});
    consultaTipoGradoProximo.cantidad = 50;
    this.addConsultaPorAlias("TIPOGRADOPROXIMO", consultaTipoGradoProximo);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === "OK") {
      this.llenaListaCatalogo(this.ltipoEstado, resp.TIPOESTADOS, "cestadosocio");
      this.llenaListaCatalogo(this.ltipoSubEstado, resp.TIPOSBAJAS, "ctipobaja");
      this.llenaListaCatalogo(this.ltipoGradoActual, resp.TIPOGRADOACTUAL, "cgrado");
      this.llenaListaCatalogo(this.ltipoGradoProximo, resp.TIPOGRADOPROXIMO, "cgrado");

    }
    this.lconsulta = [];
  }
  consultarHistoricoActual() {
    var maxSecuencia = 1;
    var regActual;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.secuencia >= maxSecuencia && reg.activo === true) {
          maxSecuencia = reg.secuencia;
          regActual = reg;
        }
      }
    }
    this.registro.cgradoactual = regActual.cgradoactual;
    this.registro.cgradoproximo = regActual.cgradoproximo;
  }
  consultarHistoricoActualReg(): any {
    this.rqConsulta.CODIGOCONSULTA = 'HISTORICOCARRERA';
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaHistorico(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }


  /**Manejo respuesta de consulta de . */
  private manejaRespuestaHistorico(resp: any) {
    this.resphisactaul = resp;
    this.mostrargrado = true;
    if (resp.cod === "OK") {
      if (this.registro.cestadosocio === 3) {
        this.registro.cgradoactual = resp.HISTORICOACTUAL.cgradoactual;
        this.mostrargrado = false;
      }

      //this.editable = false;
    }
    this.lconsulta = [];
  }
}
