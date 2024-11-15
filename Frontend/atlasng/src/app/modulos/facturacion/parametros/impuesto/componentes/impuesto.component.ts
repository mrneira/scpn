import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, Data } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { TreeNode, SelectItem } from 'primeng/primeng';
import { Consulta } from 'app/util/dto/dto.component';
import { LovCuentasContablesComponent } from 'app/modulos/contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
    selector: 'app-impuesto',
    templateUrl: 'impuesto.html'
})
export class ImpuestoComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild(LovCuentasContablesComponent)
    private lovcuentasContables: LovCuentasContablesComponent;

    public lcanales: SelectItem[] = [{ label: '...', value: null }];

    public root: any = [];

    public nodoSeleccionado: TreeNode;

    private nuevoNodo: TreeNode;

    public tiposmenu: SelectItem[];

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TfacImpuesto', 'IMPUESTOS', false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
        this.llamarnuevo = false;
        this.tiposmenu = [];
        this.tiposmenu.push({ label: 'Grupo', value: false });
        this.tiposmenu.push({ label: 'Impuesto', value: true });
    }

    ngAfterViewInit() {
    }

    crearNuevo() {
        this.obtenerSecuenciaMenu();
    }

    actualizar() {
        super.actualizar();
        if (this.nuevoNodo != null) {
            // Si el nuevoNodo no es nulo, entonces se esta agregando un nodo a un nodo padre
            if (!this.registro.eshoja) {
                this.nuevoNodo.data.nombre = this.registro.nombre;
                this.nuevoNodo.data.type = 'Folder';
                this.nuevoNodo.children = [];
            } else {
                this.nuevoNodo.data.nombre = this.registro.nombre;
            }
            this.nodoSeleccionado.children.push(this.clone(this.nuevoNodo));
        } else {
            // De lo contrario se esta editando un nodo cualquiera
            this.actualizaNodoSeleccionado(this.nodoSeleccionado, this.registro);
        }
        this.nuevoNodo = null;
        this.root = [...this.root];
    }

    eliminar() {
        super.eliminar();
        // Se eliminan los registros hijos del nodo a eliminar
        this.eliminarRegistrosNodos(this.nodoSeleccionado);
        // Se eliminan los nodos hijos del nodo a eliminar
        this.nodoSeleccionado.parent.children = this.nodoSeleccionado.parent.children.filter(n => n.data.reg.idreg !== this.nodoSeleccionado.data.reg.idreg);
        this.root = [...this.root];
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
        const conMenu = this.crearDtoConsulta();
        this.addConsultaPorAlias(this.alias, conMenu);

        super.consultar();
    }

    public crearDtoConsulta(): Consulta {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.cpadre, t.nombre', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);
        consulta.addSubquery('TconCatalogo', 'nombre', 'ncuenta', 'i.ccuenta=t.codigocontable');
        consulta.cantidad = 5000;
        this.addConsulta(consulta);

        return consulta;
    }

    private fijarFiltrosConsulta() {
        // this.mfiltrosigual.cimpuesto_ccompania = this.appService.dtoServicios.mradicacion.ccompania;
    }

    validaFiltrosConsulta(): boolean {
        return super.validaFiltrosConsulta();
    }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
        super.postQueryEntityBean(resp);
        if (resp.cod === 'OK') {
            for (const i in this.lregistros) {
                if (this.lregistros.hasOwnProperty(i)) {
                    const reg = this.lregistros[i];
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

        super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
        super.grabar();
    }

    public crearDtoMantenimiento() {

    }

    public postCommit(resp: any) {
        super.postCommitEntityBean(resp);
        this.postCommitNodosArbol(resp, this.root[0]);
    }

    private crearMenu(): TreeNode {
        const root: Data = [
            {
                data: {
                    'nombre': 'ROOT',
                    'reg': { orden: '', mdatos: { eshoja: false }, pk: {} },
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
                if (!this.estaVacio(item.cpadre) && parent.cimpuesto === item.cpadre) {
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

            if (this.estaVacio(parent.cpadre)) {
                // treeparent.setExpanded(true);
            }
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

        metadataMantenimiento['CODMODULOORIGEN'] = this.mod;
        metadataMantenimiento['CODTRANSACCIONORIGEN'] = this.tran;
        metadataMantenimiento['cmodulo'] = 0;
        metadataMantenimiento['ctransaccion'] = 101;
        metadataMantenimiento['NSECUENCIA'] = 'CIMPUESTO';

        this.dtoServicios.ejecutarRestMantenimiento(metadataMantenimiento).subscribe(
            resp => {
                this.dtoServicios.llenarMensaje(resp, true); // solo presenta errores.
                const secuenciaimp = resp.secuencia;

                if (this.estaVacio(secuenciaimp)) {
                    this.mostrarMensajeError('SECUENCIA NO GENERADA');
                    return;
                }

                /*Cuando se obtiene la secuencia se invoca al logica de nuevo*/
                super.crearNuevo();
                this.registro.eshoja = true;
                this.registro.activo = true;
                this.registro.cpais = 'EC';
                this.registro.cimpuesto = secuenciaimp;
                this.registro.cpadre = !this.estaVacio(this.nodoSeleccionado.data.reg.cimpuesto) ? this.nodoSeleccionado.data.reg.cimpuesto : null;
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

    mostrarlovcuentasContables(esCrear = false): void {
        this.lovcuentasContables.showDialog(true);
    }

    fijarLovCuentasContablesSelec(reg: any): void {
        if (reg.registro !== undefined) {
            this.registro.mdatos.ncuenta = reg.registro.nombre;
            this.registro.codigocontable = reg.registro.ccuenta;
        }
    }
}
