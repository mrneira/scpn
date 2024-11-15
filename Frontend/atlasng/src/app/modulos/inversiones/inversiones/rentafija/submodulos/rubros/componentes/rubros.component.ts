
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCuentasContablesComponent } from '../../../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';
import { InversionesServicios } from './../../../../../servicios/_invservicios.service';

@Component({
  selector: 'app-rubros',
  templateUrl: 'rubros.html'
})
export class RubrosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public pEditable: number = 0;
  
  public edited = false;

  private mrubro: string;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContablesBanco: LovCuentasContablesComponent;

  constructor(router: Router, dtoServicios: DtoServicios, private inversionesServicios: InversionesServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CONTABILIZARUBROS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {

    for (const i in this.inversionesServicios.plregistro) {
      if (this.inversionesServicios.plregistro.hasOwnProperty(i)) {
        
        if (this.inversionesServicios.plregistro[i].rubro == this.mrubro)
        {
          this.inversionesServicios.plregistro[i].ccuenta = this.mcampos.ccuentacon;
          this.inversionesServicios.plregistro[i].ncuenta = this.mcampos.ncuentacon;
          break;
        }
      }
    }
    super.actualizar();
  }

  cancelar() {
    super.cancelar();
  }

  // Inicia CONSULTA *********************
  consultar() {
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    rqConsulta.inversion = 5;
    rqConsulta.cinversion = this.mfiltros.cinversion;
    rqConsulta.procesocdetalle = 'COMPRA';
    
    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod !== 'OK') {
          return;
        }
        this.inversionesServicios.plregistro = resp.RUBROSCONTABILIZA;
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  mostrarLovCuentasContables(): void {

    this.lovCuentasContables.mfiltros.movimiento = true;

    this.lovCuentasContables.showDialog(true); // con true solo muestra cuentas de movimiento.
  }

  fijarLovCuentasContablesSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.msgs = [];

      this.mcampos.ccuentacon = reg.registro.ccuenta;
      this.mcampos.ncuentacon = reg.registro.nombre;
    }
  }

  public selectRegistro(registro: any) {
    this.mrubro = registro.rubro;
    super.selectRegistro(registro);
    this.mcampos.ccuentacon = this.registro.ccuenta;
    this.mcampos.ncuentacon = this.registro.ncuenta;
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      
    }
    this.lconsulta = [];
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

    

  }

}
