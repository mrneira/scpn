import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovClientesComponent } from '../../../lov/clientes/componentes/lov.clientes.component';
import { LovCuentasPorCobrarComponent } from '../../../lov/cuentasporcobrar/componentes/lov.cuentasporcobrarcomponent';
import { LovPlantillasComprobanteComponent } from '../../../lov/plantillascomprobante/componentes/lov.plantillasComprobante.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
          
@Component({
    selector: 'app-cxc-ingresomodificacion',
    templateUrl: 'ingresomodificacion.html'
})

export class IngresoModificacionComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild(LovPlantillasComprobanteComponent)
    private lovplantillasComprobante: LovPlantillasComprobanteComponent;
    
    @ViewChild(LovCuentasPorCobrarComponent)
    private lovCuentasPorCobrar: LovCuentasPorCobrarComponent;
    
    @ViewChild(LovClientesComponent)
    private lovClientes: LovClientesComponent;


    @ViewChild(JasperComponent)
    public jasper: JasperComponent;

    public tieneComprobante = false;
    
    public lestado: SelectItem[] = [{ label: '...', value: null }];
    public lformapago: SelectItem[] = [{ label: '...', value: null }];
    public lporcenice: SelectItem[] = [{ label: '...', value: null }];
    public lporceniva: SelectItem[] = [{ label: '...', value: null }];
    public ltipodoc: SelectItem[] = [{ label: '...', value: null }];
    public lsucursales: SelectItem[] = [{label: '...', value: null}];    
    public lagenciastotal: any = [];
    public lagencias: SelectItem[] = [{label: '...', value: null}];

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TconCuentaPorCobrar', 'CUENTASPORCOBRAR', false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
        this.consultarCatalogos();
        this.crearNuevo();
    }

    ngAfterViewInit() {
    }

    selectRegistro(registro: any) {
        // No existe para el padre
    }

    crearNuevo() {
        super.crearNuevo();
        this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
        this.registro.estadoccatalogo = 1012;
        this.registro.estadocdetalle = 'INGRE';
        this.registro.mdatos.nestado = 'INGRESADO';
        
        this.registro.formapagoccatalogo = 1013;
        this.registro.porcentajeiceccatalogo = 1014;
        this.registro.porcentajeivaccatalogo = 1015;
        this.registro.tipodocumentoccatalogo = 1016;
        this.registro.subtotalsinimpuestos = 0;
    }

    actualizar() {
        super.actualizar();
    }

    eliminar() {
        super.eliminar();
    }

    cancelar() {
        super.cancelar();
    }

    // Inicia CONSULTA *********************
    consultar() {
        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta() {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.cctaporcobrar', this.mfiltros, this.mfiltrosesp);
        consulta.addSubquery('tperproveedor', 'nombre', 'nombreProv', 'i.cpersona = t.cpersona');
        consulta.addSubquery('tperproveedor', 'identificacion', 'identificacionProv', 'i.cpersona = t.cpersona');
        consulta.addSubquery('tconcomprobante', 'numerocomprobantecesantia', 'numerocomprobantecesantia', 'i.ccomprobante = t.ccompcontable');
        consulta.addSubquery('tconplantilla', 'nombre', 'pnombre', 'i.cplantilla = t.cplantilla');
        consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nestado', 't.estadocdetalle = i.cdetalle and t.estadoccatalogo = i.ccatalogo');
        
        this.addConsulta(consulta);
        return consulta;
    }

    private fijarFiltrosConsulta() {
    }

    validaFiltrosConsulta(): boolean {
        return true;
    }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
        super.postQueryEntityBean(resp);
        this.fijarListaAgencias();
        
    }
    // Fin CONSULTA *********************

    // Inicia MANTENIMIENTO *********************
    grabar(): void {
        if (this.registro.cpersona == null) {
            super.mostrarMensajeError('CLIENTE REQUERIDO');
            return;
        }

        if (this.registro.csucursalingreso == null) {
            super.mostrarMensajeError('SUCURSAL DE INGRESO REQUERIDA');
            return;
        }
        
        if (this.registro.cagenciaingreso == null) {
            super.mostrarMensajeError('AGENCIA DE INGRESO REQUERIDA');
            return;
        }
        
        if (this.registro.tipodocumentocdetalle == null) {
            super.mostrarMensajeError('TIPO DE DOCUMENTO REQUERIDO');
            return;
        }        
        
        if (this.registro.formapagocdetalle == null) {
            super.mostrarMensajeError('FORMA DE PAGO DE FACTURA REQUERIDO');
            return;
        }

        if (this.registro.fdocumento == null) {
            super.mostrarMensajeError('FECHA DE INGRESO REQUERIDA');
            return;
        } 

        if (this.registro.fcaducidad == null) {
            super.mostrarMensajeError('FECHA DE CADUCIDAD REQUERIDA');
            return;
        }                

        if (this.registro.concepto == null) {
            super.mostrarMensajeError('CONCEPTO DE FACTURA REQUERIDO');
            return;
        }

        if (this.registro.subtotalsinimpuestos == 0) {
            super.mostrarMensajeError('VALOR DEL SUBTOTAL REQUERIDO');
            return;
        }

        if(this.registro.subtotalsinimpuestos.toString().length > 10
            || this.registro.subtotalsinimpuestos.toString() === 'Infinity'){
            super.mostrarMensajeError("DEMASIADO NÚMERO DE DIGITOS PARA LA BASE IMPONIBLE");
            return;
        }

        if (this.registro.porcentajeicecdetalle == null) {
            super.mostrarMensajeError('PORCENTAJE DE ICE REQUERIDO');
            return;
        }

        if (this.registro.porcentajeivacdetalle == null) {
            super.mostrarMensajeError('PORCENTAJE DE IVA REQUERIDO');
            return;
        }
        //#endregion

        
        if(this.registro.esnuevo){
            this.actualizar();
        }
        
        this.lmantenimiento = []; // Encerar Mantenimiento
        this.crearDtoMantenimiento();
        // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
        
        super.grabar();
    }

    guardarCambios(): void {
        this.grabar();
    }

    generarComprobante(): void {
        this.registro.mdatos.comprobante = true;
        this.registro.estadocdetalle = "CONTAB";
        this.grabar();
    }

    eliminarcxc(): void{
        this.registro.mdatos.eliminar = true;
        this.registro.estadocdetalle = "ELIMIN";
        this.grabar();   
    }
    
    public crearDtoMantenimiento() {
        const mantenimiento = super.getMantenimiento(1);
        super.addMantenimientoPorAlias(this.alias, mantenimiento);
    }

    public postCommit(resp: any) {
        if(resp.cctaporcobrar != null) {
            this.mfiltros.cctaporcobrar = this.registro.cctaporcobrar = resp.cctaporcobrar;
        }
        if(resp.ccompcontable != null) this.registro.ccompcontable = resp.ccompcontable;
        if(resp.ccodfactura != null) {
            this.mfiltros.ccodfactura = this.registro.ccodfactura = resp.ccodfactura;
        }
        if(this.registro.cpersona != null){
            this.mfiltros.cpersona = this.registro.cpersona;
            this.mfiltros.ccompania = this.registro.ccompania;
        }
        if(resp.numerocomprobantecesantia != null) this.registro.mdatos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
        super.postCommitEntityBean(resp);
    }

    /**Muestra lov de Clientes */
    mostrarLovClientes(): void {
        this.lovClientes.showDialog();
    }

    /**Retorno de lov de Clientes. */
    fijarLovClientes(reg: any): void {
        if (reg.registro !== undefined) {
            this.mcampos.cpersona = reg.registro.cpersona;
            this.registro.mdatos.identificacionProv = reg.registro.identificacion;
            this.registro.mdatos.nombreProv = reg.registro.nombre;
            this.registro.cpersona = reg.registro.cpersona;
        }
    }

    /**Muestra lov de Cuentas por cobrar */
    mostrarLovCuentasPorCobrar(): void {
        this.lovCuentasPorCobrar.showDialog();
    }

    /**Retorno de lov de Cuentas por cobrar. */
    fijarLovCuentasPorCobrarSelect(reg: any): void {
        if (reg.registro !== undefined) {
            this.mfiltros.ccodfactura = reg.registro.ccodfactura;
            this.mfiltros.cctaporcobrar = reg.registro.cctaporcobrar;
            this.mfiltros.cpersona = reg.registro.cpersona;     
            this.mfiltros.ccompania = reg.registro.ccompania;
        }
        this.consultar();
    }    

    consultarCatalogos(): any {
        this.msgs = [];
        this.lconsulta = [];
        this.llenarConsultaCatalogos();

        this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
            .subscribe(
            resp => {
                this.encerarMensajes();
                this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
                this.manejaRespuestaCatalogos(resp);
            },
            error => {
                this.dtoServicios.manejoError(error);
            });
    }

    llenarConsultaCatalogos(): void {
        const mfiltroESTADO: any = { 'ccatalogo': 1012 };
        const consultaESTADO = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroESTADO, {});
        consultaESTADO.cantidad = 500;
        this.addConsultaPorAlias('ESTADO', consultaESTADO);

        const mfiltroFORMAPAGO: any = { 'ccatalogo': 1013 };
        const consultaFORMAPAGO = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroFORMAPAGO, {});
        consultaFORMAPAGO.cantidad = 500;
        this.addConsultaPorAlias('FORMAPAGO', consultaFORMAPAGO);

        const mfiltroPORCENICE: any = { 'ccatalogo': 1014 };
        const consultaPORCENICE = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroPORCENICE, {});
        consultaPORCENICE.cantidad = 500;
        this.addConsultaPorAlias('PORCENICE', consultaPORCENICE);

        const mfiltroPORCENIVA: any = { 'ccatalogo': 1015 };
        const consultaPORCENIVA = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroPORCENIVA, {});
        consultaPORCENIVA.cantidad = 500;
        this.addConsultaPorAlias('PORCENIVA', consultaPORCENIVA);

        const mfiltroTIPODOC: any = { 'ccatalogo': 1016 };
        const consultaTIPODOC = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTIPODOC, {});
        consultaTIPODOC.cantidad = 500;
        this.addConsultaPorAlias('TIPODOC', consultaTIPODOC);

        const consultaSucursal = new Consulta('TgenSucursal', 'Y', 't.nombre', {}, {});
        consultaSucursal.cantidad = 500;
        this.addConsultaPorAlias('SUCURSAL', consultaSucursal);
        const consultaAgencia = new Consulta('TgenAgencia', 'Y', 't.nombre', {}, {});
        consultaAgencia.cantidad = 500;
        this.addConsultaPorAlias('AGENCIA', consultaAgencia);
    
    }

    /**Manejo respuesta de consulta de catalogos. */
    private manejaRespuestaCatalogos(resp: any) {
        const msgs = [];
        if (resp.cod === 'OK') {
            this.llenaListaCatalogo(this.lestado, resp.ESTADO, 'cdetalle');
            this.llenaListaCatalogo(this.lformapago, resp.FORMAPAGO, 'cdetalle');
            this.llenaListaCatalogo(this.lporcenice, resp.PORCENICE, 'cdetalle');
            this.llenaListaCatalogo(this.lporceniva, resp.PORCENIVA, 'cdetalle');
            this.llenaListaCatalogo(this.ltipodoc, resp.TIPODOC, 'cdetalle');
            this.llenaListaCatalogo(this.lsucursales, resp.SUCURSAL, 'csucursal');
            this.lagenciastotal = resp.AGENCIA;
        }
        this.lconsulta = [];
    }

    fijarListaAgencias() {
        this.lagencias = [];
        this.lagencias.push({label: '...', value: null});
        for (const i in this.lagenciastotal) {
          if (this.lagenciastotal.hasOwnProperty(i)) {
            const reg: any = this.lagenciastotal[i];
            if (reg !== undefined && reg.value !== null && reg.csucursal === Number(this.registro.csucursalingreso)) {
              this.lagencias.push({label: reg.nombre, value: reg.cagencia});
            }
          }
        }        
    }

    calcularChanges() {
        if (this.registro.subtotalsinimpuestos === 0) {
            super.mostrarMensajeError('El valor del subtotal con iva no puede ser cero');
            return;
        }
        else {
            if (this.registro.porcentajeicecdetalle !== undefined || this.registro.porcentajeicecdetalle != null) {
                if (this.registro.porcentajeicecdetalle !== "ICE0") {
                    var porcentajeICE = parseFloat(this.lporcenice.find(x => x.value === this.registro.porcentajeicecdetalle).label);
                    this.registro.montoice = porcentajeICE * parseFloat(this.registro.subtotalsinimpuestos) / 100;
                }
                else {
                    this.registro.montoice = 0;
                }                
            }
            else {
                this.registro.montoice = 0;
            }

            this.registro.baseimponible = parseFloat(this.registro.montoice) + parseFloat(this.registro.subtotalsinimpuestos);
            if (this.registro.porcentajeivacdetalle !== undefined || this.registro.porcentajeivacdetalle != null) {
                var porcentajeIVA = this.lporceniva.find(x => x.value === this.registro.porcentajeivacdetalle);
                this.registro.montoiva = parseFloat(porcentajeIVA.label) * parseFloat(this.registro.baseimponible) / 100;
            }
            this.registro.total = parseFloat(this.registro.baseimponible) + parseFloat(this.registro.montoiva);
        }
    }

    /**Muestra lov de plantillas contables */
    mostrarlovplantillasComprobante(): void {
        this.lovplantillasComprobante.mfiltros.tipomovimientocdetalle = 'CXC';
        this.lovplantillasComprobante.showDialog();
        this.registro.porcentajeicecdetalle = 'ICE0';
        this.registro.porcentajeivacdetalle = 'IVA12';
        this.registro.tipodocumentocdetalle = 'FACTUR';
    }

    /**Retorno de lov de plantillas contables. */
    fijarLovPlantillasComprobanteSelec(reg: any): void {
        if (reg.registro !== undefined) {
        this.registro.mdatos.pnombre = reg.registro.nombre;
        this.registro.cplantilla = reg.registro.cplantilla;
        }
    }

    descargarReporte(): void {
        if (this.registro.cctaporcobrar === undefined) {
          super.mostrarMensajeError('Por favor seleccione una cuenta por pagar');
          return;
        }
    
        this.jasper.nombreArchivo = "cxc_" + this.registro.cctaporcobrar;
        if (this.mcampos.nombre === undefined) {
          this.mcampos.nombre = '';
        }
    
        if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
          this.mcampos.rol = -1
        }
    
        // Agregar parametros
        this.jasper.parametros['@i_ccuentaPorCobrar'] = this.registro.cctaporcobrar;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ContConsultaCuentaxCobrar';
        this.jasper.generaReporteCore();
      }
}
