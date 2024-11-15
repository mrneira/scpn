import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-anexotransaccional',
  templateUrl: 'anexotransaccional.html'
})
export class AnexoTransaccionalComponent extends BaseComponent implements OnInit, AfterViewInit {

  public ltipoplancuentas: SelectItem[] = [{label: '...', value: null}];
  public lmesesini: SelectItem[] = [{label: '...', value: null}];
  public lmesesfin: SelectItem[] = [{label: '...', value: null}];
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'ANEXOTRANSACCIONAL', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mfiltros.fperiodo = this.anioactual;
    this.mfiltros.finicio =  new Date().getUTCMonth()+1;    ;
    this.mfiltros.ffin = new Date().getUTCMonth()+1;

    this.fijarListaMeses();
    this.lmesesfin= this.lmesesini;
  }

  ngAfterViewInit() {
  }

  consultar() {
    if (this.mfiltros.fperiodo === undefined || this.mfiltros.fperiodo === null) {
      this.mostrarMensajeError("INGRESE EL PERIODO");
      return;
    }
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }

  }
  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultarCatalogos(): any {    
  }

  fijarListaMeses() {
    this.lmesesini.push({ label: "ENERO", value: '01' });
    this.lmesesini.push({ label: "FEBRERO", value: '02' });
    this.lmesesini.push({ label: "MARZO", value: '03' });
    this.lmesesini.push({ label: "ABRIL", value: '04' });
    this.lmesesini.push({ label: "MAYO", value: '05' });
    this.lmesesini.push({ label: "JUNIO", value: '06' });
    this.lmesesini.push({ label: "JULIO", value: '07' });
    this.lmesesini.push({ label: "AGOSTO", value: '08' });
    this.lmesesini.push({ label: "SEPTIEMBRE", value: '09' });
    this.lmesesini.push({ label: "OCTUBRE", value: 10 });
    this.lmesesini.push({ label: "NOVIEMBRE", value: 11 });
    this.lmesesini.push({ label: "DICIEMBRE", value: 12 });
  }


  Descargar(registro: any, event) {
  
    this.rqConsulta.CODIGOCONSULTA = 'OC_DESCARGAXML';    
    this.rqConsulta.parametro_fperiodo = this.mfiltros.fperiodo;
    this.rqConsulta.parametro_finicio = this.mfiltros.finicio;
    this.rqConsulta.mdatos.tipodescarga = event.currentTarget.name;
    this.rqConsulta.mdatos.anioactual = this.mfiltros.fperiodo;
    this.rqConsulta.mdatos.mes = this.mfiltros.finicio;
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
