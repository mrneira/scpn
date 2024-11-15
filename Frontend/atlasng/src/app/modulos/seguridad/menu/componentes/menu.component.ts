import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router, Data} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';
import {TreeNode} from 'primeng/primeng';
import {SelectItem} from 'primeng/primeng';
import {LovTransaccionesComponent} from '../../../generales/lov/transacciones/componentes/lov.transacciones.component';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.html'
})
export class MenuComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovTransaccionesComponent)
  private lovtransacciones: LovTransaccionesComponent;

  public lperfiles: SelectItem[] = [{label: '...', value: null}];

  public root: any = [];

  private nodoSeleccionado: TreeNode;

  private nuevoNodo: TreeNode;

  public tiposmenu: SelectItem[];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsegRolOpciones', 'ROLOPCIONES', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.llamarnuevo = false;
    this.tiposmenu = [];
    this.tiposmenu.push({label: 'Menu padre', value: false});
    this.tiposmenu.push({label: 'Transacción', value: true});
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    this.obtenerSecuenciaMenu();
  }

  actualizar() {
    this.registrarEtiqueta(this.registro, this.lperfiles, 'crol', 'nrol');
    super.actualizar();
    
    if (this.nuevoNodo != null) {
      // Si el nuevoNodo no es nulo, entonces se esta agregando un nodo a un nodo padre
      if (!this.registro.mdatos.eshoja) {
        this.nuevoNodo.data.nombre = this.registro.nombre;
        this.nuevoNodo.data.type = 'Folder';
        this.nuevoNodo.children = [];
      } else {
        this.nuevoNodo.data.nombre = this.registro.mdatos.ntransaccion;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.crol, t.orden, t.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 2000;
    consulta.addSubquery('TgenTransaccion', 'nombre', 'ntransaccion', 'i.ctransaccion = t.ctransaccion and i.cmodulo = t.cmodulo');

    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    if (resp.cod === 'OK') {
      for (const i in this.lregistros) {
        if (this.lregistros.hasOwnProperty(i)) {
          const reg = this.lregistros[i];
          this.registrarEtiqueta(reg, this.lperfiles, 'crol', 'nrol');
        }
      }
    }
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
  }

  private crearMenu(): TreeNode {
    const root : Data = [
      {
        data: {
          'nombre': 'ROOT',
          'reg': {orden: '', mdatos: {eshoja: false}},
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
        if (this.estaVacio(item.copcionpadre)) {
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
        if (!this.estaVacio(item.copcionpadre) && parent.copcion === item.copcionpadre) {
          lchildren.push(item);
        }
      }
    }
    return lchildren;
  }

  private fillRecursively(rootlist: any[], parent: any, lchildren: any[]) {
    if (lchildren.length > 0 || parent.cmodulo === null) {
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

      if (this.estaVacio(parent.copcionpadre)) {
       
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
      const nombre = parent.mdatos.ntransaccion != null ? parent.mdatos.ntransaccion : '';
      const treeparent = {
        'data': {
          'nombre': parent.mdatos.ntransaccion,
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
    const metadataMantenimiento = new Object();
    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');

    metadataMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    metadataMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    metadataMantenimiento['cmodulo'] = 0;
    metadataMantenimiento['ctransaccion'] = 101;
    metadataMantenimiento['NSECUENCIA'] = 'ROLOPCION';
    
    this.dtoServicios.ejecutarRestMantenimiento(metadataMantenimiento, '').subscribe(
      resp => {
        const secuenciamenu = resp.secuencia;

        if (this.estaVacio(secuenciamenu)) {
          this.mostrarMensajeError('SECUENCIA NO GENERADA');
          return;
        }
        /*Cuando se obtiene la secuencia se invoca al logica de nuevo*/
        super.crearNuevo();
        this.registro.mdatos.eshoja = false;
        this.registro.optlock = 0;
        this.registro.crol = this.mfiltros.crol;
        this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
        this.registro.copcion = secuenciamenu;
        this.registro.copcionpadre = !this.estaVacio(this.nodoSeleccionado.data.reg) ? this.nodoSeleccionado.data.reg.copcion : null;
        this.registro.mostrarenmenu = false;
        this.registro.activo = false;
        this.nuevoNodo = {
          'data': {
            'nombre': '',
            'reg': this.registro,
            'type': 'Document'
          }
        };
      },
      error => {
        this.dtoServicios.manejoError(error);
        this.grabo = false;
      }
    );
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const consultaRol = new Consulta('TsegRol', 'Y', 't.nombre', {}, {});
    consultaRol.cantidad = 500;
    this.addConsultaCatalogos('PERFILES', consultaRol, this.lperfiles, this.llenarPerfiles, 'crol', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarPerfiles(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    super.llenaListaCatalogo(pLista, pListaResp, campopk, false, componentehijo);

    componentehijo.mfiltros.crol = pLista[0].value;
    componentehijo.consultar();
  }

  /**Muestra lov de transacciones */
  mostrarLovTransacciones(): void {
    this.lovtransacciones.mfiltrosesp.ruta = 'is not null';
    this.lovtransacciones.showDialog();
  }

  /**Retorno de lov de transacciones. */
  fijarLovTransaccionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.ntransaccion = reg.registro.nombre;
      this.registro.cmodulo = reg.registro.cmodulo;
      this.registro.ctransaccion = reg.registro.ctransaccion;
    }
  }

  public cambiaCrear(valor: any) {
    this.registro.crear = valor;
    if (this.registro.crear && (this.registro.editar == null || !this.registro.editar)) {
      this.registro.editar = true;
    }
  }

  public cambiaEditar(valor: any) {
    this.registro.editar = valor;
    if (!valor && this.registro.crear) {
      setTimeout(() => {
        this.registro.editar = true;
      }, 0);
    }
    window.event.preventDefault();
  }

}
