import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCobranzaComponent } from '../../lov/operacion/componentes/lov.operacionCobranza.component';
import { DatosGeneralesComponent } from '../submodulos/datosgenerales/componentes/_datosGenerales.component';
import { CobranzaComponent } from '../submodulos/cobranza/componentes/_cobranza.component';
import { TablaAccionesCobranzaComponent } from '../submodulos/tablaaccionescobranza/componentes/_tablaAccionesCobranza.component';
import { TablaAccionesJudicialesComponent } from '../submodulos/tablaaccionesjudiciales/componentes/_tablaAccionesJudiciales.component';

@Component({
  selector: 'app-consulta-operacion',
  templateUrl: 'consultaCobranza.html'
})
export class ConsultaCobranzaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCobranzaComponent)
  private lovOperacion: LovOperacionCobranzaComponent;

  @ViewChild(DatosGeneralesComponent)
  datosGeneralesComponent: DatosGeneralesComponent;

  @ViewChild(CobranzaComponent)
  cobranzaComponent: CobranzaComponent;

  @ViewChild(TablaAccionesCobranzaComponent)
  tablaAccionesCobranzaComponent: TablaAccionesCobranzaComponent;

  @ViewChild(TablaAccionesJudicialesComponent)
  tablaAccionesJudicialesComponent: TablaAccionesJudicialesComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CONSULTAOPERACION', false);
  }

  ngOnInit() {
    this.componentehijo = this;
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
  }

  private fijarFiltrosConsulta() {
    this.datosGeneralesComponent.mfiltros.coperacion = this.mcampos.coperacion;

    this.cobranzaComponent.mfiltros.coperacion = this.mcampos.coperacion;
    this.tablaAccionesCobranzaComponent.mfiltros.coperacion = this.mcampos.coperacion;
    this.tablaAccionesJudicialesComponent.mfiltros.coperacion = this.mcampos.coperacion;
  }

  validaFiltrosConsulta(): boolean {
    return (this.tablaAccionesCobranzaComponent.validaFiltrosConsulta() &&
      this.cobranzaComponent.validaFiltrosConsulta() && this.tablaAccionesJudicialesComponent.validaFiltrosConsulta());
  }

  public postQuery(resp: any) {
    this.datosGeneralesComponent.consultar();
    this.cobranzaComponent.consultar();
    this.tablaAccionesCobranzaComponent.consultar();
    this.tablaAccionesJudicialesComponent.consultar();
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // No existe para el padre
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // No existe para el padre
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.nombre = reg.registro.nombre;

      this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
      this.lovOperacion.consultar();
      this.lovOperacion.showDialog();
    }
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de operacion. */
  fijarLovOperacionSelec(reg: any): void {
    this.mcampos.ccobranza = reg.registro.ccobranza;
    this.mcampos.coperacion = reg.registro.coperacion;
    this.mcampos.ntipoprod = reg.registro.coperacion + ' - ' + reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    this.consultar();
  }
}
