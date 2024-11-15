import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { TreeNode } from 'primeng/primeng';
import { Consulta } from 'app/util/dto/dto.component';

@Component({
    selector: 'app-lov-categorias',
    templateUrl: 'lov.categorias.html'
})
export class LovCategoriasComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @Output() eventoLov = new EventEmitter();
    displayLov = false;

    public root: any = [];

    selectedNode: TreeNode;

    public nivelactual;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TfacCategoria', 'LOVCATEGORIAS', false, false);
        this.componentehijo = this;
    }

    ngOnInit() {
        this.formFiltrosBase = this.formFiltros;
        this.componentehijo = this;
        // En los lov va 0 para no grabar log de transaccion.
        this.rqConsulta.grabarlog = '0';
    }

    ngAfterViewInit() {
    }

    cancelar() {
        this.displayLov = false;
    }

    public confirmar() {
        if (this.estaVacio(this.selectedNode)) {
            this.mostrarMensajeError('CATEGORÍA NO SELECCIONADA');
        }
        this.eventoLov.emit({ registro: this.selectedNode.data.reg });
        this.displayLov = false;
    }

    // Inicia CONSULTA *********************
    consultar() {
        this.selectedNode = null;
        this.lregistros = [];
        this.root = this.crearMenu();
        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta(): Consulta {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);
        consulta.cantidad = 2000;

        this.addConsulta(consulta);
        return consulta;
    }

    private fijarFiltrosConsulta() {
        // this.mfiltrosigual.activo = true;
        if (!this.estaVacio(this.nivelactual)) {
            this.mfiltrosesp.nivel = '<=' + this.nivelactual;
        }
    }

    validaFiltrosConsulta(): boolean {
        return true;
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

    private crearMenu(): TreeNode {
        const root = [
            {
                data: {
                    'nombre': 'ROOT',
                    'reg': { orden: '', mdatos: { eshoja: false }, pk: '' },
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
                if (this.estaVacio(item.cpadre)) {
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
                if (!this.estaVacio(item.cpadre) && parent.ccategoria === item.cpadre) {
                    lchildren.push(item);
                }
            }
        }
        return lchildren;
    }

    private fillRecursively(rootlist: any[], parent: any, lchildren: any[]) {
        if (!parent.eshoja) {
            const treeparent = {
                data: {
                    'nombre': parent.nombre,
                    'reg': parent,
                    'type': 'Folder'
                },
                children: []
            };
            rootlist.push(treeparent);
            for (const i in lchildren) {
                if (lchildren.hasOwnProperty(i)) {
                    const item: any = lchildren[i];
                    const lchildrenin = this.getChildren(item);
                    this.fillRecursively(treeparent.children, item, lchildrenin);
                }
            }
        } else {
            const treeparent = {
                'data': {
                    'nombre': parent.nombre,
                    'reg': parent,
                    'type': 'Document'
                }
            };
            rootlist.push(treeparent);
        }
    }

    public seleccionaNodo(event) {
        if (event.node.data.nombre === 'ROOT' || !event.node.data.reg.eshoja) {
            this.mostrarMensajeWarn('NODO NO SELECCIONABLE');
            this.selectedNode = null;
            return;
        }
        // else if (!event.node.data.reg.activo) {
        //     this.mostrarMensajeWarn('EL REGISTRO ESTÁ INACTIVO');
        //     this.selectedNode = null;
        //     return;
        // }
        else {
            this.limpiamsgpeticion = true;
        }
    }

    showDialog() {
        this.displayLov = true;
    }

}
