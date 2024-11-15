import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router, Data} from '@angular/router';
import {NgForm} from '@angular/forms';
import {TreeNode} from 'primeng/primeng';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {LovCantonesComponent} from '../../../../generales/lov/cantones/componentes/lov.cantones.component';
import {LovCiudadesComponent} from '../../../../generales/lov/ciudades/componentes/lov.ciudades.component';
import {LovPaisesComponent} from '../../../../generales/lov/paises/componentes/lov.paises.component';
import {LovDistritosComponent} from '../../../../generales/lov/distritos/componentes/lov.distritos.component';
import {LovProvinciasComponent} from '../../../../generales/lov/provincias/componentes/lov.provincias.component';
import {PaisesComponent} from '../../../../generales/paises/componentes/paises.component';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-ubicacion',
  templateUrl: 'ubicacion.html'
})
export class UbicacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovDistritosComponent)
  private lovDistritosComponent: LovDistritosComponent;

  @ViewChild(LovProvinciasComponent)
  private lovProvinciasComponent: LovProvinciasComponent;

  @ViewChild(LovCantonesComponent)
  private lovCantonesComponent: LovCantonesComponent;

  @ViewChild(LovCiudadesComponent)
  private lovCiudadesComponent: LovCiudadesComponent;

  public root: any = [];
  private nodoSeleccionado: TreeNode;
  private nuevoNodo: TreeNode;
  public tiposmenu: SelectItem[];
  public nivel = 0;
  public secuencia = '';
  public digitos = 0;
  public nlabel = '';
  public alias = '';
  public calias = 0;
  public cdistrito = 0;
  public cpprovincia = 0;
  public ccanton = 0;
  public cciudad = 0;
  public mostrarEditar: boolean;
  public registroNodo: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tsocubicacion', 'UBICACIONES', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.llamarnuevo = false;

    //this.consultar();
    this.iniciarArbol();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    this.obtenerSecuenciaMenu();
  }

  actualizar() {
    super.actualizar();
    if (this.nuevoNodo != null) {
      // Si el nuevoNodo no es nulo, entonces se esta agregando un nodo a un nodo cubicacionpadre
      if (!this.registro.mdatos.eshoja) {
        this.nuevoNodo.data.nombre = this.registro.nombre;
        this.nuevoNodo.data.type = 'Folder';
        this.nuevoNodo.children = [];
      } else {
        this.nuevoNodo.data.nombre = this.registro.mdatos.nombre;
        this.registro.mdatos.ntabla = this.registro.mdatos.nombre;
      }
      this.nodoSeleccionado.children.push(this.clone(this.nuevoNodo));
    } else {
      // De lo contrario se esta editando un nodo cualquiera
      this.actualizaNodoSeleccionado(this.nodoSeleccionado, this.registro);
    }
    this.nuevoNodo = null;
    this.grabar();
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
    if (this.nodoSeleccionado.parent === undefined) {
      this.nivel = 1;
    } else {
      this.nivel = this.nodoSeleccionado.data.reg.nivel;
    }
    this.registroNodo = this.nodoSeleccionado.data.reg
    this.etiqueta(this.nivel);


    super.selectRegistro(this.nodoSeleccionado.data.reg);
    if (this.nivel <= 4) {
      this.registro.mdatos.codigo = this.nodoSeleccionado.data.reg.calias;
      this.registro.mdatos.nombre = this.nodoSeleccionado.data.reg.mdatos.ntabla;
    } else {
      this.registro.mdatos.codigo = this.nodoSeleccionado.data.reg.cubicacion;
      this.registro.mdatos.nombre = this.nodoSeleccionado.data.reg.nombre;
    }
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cubicacion, t.nivel, t.cubicacionpadre, t.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia(`case t.alias when 'DISTRITO' then (select ccdescripcion from tgendistrito d where d.cdistrito = t.calias)` +
      `when 'PROVINCIA' then (select nombre from tgenprovincia p where p.cpprovincia = t.calias ) ` +
      `when 'CANTON' then (select nombre from tgencanton c where c.ccanton = t.calias and c.cpprovincia = t.cpprovincia) ` +
      `when 'CIUDAD' then (select nombre from tgenciudad c where c.cciudad = t.calias and c.cpprovincia = t.cpprovincia and c.ccanton = t.ccanton) ` +
      `end `, 'ntabla');
    consulta.cantidad = 2000;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    //  this.mfiltros.activo = 0;
  }

  validaFiltrosConsulta(): boolean {
    //return super.validaFiltrosRequeridos();
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
          'nombre': 'ROOT',
          'reg': {orden: '', mdatos: {eshoja: false, ntabla: 'ROOT'}},
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
        if (this.estaVacio(item.cubicacionpadre)) {
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
        if (!this.estaVacio(item.cubicacionpadre) && parent.cubicacion === item.cubicacionpadre) {
          lchildren.push(item);
        }
      }
    }
    return lchildren;
  }

  private fillRecursively(rootlist: any[], parent: any, lchildren: any[]) {
    if (lchildren.length > 0 || parent.finubicacion === false) {
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

      if (this.estaVacio(parent.cubicacionpadre)) {
        //treeparent.setExpanded(true);
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
      const nombre = parent.mdatos.cubicacion != null ? parent.mdatos.cubicacion : '';
      const treeparent = {
        'data': {
          'nombre': parent.mdatos.cubicacion,
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

  private etiqueta(nivel: number) {
    this.alias = '';
    if (nivel === 1) {
      this.nlabel = 'Distrito';
      this.alias = 'DISTRITO';
    }

    if (nivel === 2) {
      this.nlabel = 'Provincia';
      this.alias = 'PROVINCIA';
    }

    if (nivel === 3) {
      this.nlabel = 'Cantón';
      this.alias = 'CANTON';
    }

    if (nivel === 4) {
      this.nlabel = 'Ciudad';
      this.alias = 'CIUDAD';
    }
  }

  private filtrarLov(nivel: number, reg: any) {
    const cpais = 'EC';
    switch (nivel) {
      case 1: {
        this.lovDistritosComponent.showDialog();
        break;
      }
      case 2: {
        this.lovProvinciasComponent.mfiltros.cpais = cpais;
        this.lovProvinciasComponent.showDialog();
        this.lovProvinciasComponent.consultar();
        break;
      }
      case 3: {
        this.lovCantonesComponent.mfiltros.cpais = cpais;
        this.lovCantonesComponent.mfiltros.cpprovincia = reg.calias;
        this.lovCantonesComponent.showDialog();
        this.lovCantonesComponent.consultar();
        break;
      }
      case 4: {
        this.lovCiudadesComponent.mfiltros.cpais = cpais;
        this.lovCiudadesComponent.mfiltros.cpprovincia = reg.cpprovincia;
        this.lovCiudadesComponent.mfiltros.ccanton = reg.calias;
        this.lovCiudadesComponent.showDialog();
        this.lovCiudadesComponent.consultar();
        break;
      }
    }
  }

  private obtenerSecuenciaMenu() {
    if (this.nodoSeleccionado.parent === undefined) {
      this.nivel = 1;
    } else {
      this.nivel = this.nodoSeleccionado.data.reg.nivel + 1;
    }
    this.registroNodo = this.nodoSeleccionado.data.reg
    this.etiqueta(this.nivel);
    this.calias = this.nodoSeleccionado.data.reg.calias;
    this.cdistrito = this.nodoSeleccionado.data.reg.cdistrito;
    this.cpprovincia = this.nodoSeleccionado.data.reg.cpprovincia;
    this.ccanton = this.nodoSeleccionado.data.reg.ccanton;
    this.cciudad = this.nodoSeleccionado.data.reg.cciudad;
    super.crearNuevo();
    this.registro.mdatos.eshoja = true;
    this.registro.nivel = this.nivel;
    this.registro.cubicacionpadre = this.nodoSeleccionado.data.reg.cubicacion;
    this.registro.finubicacion = false;
    this.registro.activo = true;
    this.registro.alias = this.alias;
    if (this.nivel >= 5) {
      this.registro.cdistrito = this.cdistrito;
      this.registro.cpprovincia = this.cpprovincia;
      this.registro.ccanton = this.ccanton;
      if (this.nivel === 5) {
        this.registro.cciudad = this.calias;
      } else {
        this.registro.cciudad = this.cciudad;
      }
      
    }
    this.nuevoNodo = {
      'data': {
        'nombre': '',
        'reg': this.registro,
        'type': 'Document'
      }
    };
  }

  cambiarSecuencia(event): void {
    const ubicacion = this.lregistros.find(x => x.cubicacion === this.registro.cubicacionpadre + this.secuencia);
    if (ubicacion !== undefined && ubicacion !== null) {
      this.mostrarMensajeError('Ubicación ya existe');
      this.secuencia = event.data;
      return;
    }
    this.registro.ccuenta = this.registro.cubicacionpadre + this.secuencia;
  }

  obtenerDigitos(): number {
    return this.lregistros.find(x => x.nivel === this.registro.nivel).mdatos.digitos;
  }

  /**Muestra lov de saldo */
  mostrarLov(): void {
    this.filtrarLov(this.nivel, this.registroNodo);
  }

  /**Retorno de lov de saldo. */
  fijarLovSelec(reg: any): void {
    if (reg.registro !== undefined) {
      if (this.nivel === 1) {
        this.registro.mdatos.nombre = reg.registro.ccdescripcion;
        this.registro.mdatos.codigo = reg.registro.cdistrito;
        this.registro.calias = reg.registro.cdistrito;


      }

      if (this.nivel === 2) {
        this.registro.mdatos.nombre = reg.registro.nombre;
        this.registro.mdatos.codigo = reg.registro.cpprovincia;
        this.registro.calias = reg.registro.cpprovincia;
        this.registro.cdistrito = this.calias;

      }

      if (this.nivel === 3) {
        this.registro.mdatos.nombre = reg.registro.nombre;
        this.registro.mdatos.codigo = reg.registro.ccanton;
        this.registro.calias = reg.registro.ccanton;
        this.registro.cdistrito = this.cdistrito;
        this.registro.cpprovincia = this.calias;
        ;
      }

      if (this.nivel === 4) {
        this.registro.mdatos.nombre = reg.registro.nombre;
        this.registro.mdatos.codigo = reg.registro.cciudad;
        this.registro.calias = reg.registro.cciudad;
        this.registro.cdistrito = this.cdistrito;
        this.registro.cpprovincia = this.cpprovincia;
        this.registro.ccanton = this.calias;
      }
    }
  }
}
