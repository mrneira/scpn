import { LovRequisitosExpedienteComponent } from './../../../lov/requisitos/componentes/lov.requisitosexpediente.component';
import { DtoServicios } from './../../../../../util/servicios/dto.servicios';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Consulta, Mantenimiento } from './../../../../../util/dto/dto.component';
import { BaseComponent } from './../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-requisitos',
  templateUrl: '_requisitos.html'
})
export class RequisitosComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovRequisitosExpedienteComponent)
  private lovrequisitos: LovRequisitosExpedienteComponent;

  public ltiposexp: SelectItem[] = [{ label: "...", value: null }];
  public ljerarquia: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpretipoexpedienterequisito', 'TEXPEDIENTEREQUISITO', false, true);
    this.componentehijo = this;
  }


  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.verreg = 0;
    this.registro.activo = true;
    this.registro.opcional = false;
    this.registro.ccatalogotipoexp = 2802;
    this.registro.ccatalogojerarquia = 2701;
    this.registro.cdetalletipoexp = this.mfiltros.cdetalletipoexp;
  }

  actualizar() {
    super.actualizar();
    this.grabar();
  }

  eliminar() {
    super.eliminar();
    this.grabar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public consultarAnterior() {
   
    super.consultarAnterior();
  }

  public consultarSiguiente() {
   
    super.consultarSiguiente();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.orden', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tprerequisitos', 'nombre', 'nombre', 'i.crequisito = t.crequisito');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    // this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTEN IMIENTO *********************
  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de requisitos */
  mostrarlovrequisitos(): void {
    this.lovrequisitos.showDialog();
  }


  /**Retorno de lov de requisitos. */
  fijarLovRequisitosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nombre = reg.registro.nombre;
      this.registro.crequisito = reg.registro.crequisito;
    }
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  llenarConsultaCatalogos(): void {
    const mfiltroTipoLiquidacion: any = { 'ccatalogo': 2802 };
    const conTipLiquidacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoLiquidacion, {});
    this.addConsultaPorAlias('TIPLIQUID', conTipLiquidacion);

    const mfiltroJerarquia: any = { 'ccatalogo': 2701 };
    const conJerarquia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroJerarquia, {});
    this.addConsultaPorAlias('JERARQUIAS', conJerarquia);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === "OK") {
      this.llenaListaCatalogo(this.ltiposexp, resp.TIPLIQUID, "cdetalle");
      this.llenaListaCatalogo(this.ljerarquia, resp.JERARQUIAS, "cdetalle");
    }
    this.lconsulta = [];
  }

  limpiar() {
    this.ltiposexp = [];
    this.mfiltros.cdetalletipoexp = null;
    this.mfiltros.cdetallejerarquia = null;
    this.consultar();
  }

  cambiarTipoExpediente(event: any): any {
    this.consultar();
  }
}
