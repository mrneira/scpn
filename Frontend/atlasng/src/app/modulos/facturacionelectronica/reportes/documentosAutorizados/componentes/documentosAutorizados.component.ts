import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovClientesComponent } from '../../../../contabilidad/lov/clientes/componentes/lov.clientes.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-reporte-documentosAutorizados',
  templateUrl: 'documentosAutorizados.html'
})
export class DocumentosAutorizadosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovClientesComponent)
  private lovClientes: LovClientesComponent;

  public ltipodoc: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcellogdocumentos', 'CONSULTADOCUMENTOSAUTORIZADOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    //this.fijarListaAgencias();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  consultar(): void {
    if(!this.validaFiltrosConsulta()){
      return;
    }
    this.consultarDocumentos();
    //super.consultar();
  }

  descargarReporte(resp: any): void {

    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    this.jasper.nombreArchivo = 'ReporteLogDocumentosElectronicos';

    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null) {
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }

    // Agregar parametros
    //this.jasper.parametros['@i_tipo'] = this.mfiltros.ctipoproducto;
    this.jasper.parametros['@i_finicio'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_ffin'] = this.mfiltros.ffin;
    this.jasper.parametros['@i_tipoDocumento'] = this.mfiltros.tipodocumento;
    if (this.registro.cpersona != undefined) {
        this.jasper.parametros['@i_cpersona'] = this.registro.cpersona;
    }
    else {
      this.jasper.parametros['@i_cpersona'] = undefined;
    }
    this.jasper.parametros['@i_modulo'] = this.registro.modulo;
    this.jasper.formatoexportar = resp;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/FacturacionElectronica/rptCel_LogDocumentosElectronicosAutorizados';

    this.jasper.generaReporteCore();
  }

  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ltipodoc, resp.TIPODOC, 'cdetalle');
    }
    this.lconsulta = [];
  }

  llenarConsultaCatalogos(): void {
    const mfiltroTIPODOC: any = { 'ccatalogo': 1018 };
    const consultaTIPODOC = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTIPODOC, {});
    consultaTIPODOC.cantidad = 10;
    this.addConsultaPorAlias('TIPODOC', consultaTIPODOC);
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.encerarMensajes();
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  /**Muestra lov de Clientes */
  mostrarLovClientes(): void {
    this.lovClientes.mcampos.todos = true;
    this.lovClientes.showDialog();
  }

  /**Retorno de lov de Clientes. */
  fijarLovClientes(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.registro.mdatos.identificacionProv = reg.registro.identificacion;
      this.registro.mdatos.nombreProv = reg.registro.nombre;
      this.registro.cpersona = reg.registro.cpersona;
    }
  }

  //MÉTODO PARA CONSULTAR DATOS DEL DOCUMENTOS AUTORIZADOS -- COMPONENTE DE CONSULTA
  consultarDocumentos() {
    this.rqConsulta.CODIGOCONSULTA = 'DOCUMENTOSAUTORIZADOS';
    this.rqConsulta.storeprocedure = "sp_CelConLogDocElectronicosAutorizados";
    this.rqConsulta.parametro_finicio = this.mfiltros.finicio === undefined ? "" : this.mfiltros.finicio;
    this.rqConsulta.parametro_ffin = this.mfiltros.ffin === undefined ? "" : this.mfiltros.ffin;
    this.rqConsulta.parametro_tipoDocumento = this.mfiltros.tipodocumento;
    
    if (this.registro.cpersona != undefined) {
      this.rqConsulta.parametro_cpersona = this.registro.cpersona;
    }
    else {
      this.rqConsulta.parametro_cpersona = undefined;
    }
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaDocumentos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaDocumentos(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.DOCUMENTOSAUTORIZADOS;
    }
  }

  Descargar(registro: any, event) {
    this.rqConsulta.CODIGOCONSULTA = 'DESCARGACOMPROBANTE';
    this.rqConsulta.mdatos.numerodocumento = registro.numerodocumento;
    this.rqConsulta.mdatos.tipodocumento = registro.tipodocumento;
    this.rqConsulta.mdatos.tipodescarga = event.currentTarget.name;
    this.rqConsulta.mdatos.clavedeacceso = registro.clavedeacceso;
    this.rqConsulta.mdatos.modulo = registro.modulo;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.descargaAdjunto(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }
  descargaAdjunto(registro: any) {
    const linkElement = document.createElement('a');
    let bytes = registro.archivoDescarga;
    let base = this.arrayBufferToBase64(bytes);
    var blob = new Blob([this.base64ToArrayBuffer(bytes)], { type: registro.tipo });
    const bloburl = URL.createObjectURL(blob);
    if (registro.extension === 'pdf') {
      window.open(bloburl);
    } else {
      linkElement.href = bloburl;
      linkElement.download = registro.nombre;
      //  linkElement.click();
      const clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': false
      });
      linkElement.dispatchEvent(clickEvent);
    }
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
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

  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();

  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  enviarmail(registro: any) {
    this.rqMantenimiento = [];
    this.rqMantenimiento.mdatos = {};
    
    let lmails = registro.email;
    this.rqMantenimiento.mdatos.lmails = lmails;
    this.rqMantenimiento.mdatos.comprobanteElectronico = true;
    this.rqMantenimiento.mdatos.cnotificacion = 7;
    this.rqMantenimiento.mdatos.numerodocumento = registro.numerodocumento;
    this.rqMantenimiento.mdatos.tipodocumento = registro.tipodocumento;
    this.rqMantenimiento.mdatos.clavedeacceso = registro.clavedeacceso;
    this.rqMantenimiento.mdatos.nombre = registro.nombre;
    super.grabar();
  }

}
