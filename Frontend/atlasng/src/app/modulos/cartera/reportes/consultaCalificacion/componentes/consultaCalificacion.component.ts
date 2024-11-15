import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ProductosComponent } from "../../../productos/productoingreso/submodulos/productos/componentes/_productos.component";
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'consultaCalificacion.html'
})
export class ConsultaCalificacionReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  private lovpersonas: LovPersonasComponent;

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public lproducto: SelectItem[] = [{ label: "...", value: null }];
  public lmeses: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproductototal: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproducto: SelectItem[] = [{ label: "...", value: null }];
  public valoradio = null;

  @ViewChild(ProductosComponent)
  productosComponent: ProductosComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'REPORTECONSULTA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.valoradio = 'prov';
    this.consultarCatalogos();
    this.mcampos.anio = this.anioactual;
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();
    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }
  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {
    if (this.estaVacio(this.mcampos.anio) || this.estaVacio(this.mcampos.mescdetalle)) {
      super.mostrarMensajeError("FILTROS DE CONSULTA REQUERIDOS");
      return;
    }

    this.jasper.nombreArchivo = 'ReporteCalificacion';
    var d = new Date(this.mcampos.anio, (Number(this.mcampos.mescdetalle)), 1)
    d.setDate(d.getDate() - 1);
    const FFin = this.mcampos.anio + this.mcampos.mescdetalle + d.getDate();
    if (this.valoradio === 'prov') {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaListadoCalificacionDetalle';

    } else {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaListadoCalificacion';
    }
    this.jasper.formatoexportar = resp;
    this.jasper.parametros['@i_finicio'] = Number(FFin);
    this.jasper.generaReporteCore();

  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

}
