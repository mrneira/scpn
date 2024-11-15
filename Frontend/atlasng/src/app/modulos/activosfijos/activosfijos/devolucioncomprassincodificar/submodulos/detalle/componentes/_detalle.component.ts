import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, DtoConsulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';
import { CabeceraComponent } from 'app/modulos/activosfijos/activosfijos/consultaingreso/submodulos/cabecera/componentes/_cabecera.component';
@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  
  public totalCantidad = 0;
  public totalValorUnitario = 0;
  public totalValorTotal = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfingresodetalle', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
    if (this.registro.padre === undefined) {
      this.registro.padre = this.mfiltros.padre;
    }
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
   
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);    
    consulta.addSubquery('tacfproducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'codigo', 'codigo', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'stock', 'stock1', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'vunitario', 'vunitario1', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'ctipoproducto', 'ctipoproducto', 'i.cproducto = t.cproducto');
    this.addConsulta(consulta);
    return consulta;    
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  cambiarCantidad(indice,event): void {
    this.selectRegistro(this.registro);
    
    if (event > this.registro.mdatos.cantidadoriginal  ){
      super.mostrarMensajeError('CANTIDAD A DEVOLVER MAYOR A CANTIDAD ENTREGADA');
      this.lregistros[indice].cantidad = this.lregistros[indice].mdatos.cantidadoriginal;
    }
  }
  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    let lista = resp.DETALLE;
    let listaResp = [];
    resp.DETALLE = undefined;
    //const lreg = componente.clone(componente.lregistros);
    for (const i in lista) {
      if (lista.hasOwnProperty(i)) {
        const reg = lista[i];
        reg.cantidad = reg.cantidad - reg.cantidaddevuelta;
        lista[i].mdatos.cantidadoriginal = reg.cantidad;
        reg.esnuevo = true;
        listaResp.push(reg);  
      }
    }
    resp.DETALLE = listaResp;
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }


  crearNuevoRegistro() {
    super.crearnuevoRegistro();
  }


  consultarCatalogos(): void {
  }

}
