import {LovDistritosComponent} from './../../../../generales/lov/distritos/componentes/lov.distritos.component';
import {Component, OnInit, Output, Input, EventEmitter, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {TreeNode} from 'primeng/primeng';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-lov-ubicaciones',
  templateUrl: 'lov.ubicaciones.html'
})
export class LovUbicacionesComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovDistritosComponent)
  private lovDistritos: LovDistritosComponent;

  selectedNode: TreeNode;

  public maximonivel = 4;

  public root: any = [];
  
  public aliaspadre: string;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsocUbicacion', 'TSOCUBICACION', false, true);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    this.root = this.crearMenu();
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.cubicacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia(`case t.alias when 'DISTRITO' then (select ccdescripcion from tgendistrito d where d.cdistrito = t.calias)` +
      `when 'PROVINCIA' then (select nombre from tgenprovincia p where p.cpprovincia = t.calias ) ` +
      `when 'CANTON' then (select nombre from tgencanton c where c.ccanton = t.calias and c.cpprovincia = t.cpprovincia) ` +
      `when 'CIUDAD' then (select nombre from tgenciudad c where c.cciudad = t.calias and c.cpprovincia = t.cpprovincia and c.ccanton = t.ccanton) ` +
      `end `, 'ntabla');
    consulta.cantidad = 2000;
    this.addConsulta(consulta);
    return consulta;
  }

  private crearMenu(): TreeNode {
    const root = [
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
    return <TreeNode>root;
  }

  private getParents() {
    const lparents = [];
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const item: any = this.lregistros[i];
        if (this.estaVacio(item.nombre) && item.alias === this.aliaspadre) {
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
        if ((!this.estaVacio(item.nombre) || item.finubicacion === false) && parent.cubicacion === item.cubicacionpadre) {
          lchildren.push(item);
        }
      }
    }
    return lchildren;
  }

  private fillRecursively(rootlist: any[], parent: any, lchildren: any[]) {
    if (lchildren.length > 0 || (this.estaVacio(parent.nombre) && parent.finubicacion === false)) {
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
  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.root = this.crearMenu();
    // Una vez que se ha generado el menu, se ha modificado la lista de registos de trabajo agregando el campo 'eshoja' en el mdatos de cada
    // registro, por tal motivo es necesario actualizar nuevamente la lista de registros originales
    this.actualizaRegistrosOriginales();
  }

  seleccionaRegistro(evento: any) {
    this.eventoCliente.emit({registro: evento.data});
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }

  mostrarLovDistritos(): void {
    this.lovDistritos.showDialog();
  }

  /**Retorno de lov de provincias. */
  fijarLovDistritosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cdistrito = reg.registro.cdistrito;
      this.mcampos.ndistrito = reg.registro.ccdescripcion;
      this.mfiltros.cpprovincia = null;
      this.mcampos.nprovincia = null;
      this.mfiltros.ccanton = null;
      this.mcampos.ncanton = null;
      this.mfiltros.cciudad = null;
      this.mcampos.nciudad = null;
      this.aliaspadre = 'PROVINCIA'
      this.consultar();
    }
  }

  public seleccionaNodo(event) {
    if (event.node.data.nombre === 'ROOT') {
      this.mostrarMensajeWarn('NODO NO SELECCIONABLE');
      this.selectedNode = null;
      return;
    } else if (!event.node.data.reg.activo) {
      this.mostrarMensajeWarn('EL REGISTRO ESTÁ INACTIVO');
      this.selectedNode = null;
      return;
    } else if (event.node.data.reg.finubicacion !== true && !event.node.data.reg.mdatos.eshoja) {
      this.mostrarMensajeWarn('NIVEL NO PERMITIDO, ELIGA EL ULTIMO NIVEL DE CADA CATEGORIA');
      this.selectedNode = null;
      return;
    } else {
      this.encerarMensajes();
    }
    this.eventoCliente.emit({registro: this.selectedNode.data.reg});
    this.displayLov = false;
  }
}
