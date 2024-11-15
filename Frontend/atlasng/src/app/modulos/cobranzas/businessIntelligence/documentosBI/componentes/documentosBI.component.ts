import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { AccionesReporteComponent } from './../../../../../util/shared/componentes/accionesReporte.component';

@Component({
  selector: 'app-documentos-BI',
  templateUrl: 'documentosBI.html'
})
export class DocumentosBIComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(AccionesReporteComponent)
  accionesReporteComponent: AccionesReporteComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenDocumentosBI', 'DOCBI', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.cmodulo = sessionStorage.getItem('m');;
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cdocumento', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgendocumentosbi', 'cdocumento', 'numerodocumento', 't.cdocumento = i.cdocumento and i.cmodulo = t.cmodulo');
    consulta.addSubquery('tgendocumentosbi', 'nombre', 'nnombre', 't.cdocumento = i.cdocumento and i.cmodulo = t.cmodulo');
    consulta.addSubquery('tgendocumentosbi', 'descripcion', 'ndescripcion', 't.cdocumento = i.cdocumento and i.cmodulo = t.cmodulo');
    consulta.addSubquery('tgendocumentosbi', 'reporte', 'nreporte', 't.cdocumento = i.cdocumento and i.cmodulo = t.cmodulo');

    this.addConsulta(consulta);
    return consulta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  Descargar(reg: any, event) {
    this.rqConsulta.CODIGOCONSULTA = 'DESCARGABI';
    this.rqConsulta.mdatos.cmodulo = reg.cmodulo;
    this.rqConsulta.mdatos.cdocumento = reg.cdocumento;
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
    if (registro.extension === 'xls1') {
      window.open(bloburl);
    } else {
      linkElement.href = bloburl;
      linkElement.download = registro.nombre;
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
