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
  
  @Output() calcularTotalesEvent = new EventEmitter();

  
  public cantidad = 0;
  public fisico = 0;
  public diferencia = 0;
  indice: number;
  codigo = '';

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfajustedetalle', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();

  }

  agregarProducto(){
    super.crearnuevoRegistro();
    this.actualizar();
  }

  cuentaFocus(reg:any, index: number){
    this.indice = index;
    this.codigo = reg.mdatos.codigo;
  }

  productoBlur(reg: any, index: number){

    if (reg.mdatos.codigo === ''){
      this.lregistros[index].mdatos.codigo = undefined;
      this.lregistros[index].mdatos.nproducto = undefined;
      return;
    }

    if (reg.mdatos.codigo === this.codigo){
      return;
    }

    const consulta = new Consulta('tacfproducto', 'N', '', {'codigo' : reg.mdatos.codigo,'movimiento': true}, {'ctipoproducto':'in(\'1\',\'2\')'}, {});
    consulta.addFiltroCondicion('codigo', reg.mdatos.codigo, '=');
    this.addConsultaPorAlias('PRODUCTO',consulta);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuesta(resp, index);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuesta(resp: any, index: number) {
    let producto; 
    if (resp.PRODUCTO !== undefined && resp.PRODUCTO !== null ) {
      producto = resp.PRODUCTO;
      this.lregistros[index].cproducto = producto.cproducto;
      this.lregistros[index].mdatos.nproducto = producto.nombre;
      this.lregistros[index].mdatos.stock = producto.stock;
    }else{
      this.lregistros[index].cproducto = undefined;
      this.lregistros[index].mdatos.codigo = undefined;
    }
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tacfproducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'codigo', 'codigo', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'stock', 'stock1', 'i.cproducto = t.cproducto');   
    consulta.addSubquery('tacfproducto', 'vunitario', 'vunitario1', 'i.cproducto = t.cproducto');    
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
        reg.mdatos.codigo = reg.mdatos.codigo;
        reg.mdatos.diferencia =  reg.fisico - reg.stockcongelado;
        reg.mdatos.stock = reg.stockcongelado;
        reg.mdatos.vunitario = reg.mdatos.vunitario;
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

  private cerrarDialogo(): void {
    this.registro.mdatos.diferencia = this.registro.mdatos.stock - this.registro.fisico;
   
  }

  cambiarCantidad(indice,event): void {
    this.lregistros[indice].mdatos.diferencia = this.lregistros[indice].mdatos.stock - this.lregistros[indice].fisico;
   
  }
  
  calcularTotales (){
    this.calcularTotalesEvent.emit();
  }
  /**Retorno de lov de Productos. */
  fijarLovProductosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nproducto = reg.registro.nombre;
      this.registro.cproducto = reg.registro.cproducto;
      this.registro.mdatos.codigo = reg.registro.codigo;
      this.registro.mdatos.vunitario = reg.registro.vunitario;
      this.registro.mdatos.stock = reg.registro.stock;
 
    }
  }

  mostrarlovproductos(): void {
    this.lovproductos.mfiltros.movimiento = true;
    this.lovproductos.mfiltrosesp.ctipoproducto = 'in(\'1\',\'2\')'; 
    this.lovproductos.showDialog();
  }

  crearNuevoRegistro() {
    super.crearnuevoRegistro();
  }

 
}

  
  
  

