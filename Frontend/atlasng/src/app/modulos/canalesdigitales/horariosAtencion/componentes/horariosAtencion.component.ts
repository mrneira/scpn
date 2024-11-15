import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { ConfirmationService } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { Consulta } from 'app/util/dto/dto.component';

@Component({
  selector: 'app-horarios-atencion',
  templateUrl: 'horariosAtencion.html'
})
export class HorariosAtencionComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  ffatencion: Date;
  titleDialogo: string;
  numReservaciones: number = 0;
  minIntervalo: number = 0;
  maxIntervalo: number = 0;
  numMaxAgentes: number = 0;
  numMaxReservaciones: number = 0;
  validarNumAgendamiento: boolean = true;

  public lagencias: SelectItem[] = [{ label: '...', value: null }];


  constructor(
    router: Router,
    dtoServicios: DtoServicios,
    private confirmationService: ConfirmationService
  ) {
    super(router, dtoServicios, 'TcanHorarioAtencion', 'TCANHORARIOATENCION', false, false);
    this.componentehijo = this;
  }

  ngOnInit(): void {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  // INICIO CONSULTA DATOS
  consultar() {
    if (this.mfiltros.cagencia == null) {
      super.mostrarMensajeError('LA AGENCIA ES REQUERIDA');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }
  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.fatencion', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
    consulta.addSubquery('TgenAgencia', 'nombre', 'nagencia', 'i.cagencia = t.cagencia');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.fatencion = super.fechaToInteger(this.ffatencion);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // FIN CONSULTA DATOS


  // INICIO MANTENIMIENTO
  crearNuevo() {
    if (this.mfiltros.cagencia == null) {
      super.mostrarMensajeError('LA AGENCIA ES REQUERIDA');
      return;
    }

    this.titleDialogo = "Horario de Atención"
    super.crearNuevo();
    this.registro.cagencia = this.mfiltros.cagencia;
    this.registro.activo = true;
    this.registro.descando = false;//CCA 20230602
    this.registro.mdatos.nagencia = this.getNombreAgencia();
    return;
  }

  private getNombreAgencia(): string {
    const item = this.lagencias.find(x => x.value == this.mfiltros.cagencia);
    return item.label;
  }

  actualizar() {
    if (!this.validarData()) {
      return;
    }
    this.validarNumAgendamiento = true;
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  grabar(): void {
    if (!this.validarData()) {
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.finicio = this.registro.finicio;
    this.rqMantenimiento.mdatos.ffin = this.registro.ffin;
    this.rqMantenimiento.mdatos.numreservaciones = this.numReservaciones;
    this.rqMantenimiento.mdatos.validarNumAgendamientos = this.validarNumAgendamiento;

    this.crearDtoMantenimiento();
    super.grabar();
  }


  private validarData(): boolean {
    this.encerarMensajes();
    if (typeof this.registro.hinicio == 'object') {
      this.registro.hinicio = super.ConvertirHoraTexto(this.registro.hinicio);
    }
    if (typeof this.registro.hfin == 'object') {
      this.registro.hfin = super.ConvertirHoraTexto(this.registro.hfin);
    }
    if (this.registro.descanso) {
      if (typeof this.registro.hiniciodescanso == 'object') {
        this.registro.hiniciodescanso = super.ConvertirHoraTexto(this.registro.hiniciodescanso);
      }
    }

    if (this.registro.esnuevo) {
      if (super.fechaToInteger(this.registro.finicio) < super.fechaToInteger(new Date())) {
        super.mostrarMensajeError('FECHAS INCORRECTAS, LA FECHA DE INICIO DEBE SER MAYOR A LA FECHA ACTUAL');
        return false;
      } else if (super.fechaToInteger(this.registro.finicio) == super.fechaToInteger(new Date())) {
        const horaActual = super.ConvertirHoraTexto(new Date());
        const hini = this.registro.hinicio.split(':')[0];
        const hinidescanso = this.registro.descanso ? this.registro.hiniciodescanso.split(':')[0] : undefined;
        const hactual = horaActual.split(':')[0];
        if (Number(hini) <= Number(hactual)) {
          super.mostrarMensajeError('HORAS INCORRECTAS, LA HORA DE INICIO DEBE SER MAYOR CON AL MENOS UNA HORA RESPECTO A LA HORA ACTUAL');
          return false;
        }
        
        if (!super.estaVacio(hinidescanso)) {
          if (Number(hinidescanso) <= Number(hini) && this.registro.descanso) {
            super.mostrarMensajeError('HORAS INCORRECTAS, LA HORA DE DESCANSO DEBE SER MAYOR CON AL MENOS UNA HORA RESPECTO A LA HORA INICIO');
            return false;
          }
        }
      }

      if (super.fechaToInteger(this.registro.finicio) > super.fechaToInteger(this.registro.ffin)) {
        super.mostrarMensajeError('FECHAS INCORRECTAS, LA FECHA DE INICIO DEBE SER MENOR A LA FECHA FIN');
        return false;
      }
    } else {
      if (this.registro.fatencion < this.fechaToInteger(new Date())) {
        super.mostrarMensajeError('HORARIO DE ATENCIÓN CADUCADO, NO SE PUEDE ACTUALIZAR EL REGISTRO');
        return;
      } else if (this.registro.fatencion == this.fechaToInteger(new Date())) {
        if (this.registro.activo) {
          const horaActual = super.ConvertirHoraTexto(new Date());
          const hini = this.registro.hinicio.split(':')[0];
          const hinidescanso = this.registro.descanso ? this.registro.hiniciodescanso.split(':')[0] : undefined;
          const hactual = horaActual.split(':')[0];
          if (Number(hini) <= Number(hactual)) {
            super.mostrarMensajeError('HORAS INCORRECTAS, LA HORA DE INICIO DEBE SER MAYOR CON AL MENOS UNA HORA RESPECTO A LA HORA ACTUAL');
            return false;
          }

          if (!super.estaVacio(hinidescanso)) {
            if (Number(hinidescanso) <= Number(hini) && this.registro.descanso) {
              super.mostrarMensajeError('HORAS INCORRECTAS, LA HORA DE DESCANSO DEBE SER MAYOR CON AL MENOS UNA HORA RESPECTO A LA HORA INICIO');
              return false;
            }
          }
        }
      }
    }


    if (this.registro.activo) {
      const hinicio = this.registro.hinicio.split(':')[0];
      const hfin = this.registro.hfin.split(':')[0];
      const hinidescanso = this.registro.descanso ? this.registro.hiniciodescanso.split(':')[0] : undefined;
      if (Number(hinicio) >= Number(hfin)) {
        super.mostrarMensajeError('HORAS INCORRECTAS, LA HORA DE INICIO DEBE SER AL MENOS MENOR CON UNA HORA RESPECTO A LA HORA FIN');
        return false;
      }
      if (!super.estaVacio(hinidescanso)) {
        if (Number(hinidescanso) <= Number(hinicio) && this.registro.descanso) {
          super.mostrarMensajeError('HORAS INCORRECTAS, LA HORA DE DESCANSO DEBE SER MAYOR CON AL MENOS UNA HORA RESPECTO A LA HORA INICIO');
          return false;
        }
      }

      if (Number(this.registro.intervalo) < this.minIntervalo || Number(this.registro.intervalo) > this.maxIntervalo) {
        super.mostrarMensajeError(`VALOR DE INTERVALO INCORRECTO, VALOR MÍNIMO ${this.minIntervalo} Y VALOR MÁXIMO ${this.maxIntervalo}`);
        return false;
      }

      if (this.registro.agentes <= 0 || this.registro.agentes > this.numMaxAgentes) {
        super.mostrarMensajeError(`VALOR DE # DE AGENTES INCORRECTO, VALOR MÍNIMO 1 Y VALOR MÁXIMO ${this.numMaxAgentes}`);
        return false;
      }

      if (this.registro.citasreservadas <= 0 || this.registro.citasreservadas > this.numMaxReservaciones) {
        super.mostrarMensajeError(`VALOR DE # DE CITAS RESERVADAS INCORRECTO, VALOR MÍNIMO 1 Y VALOR MÁXIMO ${this.numMaxReservaciones}`);
        return false;
      }
    }

    return true;
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    if (resp.cod == 'CAN-047') {
      this.confirmationService.confirm({
        key: 'cd',
        header: resp.msgusu,
        message: 'Desea continuar con la desactivación?',
        accept: () => {
          this.validarNumAgendamiento = false;
          this.grabar();
        },
        reject: () => {
        }
      });
    }
    super.postCommitEntityBean(resp);
  }

  public selectRegistro(registro: any) {
    this.titleDialogo = `Horario de Atención - ${registro.mdatos.nagencia} - ${super.integerToFormatoFecha(registro.fatencion)}`;
    super.selectRegistro(registro);
  }
  // FIN MANTENIMIENTO

  // INICIO CONSULTA CATALOGOS
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
    const consultaAgencia = new Consulta('tgenagencia', 'Y', 't.nombre', {}, {});
    consultaAgencia.cantidad = 25;
    this.addConsultaPorAlias('AGENCIA', consultaAgencia);

    const consultaMinIntervalo = new Consulta('tcanparametro', 'N', '', { cparametro: 'MIN-INTERVALO' }, {});
    this.addConsultaPorAlias('MININTERVALO', consultaMinIntervalo);

    const consultaMaxIntervalo = new Consulta('tcanparametro', 'N', '', { cparametro: 'MAX-INTERVALO' }, {});
    this.addConsultaPorAlias('MAXINTERVALO', consultaMaxIntervalo);

    const consultaMaxAgente = new Consulta('tcanparametro', 'N', '', { cparametro: 'MAX-AGENTES' }, {});
    this.addConsultaPorAlias('AGENTE', consultaMaxAgente);

    const consultaMaxReservacion = new Consulta('tcanparametro', 'N', '', { cparametro: 'MAX-RESERVACIONES' }, {});
    this.addConsultaPorAlias('RESERVACION', consultaMaxReservacion);
  }

  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lagencias, resp.AGENCIA, 'cagencia');
      if (resp.MININTERVALO !== undefined && resp.MININTERVALO !== null) {
        this.minIntervalo = parseInt(resp.MININTERVALO.valor);
      }
      if (resp.MAXINTERVALO !== undefined && resp.MAXINTERVALO !== null) {
        this.maxIntervalo = parseInt(resp.MAXINTERVALO.valor);
      }
      if (resp.AGENTE !== undefined && resp.AGENTE !== null) {
        this.numMaxAgentes = parseInt(resp.AGENTE.valor);
      }
      if (resp.RESERVACION !== undefined && resp.RESERVACION !== null) {
        this.numMaxReservaciones = parseInt(resp.RESERVACION.valor);
      }
    }
    this.lconsulta = [];
  }
  // FIN CONSULTA CATALOGOS
}
