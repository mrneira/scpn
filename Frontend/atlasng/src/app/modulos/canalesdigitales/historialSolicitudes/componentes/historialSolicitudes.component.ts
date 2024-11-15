import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Consulta } from "app/util/dto/dto.component";
import { DtoServicios } from "app/util/servicios/dto.servicios";
import { BaseComponent } from "app/util/shared/componentes/base.component";

@Component({
    selector: 'app-historial-solicitudes',
    templateUrl: 'historialSolicitudes.html'
})
export class HistorialSolicitudesComponent extends BaseComponent implements OnInit {
    @ViewChild('formFiltros') formFiltros: NgForm;

    finicio: Date = new Date();
    ffin: Date = new Date();
    tipoProducto: string = 'EME';
    mostrarEmergente: boolean;
    titleDialogo: string;

    constructor(
        router: Router, 
        dtoServicios: DtoServicios
    ) {
        super(router, dtoServicios, 'TcanAgendamiento', 'TCANAGENDAMIENTO', false, false);
        this.componentehijo = this;
    }

    ngOnInit(): void {
        super.init(this.formFiltros);
        this.cargarTabla('EME')
    }

    cargarTabla(opcion: string) {
        this.tipoProducto = opcion;
        this.consultar();
    }


    // Inicia CONSULTA *********************
    consultar() {
        if (!this.validaFiltrosConsulta()) {
            return;
        }
        this.encerarConsulta();
        this.lregistros = [];
        this.mfiltros = {};
        this.mfiltrosesp = {};

        if (this.tipoProducto == 'EME') {
            this.mostrarEmergente = true;
            this.crearDtoConsultaEmergentes();
        } else if (this.tipoProducto == 'ORD') {
            this.mostrarEmergente = false;
            this.crearDtoConsultaOrdinarios();
        }
        
        super.consultar();
    }

