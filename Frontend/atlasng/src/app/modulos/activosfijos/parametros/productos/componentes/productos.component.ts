import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, Data } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovProductosComponent } from '../../../lov/productos/componentes/lov.productos.component';

import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { UnidadComponent } from '../../../../activosfijos/parametros/unidad/componentes/unidad.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

import { SelectItem } from 'primeng/primeng';
import { TreeNode } from 'primeng/primeng';
import { any } from 'codelyzer/util/function';

@Component({
  selector: 'app-productos',
  templateUrl: 'productos.html'
})
export class ProductosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovProductosComponent)
  private lovproductos: LovProductosComponent;
  @ViewChild('lov1')
  lovCuentas: LovCuentasContablesComponent;
  @ViewChild('lov2')
  lovCuentasDepreciacion: LovCuentasContablesComponent;
  @ViewChild('lov3')
  lovCuentasGasto: LovCuentasContablesComponent;
  @ViewChild('lov4')
  lovCuentasDepreciacionAcum: LovCuentasContablesComponent;
  
  public lunidad: SelectItem[] = [{ label: '...', value: null }];
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lmarcacdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lCcostocdetalle: SelectItem[] = [{ label: '...', value: null }];

  public root: any = [];
  private nodoSeleccionado: TreeNode;
  private nuevoNodo: TreeNode;
  public tiposmenu: SelectItem[];

  private catalogoEstadoDetalle: CatalogoDetalleComponent;
  private catalogoMarcaDetalle: CatalogoDetalleComponent;
  private catalogoCcostoDetalle: CatalogoDetalleComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfproducto', 'PRODUCTO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.llamarnuevo = false;
    this.tiposmenu = [];
    this.tiposmenu.push({ label: 'Categorias', value: false });
    this.tiposmenu.push({ label: 'Productos', value: true });
    this.consultar();
    this.consultarCatalogos();
    this.iniciarArbol();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.verreg =0;
    this.registro.estadoccatalogo = 1301;
    this.registro.marcaccatalogo = 1302;
    this.registro.centrocostosccatalogo = 1002;
    this.registro.vunitario = 0;
    this.registro.stock = 0;
    this.registro.valorlibros = 0;
    this.registro.cantidadtotal = 0;
    this.registro.codificable = true;
    this.registro.movimiento = false;
    this.registro.mdatos.eshoja = true;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.registro.valorresidual = 0.01;
    this.registro.vidautil = 0;
    this.registro.grcodificable = false;    
    this.registro.padre = !this.estaVacio(this.nodoSeleccionado.data.reg) ? this.nodoSeleccionado.data.reg.cproducto : null;
    this.registro.ctipoproducto = !this.estaVacio(this.nodoSeleccionado.data.reg) ? this.nodoSeleccionado.data.reg.ctipoproducto : null;
    this.nuevoNodo = {
      'data': {
        'nombre': '',
        'reg': this.registro,
        'type': 'Document'
      }
    };

  }

  validarGrabar(): string {
    let mensaje: string = '';
    
   return mensaje;   
  }


  actualizar() {
    super.actualizar();
    if (this.nuevoNodo != null) {
      // Si el nuevoNodo no es nulo, entonces se esta agregando un nodo a un nodo padre
      if (!this.registro.mdatos.eshoja) {
        this.nuevoNodo.data.nombre = this.registro.nombre;
        this.nuevoNodo.data.type = 'Folder';
        this.nuevoNodo.children = [];
      } else {
        this.nuevoNodo.data.nombre = this.registro.mdatos.padre;
      }
      this.nodoSeleccionado.children.push(this.clone(this.nuevoNodo));
    } else {
      // De lo contrario se esta editando un nodo cualquiera
      this.actualizaNodoSeleccionado(this.nodoSeleccionado, this.registro);
    }
    this.nuevoNodo = null;
  }

  eliminar() {
    super.eliminar();
    // Se eliminan los registros hijos del nodo a eliminar
    this.eliminarRegistrosNodos(this.nodoSeleccionado);
    // Se eliminan los nodos hijos del nodo a eliminar
    this.nodoSeleccionado.parent.children = this.nodoSeleccionado.parent.children.filter(n => n.data.reg.idreg !== this.nodoSeleccionado.data.reg.idreg);

  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(nodo: TreeNode) {
    this.nodoSeleccionado = nodo;
    super.selectRegistro(this.nodoSeleccionado.data.reg);
  }

  // Inicia CONSULTA *********************
  consultar() {
  
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();

    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre, t.padre, t.codigo', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 1000;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltrosesp.ctipoproducto = 'in (1,2)';
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  iniciarArbol() {
    this.root = this.crearMenu();
    this.actualizaRegistrosOriginales();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.root = this.crearMenu();
    // Una vez que se ha generado el menu, se ha modificado la lista de registos de trabajo agregando el campo 'eshoja' en el mdatos de cada
    // registro, por tal motivo es necesario actualizar nuevamente la lista de registros originales
    this.actualizaRegistrosOriginales();
  }
  // Fin CONSULTA *********************


  // Inicia MANTENIMIENTO *********************
  grabar(): void { 
    this.lmantenimiento = []; // Encerar Mantenimiento
    let mensaje = this.validarGrabar();
    if ( mensaje !== ''){
      super.mostrarMensajeError(mensaje);
      return;
    }
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
    this.postCommitNodosArbol(resp, this.root[0]);
  }

  cerrarDialogo(){
    let mensaje = this.validarGrabar();
    if ( mensaje !== ''){
      super.mostrarMensajeError(mensaje);
      return;
    }
  }
  private crearMenu(): TreeNode {
    const root: Data = [
      {
        data: {
          'nombre': 'ROOT',
          'reg': { orden: '', mdatos: { eshoja: false } },
          'type': 'Folder'
        },
        expanded: true,
        children: []
      }
    ];
    const lparents = this.getParents();
    for (const i in lparents) {
      if (lparents.hasOwnProperty(i)) {
        const item: any = lparents[i];
        const lchildren = this.getChildren(item);
        this.fillRecursively(root[0].children, item, lchildren);
      }
    }
    return root;
  }

  private getParents() {
    const lparents = [];
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const item: any = this.lregistros[i];
        if (this.estaVacio(item.padre)) {
          lparents.push(item);
        }
      }
    }
    return lparents;
  }

  private getChildren(parent: any) {
    const lchildren = [];
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const item: any = this.lregistros[i];
        if (!this.estaVacio(item.padre) && parent.cproducto === item.padre) {
          lchildren.push(item);
        }

      }
    }
    return lchildren;
  }

  private fillRecursively(rootlist: any[], parent: any, lchildren: any[]) {
    if (lchildren.length > 0 || parent.movimiento === false) {
      parent.mdatos.eshoja = false;
      const treeparent = {
        data: {
          'nombre': parent.nombre,
          'reg': parent,
          'type': 'Folder'
        },
        children: []
      };
      rootlist.push(treeparent);

      if (this.estaVacio(parent.padre)) {
      
      }
      for (const i in lchildren) {
        if (lchildren.hasOwnProperty(i)) {
          const item: any = lchildren[i];
          const lchildrenin = this.getChildren(item);
          this.fillRecursively(treeparent.children, item, lchildrenin);
        }
      }
    } else {
      parent.mdatos.eshoja = true;
      const nombre = parent.mdatos.cproducto != null ? parent.mdatos.cproducto : '';
      const treeparent = {
        'data': {
          'nombre': parent.mdatos.cproducto,
          'reg': parent,
          'type': 'Document'
        }
      };
      rootlist.push(treeparent);
    }
  }

  eliminarRegistrosNodos(nodo: TreeNode) {
    if (!this.estaVacio(nodo.children)) {
      for (const i in nodo.children) {
        if (nodo.children.hasOwnProperty(i)) {
          this.eliminarRegistrosNodos(nodo.children[i]);
          super.selectRegistro(nodo.data.reg);
          super.eliminar();
        }
      }
    } else {
      super.selectRegistro(nodo.data.reg);
      super.eliminar();
    }
  }


  /**Muestra lov de productos */
  mostrarlovproductos(): void {
    this.lovproductos.showDialog();
  }


  /**Retorno de lov de productos. */
  fijarLovProductosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.nombre = reg.registro.nombre;
      this.mfiltros.cproducto = reg.registro.cproducto;
      this.consultar();
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();


    const unidadComponent = new UnidadComponent(this.router, this.dtoServicios);
    const conUnidad = unidadComponent.crearDtoConsulta();
    this.addConsultaCatalogos('UNIDAD', conUnidad, this.lunidad, super.llenaListaCatalogo, 'cunidad');

    this.catalogoEstadoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoEstadoDetalle.mfiltros.ccatalogo = 1301;
    const conEstado = this.catalogoEstadoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('ESTADOPRODUCTO', conEstado, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoMarcaDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoMarcaDetalle.mfiltros.ccatalogo = 1302;
    const conMarca = this.catalogoMarcaDetalle.crearDtoConsulta();
    conMarca.cantidad = 200;
    this.addConsultaCatalogos('MARCAPRODUCTO', conMarca, this.lmarcacdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoCcostoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoCcostoDetalle.mfiltros.ccatalogo = 1002;
    const Ccosto = this.catalogoCcostoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('CENTROCOSTO', Ccosto, this.lCcostocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();

  }



  /**Muestra lov de cuentas contables */
  mostrarLovCuentas(): void {
    this.lovCuentas.mfiltros.movimiento = true;
    this.lovCuentas.showDialog(true);
  }

  /**Retorno de lov de Cuentas Contables. */
  fijarLovCuentasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuenta = reg.registro.ccuenta;
    }
  }

  /**Muestra lov de cuentas contables */
  mostrarLovCuentasDepreciacion(): void {
    this.lovCuentas.mfiltros.movimiento = true;
    this.lovCuentasDepreciacion.showDialog(true);
  }

  /**Retorno de lov de Cuentas Contables. */
  fijarLovCuentasDepreciacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuentadepreciacion = reg.registro.ccuenta;
    }
  }

  mostrarLovCuentasDepreciacionAcum(): void {
    this.lovCuentas.mfiltros.movimiento = true;
    this.lovCuentasDepreciacionAcum.showDialog(true);
  }

  /**Retorno de lov de Cuentas Contables. */
  fijarLovCuentasDepreciacionAcumSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuentadepreciacionacum = reg.registro.ccuenta;
    }
  }
  /**Muestra lov de cuentas contables */
  mostrarLovCuentasGasto(): void {
    this.lovCuentas.mfiltros.movimiento = true;
    this.lovCuentasGasto.showDialog(true);
  }

  /**Retorno de lov de Cuentas Contables. */
  fijarLovCuentasGastoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuentagasto = reg.registro.ccuenta;
    }
  }

  limpiarlovcuentacontable(): void {
    this.registro.ccuenta = null;
  }

  limpiarlovcuentacontabledepreciacion(): void {
    this.registro.ccuentadepreciacion = null;
  }

  limpiarlovcuentacontabledepreciacionacum(): void {
    this.registro.ccuentadepreciacionacum = null;
  }

  limpiarlovcuentacontablegasto(): void {
    this.registro.ccuentagasto = null;
  }
}
