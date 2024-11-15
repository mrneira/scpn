import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, Data } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovClasificadorComponent } from '../../../lov/clasificador/componentes/lov.clasificador.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';
import { TreeNode } from 'primeng/primeng';
import { any } from 'codelyzer/util/function';

@Component({
  selector: 'app-partida-gasto',
  templateUrl: 'partidaGasto.html'
})
export class PartidaGastoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild('lovclasificador')
  private lovclasificador: LovClasificadorComponent;
  @ViewChild('lovclasificadorcategoria')
  private lovclasificadorcategoria: LovClasificadorComponent;

  totalMonto = 0;
  totalPorcentaje = 0;
  totalIngresosMonto = 0;
  totalIngresosPorcentaje = 0;

  public nivel = 0;
  public root: any = [];
  private nodoSeleccionado: TreeNode;
  private nuevoNodo: TreeNode;
  public tiposmenu: SelectItem[];
  esCategoria:boolean = false;
  esNuevo = true;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpptpartidagasto', 'PARTIDAGASTO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.registro.aniofiscal = this.anioactual;
    this.llamarnuevo=false;
    this.tiposmenu = [];
    this.tiposmenu.push({ label: 'Categorías', value: false });
    this.tiposmenu.push({ label: 'Partida Gasto', value: true });
    this.mfiltros.aniofiscal =  this.integerToYear(this.dtoServicios.mradicacion.fcontable);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  cambiar(event){
    this.registro.movimiento = event.value;
  }

  crearNuevo() {
    super.crearNuevo();
    
    if (this.nodoSeleccionado.parent === undefined){
      this.nivel = 1;
    }else {
      this.nivel = this.nodoSeleccionado.data.reg.nivel + 1;
    }
    this.esNuevo = true;
    this.registro.nivel = this.nivel;
    this.registro.movimiento = true;
    this.registro.mdatos.eshoja = true;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.registro.aniofiscal = this.anioactual;
    this.registro.vasignacioninicial = 0;
    this.registro.vmodificado = 0;
    this.registro.vcodificado = 0;
    this.registro.vcertificado = 0;
    this.registro.vcomprometido = 0;
    this.registro.vdevengado =0;
    this.registro.vsaldopordevengar = 0;
    this.registro.vsaldoporpagar = 0;
    this.registro.porcenejecucion = 0;
    this.registro.porcenparticipacion = 0;
    this.registro.vpagado =0;
    this.registro.vsaldoporcomprometer = 0;
    this.registro.padre = !this.estaVacio(this.nodoSeleccionado.data.reg) ? this.nodoSeleccionado.data.reg.cpartidagasto : null;
     this.nuevoNodo = {
      'data': {
        'nombre': '',
        'reg': this.registro,
        'type': 'Document'
      }
    };    

  }

  consultarpartidas(){
    this.consultar();
    this.iniciarArbol();
  }

  iniciarArbol(){
    this.root = this.crearMenu();
    this.actualizaRegistrosOriginales();
  }
  
  private crearMenu(): TreeNode {
    const root : Data = [
      {
        data: {
          'nombre': 'ROOT',
          'reg': { orden: '', mdatos: { eshoja: false }},
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
        if (!this.estaVacio(item.padre) && parent.cpartidagasto === item.padre) {
          lchildren.push(item);
        }
        
      }
    }
    return lchildren;
  }
  
  private fillRecursively(rootlist: any[], parent: any, lchildren: any[]) {
    if (lchildren.length > 0 || parent.movimiento === null) {
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
      const nombre = parent.mdatos.cpartidagasto != null ? parent.mdatos.cpartidagasto : '';
      const treeparent = {
        'data': {
          'nombre': parent.mdatos.cpartidagasto,
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
    this.esNuevo = false;
    super.selectRegistro(this.nodoSeleccionado.data.reg);
    this.nivel = this.nodoSeleccionado.data.reg.nivel;
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.lregistros = [];
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.cpartidagasto, t.padre, t.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 2000;
    this.addConsulta(consulta);
    return consulta;
  }

  consultarCatalogos(): void {
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.root = this.crearMenu();
    this.calcularTotalesIngreso();
    this.actualizaRegistrosOriginales();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
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


  mostrarlovclasificador(): void {
    this.lovclasificador.showDialog();
  }

  /**Retorno de lov de plantillas contables. */
  fijarlovclasificadorSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.nombre = reg.registro.nombre;
      this.registro.cclasificador = reg.registro.cclasificador;
      this.registro.cpartidagasto = reg.registro.cclasificador;
    }
  }

  /**Muestra lov de plantillas contables */
  mostrarlovclasificadorcategoria(): void {
    this.lovclasificadorcategoria.showDialog();
  }


  /**Retorno de lov de plantillas contables. */
  fijarlovclasificadorSelecCategoria(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.nombre = reg.registro.nombre;
      this.registro.cclasificador = reg.registro.cclasificador;
      this.registro.cpartidagasto = reg.registro.cclasificador;
    }
  }  

  calcularTotales(tipoflujocdetalle: string) {
    let totalmontototal = 0;
    let totalporcen = 0;

    if (this.lregistros) {
      for (let reg of this.lregistros) {
        if (reg.mdatos.tipoflujocdetalle === tipoflujocdetalle) {
          totalmontototal += reg.montototal;
          totalporcen += reg.porcenparticipacion;
        }
      }
    }

    this.totalMonto =  totalmontototal;
    this.totalPorcentaje = totalporcen;
  }

  calculaVcodificado(event){
      this.registro.vcodificado = this.registro.vasignacioninicial + this.registro.vmodificado;
      this.registro.vsaldoporcomprometer = this.registro.vcodificado;
      this.registro.vsaldoporcertificar = this.registro.vcodificado;
      this.registro.vsaldoporcomprometer = this.registro.vcodificado;
      this.registro.vsaldopordevengar = this.registro.vcodificado;
  }
  
  calcularTotalesIngreso(){
    
    let totalmontototal = 0;
    let totalporcen = 0;

    if (this.lregistros) {
      for (let reg of this.lregistros) {
          totalmontototal += reg.montototal;
          totalporcen += reg.porcenparticipacion;
      }
    }

    this.totalIngresosMonto += totalmontototal;
    this.totalIngresosPorcentaje += totalporcen;
  }
}
