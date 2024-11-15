import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPersonasComponent } from '../../../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovPersonaVistaComponent } from '../../../../../../personas/lov/personavista/componentes/lov.personaVista.component';
import { EgresosComponent } from '../../egresos/componentes/_egresos.component';
import { IngresosComponent } from '../../ingresos/componentes/_ingresos.component';
import { AbsorberGaranteComponent } from './_absorbergarante.component';

@Component({
  selector: 'app-garante',
  templateUrl: '_garante.html'
})
export class GaranteComponent extends BaseComponent implements OnInit, AfterViewInit {

  //@ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild('vistagarante')
  private lovPersonaVista: LovPersonaVistaComponent;

  @ViewChild(EgresosComponent)
  egresosComponent: EgresosComponent;

  @ViewChild(IngresosComponent)
  ingresosComponent: IngresosComponent;

  @ViewChild(AbsorberGaranteComponent)
  absorberGaranteComponent: AbsorberGaranteComponent;

  public deudor = "";
  public aprobado = false;
  public porcentajecapacidadpago = 0;
  public lestadossocios: any = [];
  public habilitamensaje = false;
  public lrelacion: SelectItem[] = [{ label: '...', value: null }];
  public habilitaAbsorcionGarante = false;
  public aplicaGarante = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarSolicitudCapacidadPago', 'GARANTE', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    //super.init(this.formFiltros);
    super.init();
  }

  ngAfterViewInit() {
  }

  actualizar() {
    super.actualizar();
    this.registro.cusuario = this.dtoServicios.mradicacion.cusuario;
    this.registro.crelacion = 2;
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, "Y", "t.ccapacidad", this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.habilitamensaje = false;
    this.lovPersonas.mfiltrosesp.cpersona = 'not in (' + this.deudor + ')';
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (!this.estaVacio(reg.registro)) {

      if (!this.validaCondicionesSocio(reg.registro.mdatos.cestadosocio)) {
        this.habilitamensaje = true;
        return;
      }

      this.aplicaGarante = true;
      this.absorberGaranteComponent.mcampos.cpersona = reg.registro.cpersona;
      this.absorberGaranteComponent.consultar();

      this.registro.cpersona = reg.registro.cpersona;
      this.registro.mdatos.identificacion = reg.registro.identificacion;
      this.registro.mdatos.npersona = reg.registro.nombre;
      this.consultarIngresosEgresos();

      this.consultarConyuge();
    }
  }

  /**Muestra lov de persona vista */
  mostrarLovPersonaVista(): void {
    this.lovPersonaVista.showDialog();
    this.lovPersonaVista.mcampos.cpersona = this.registro.cpersona;
    this.lovPersonaVista.mcampos.identificacion = this.registro.mdatos.identificacion;
    this.lovPersonaVista.mcampos.nombre = this.registro.mdatos.npersona;
    this.lovPersonaVista.consultar();
  }

  /**Validacion de condiciones de socio. */
  validaCondicionesSocio(cestadosocio): boolean {
    if (this.lestadossocios.some(x => Number(x.value) === Number(cestadosocio))) {
      return true;
    }
    return false;
  }

  private consultarIngresosEgresos() {
    const rqConsulta: any = { 'mdatos': {} };
    rqConsulta.CODIGOCONSULTA = 'CUENTASBALANCE';
    rqConsulta.cpersona = this.registro.cpersona;
    rqConsulta.mdatos.cmodulo = this.mcampos.cmodulo;
    rqConsulta.mdatos.cproducto = this.mcampos.cproducto;
    rqConsulta.mdatos.ctipoproducto = this.mcampos.ctipoproducto;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }
          this.ingresosComponent.postQuery(resp);
          this.egresosComponent.postQuery(resp);
          this.ingresosComponent.porcentajecapacidadpago = this.porcentajecapacidadpago;
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  public calculaCapacidadPago() {
    this.registro.capacidadpago = 0;
    this.registro.porcentajecoberturacuota = 0;
    this.registro.resolucion = "";
    //CCA 20211202 
    if (!this.estaVacio(this.registro.totalingresos) && this.registro.totalingresos > 0) {
      if(this.ingresosComponent.montoseleccionado==0)
      {
        this.registro.capacidadpago = super.redondear((((this.ingresosComponent.totalRMU)*this.porcentajecapacidadpago/100)+this.ingresosComponent.montoRancho),2);
      }
      else{
        this.registro.capacidadpago = super.redondear((((this.ingresosComponent.totalRMU+this.ingresosComponent.montoseleccionado)*this.porcentajecapacidadpago/100)+this.ingresosComponent.montoRancho),2);
      }
    }
    if(!this.estaVacio(this.registro.totalingresos) && this.registro.totalingresos > 0 && this.registro.totalegresos == 0){
      this.registro.capacidadpago = super.redondear(((this.registro.capacidadpago) - (this.registro.totalegresos)), 2)
    }
    if (!this.estaVacio(this.registro.totalegresos) && this.registro.totalegresos > 0) {
      this.registro.capacidadpago = super.redondear(((this.registro.capacidadpago) - (this.registro.totalegresos)), 2); //cca cambios nuevos      
    }
    //CCA 20211202
    this.registro.porcentajecoberturacuota = Math.round((this.registro.valorcuota / this.registro.capacidadpago) * 100);

    if (this.registro.capacidadpago >= this.registro.valorcuota) {
      this.aprobado = true;
      this.registro.resolucion = "APROBADO";
    } else {
      this.aprobado = false;
      this.registro.resolucion = "NEGADO";
    }
  }

  private actualizarEgresos() {
    this.registro.totalegresos = 0;
    this.registro.totalegresos = this.egresosComponent.registro.totalegresos;
    this.calculaCapacidadPago();
  }

  private actualizarIngresos() {
    this.registro.totalingresos = 0;
    this.registro.totalingresos = this.ingresosComponent.registro.totalingresos;
    this.calculaCapacidadPago();
  }

  private actualizarAbsorcion(data: any) {
    super.encerarMensajes();
    if (data.evento && (this.registro.monto < data.registro.mdatos.saldo)) {
      data.registro.mdatos.pagar = false;
      super.mostrarMensajeError("EL MONTO DE LA OPERACIÓN A CANCELAR ES MAYOR AL MONTO DE LA SOLICITUD");
      return;
    }

    for (const i in this.egresosComponent.lregistros) {
      if (this.egresosComponent.lregistros.hasOwnProperty(i)) {
        const reg = this.egresosComponent.lregistros[i];
        if (Number(reg.secuencia) === Number(data.registro.coperacion)) {
          if (data.evento) {
            reg.valor = 0;
          } else {
            reg.valor = data.registro.mdatos.valorcuotaencurso;
          }
          break;
        }
      }
    }

    this.egresosComponent.registro.totalegresos = 0;
    for (const i in this.egresosComponent.lregistros) {
      if (this.egresosComponent.lregistros.hasOwnProperty(i)) {
        this.egresosComponent.registro.totalegresos = this.egresosComponent.registro.totalegresos + this.egresosComponent.lregistros[i].valor;
      }
    }

    this.actualizarEgresos();
  }

  consultarConyuge(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.ingresosComponent.lconyuge = [];

    const mfiltrosSueldo: any = { 'cpersona': this.registro.cpersona, 'verreg': 0 };
    const consultaConyuge = new Consulta('TperReferenciaPersonales', 'Y', 't.cpersona', mfiltrosSueldo, {});
    consultaConyuge.cantidad = 100;
    this.addConsultaPorAlias("CONYUGE", consultaConyuge);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.ingresosComponent.lconyuge = resp.CONYUGE;
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

}
