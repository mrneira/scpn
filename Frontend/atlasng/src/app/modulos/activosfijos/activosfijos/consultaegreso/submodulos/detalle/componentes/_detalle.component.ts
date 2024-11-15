import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { AccordionModule } from 'primeng/primeng';
import { LovProductosComponent } from '../../../../../lov/productos/componentes/lov.productos.component';
@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovProductosComponent)
  private lovproductos: LovProductosComponent;

  public totalCantidad = 0;
  public totalValorUnitario = 0;
  public totalValorTotal = 0;

  private catalogoDetalle: CatalogoDetalleComponent

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfegresodetalle', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.nsucursal = this.dtoServicios.mradicacion.nsucursal;
    this.mcampos.nagencia = this.dtoServicios.mradicacion.nagencia;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
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

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tacfproducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'codigo', 'codigo', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'stock', 'stock1', 'i.cproducto = t.cproducto');
    consulta.cantidad = 300;
    this.addConsulta(consulta);
    return consulta;
  } 

  public fijarFiltrosConsulta() {
   
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    let lista = resp.DETALLE;
    let listaResp = [];
    resp.DETALLE = undefined;
    for (const i in lista) {
      if (lista.hasOwnProperty(i)) {
        const reg = lista[i];
        reg.mdatos.vtotal = reg.vunitario * reg.cantidad;
          listaResp.push(reg);
      }
    }

    resp.DETALLE = listaResp;
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************


  consultarCatalogos(): void {
  }


  calcularTotales(): void{
    let sumatorioCantidad = 0;
    let sumatorioVunitario = 0;
    let sumatorioVtotal = 0;

    for (const i in this.lregistros) {
      const reg = this.lregistros[i];
      sumatorioCantidad += Number(reg.cantidad);
      sumatorioVunitario += reg.vunitario;
      sumatorioVtotal += reg.mdatos.vtotal;
    }
    this.totalCantidad = sumatorioCantidad;
    this.totalValorUnitario = sumatorioVunitario;
    this.totalValorTotal = sumatorioVtotal;
  }

}
