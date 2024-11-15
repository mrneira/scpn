import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {ModulosComponent} from '../../../../generales/modulos/componentes/modulos.component';
import {LovTransaccionesComponent} from '../../../../generales/lov/transacciones/componentes/lov.transacciones.component';

@Component({
  selector: 'app-contabilizacion-provisiones',
  templateUrl: 'contabilizacionProvisiones.html'
})
export class ContabilizacionProvisionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovTransaccionesComponent)
  private lovtransacciones: LovTransaccionesComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TloteModuloTareas', 'LOTETRANSACCION', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.inicializar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 'ordenmod, t.orden', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TloteModulo', 'orden', 'ordenmod', 'i.cmodulo = t.cmodulo and i.clote = t.clote');
    consulta.addSubquery('TgenModulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('TloteTareas', 'nombre', 'ntarea', 'i.cmodulo = t.cmodulo and i.ctarea = t.ctarea');
    consulta.cantidad = 200;
    
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.CLOTE = this.mfiltros.clote;
    this.rqMantenimiento.fejecucion = this.fechaToInteger(new Date());
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de transacciones */
  mostrarLovTransacciones(): void {
    this.lovtransacciones.showDialog();
  }

  /**Retorno de lov de transacciones. */
  fijarLovTransaccionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nmodulo = reg.registro.mdatos.nmodulo;
      this.mcampos.ntransaccion = reg.registro.nombre;
      this.mfiltros.cmodulo = reg.registro.cmodulo;
      this.mfiltros.ctransaccion = reg.registro.ctransaccion;

      this.consultar();
    }
  }

  inicializar() {
    this.mcampos.nmodulo = 'LOTES';
    this.mcampos.ntransaccion = 'CONTABILIZACION PROVISONES';
    this.mfiltros.clote = 'CONTABILIZACION-PROVISION';
    this.consultar();
  }

}
