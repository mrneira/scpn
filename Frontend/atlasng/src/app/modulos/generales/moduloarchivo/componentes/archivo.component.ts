import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-archivo',
  templateUrl: 'archivo.html'
})

export class ArchivoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public lcharSeparacion: SelectItem[] = [{ label: '...', value: null }];

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  public mdatosarchivosngstr = {};
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'TMODULOARCHIVO', false, false);
    this.componentehijo = this;
  }
registroarchivo:any;
  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    //No aplica
  }

  actualizar() {
    //No aplica
  }

  eliminar() {
    //No aplica 
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.rqConsulta.CODIGOCONSULTA = 'LISTAARCHIVOS';
    this.rqConsulta.mdatos.cmodulo = sessionStorage.getItem('m');
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaArchivos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

  }

  manejaRespuestaArchivos(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
        this.lregistros=resp.lista;
    }
  }
  consultarDatos(registro: any){
    this.rqConsulta.CODIGOCONSULTA = 'REGISTROARCHIVO';
    this.rqConsulta.mdatos.carchivo = registro.carchivo;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.descargaArchivo(resp.registro);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }
  descargaArchivo(registro: any) {
  const linkElement = document.createElement('a');
    let bytes = registro.archivo;
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

  descarga(registro: any) {
    let bytes = registro.archivo;
    var blob = new Blob([this.arrayBufferToBase64(bytes)], { type: registro.tipo });
    const bloburl = URL.createObjectURL(blob);

    window.open(bloburl);
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
  // Inicia MANTENIMIENTO *********************



  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.carchivo', this.mfiltros, this.mfiltrosesp);
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }
}

