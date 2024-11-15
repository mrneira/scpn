import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ProductosComponent } from "../../../productos/productoingreso/submodulos/productos/componentes/_productos.component";
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'consultaSaldosReporte.html'
})
export class ConsultaSaldosReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(ProductosComponent)
  productosComponent: ProductosComponent;

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public lproducto: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproductototal: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproducto: SelectItem[] = [{ label: "...", value: null }];
  public lagencia: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTECONSULTASOLICITUD', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fecha = new Date();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(): void {
    if (this.estaVacio(this.mcampos.cagencia)) {
      this.mcampos.cagencia = -1;
    }
    if (this.estaVacio(this.mcampos.cproducto)) {
      this.mcampos.cproducto = -1;
    }
    if (this.estaVacio(this.mcampos.ctipoproducto)) {
      this.mcampos.ctipoproducto = -1;
    }

    this.jasper.nombreArchivo = 'ReporteConsultaSaldos_' + this.fechaToInteger(this.mcampos.fecha);
    this.jasper.parametros['@fechacontable'] = this.fechaToInteger(this.mcampos.fecha);
    this.jasper.parametros['@agencia'] = this.mcampos.cagencia;
    this.jasper.parametros['@cproducto'] = this.mcampos.cproducto;
    this.jasper.parametros['@ctipoproducto'] = this.mcampos.ctipoproducto;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.formatoexportar = 'xls';

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaListadoSaldos';
    this.jasper.generaReporteCore();
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {
    const consultaAgencia = new Consulta('tgenagencia', 'Y', 't.nombre', {}, {});
    consultaAgencia.cantidad = 100;
    this.addConsultaPorAlias('AGENCIA', consultaAgencia);

    const mfiltrosProd: any = { cmodulo: 7 };
    const consultaProd = new Consulta("TgenProducto", "Y", "t.nombre", mfiltrosProd, {});
    consultaProd.cantidad = 50;
    this.addConsultaPorAlias("PRODUCTO", consultaProd);

    const mfiltrosTipoProd: any = { 'cmodulo': 7, 'activo': true, 'verreg': 0 };
    const consultaTipoProd = new Consulta('TcarProducto', 'Y', 't.nombre', mfiltrosTipoProd, {});
    consultaTipoProd.cantidad = 100;
    this.addConsultaPorAlias('TIPOPRODUCTO', consultaTipoProd);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lagencia, resp.AGENCIA, 'cagencia');
      this.llenaListaCatalogo(this.lproducto, resp.PRODUCTO, 'cproducto');
      this.ltipoproductototal = resp.TIPOPRODUCTO;
    }
    this.lconsulta = [];
  }

  public postQuery(resp: any) {
    this.fijarListaTipoProducto(this.mcampos.cproducto);
  }

  cambiarTipoProducto(event: any): any {
    this.msgs = [];

    if (this.estaVacio(this.mcampos.cproducto)) {
      this.limpiar();
      return;
    };
    this.fijarListaTipoProducto(Number(event.value));
    this.llenaListaTipoProducto(this.ltipoproducto, this.componentehijo);
  }

  limpiar() {
    this.mcampos.ctipoproducto = null;
    this.ltipoproducto = [];
  }

  fijarListaTipoProducto(cproducto: any) {
    super.limpiaLista(this.ltipoproducto);
    for (const i in this.ltipoproductototal) {
      if (this.ltipoproductototal.hasOwnProperty(i)) {
        const reg: any = this.ltipoproductototal[i];
        if (reg !== undefined && reg.value !== null && reg.cproducto === Number(cproducto)) {
          this.ltipoproducto.push({ label: reg.nombre, value: reg.ctipoproducto });
        }
      }
    }
  }

  public llenaListaTipoProducto(pLista: any, componentehijo = null) {
    if (pLista.length === 0) {
      this.limpiar();
      componentehijo.mostrarMensajeError('NO EXISTE DATOS DE TIPO PRODUCTO PARA EL PRODUCTO SELECCIONADO');
      return;
    }
    componentehijo.mcampos.ctipoproducto = pLista[0].value;
  }
}
