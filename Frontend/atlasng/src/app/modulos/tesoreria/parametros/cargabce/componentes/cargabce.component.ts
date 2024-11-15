import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-cargabce',
  templateUrl: 'cargabce.html'
})
export class CargaBceComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public ltipodocumentocdetalle: SelectItem[] = [{ label: '...', value: null }];
  private catalogoDetalle: CatalogoDetalleComponent;
  public lcatalogoestado: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'REGISTROSIP', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    
  }

  ngAfterViewInit() {

  }

  crearNuevo() {
    super.crearNuevo();
    this.mostrarDialogoGenerico = true;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    this.encerarMensajes();
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.mostrarDialogoGenerico = true;
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
    this.lregistrosbce = [];
    super.crearBce(this.registro,"1718339003", "Prueba 12", "333334444", 6545, "1", 306, "13", 305, 1500.99, "ref30998",2,null,null,null,"P");
    //super.crearBce(this.registro,"1718339009", "Prueba 123", "3333734444", 6545, "1", 306, "20", 305, 800.50, "ref30999",2,null,null,null,"P");
    //super.crearBce(this.registro,"1718339008", "Prueba 124", "3333834444", 6545, "1", 306, "20", 305, 900.49, "ref309976",2,null,null,null,"P");
    //super.crearNuevoSpi(this.registro,"1718339009", "Prueba 2", "0987654325", 6545, "1", 306, "20", 305, 2500, "ref30989",2);
    //super.crearNuevoSpi(this.registro,"1718339009", "Prueba 3", "0987654326", 6545, "1", 306, "20", 305, 3500, "ref30910",3);
    //super.crearNuevoSpi(this.registro,"1718339009", "Prueba 4", "0987654327", 6545, "1", 306, "20", 305, 4500, "ref30911",4);
    //super.crearNuevoSpi(this.registro,"1718339009", "Prueba 5", "0987654328", 6545, "1", 306, "20", 305, 5500, "ref30912",5);
    //super.eliminarSpi("ref123", 33);
    this.rqMantenimiento.mdatos.mbce=this.lregistrosbce;
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

  cerrarDialogo() {
  }

  

}

  