import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-saldo',
  templateUrl: 'saldo.html'
})
export class SaldoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ltiposaldo: SelectItem[] = [{ label: '...', value: null }];
  public lmodulo: SelectItem[] = [{ label: '...', value: null }];
  public lclase: SelectItem[] = [{ label: '...', value: null }];
  

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TmonSaldo', 'SALDO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    //  this.consultar();  // para ejecutar consultas automaticas.
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.mfiltros.ctiposaldo == null) {
      super.mostrarMensajeError('TIPO DE SALDO REQUERIDA');
      return;
    }

    super.crearNuevo();
    this.registro.ctiposaldo = this.mfiltros.ctiposaldo;
    this.registrarEtiqueta(this.registro, this.ltiposaldo, 'ctiposaldo', 'ntiposaldo');
    this.registro.efectivo = false;
    this.registro.estadodecuenta = false;
    this.registro.permitesobregiro = false;
    this.registro.registromovimiento = false;
    this.registro.permitesaldonegativo = false;
    this.registro.esacrual = false;
    //this.registro.plantillacxc = false;
    this.registro.actualizasaldo = false;
    this.registro.cache = false;
    this.registro.intersucursal = false;
    return;

  }

  actualizar() {
    super.actualizar();
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
    consulta.addSubquery('TgenModulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('TmonTipoSaldo', 'nombre', 'ntiposaldo', 'i.ctiposaldo = t.ctiposaldo');
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
    const consultaTipoSaldo = new Consulta('TmonTipoSaldo', 'Y', 't.nombre', {}, {});
    consultaTipoSaldo.cantidad = 50;
    this.addConsultaPorAlias('TIPOSALDO', consultaTipoSaldo);

    const consultaModulo = new Consulta('TgenModulo', 'Y', 't.nombre', {}, {});
    consultaModulo.cantidad = 50;
    this.addConsultaPorAlias('MODULO', consultaModulo);
    
    const consultaClase = new Consulta('TmonClase', 'Y', 't.nombre', {}, {});
    consultaClase.cantidad = 50;
    this.addConsultaPorAlias('CLASE', consultaClase);
    
    
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ltiposaldo, resp.TIPOSALDO, 'ctiposaldo');
      this.llenaListaCatalogo(this.lmodulo, resp.MODULO, 'cmodulo');
      this.llenaListaCatalogo(this.lclase, resp.CLASE, 'cclase');

    }
    this.lconsulta = [];
  }

}
