import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Consulta } from "app/util/dto/dto.component";
import { DtoServicios } from "app/util/servicios/dto.servicios";
import { BaseComponent } from "app/util/shared/componentes/base.component";

@Component({
    selector: 'app-buzon-solicitudes',
    templateUrl: 'buzonSolicitudes.html'
})
export class BuzonSolicitudesComponent extends BaseComponent implements OnInit {
    @ViewChild('formFiltros') formFiltros: NgForm;

    hoy: Date = new Date();
    titleDialogo: string;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TcanAgendamiento', 'TCANAGENDAMIENTO', false, false);
        this.componentehijo = this;
    }

    ngOnInit(): void {
        super.init(this.formFiltros);
        this.consultar();
    }

    // Inicia CONSULTA *********************
    consultar() {
        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta(): Consulta {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.cagendamiento desc', this.mfiltros, this.mfiltrosesp);
        consulta.addSubquery('TcanHorarioAtencion', 'cagencia', 'cagencia', 'i.chorario = t.chorario');
        consulta.addSubquery('TcanHorarioAtencion', 'csucursal', 'csucursal', 'i.chorario = t.chorario');
        consulta.addSubquery('TcanHorarioAtencion', 'ccompania', 'ccompania', 'i.chorario = t.chorario');
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

    private fijarFiltrosConsulta() {
        const fechaInteger = this.fechaToInteger(new Date());
        const cagencia = this.dtoServicios.mradicacion.cagencia;
        const csucursal = this.dtoServicios.mradicacion.csucursal;
        const ccompania = this.dtoServicios.mradicacion.ccompania;

        this.mfiltros.agendado = true;
        this.mfiltros.atendido = false;
        this.mfiltrosesp.chorario = ` IN (SELECT t2.chorario from tcanhorarioatencion t2 where t2.cagencia = ${cagencia} and t2.csucursal = ${csucursal} and t2.ccompania = ${ccompania} and t2.fatencion = ${fechaInteger})`;
    }

    validaFiltrosConsulta(): boolean {
        return super.validaFiltrosConsulta();
    }

    public postQuery(resp: any) {
        super.postQueryEntityBean(resp);
    }
    //Fin CONSULTA

    //Inicio MANTENIMIENTO

    cancelar() {
        super.cancelar();
    }

    gestionar(aprobado: any = null) {
        if (aprobado != null) {
            this.rqMantenimiento.csolicitud = this.registro.csolicitud;
            this.rqMantenimiento.cproducto = this.registro.cproducto;
            this.rqMantenimiento.ctipoproducto = this.registro.ctipoproducto;
        } 

        this.rqMantenimiento.cagendamiento = this.registro.cagendamiento;
        this.rqMantenimiento.cpersona = this.registro.cpersona;
        this.rqMantenimiento.cusuario = this.registro.cusuario;
        this.rqMantenimiento.mdatos.aprobado = aprobado

        const rqMan = this.getRequestMantenimiento();
        this.dtoServicios.ejecutarRestMantenimiento(rqMan).subscribe(resp => {
            console.log(resp);
            if (resp.cod !== 'OK') {
                super.mostrarMensajeError(resp.msgusu);
                return;
            }
            super.postCommitEntityBean(resp);
            this.cancelar();
            super.mostrarMensajeSuccess("REGISTRO ACTUALIZADO CORRECTAMENTE");
    
          }, error => {
            this.dtoServicios.manejoError(error);
          });
    }

    public crearDtoMantenimiento() {
        const mantenimiento = super.getMantenimiento(1);
        super.addMantenimientoPorAlias(this.alias, mantenimiento);
    }

    public selectRegistro(registro: any) {
        this.titleDialogo = `Gestión de solicitud - ${super.integerToFormatoFecha(registro.mdatos.fecha)} - ${registro.hagendamiento}`;
        super.selectRegistro(registro);
    }

    //Fin MANTENIMIENTO
}