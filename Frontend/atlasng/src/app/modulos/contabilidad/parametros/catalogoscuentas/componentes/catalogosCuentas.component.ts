import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, Data } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovCuentasContablesComponent } from '../../../lov/cuentascontables/componentes/lov.cuentasContables.component';
import { SelectItem } from 'primeng/primeng';
import { TreeNode } from 'primeng/primeng';
import { MonedasComponent } from '../../../../generales/monedas/componentes/monedas.component';
import { ClaseComponent } from '../../../../monetario/clase/componentes/clase.component';
import { NivelComponent } from '../../nivel/componentes/nivel.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';


@Component({
  selector: 'app-catalogos-cuentas',
  templateUrl: 'catalogosCuentas.html'
})
export class CatalogosCuentasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovCuentasContablesComponent)
  private lovcuentasContables: LovCuentasContablesComponent;
  public lnivel: SelectItem[] = [{ label: '...', value: null }];
  public lclase: SelectItem[] = [{ label: '...', value: null }];
  public lmoneda: SelectItem[] = [{ label: '...', value: null }];
  public ltipoplancdetalle: SelectItem[] = [{ label: '...', value: null }];
  public ldigitos = [];

  public root: any = [];
  private nodoSeleccionado: TreeNode;
  private nuevoNodo: TreeNode;
  public tiposmenu: SelectItem[];
  public cnivel = 0;
  public secuencia = '';
  public digitos = 0;
  public tipoplan = '';
  public esnuevo = false;

  private catalogoDetalle: CatalogoDetalleComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TconCatalogo', 'CUECONTABLE', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.llamarnuevo = false;
    this.tiposmenu = [];
    this.tiposmenu.push({ label: 'Padre', value: false });
    this.tiposmenu.push({ label: 'Detalle', value: true });
    //this.consultar();
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
    this.secuencia = this.nodoSeleccionado.data.reg.ccuenta.replace(this.nodoSeleccionado.data.reg.padre, '');
    this.cnivel = this.nodoSeleccionado.data.reg.cnivel;
    this.esnuevo = false;
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.tipoplan = this.ltipoplancdetalle.find(x => x.value == this.mfiltros.tipoplancdetalle).label;
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccuenta, t.cnivel, t.padre, t.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconnivel', 'digitos', 'digitos', 't.cnivel = i.cnivel');
    consulta.cantidad = 5000;
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
    const root: Data = [
      {
        data: {
          'nombre': this.tipoplan,
          'reg': { orden: '', mdatos: { eshoja: false }, nombre: this.tipoplan },
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
        if (!this.estaVacio(item.padre) && parent.ccuenta === item.padre) {
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
      const nombre = parent.mdatos.ccuenta != null ? parent.mdatos.ccuenta : '';
      const treeparent = {
        'data': {
          'nombre': parent.mdatos.ccuenta,
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

    if (this.nodoSeleccionado.parent === undefined) {
      this.cnivel = 1;
    } else {
      this.cnivel = this.nodoSeleccionado.data.reg.cnivel + 1;
    }

    super.crearNuevo();
    this.esnuevo = true;
    this.registro.mdatos.eshoja = true;
    this.registro.ccuenta = this.mfiltros.ccuenta;
    this.registro.optlock = 0;
    this.registro.movimiento = false;
    this.registro.intersucursales = false;
    this.registro.eslegal = true;
    this.registro.activa = true;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.tipoplanccatalogo = 1001;
    this.registro.cmoneda = 'USD';
    this.registro.tipoplancdetalle = this.mfiltros.tipoplancdetalle;
    this.registro.cnivel = this.cnivel;
    this.registro.padre = this.nodoSeleccionado.data.reg.ccuenta;
    this.registro.cclase = this.nodoSeleccionado.data.reg.cclase;
    this.secuencia = '';
    if (this.nodoSeleccionado.children.length > 0) {
      this.digitos = this.nodoSeleccionado.children[0].data.reg.mdatos.digitos;
    } else {
      this.digitos = this.obtenerDigitos();
    }
    //this.registro.padre = !this.estaVacio(this.nodoSeleccionado.data.reg) ? this.nodoSeleccionado.data.reg.copcion : null;  
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

  /**Muestra lov de cuentas contables */
  mostrarlovcuentasContables(): void {
    if (this.mfiltros.tipoplancdetalle === undefined || this.mfiltros.tipoplancdetalle === null) {
      this.mostrarMensajeError("TipoPlan es requerido");
      return;
    }
    this.lovcuentasContables.tipoplancdetalle = this.mfiltros.tipoplancdetalle;
    this.lovcuentasContables.showDialog(null);
  }


  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;
      this.mfiltros.padre = reg.registro.ccuenta;
      this.consultar();
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const nivelComponent = new NivelComponent(this.router, this.dtoServicios);
    const conModNivel = nivelComponent.crearDtoConsulta();
    this.addConsultaCatalogos('MODNIVEL', conModNivel, this.lnivel, super.llenaListaCatalogo, 'cnivel');

    const claseComponent = new ClaseComponent(this.router, this.dtoServicios);
    const conModClase = claseComponent.crearDtoConsulta();
    this.addConsultaCatalogos('MODCLASE', conModClase, this.lclase, super.llenaListaCatalogo, 'cclase');

    const monedasComponent = new MonedasComponent(this.router, this.dtoServicios);
    const conModMoneda = monedasComponent.crearDtoConsulta();
    this.addConsultaCatalogos('MODMONEDA', conModMoneda, this.lmoneda, super.llenaListaCatalogo, 'cmoneda');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1001;
    const conTipoplan = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('TIPOPLAN', conTipoplan, this.ltipoplancdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  cambiarSecuencia(event): void {
    let cuenta: any;
    if (this.registro.padre === undefined) {
      cuenta = this.lregistros.find(x => x.ccuenta === this.secuencia);
    } else {
      cuenta = this.lregistros.find(x => x.ccuenta === this.registro.padre + this.secuencia);
    }
    if (cuenta !== undefined && cuenta !== null) {
      this.mostrarMensajeError('Cuenta ya existe');
      this.registro.ccuenta = "";
      this.secuencia = "";
      return;
    } else {
      if (this.registro.padre === undefined) {
        this.registro.ccuenta = this.secuencia;
      } else {
        this.registro.ccuenta = this.registro.padre.toString() + this.secuencia;
      }
    }
  }

  obtenerDigitos(): number {
    return this.lregistros.find(x => x.cnivel === this.registro.cnivel).mdatos.digitos;
  }

  ValidarSaldo(event, registro: any) {
    //let tienesaldo: boolean;
    if (event) return;

    const consulta = new Consulta('tconsaldoscierre', 'Y', '', { 'ccuenta': registro.ccuenta, 'particion': super.fechaToIntegerMes(this.integerToDate(this.dtoServicios.mradicacion.fcontable)) }, {});
    this.addConsultaPorAlias('SALDOS', consulta);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaCompromiso(resp, event);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
    this.rqConsulta.CODIGOCONSULTA = null;

    //if (tienesaldo){ event = !event; }

  }

  private manejaRespuestaCompromiso(resp: any, event): void {
    if (resp.cod = 'OK') {
      if (resp.SALDOS.length <= 0) {
        event = false;
      } else {
        var sumatorioSaldos = 0;
        for (const i in resp.SALDOS) {
          const reg = resp.SALDOS[i];
          sumatorioSaldos += reg.monto;
        }
        if (sumatorioSaldos > 0) {
          event = true;
        } else {
          event = false;
        }
      }
    }
  }
}