    public crearDtoConsultaEmergentes(): Consulta {
        const cproducto: number = 1;
        const ctipoproducto: number = 3;
        this.fijarFiltrosConsultaEmergentes();
        const consulta = new Consulta('TcanSolicitud', 'Y', 'fingreso desc', this.mfiltros, this.mfiltrosesp);
        consulta.addSubqueryPorSentencia(`SELECT p.identificacion FROM  tperpersonadetalle p, tcanusuario u WHERE p.cpersona = u.cpersona AND u.cusuario = t.cusuario AND p.verreg = 0`, 'identificacion');
        consulta.addSubqueryPorSentencia(`SELECT p.nombre FROM  tperpersonadetalle p, tcanusuario u WHERE p.cpersona = u.cpersona AND u.cusuario = t.cusuario AND p.verreg = 0`, 'npersona');
        consulta.addSubquery('tcarproducto', 'nombre', 'nproducto', `i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto} and i.cmodulo = 7 and i.verreg = 0`);
        consulta.addSubquery('tcansolicituddetalle', 'montosolicitado', 'montosolicitado', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.addSubquery('tcansolicituddetalle', 'plazosolicitado', 'plazosolicitado', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.addSubquery('tcansolicituddetalle', 'sueldo', 'sueldo', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.addSubquery('tcansolicituddetalle', 'rancho', 'rancho', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.addSubquery('tcansolicituddetalle', 'otrosingresos', 'otrosingresos', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.addSubquery('tcansolicituddetalle', 'cesantia', 'cesantia', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.addSubquery('tcansolicituddetalle', 'isspol', 'isspol', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.addSubquery('tcansolicituddetalle', 'retenciones', 'retenciones', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.addSubquery('tcansolicituddetalle', 'buro', 'buro', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.addSubquery('tcansolicituddetalle', 'capacidadpago', 'capacidadpago', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.addSubquery('tcansolicituddetalle', 'identificacionconyuge', 'identificacionconyuge', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.addSubquery('tcansolicituddetalle', 'nombreconyuge', 'nombreconyuge', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.addSubquery('tcansolicituddetalle', 'espolicia', 'espolicia', `i.csolicitud = t.csolicitud and i.cproducto = ${cproducto} and i.ctipoproducto = ${ctipoproducto}`);
        consulta.cantidad = 50;
        this.addConsulta(consulta);
        return consulta;
    }

    fijarFiltrosConsultaEmergentes(){
        const cproducto: number = 1;
        const ctipoproducto: number = 3;
        var fechaFin  = new Date();
        fechaFin.setDate(this.ffin.getDate()+1);
        const fechaInicioString : string = super.calendarToFechaString(this.finicio);
        const fechaFinString : string =  super.calendarToFechaString(fechaFin);

        this.mfiltrosesp.csolicitud = ` IN (SELECT t2.csolicitud FROM tcansolicituddetalle t2 WHERE t2.cproducto = ${cproducto} AND t2.ctipoproducto = ${ctipoproducto} AND t2.montosolicitado IS NOT NULL) AND t.csolicitud NOT IN (SELECT t3.csolicitud FROM tcanagendamiento t3 WHERE t3.cproducto = ${cproducto} AND t3.ctipoproducto = ${ctipoproducto})`;
        this.mfiltrosesp.fingreso = ` BETWEEN CONVERT(DATETIME, '${fechaInicioString}', 102) AND CONVERT(DATETIME, '${fechaFinString}', 102)`;
    }

    public crearDtoConsultaOrdinarios(): Consulta {
        this.fijarFiltrosConsultaOrdinarios();
        const consulta = new Consulta(this.entityBean, 'Y', 'fecha desc', this.mfiltros, this.mfiltrosesp);
        consulta.addSubquery('TcanHorarioAtencion', 'cagencia', 'cagencia', 'i.chorario=t.chorario');
        consulta.addSubquery('TcanHorarioAtencion', 'csucursal', 'csucursal', 'i.chorario=t.chorario');
        consulta.addSubquery('TcanHorarioAtencion', 'ccompania', 'ccompania', 'i.chorario=t.chorario');
        consulta.addSubquery('tcanhorarioatencion', 'fatencion', 'fecha', 'i.chorario = t.chorario');
        consulta.addSubquery('tperpersonadetalle', 'identificacion', 'identificacion', 'i.cpersona = t.cpersona and i.verreg = 0');
        consulta.addSubquery('tperpersonadetalle', 'nombre', 'npersona', 'i.cpersona = t.cpersona and i.verreg = 0');
        consulta.addSubquery('tcarproducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto and i.cmodulo = 7 and i.verreg = 0');
        consulta.addSubquery('tcansolicituddetalle', 'montosolicitado', 'montosolicitado', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.addSubquery('tcansolicituddetalle', 'plazosolicitado', 'plazosolicitado', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.addSubquery('tcansolicituddetalle', 'sueldo', 'sueldo', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.addSubquery('tcansolicituddetalle', 'rancho', 'rancho', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.addSubquery('tcansolicituddetalle', 'otrosingresos', 'otrosingresos', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.addSubquery('tcansolicituddetalle', 'cesantia', 'cesantia', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.addSubquery('tcansolicituddetalle', 'isspol', 'isspol', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.addSubquery('tcansolicituddetalle', 'retenciones', 'retenciones', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.addSubquery('tcansolicituddetalle', 'buro', 'buro', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.addSubquery('tcansolicituddetalle', 'capacidadpago', 'capacidadpago', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.addSubquery('tcansolicituddetalle', 'identificacionconyuge', 'identificacionconyuge', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.addSubquery('tcansolicituddetalle', 'nombreconyuge', 'nombreconyuge', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.addSubquery('tcansolicituddetalle', 'espolicia', 'espolicia', 'i.csolicitud = t.csolicitud and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
        consulta.cantidad = 50;
        this.addConsulta(consulta);
        return consulta;
    }

    private fijarFiltrosConsultaOrdinarios() {
        const fechaInicioInteger = super.fechaToInteger(this.finicio);
        const fechaFinInteger = super.fechaToInteger(this.ffin);
        const cagencia = this.dtoServicios.mradicacion.cagencia;
        const csucursal = this.dtoServicios.mradicacion.csucursal;
        const ccompania = this.dtoServicios.mradicacion.ccompania;

        this.mfiltros.agendado = true;
        this.mfiltrosesp.chorario = ` IN (SELECT t2.chorario from tcanhorarioatencion t2 where t2.cagencia = ${cagencia} and t2.csucursal = ${csucursal} and t2.ccompania = ${ccompania} and (t2.fatencion >= ${fechaInicioInteger} and t2.fatencion <= ${fechaFinInteger}))`;
    }


    validaFiltrosConsulta(): boolean {
        if (this.finicio == null) {
            super.mostrarMensajeError('FECHAS INCORRECTAS, LA FECHA DE INICIO ES REQUERIDA');
            return false;
        }
        if (this.ffin == null) {
            super.mostrarMensajeError('FECHAS INCORRECTAS, LA FECHA FIN ES REQUERIDA');
            return false;
        }
        if (super.fechaToInteger(this.finicio) > super.fechaToInteger(this.ffin)) {
            super.mostrarMensajeError('FECHAS INCORRECTAS, LA FECHA DE INICIO DEBE SER MENOR O IGUAL A LA FECHA FIN');
            return false;
        }
        // if (super.fechaToInteger(this.ffin) > super.fechaToInteger(new Date())) {
        //     super.mostrarMensajeError('FECHAS INCORRECTAS, LA FECHA FIN DEBE SER MENOR O IGUAL A LA FECHA ACTUAL');
        //     return false;
        // }
        return true;
    }

    public postQuery(resp: any) {
        super.postQueryEntityBean(resp);
    }
    //Fin CONSULTA

    //Inicio MANTENIMIENTO

    public selectRegistro(registro: any) {
        this.titleDialogo = `Historial de solicitud`;
        super.selectRegistro(registro);
    }

    cancelar() {
        super.cancelar();
    }

    //Fin MANTENIMIENTO
}