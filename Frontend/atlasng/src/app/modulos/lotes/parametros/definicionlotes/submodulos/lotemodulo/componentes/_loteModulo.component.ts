import {Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../../util/shared/componentes/base.component';

import {SelectItem} from 'primeng/primeng';
import {LovModuloComponent} from '../../../../../lov/lovmodulo/componentes/lovModulo.component'
import { LovPersonasComponent } from '../../../../../../personas/lov/personas/componentes/lov.personas.component';

@Component({
  selector: 'app-lote-modulo',
  templateUrl: '_loteModulo.html'
})
export class LoteModuloComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovModuloComponent)
  comboModulo: LovModuloComponent;
  
  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  comboSelect: any;
  
  public lmodo: SelectItem[] = [{label: '...', value: null}];
  public lmodulo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {// ya estan definidos los alias
    super(router, dtoServicios, 'TloteModulo', 'LOTEMODULO', false, true); // true cuendo es pk compuesto
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.lmodo.push({label: 'Horizontal', value: 'H'});
    this.lmodo.push({label: 'Vertical', value: 'V'});
  }

  ngAfterViewInit() {
  }

  crearNuevo() {// primero crea un registro
    super.crearNuevo();
    this.registro.activo = true;
    this.registro.clote = this.mfiltros.clote;
    this.comboSelect = null;
  }

  actualizar() { // Cuando doy confirmar se ejecuta
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    this.comboSelect = registro.cmodulo;
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cmodulo', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenModulo', 'nombre', 'nombreModulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('TperPersonaDetalle', 'nombre', 'npersonaresponsable', 'i.ccompania = t.ccompania and i.cpersona = t.cpersonaresponsable and i.verreg=0');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  public crearDtoMantenimiento() {
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const consultaEstatus = new Consulta('tgenmodulo', 'Y', 't.nombre', {}, {});
    consultaEstatus.cantidad = 100;
    this.addConsultaCatalogos('MODULO', consultaEstatus, this.lmodulo, super.llenaListaCatalogo, 'cmodulo');

    this.ejecutarConsultaCatalogos();
  }
  fijarModuloSelect(reg: any): void {
    if (reg.registro !== undefined || reg.registro !== null) {
      if (reg.registro.value !== null) {
        this.mfiltros.cmodulo = reg.registro.value;
      }
    }
  }
  fijarModuloDialog(reg: any): void {
    if (reg.registro !== undefined || reg.registro !== null) {
      if (reg.registro.value !== null) {
        this.registro.cmodulo = reg.registro.value;
        this.registro.mdatos.nombreModulo = reg.registro.label;
      }
    }
  }
  
  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovPersonas.mfiltros.tipodepersona = 'N';
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.npersonaresponsable = reg.registro.nombre;
      this.registro.cpersonaresponsable = reg.registro.cpersona;
      this.registro.ccompania = reg.registro.ccompania;
    }
  }
}

