import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'app-recaudacion-cobranzas',
    templateUrl: 'recaudacionCobranzas.html'
})

export class RecaudacionCobranzasComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild(JasperComponent)
    public jasper: JasperComponent;
    public lparticioncob: SelectItem[] = [{ label: "...", value: null }];

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'ttesrecaudaciondetalle', 'RECAUDACIONCOBRANZAS', false, false);
        this.componentehijo = this;
    }
    //MNE 20240716
    ngOnInit() {
        super.init(this.formFiltros);
        this.consultarCatalogos();
    }

    ngAfterViewInit() { }

    consultarCatalogos(): any {
        this.encerarConsultaCatalogos();
        const consultaPar = new Consulta('TcarDescuentos', 'Y', 't.particion', {}, {});
        consultaPar.cantidad = 1000;
        this.addConsultaCatalogos("TIPOPRODUCTO", consultaPar, null, this.llenarParticion, null, this.componentehijo);
        this.ejecutarConsultaCatalogos();
    }

    public llenarParticion(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
        for (const i in pListaResp) {
            if (pListaResp.hasOwnProperty(i)) {
                const reg = pListaResp[i];
                const anio = reg.particion.toString().substring(0, 4);
                const inimes = reg.particion.toString().substring(4, 5);
                let mes = '';
                if (inimes === "0") {
                    mes = this.componentehijo.lmeses.find(x => x.value === reg.particion.toString().substring(5, 6)).label;
                } else {
                    mes = this.componentehijo.lmeses.find(x => x.value === reg.particion.toString().substring(4, 6)).label;
                }
                const nombre: string = anio + ' - ' + mes;
                componentehijo.lparticioncob.push({ label: nombre, value: reg.particion });
            }
        }
    }

    public postQuery(resp: any) {
       //super.postQueryEntityBean(resp);
    }

    imprimir(): void {
        let date = new Date(parseInt(String(this.mcampos.particioncob).substring(0,4)), parseInt(String(this.mcampos.particioncob).substring(4,6)), 0);
        if (!this.estaVacio(this.mcampos.particioncob)) {
            this.jasper.formatoexportar = "xls";
            this.jasper.parametros['@i_fecha_inicio'] = this.mcampos.particioncob + "01";
            this.jasper.parametros['@i_fecha_fin'] = String(this.mcampos.particioncob) + String(date.getDate());
            this.jasper.nombreArchivo = 'Recaudacion_' + this.mcampos.particioncob + "01_a_" + this.mcampos.particioncob + date.getDate();
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Cobranzas/rptRecaudacionCobranzas';
            this.jasper.generaReporteCore();
        } else {
            this.mostrarMensajeError("DEBE SELECCIONAR UN MES DE RECAUDACIÓN");
        }
    }
}
