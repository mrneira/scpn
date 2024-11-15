import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../util/dto/dto.component";
import { Mantenimiento } from "../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";

import { ProductosComponent } from "../submodulos/productos/componentes/_productos.component";
import { RequisitosComponent } from "../submodulos/requisitos/componentes/_requisitos.component";
import { DocumentoComponent } from "../submodulos/documento/componentes/_documento.component";
import { ProductosPermitidosComponent } from './../submodulos/productospermitidos/componentes/_productospermitidos.component';

@Component({
  selector: "app-producto-ingreso",
  templateUrl: "productoIngreso.html"
})
export class ProductoIngresoComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild("formFiltros") formFiltros: NgForm;

  @ViewChild(ProductosComponent)
  productosComponent: ProductosComponent;

  @ViewChild(RequisitosComponent)
  requisitosComponent: RequisitosComponent;

  @ViewChild(DocumentoComponent)
  documentoComponent: DocumentoComponent;

  @ViewChild(ProductosPermitidosComponent)
  prodPermitidosComponent: ProductosPermitidosComponent;

  public lproducto: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproductototal: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproducto: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, "ABSTRACT", "CREAPRODUCTOS", false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() { }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conProductos = this.productosComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.productosComponent.alias, conProductos);

    const conRequisitos = this.requisitosComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.requisitosComponent.alias, conRequisitos);

    const conDocumento = this.documentoComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.documentoComponent.alias, conDocumento);

    const conProdPermitidos = this.prodPermitidosComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.prodPermitidosComponent.alias, conProdPermitidos);
  }

  private fijarFiltrosConsulta() {
    this.productosComponent.fijarFiltrosConsulta();
    this.requisitosComponent.fijarFiltrosConsulta();
    this.documentoComponent.fijarFiltrosConsulta();
    this.prodPermitidosComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return (
      this.productosComponent.validaFiltrosRequeridos() &&
      this.requisitosComponent.validaFiltrosRequeridos() &&
      this.documentoComponent.validaFiltrosRequeridos() &&
      this.prodPermitidosComponent.validaFiltrosRequeridos()
    );
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.productosComponent.postQuery(resp);
    this.requisitosComponent.postQuery(resp);
    this.documentoComponent.postQuery(resp);
    this.prodPermitidosComponent.postQuery(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.registro.ctipoproducto = this.mfiltros.ctipoproducto;
    super.registrarEtiqueta(this.registro, this.ltipoproducto, "ctipoproducto", "ntipoproducto");

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.productosComponent.registro.cmodulo = 7;
    this.productosComponent.registro.cproducto = this.mfiltros.cproducto;
    this.productosComponent.registro.ctipoproducto = this.mfiltros.ctipoproducto;
    this.productosComponent.registro.nombre = this.registro.mdatos.ntipoproducto;
    this.productosComponent.registro.mantieneplazo = true;
    this.productosComponent.registro.periodicidadcapital = 1;
    this.productosComponent.registro.tasasegmento = false;
    this.productosComponent.registro.tasasegmentofrec = false;
    super.addMantenimientoPorAlias(this.productosComponent.alias, this.productosComponent.getMantenimiento(1));

    this.requisitosComponent.registro.cmodulo = 7;
    this.requisitosComponent.registro.cproducto = this.mfiltros.cproducto;
    this.requisitosComponent.registro.ctipoproducto = this.mfiltros.ctipoproducto;
    super.addMantenimientoPorAlias(this.requisitosComponent.alias, this.requisitosComponent.getMantenimiento(2));

    this.documentoComponent.registro.cmodulo = 7;
    this.documentoComponent.registro.cproducto = this.mfiltros.cproducto;
    this.documentoComponent.registro.ctipoproducto = this.mfiltros.ctipoproducto;
    this.addMantenimientoPorAlias(this.documentoComponent.alias, this.documentoComponent.getMantenimiento(3));

    this.prodPermitidosComponent.registro.cmodulo = 7;
    this.prodPermitidosComponent.registro.cproducto = this.mfiltros.cproducto;
    this.prodPermitidosComponent.registro.ctipoproducto = this.mfiltros.ctipoproducto;
    super.addMantenimientoPorAlias(this.prodPermitidosComponent.alias, this.prodPermitidosComponent.getMantenimiento(4));

    super.grabar();
  }

  validaGrabar() {
    return this.productosComponent.validaGrabar()
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    this.productosComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.productosComponent.alias));
    this.requisitosComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.requisitosComponent.alias));
    this.documentoComponent.postCommitEntityBean(this.getDtoMantenimiento(this.documentoComponent.alias));
    this.prodPermitidosComponent.postCommitEntityBean(this.getDtoMantenimiento(this.prodPermitidosComponent.alias));
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosProd: any = { cmodulo: 7 };
    const consultaProd = new Consulta("TgenProducto", "Y", "t.cproducto", mfiltrosProd, {});
    consultaProd.cantidad = 50;
    this.addConsultaPorAlias("PRODUCTO", consultaProd);

    const mfiltrosTipoProd: any = { cmodulo: 7 };
    const consultaTipoProd = new Consulta("TgenTipoProducto", "Y", "t.nombre", mfiltrosTipoProd, {});
    consultaTipoProd.cantidad = 100;
    this.addConsultaPorAlias("TIPOPRODUCTO", consultaTipoProd);

    const consultaTipoTamortizacion = new Consulta("TcarTipoTablaAmortizacion", "Y", "t.nombre", {}, {});
    consultaTipoTamortizacion.cantidad = 100;
    this.addConsultaPorAlias("TIPOTABLAAMORTIZACION", consultaTipoTamortizacion);

    const consultaBaseCal = new Consulta("TgenBaseCalculo", "Y", "t.nombre", {}, {});
    consultaBaseCal.cantidad = 50;
    this.addConsultaPorAlias("BASECALCULO", consultaBaseCal);

    const consultaFrec = new Consulta("TgenFrecuencia", "Y", "t.nombre", {}, {});
    consultaFrec.cantidad = 50;
    this.addConsultaPorAlias("FRECUENCIA", consultaFrec);

    const consultaTipoCredito = new Consulta("TgenTipoCredito", "Y", "t.nombre", {}, {});
    consultaTipoCredito.cantidad = 50;
    this.addConsultaPorAlias("TIPOCREDITO", consultaTipoCredito);

    const consultaSegmento = new Consulta("TcarSegmento", "Y", "t.nombre", {}, {});
    consultaSegmento.cantidad = 50;
    this.addConsultaPorAlias("SEGMENTO", consultaSegmento);

    const consultaMoneda = new Consulta("TgenMoneda", "Y", "t.nombre", {}, {});
    consultaMoneda.cantidad = 50;
    this.addConsultaPorAlias("MONEDA", consultaMoneda);

    const mfiltroSaldo: any = { cmodulo: 7, ctiposaldo: "CAR" };
    const consultaSaldo = new Consulta("TmonSaldo", "Y", "t.nombre", mfiltroSaldo, {});
    consultaSaldo.cantidad = 50;
    this.addConsultaPorAlias("SALDO", consultaSaldo);

    const mfiltrosDocumentos: any = { 'activo': true, cmodulo: 7 };
    const consultaDocumentos = new Consulta('tgendocumentos', 'Y', 't.nombre', mfiltrosDocumentos, {});
    consultaDocumentos.cantidad = 50;
    this.addConsultaPorAlias('DOCUMENTOS', consultaDocumentos);

    const mfiltrosFlujo: any = { 'cmodulo': 7 };
    const mfiltrosEspFlujo: any = { 'ccatalogo': "in (700,701,706)" };
    const consultaFlujo = new Consulta('TgenCatalogo', 'Y', 't.nombre', mfiltrosFlujo, mfiltrosEspFlujo);
    consultaFlujo.cantidad = 50;
    this.addConsultaPorAlias('FLUJO', consultaFlujo);

    const consultaConvenio = new Consulta("TcarConvenio", "Y", "t.nombre", {}, {});
    consultaConvenio.cantidad = 50;
    this.addConsultaPorAlias("CONVENIO", consultaConvenio);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === "OK") {
      this.llenaListaCatalogo(this.lproducto, resp.PRODUCTO, "cproducto");
      this.llenaListaCatalogo(this.productosComponent.ltablaamortizacion, resp.TIPOTABLAAMORTIZACION, "ctabla");
      this.llenaListaCatalogo(this.productosComponent.lbasecalculo, resp.BASECALCULO, "cbasecalculo");
      this.llenaListaCatalogo(this.productosComponent.lfrecuenciainteres, resp.FRECUENCIA, "cfrecuecia");
      this.llenaListaCatalogo(this.productosComponent.ltipocredito, resp.TIPOCREDITO, "ctipocredito");
      this.llenaListaCatalogo(this.productosComponent.lsegmentos, resp.SEGMENTO, "csegmento");
      this.llenaListaCatalogo(this.productosComponent.lflujo, resp.FLUJO, "ccatalogo");
      this.llenaListaCatalogo(this.productosComponent.lconvenio, resp.CONVENIO, "cconvenio");
      this.llenaListaCatalogo(this.documentoComponent.ldocumentos, resp.DOCUMENTOS, 'cdocumento')
      this.llenaListaCatalogo(this.prodPermitidosComponent.lproducto, resp.PRODUCTO, "cproducto");
      this.ltipoproductototal = resp.TIPOPRODUCTO;
      this.prodPermitidosComponent.ltipoproductototal = resp.TIPOPRODUCTO;
    }
    this.lconsulta = [];
  }

  limpiar() {
    this.ltipoproducto = [];
    this.mfiltros.ctipoproducto = null;
    this.productosComponent.mfiltros.cproducto = 0;
    this.requisitosComponent.mfiltros.cproducto = 0;
    this.documentoComponent.mfiltros.cproducto = 0;
    this.prodPermitidosComponent.mfiltros.cproducto = 0;
    this.consultar();
  }

  cambiarTipoProducto(event: any): any {
    if (this.mfiltros.cproducto === undefined || this.mfiltros.cproducto === null) {
      this.limpiar();
      return;
    }
    this.fijarListaTipoProducto(Number(event.value));
  }

  fijarListaTipoProducto(cproducto: any) {
    this.ltipoproducto = [];

    for (const i in this.ltipoproductototal) {
      if (this.ltipoproductototal.hasOwnProperty(i)) {
        const reg: any = this.ltipoproductototal[i];
        if (reg !== undefined && reg.value !== null && reg.cproducto === Number(cproducto)) {
          this.ltipoproducto.push({ label: reg.nombre, value: reg.ctipoproducto });
        }
      }
    }

    this.mfiltros.ctipoproducto = null;
    if (this.ltipoproducto.length <= 0) {
      this.ltipoproducto.push({ label: "...", value: null });
    } else {
      this.llenaListaTipoProducto(this.ltipoproducto, this.componentehijo);
    }
  }

  public llenaListaTipoProducto(pLista: any, componentehijo = null) {
    if (pLista.length === 0) {
      componentehijo.mfiltros.ctipoproducto = null;
      componentehijo.ltipoproducto = [];
      componentehijo.mostrarMensajeError("NO EXISTE DATOS DE TIPO PRODUCTO PARA EL PRODUCTO SELECCIONADO");
      return;
    }

    componentehijo.mfiltros.ctipoproducto = pLista[0].value;
    componentehijo.productosComponent.mfiltros.cproducto = componentehijo.mfiltros.cproducto;
    componentehijo.productosComponent.mfiltros.ctipoproducto = pLista[0].value;

    componentehijo.requisitosComponent.mfiltros.cproducto = componentehijo.mfiltros.cproducto;
    componentehijo.requisitosComponent.mfiltros.ctipoproducto = pLista[0].value;

    componentehijo.documentoComponent.mfiltros.cproducto = componentehijo.mfiltros.cproducto;
    componentehijo.documentoComponent.mfiltros.ctipoproducto = pLista[0].value;

    componentehijo.prodPermitidosComponent.mfiltros.cproducto = componentehijo.mfiltros.cproducto;
    componentehijo.prodPermitidosComponent.mfiltros.ctipoproducto = pLista[0].value;

    componentehijo.consultar();
  }

  mostrar(event: any): any {
    if (this.mfiltros.ctipoproducto === undefined || this.mfiltros.ctipoproducto === null) {
      return;
    }
    this.productosComponent.mfiltros.cmodulo = 7;
    this.productosComponent.mfiltros.cproducto = this.mfiltros.cproducto;
    this.productosComponent.mfiltros.ctipoproducto = this.mfiltros.ctipoproducto;

    this.requisitosComponent.mfiltros.cmodulo = 7;
    this.requisitosComponent.mfiltros.cproducto = this.mfiltros.cproducto;
    this.requisitosComponent.mfiltros.ctipoproducto = this.mfiltros.ctipoproducto;

    this.documentoComponent.mfiltros.cmodulo = 7;
    this.documentoComponent.mfiltros.cproducto = this.mfiltros.cproducto;
    this.documentoComponent.mfiltros.ctipoproducto = this.mfiltros.ctipoproducto;

    this.prodPermitidosComponent.mfiltros.cmodulo = 7;
    this.prodPermitidosComponent.mfiltros.cproducto = this.mfiltros.cproducto;
    this.prodPermitidosComponent.mfiltros.ctipoproducto = this.mfiltros.ctipoproducto;

    this.consultar();
  }
}
