import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router,Data } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { TreeNode } from 'primeng/primeng';


@Component({
  selector: 'app-clasificador-presupuestario',
  templateUrl: 'clasificador.html'
})
export class ClasificadorComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public root: any = [];
  private nodoSeleccionado: TreeNode;
  private nuevoNodo: TreeNode;
  public tiposmenu: SelectItem[];
  public secuencia = '';
  public digitos = 0;
  public esnuevo = false;
  public nivel = 1;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpptclasificador', 'CLASIFICADOR', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.llamarnuevo = false;
    this.tiposmenu = [];
    this.tiposmenu.push({ label: 'Padre', value: false });
    this.tiposmenu.push({ label: 'Detalle', value: true });
    this.consultar();
    this.consultarCatalogos();
    this.iniciarArbol();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    this.obtenerSecuenciaMenu();
    this.esnuevo = true;
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
    this.secuencia = this.nodoSeleccionado.data.reg.cclasificador.replace(this.nodoSeleccionado.data.reg.padre,'');
    this.nivel = this.nodoSeleccionado.data.reg.nivel;
    this.esnuevo = false;
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cclasificador', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 3000;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

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
    this.enproceso = false;
    this.consultar();
  }

  private crearMenu(): TreeNode {
    const root : Data = [
      {
        data: {
          'nombre': 'CLASIFICADOR PRESUPUESTARIO',
          'reg': { orden: '', mdatos: { eshoja: false }, nombre: 'CLASIFICADOR PRESUPUESTARIO' },
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
        if (!this.estaVacio(item.padre) && parent.cclasificador === item.padre) {
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
      const nombre = parent.mdatos.cclasificador != null ? parent.mdatos.cclasificador : '';
      const treeparent = {
        'data': {
          'nombre': parent.mdatos.cclasificador,
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

  private obtenerSecuenciaMenu() {

    if (this.nodoSeleccionado.parent === undefined){
      this.nivel = 1;
    }else {
      this.nivel = this.nodoSeleccionado.data.reg.nivel + 1;
    }

    super.crearNuevo();
    this.esnuevo = true;
    this.registro.mdatos.eshoja = true;
    this.registro.optlock = 0;
    this.registro.movimiento = false;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.nivel = this.nivel;
    this.registro.padre = this.nodoSeleccionado.data.reg.cclasificador;
    this.registro.cclase = this.nodoSeleccionado.data.reg.cclase;
    this.secuencia = '';
    if (this.nodoSeleccionado.children.length > 0) {
      this.digitos = 2;
    } else {
      this.digitos = 2;
    }
     if (this.registro.padre === '' || this.registro.padre === null) {
      this.registro.padre = !this.estaVacio(this.nodoSeleccionado.data.reg) ? this.nodoSeleccionado.data.reg.copcion : null;
    } else {
      this.registro.padre = this.registro.padre;
    }
    this.nuevoNodo = {
      'data': {
        'nombre': '',
        'reg': this.registro,
        'type': 'Document'
      }
    };
  }


  consultarCatalogos(): void {
 
  }

  cambiarSecuencia(event): void {
    let cuenta: any;
    if (this.registro.padre === undefined) {
      cuenta = this.lregistros.find(x => x.cclasificador === this.secuencia);
    } else {
      cuenta = this.lregistros.find(x => x.cclasificador === this.registro.padre + this.secuencia);
    }
    if (cuenta !== undefined && cuenta !== null) {
      this.mostrarMensajeError('Registro ya existe');
      this.registro.cclasificador = undefined;
      this.secuencia = "";
      return;
    } else {
      if  (this.registro.padre === undefined) {
        this.registro.cclasificador = this.secuencia;
      }else {
        this.registro.cclasificador = this.registro.padre.toString() + this.secuencia;
      }
    }
  }

  obtenerDigitos(): number {
    return this.lregistros.find(x => x.cnivel === this.registro.cnivel).mdatos.digitos;
  }


}
