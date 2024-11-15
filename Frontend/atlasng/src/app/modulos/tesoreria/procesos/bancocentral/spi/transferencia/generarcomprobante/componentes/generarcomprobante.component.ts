import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../../../../util/componentes/jasper/componentes/jasper.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-reporte-generarcomprobante',
  templateUrl: 'generarcomprobante.html'
})
export class GenerarComprobanteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  comportamiento: boolean = false;
  public lempresa: SelectItem[] = [{ label: '...', value: null }];
  public lempresatotal: any[];
  graba: boolean = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttestransaccion', 'GENERARPAGOSINV', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.mfiltros.esproveedor = false;
    this.consultarCatalogos();
    this.consultar();
  }

  ngAfterViewInit() {
  }

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

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.enproceso = false;
      this.consultar();
    }
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctestransaccion', this.mfiltros, {});
    consulta.addSubquery('tgenmodulo', 'nombre', 'modulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'institucion', 'i.ccatalogo = t.institucionccatalogo and i.cdetalle = t.institucioncdetalle ');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'tipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle ');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
    this.mfiltros.cestado = 7;
    this.mfiltros.tipotransaccion = 'I';
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const mfiltrosMod: any = { activo: true, negocio: true };
    const conModulo = new Consulta('tgenmodulo', 'Y', 't.nombre', mfiltrosMod, {});
    conModulo.cantidad = 100;
    this.addConsultaCatalogos('MODULOS', conModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');

    this.ejecutarConsultaCatalogos();
  }

  Descargar(registro: any, event) {
    this.rqConsulta.CODIGOCONSULTA = 'GENERACOMPROBANTEPAGO';
    this.rqConsulta.mdatos.ctestransaccion = registro.ctestransaccion;
    this.rqConsulta.mdatos.extension = 'pdf';
    this.rqConsulta.mdatos.rutareporte = '/CesantiaReportes/Tesoreria/';
    this.rqConsulta.mdatos.tiporeporte = 'rptTes_TransferenciaBancaria';
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
    let bytes = registro.archivogenerado.contenido;
    let base = this.arrayBufferToBase64(bytes);
    var blob = new Blob([this.base64ToArrayBuffer(bytes)], { type: registro.archivogenerado.tipo });
    const bloburl = URL.createObjectURL(blob);
    if (registro.archivogenerado.extension === 'pdf1') {
      window.open(bloburl);
    } else {
      linkElement.href = bloburl;
      linkElement.download = registro.archivogenerado.nombre;
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
}
