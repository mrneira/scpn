import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Consulta } from 'app/util/dto/dto.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { BaseComponent } from 'app/util/shared/componentes/base.component';

@Component({
    selector: 'app-disponibilidad-emergente',
    templateUrl: 'disponibilidadEmergente.html'
})
export class DisponibilidadEmergenteComponent extends BaseComponent implements OnInit {

    constructor(
        router: Router,
        dtoServicios: DtoServicios
    ) {
        super(router, dtoServicios, 'TcanParametro', 'TCANPARAMETRO', false, false);
        this.componentehijo = this;
    }

    ngOnInit(): void {
        this.consultar();
    }

    // INICIO CONSULTA DATOS
    consultar() {
        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta(): Consulta {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'N', 't.cparametro', this.mfiltros, this.mfiltrosesp);
        this.addConsulta(consulta);
        return consulta;
    }

    private fijarFiltrosConsulta() {
        this.mfiltros.cparametro = 'DISPONIBILIDAD-CREDITO-EMERGENTE';
    }

    validaFiltrosConsulta(): boolean {
        return super.validaFiltrosConsulta();
    }

    public postQuery(resp: any) {
        const fechasArray = resp.TCANPARAMETRO.valor.split('/')
        resp.TCANPARAMETRO.mdatos.finicio = super.stringToFecha(fechasArray[0]);
        resp.TCANPARAMETRO.mdatos.ffin = super.stringToFecha(fechasArray[1]);
        super.postQueryEntityBean(resp);

    }
    // FIN CONSULTA DATOS

    // Inicia MANTENIMIENTO *********************
    grabar(): void {
        if (!this.validarData()) {
            return;
        }
        this.rqMantenimiento.mdatos.finicio = this.registro.mdatos.finicio;
        this.rqMantenimiento.mdatos.ffin = this.registro.mdatos.ffin;
        this.crearDtoMantenimiento();
        super.grabar();
    }

    private validarData(): boolean {
        if (super.fechaToInteger(this.registro.mdatos.finicio) > super.fechaToInteger(this.registro.mdatos.ffin)) { 
            super.mostrarMensajeError('FECHAS INCORRECTAS, LA FECHA DE INICIO DEBE SER MENOR A LA FECHA FIN');
            return false;
        }

        return true;
    }

    public crearDtoMantenimiento() {
        const mantenimiento = super.getMantenimiento(1);
        super.addMantenimientoPorAlias(this.alias, mantenimiento);
    }

    public postCommit(resp: any) {
        super.postCommitEntityBean(resp);
    }
}
