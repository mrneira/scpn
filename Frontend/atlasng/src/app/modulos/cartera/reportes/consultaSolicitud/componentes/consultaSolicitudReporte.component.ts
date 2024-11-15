import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ProductosComponent } from "../../../productos/productoingreso/submodulos/productos/componentes/_productos.component";
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-solicitudes-reporte',
  templateUrl: 'consultaSolicitudReporte.html'
})
export class ConsultaSolicitudReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  private lovpersonas: LovPersonasComponent;

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public lproducto: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproductototal: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproducto: SelectItem[] = [{ label: "...", value: null }];

  @ViewChild(ProductosComponent)
  productosComponent: ProductosComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTECONSULTASOLICITUD', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.finicio = new Date();
    this.mcampos.camposfecha.ffin = new Date();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  mostrarLovPersona(): void {
    this.lovpersonas.mfiltros.csocio = 1;
    this.lovpersonas.showDialog();
  }

  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;

      this.consultar();
    }
  }


  imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'ReporteConsultaSolicitud';

    if (this.mcampos.cproducto === undefined || this.mcampos.cproducto === null) {
      this.mcampos.cproducto = -1;
    }

    if (this.mcampos.estadoSolicitud === undefined || this.mcampos.estadoSolicitud === null) {
      this.mcampos.estadoSolicitud = '';
    }
    if (this.mcampos.ctipoproducto === undefined || this.mcampos.ctipoproducto === null) {
      this.mcampos.ctipoproducto = -1;
    }

    if (this.mcampos.camposfecha.finicio.toJSON() <= this.mcampos.camposfecha.ffin.toJSON()) {
      // Agregar parametros
      this.jasper.formatoexportar = resp;
      this.jasper.parametros['@i_cestatussolicitud'] = this.mcampos.estadoSolicitud;
      this.jasper.parametros['@i_FIni'] = this.fechaToInteger(this.mcampos.camposfecha.finicio);
      this.jasper.parametros['@i_FFin'] = this.fechaToInteger(this.mcampos.camposfecha.ffin);
      this.jasper.parametros['@i_cproducto'] = this.mcampos.cproducto;
      this.jasper.parametros['@i_ctipoproducto'] = this.mcampos.ctipoproducto;

      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaSolicitudListado';
      this.jasper.generaReporteCore();
    } else {
      this.mostrarMensajeError("LA FECHA HASTA DEBE SER MAYOR A LA FECHA DESDE.");
    }
  }

  //retorna fecha en formato numeros YYYYMMDD
  private Fecha(scope) {
    var Fecha = new Date(scope);
    var mes = Fecha.getMonth() + 1;
    var dia = Fecha.getDate();
    var respmes = '';
    var respdia = '';
    if (mes < 10) {
      respmes = '0'
    }
    if (dia < 10) {
      respdia = '0'
    }
    return Fecha.getFullYear().toString() + respmes + mes + respdia + dia;
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

    const consultaEstadoSolicitud = new Consulta('tcarestatussolicitud', 'Y', 't.nombre', {}, {});
    consultaEstadoSolicitud.cantidad = 100;
    this.addConsultaPorAlias('ESTADOSOLICITUD', consultaEstadoSolicitud);

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


      this.llenaListaCatalogo(this.lestado, resp.ESTADOSOLICITUD, 'cestatussolicitud');
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

    if (this.mcampos.cproducto === undefined || this.mcampos.cproducto === null) {
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
