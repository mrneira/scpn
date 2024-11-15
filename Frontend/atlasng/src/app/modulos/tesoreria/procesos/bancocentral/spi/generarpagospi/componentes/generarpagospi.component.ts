import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../../../util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";
import { JasperComponent } from "../../../../../../../util/componentes/jasper/componentes/jasper.component";
import { ConfirmationService } from "primeng/primeng";

@Component({
  selector: "app-reporte-generarpagospi",
  templateUrl: "generarpagospi.html"
})
export class GenerarPagoSpiComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros")
  formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public ltipoArchivo: SelectItem[] = [
    { label: "...", value: null },
    { label: "SPI", value: "spi" },
    //{ label: "SPI-PROVEEDOR", value: "spi-proveedor" },
    { label: "OCP", value: "ocp" }
  ];
  comportamiento: boolean = false;
  public lempresa: SelectItem[] = [{ label: "...", value: null }];
  selectedRegistros;
  selectedRegistrosApr;
  public lempresatotal: any[];
  public lhistoricopagos: any[];
  public ldetallepagos: any[];
  graba: boolean = false;
  public laprobados: any = [];
  generar: boolean = false;
  public mostrarDialogoGenericoDetalle = false;
  public lista: any = [];
  public lregistrosocp : any = [];

  public totalRegistros = 0;
  public totalOcp: Number = 0;

  constructor(
    router: Router,
    dtoServicios: DtoServicios,
    private confirmationService: ConfirmationService
  ) {
    super(router, dtoServicios, "ttestransaccion", "GENERARARCHIVO", false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.rqMantenimiento.mdatos.accion = null;
    this.consultarCatalogos();
    //this.consultar();
  }

  ngAfterViewInit() {}

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {
    this.crearDtoConsulta();
    super.consultar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  actualizar() {
    super.actualizar();
  }
  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean,"Y", "t.ctestransaccion", this.mfiltros, {} );
    consulta.addSubquery("tgenmodulo", "nombre","modulo", "i.cmodulo = t.cmodulo");
    consulta.addSubquery("tgencatalogodetalle", "nombre", "institucion", "i.ccatalogo = t.institucionccatalogo and i.cdetalle = t.institucioncdetalle ");
    consulta.addSubquery("tgencatalogodetalle", "nombre",  "tipocuenta", "i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle " );
    consulta.cantidad = 20000;
    this.addConsulta(consulta);

    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
    this.mfiltros.cestado = "8";
    switch (this.mcampos.tipoArchivo) {
      case "spi":
        this.mfiltros.tipotransaccion = "P";
        this.mfiltros.esproveedor = false;
        break;
      case "spi-proveedor":
        this.mfiltros.tipotransaccion = "P";
        this.mfiltros.esproveedor = true;
        break;
      case "ocp":
        this.mfiltros.tipotransaccion = "C";
        this.mfiltros.esproveedor = false;
        this.obtenerresumen();
        break;
      default:
        break;
    }
    console.log(this.mfiltros.tipotransaccion);
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosEmpresa: any = { verreg: 0, integracion: false };
    const conEmpresa = new Consulta(
      "ttesempresa",
      "Y",
      "t.nombre",
      mfiltrosEmpresa,
      {}
    );
    conEmpresa.cantidad = 10;
    this.addConsultaCatalogos(
      "EMPRESA",
      conEmpresa,
      this.lempresatotal,
      this.llenarEmpresa,
      "",
      this.componentehijo
    );
    var x = location.hostname;
    this.ejecutarConsultaCatalogos();
  }

  public llenarEmpresa(
    pLista: any,
    pListaResp,
    campopk,
    agregaRegistroVacio = true,
    componentehijo = null
  ): any {
    this.componentehijo.lempresatotal = pListaResp;
    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg: any = pListaResp[i];
        if (!this.componentehijo.estaVacio(reg)) {
          this.componentehijo.lempresa.push({
            label: reg.cuentaorigen + " - " + reg.nombre,
            value: reg.cempresa
          });
        }
      }
    }
  }

  seleccionarEmpresa(event: any): any {
    if (this.estaVacio(this.mcampos.cempresa)) {
      this.mcampos.cuentaorigen = null;
      this.mcampos.nombre = null;
      this.mcampos.localidad = null;
      return;
    }
    var detalle = this.lempresatotal.find(x => x.cempresa === event.value);
    this.mcampos.cuentaorigen = detalle.cuentaorigen;
    this.mcampos.nombre = detalle.nombre;
    this.mcampos.localidad = detalle.localidad;
    this.mcampos.cempresa = detalle.cempresa;
  }

  Historico(registro: any) {
    this.obtnerhistorialpagos(registro);
    this.mostrarDialogoGenerico = true;
  }

  obtnerhistorialpagos(registro) {
    this.rqConsulta.CODIGOCONSULTA = "HISTORICOPAGO";
    this.rqConsulta.storeprocedure = "sp_TesConObtenerHistorialPagos";
    this.rqConsulta.parametro_ctestransaccion = registro.ctestransaccion;
    this.rqConsulta.parametro_verreg = -1;
    this.rqConsulta.parametro_tipotransaccion = this.mfiltros.tipotransaccion;
    this.msgs = [];

    this.dtoServicios
      .ejecutarConsultaRest(this.getRequestConsulta("C"))
      .subscribe(
        resp => {
          this.manejaRespuestaHistorial(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        }
      );
  }

  private manejaRespuestaHistorial(resp: any) {
    this.lhistoricopagos = [];
    if (resp.cod === "OK") {
      this.lhistoricopagos = resp.HISTORICOPAGO;
      this.rqConsulta = { mdatos: {} };
    }
  }

  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento
    if (this.mcampos.tipoArchivo === 'spi'){
      this.rqMantenimiento.mdatos.GENERARARCHIVO = this.lregistros;
    }
    else {
      //let listaOcp = this.listaOcp(this.lregistros);
      this.rqMantenimiento.mdatos.GENERARARCHIVO = 'ocp';
    }
    this.rqMantenimiento.mdatos.cempresa = this.mcampos.cempresa;
    this.rqMantenimiento.mdatos.tipoArchivo = this.mcampos.tipoArchivo;
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  public listaOcp(registro: any): any{
    this.lista = [];
    for (const i in registro) {
      if (registro.hasOwnProperty(i)) {
        const reg: any = registro[i];
        this.lista.push(reg.ctestransaccion)
      }
    }
    return this.lista;
  }

  LimpiarRegistros(){
    this.lregistros=[];
    this.lregistrosocp=[];
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      if (resp.eliminado === "OK") {
        this.enproceso = false;
        this.consultar();
      }
      if (resp.spi === "OK" || resp.ocp === "OK") {
        this.rqMantenimiento.mdatos.accion = null;
        this.selectedRegistros = [];
        this.laprobados = [];
        for (const i in resp.spigenerado) {
          if (resp.spigenerado.hasOwnProperty(i)) {
            this.registro.nombre = resp.spigenerado[i].nombre;
        this.registro.tipo = resp.spigenerado[i].tipo;
        this.registro.archivoDescarga = resp.spigenerado[i].contenido;
        this.registro.extension = resp.spigenerado[i].extension;
        this.descargaAdjunto(this.registro);
          }
        }
        this.enproceso = false;
        this.consultar();
      }
    }
  }

  descargaAdjunto(registro: any) {
    const linkElement = document.createElement("a");
    let bytes = registro.archivoDescarga;
    let base = this.arrayBufferToBase64(bytes);
    var blob = new Blob([this.base64ToArrayBuffer(bytes)], {
      type: registro.tipo
    });
    const bloburl = URL.createObjectURL(blob);
    if (registro.extension === "pdf") {
      window.open(bloburl);
    } else {
      linkElement.href = bloburl;
      linkElement.download = registro.nombre;
      //  linkElement.click();
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: false
      });
      linkElement.dispatchEvent(clickEvent);
    }
  }

  arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  tomarRegistrosGenerar(): boolean {
    this.graba = false;
    this.rqMantenimiento.mdatos.accion = "generar";
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        reg.mdatos.generar = true;
        this.graba = true;
      }
    }
    if (
      this.selectedRegistros === undefined ||
      this.selectedRegistros.length === 0
    ) {
      this.graba = false;
    }
    return this.graba;
  }

  tomarRegistrosEliminar(registro: any): boolean {
    this.graba = false;
    this.rqMantenimiento.mdatos.accion = "eliminar";
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        if (reg.ctestransaccion === registro.ctestransaccion) {
          reg.mdatos.eliminar = true;
          this.graba = true;
        } else {
          reg.mdatos.eliminar = false;
          this.graba = true;
        }
      }
    }
    if (this.lregistros === undefined || this.lregistros.length === 0) {
      this.graba = false;
    }
    return this.graba;
  }

  GenerarArchivo() {
    if (this.estaVacio(this.mcampos.cempresa)) {
      this.mostrarMensajeError("INSTITUCIÓN DE ORIGEN DE PAGO REQUERIDA");
      return;
    }
    if (this.mcampos.tipoArchivo === 'spi') {
      this.confirmationService.confirm({
        message:
          "Está seguro de generar el archivo por el valor de: " +
          this.getTotal() +
          " ?",
        header: "Confirmación",
        accept: () => {
          this.rqMantenimiento.mdatos.accion = "generar";
          this.grabar();
        }
      });
    }
    else{
      this.confirmationService.confirm({
        message:
          "Está seguro de generar el archivo OCP ?",
        header: "Confirmación",
        accept: () => {
          this.rqMantenimiento.mdatos.accion = "generar";
          this.grabar();
        }
      });
    }
  }

  getTotal(): Number {
    let total = 0;

    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        total = super.redondear(total + reg.valorpago, 2);
      }
    }

    if (total > 0) {
      this.mcampos.total = total;
    }

    return total;
  }

  getTotalApr(): Number {
    let total = 0;

    for (const i in this.laprobados) {
      if (this.laprobados.hasOwnProperty(i)) {
        const reg: any = this.laprobados[i];
        total = super.redondear(total + reg.valorpago, 2);
      }
    }

    if (total > 0) {
      this.mcampos.total = total;
    }

    return total;
  }

  Aprobar(): void {
    if (this.selectedRegistros === undefined) {
      this.mostrarMensajeError("NO EXISTEN REGISTROS A APROBAR");
      return;
    }
    this.getTotalApr();
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[0];
        this.laprobados.push(this.selectedRegistros[i]);
        this.lregistros.splice(this.lregistros.indexOf(reg), 1);
      }
    }
    this.selectedRegistros = [];
  }

  Proveedor(event: any): any {
    let a = event;
    this.mfiltros.esproveedor = event;
    this.laprobados = [];
    this.consultar();
  }

  eliminarpago(registro: any) {
    this.tomarRegistrosEliminar(registro);
    this.grabar();
  }

  Detalle(registro: any) {
    this.obtnerdetallepagos(registro);
    this.mostrarDialogoGenericoDetalle = true;
  }

  obtnerdetallepagos(registro) {
    this.rqConsulta.CODIGOCONSULTA = "HISTORICOPAGO";
    this.rqConsulta.storeprocedure = "sp_TesConObtenerHistorialPagos";
    this.rqConsulta.parametro_ctestransaccion = registro.ctestransaccion;
    this.rqConsulta.parametro_verreg = 0;
    this.rqConsulta.parametro_tipotransaccion = "P";
    this.msgs = [];

    this.dtoServicios
      .ejecutarConsultaRest(this.getRequestConsulta("C"))
      .subscribe(
        resp => {
          this.manejaRespuestaDetalle(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        }
      );
  }

  private manejaRespuestaDetalle(resp: any) {
    this.ldetallepagos = [];
    if (resp.cod === "OK") {
      this.ldetallepagos = resp.HISTORICOPAGO;
      this.rqConsulta = { mdatos: {} };
    }
  }

  obtenerresumen() {
    this.rqConsulta.CODIGOCONSULTA = "DETALLEOCP";
    this.rqConsulta.storeprocedure = "sp_TesConResumenOcp";
    this.rqConsulta.parametro_fcontable = this.dtoServicios.mradicacion.fcontable;
    this.rqConsulta.parametro_verreg = 0;
    this.rqConsulta.parametro_tipotransaccion = "C";
    this.rqConsulta.parametro_cestado = "8";
    this.msgs = [];

    this.dtoServicios
      .ejecutarConsultaRest(this.getRequestConsulta("C"))
      .subscribe(
        resp => {
          this.manejaRespuestaResumenOcp(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        }
      );
  }

  private manejaRespuestaResumenOcp(resp: any) {
    this.lregistrosocp = [];
    if (resp.cod === "OK") {
      this.lregistrosocp = resp.DETALLEOCP;
      this.calcularTotalesOcp(this.lregistrosocp);
      this.rqConsulta = { mdatos: {} };
    }
  }
  
  public calcularTotalesOcp(lista: any) {
    this.totalRegistros = 0;
    this.totalOcp = 0;
    for (const i in lista) {
      const reg = lista[i];
      this.totalOcp += reg.total;
      this.totalRegistros += reg.registros;
    }
  }
}
