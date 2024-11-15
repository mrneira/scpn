import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";
import { JasperComponent } from "../../../../../util/componentes/jasper/componentes/jasper.component";
import { ConfirmationService } from "primeng/primeng";

@Component({
  selector: "app-reporte-operativocontabletesoreria",
  templateUrl: "operativocontabletesoreria.html"
})
export class OperativoContableTesoreriaComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros")
  formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

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
  public lregistrosmovimientos: any = [];

  constructor(
    router: Router,
    dtoServicios: DtoServicios,
    private confirmationService: ConfirmationService
  ) {
    super(router, dtoServicios, "ABSTRACT", "OPERATIVOCONTABLETESORERIA", false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.fcontable = this.stringToFecha(
      this.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable)
    );
    this.consultarCatalogos();
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
    if (!this.validaFiltrosConsulta()) {
      return;

    }
    this.consultarOperativo();
    //super.consultar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  actualizar() {
    super.actualizar();
  }

  consultarOperativo() {
    this.rqConsulta.CODIGOCONSULTA = 'TESORERIA_OPERATIVOCONTABLE';
    this.rqConsulta.storeprocedure = "sp_TesConAuxiliarContable";
    let cempresa =  this.mcampos.cempresa;
    console.log(cempresa);
    this.rqConsulta.cempresa =  this.mcampos.cempresa;
    this.rqConsulta.fecha = this.fechaToInteger(this.mcampos.fcontable);
    this.rqConsulta.tipotransaccion = 'P';
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaReporte(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuestaReporte(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.CABECERA;
      this.lregistrosmovimientos = resp.MOVIMIENTOS;
    }
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
  ): any {
    this.componentehijo.lempresatotal = pListaResp;
    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const reg: any = pListaResp[i];
        if (!this.componentehijo.estaVacio(reg)) {
          this.componentehijo.lempresa.push({
            label: reg.cuentaorigen + " - " + reg.nombrecorresponsal,
            value: reg.cempresa
          });
        }
      }
    }
  }

  
  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
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

  
}
