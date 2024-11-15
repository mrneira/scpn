import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-resumen-descuentos',
  templateUrl: 'resumenDescuentos.html'
})

export class ResumenDescuentosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lparticion: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcardescuentosdetalle', 'RESUMENDESCUENTOS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.particion)) {
      super.mostrarMensajeError("FECHA DE GENERACIÓN ES REQUERIDO");
      return;
    }

    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    this.rqConsulta.CODIGOCONSULTA = 'RESUMENDESCUENTOS';
    this.rqConsulta.storeprocedure = "sp_CarConResumenDescuentos";
  }

  private fijarFiltrosConsulta() {
    this.rqConsulta.parametro_particion = this.mcampos.particion;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const consultaPar = new Consulta('TcarDescuentos', 'Y', 't.particion', {}, {});
    consultaPar.cantidad = 500;
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
        componentehijo.lparticion.push({ label: nombre, value: reg.particion });
      }
    }
  }

  public fijarParticion(particion: any) {
    const anio = particion.toString().substring(0, 4);
    const inimes = particion.toString().substring(4, 5);
    let mes = '';
    if (inimes === "0") {
      mes = this.componentehijo.lmeses.find(x => x.value === particion.toString().substring(5, 6)).label;
    } else {
      mes = this.componentehijo.lmeses.find(x => x.value === particion.toString().substring(4, 6)).label;
    }
    return anio + ' - ' + mes;
  }

  imprimir(resp: any): void {
    if (!this.estaVacio(this.mcampos.particion)) {
      // Agregar parametros
      this.jasper.formatoexportar = resp;
      this.jasper.parametros['@particion'] = this.mcampos.particion;
      switch (this.mcampos.tipo) {
        case 'R':
          this.jasper.nombreArchivo = 'ResumenDescuentos_' + this.mcampos.particion;
          this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarDescuentosResumen';
          break;
        case 'D':
          this.jasper.nombreArchivo = 'DetalleDescuentos_' + this.mcampos.particion;
          this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaListadoDescuentosRubros';
          break;
      }
      this.jasper.generaReporteCore();
    } else {
      this.mostrarMensajeError("FECHA DE DESCUENTO ES REQUERIDO");
    }
  }

}
