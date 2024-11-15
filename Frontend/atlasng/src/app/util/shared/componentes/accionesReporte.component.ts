import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../servicios/dto.servicios';
import { BaseComponent } from './base.component';

@Component({
  selector: 'acciones-rep',
  templateUrl: 'accionesReporte.html'
})

//export class AccionesReporteComponent {
export class AccionesReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Input()
  componente: BaseComponent;

  @Input()
  reg: any;

  // private lformatoExportar: FormatoExportar[];

  public path: string;
  public parametros: Object;
  public nombreArchivo = 'REPORTE';
  public cdocumento = null;
  public csolicitud = null;
  public coperacion = null;
  public nombreReporteJasper = '';
  public formatoexportar = 'pdf';
  public mensaje;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'JASPERREPORTS', 'JASPERREPORTS', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();

    this.parametros = new Object();
    this.parametros['reportes'] = [];
  }

  ngAfterViewInit() {
  }

  // Inicia CONSULTA *********************
  consultar() {

  }

  // Inicia MANTENIMIENTO *********************
  generaReporteCore(cmodulo: any = 0, ctransaccion: any = 100): void {
    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');

    this.rqMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    this.rqMantenimiento['cmodulo'] = cmodulo;
    this.rqMantenimiento['ctransaccion'] = ctransaccion;
    this.rqMantenimiento['cdocumento'] = this.cdocumento;
    if (this.csolicitud !== null) {
      this.rqMantenimiento['csolicitud'] = this.csolicitud;
    }
    if (this.coperacion !== null) {
      this.rqMantenimiento['coperacion'] = this.coperacion;
    }

    this.agregarparametrosgenerales();
    this.agregarParametrosCore();
    this.parametros['imagen'] = null;
    this.parametros['estilo'] = null;
    this.rqMantenimiento.mdatos['parametros'] = this.parametros;

    if (!this.controlGrabar(true)) {
      // return;
    }
    this.encerarMensajes();
    const rqMan = this.getRequestMantenimiento();
    this.dtoServicios.ejecutarRestMantenimiento(rqMan).subscribe(
      resp => {
        // this.postCommitEntityBean(resp);
        this.dtoServicios.llenarMensaje(resp, true); // solo presenta errores.
        this.enproceso = false;
        this.grabo = true;
        let bytes = resp['reportebyte'];
        if (resp.cod === 'OK') {
          this.descargarBytes(bytes);
        }

      },
      error => {
        this.dtoServicios.manejoError(error);
        this.enproceso = false;
        this.grabo = false;
      }
      // finalizacion
    );
  }

  descargarBytes(bytes: any): void {
    const linkElement = document.createElement('a');
    try {
      let contenttype = '';
      if (this.formatoexportar === 'pdf') {
        contenttype = 'application/pdf';
      } else if (this.formatoexportar === 'xls') {
        contenttype = 'application/vnd.ms-excel';
      } else {
        contenttype = 'application/octet-stream';
      }
      const archivo = 'data:' + this.formatoexportar + ';base64,' + bytes;

      var blob = new Blob([this.base64ToArrayBuffer(bytes)], { type: contenttype });
      const bloburl = URL.createObjectURL(blob);
      if (this.formatoexportar === 'pdf') {
        window.open(bloburl);
        this.componente.componentehijo.consultar();
        return;
      } else {
        linkElement.href = bloburl;
        linkElement.download = this.nombreArchivo + '.' + this.formatoexportar;
        //  linkElement.click();

        const clickEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': false
        });
        linkElement.dispatchEvent(clickEvent);
      }

    } catch (ex) {
    }
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
  agregarReporte(nombrereportejasper: string, parametrosreporte: any): void {
    if (this.parametros['reportes'] == null) {
      this.parametros['reportes'] = {};
    }

    parametrosreporte['nombrereportejasper'] = nombrereportejasper;
    this.parametros['reportes'][nombrereportejasper] = parametrosreporte;
  }

  agregarparametrosgenerales(): void {
    // this.parametros['freporte'] = FechaInteger.getFechaString(this.loginBean.getCredencial().getFtrabajo());
    this.parametros['imagen'] = 'repo:/ficus/' + this.dtoServicios.mradicacion.ccompania + '/imagenes/ficus';
    this.parametros['estilo'] = 'repo:/ficus/' + this.dtoServicios.mradicacion.ccompania + '/estilos/ficus';
    this.parametros['ccompania'] = this.dtoServicios.mradicacion.ccompania;
    this.parametros['cusuario'] = this.dtoServicios.mradicacion.cusuario;
    this.path = this.dtoServicios.mradicacion.ccompania + this.path;
    this.parametros['path'] = this.path;
    this.parametros['nombreArchivo'] = this.nombreArchivo;
    this.parametros['formatoexportar'] = this.formatoexportar;
    this.parametros['tituloreporte'] = this.dtoServicios.mradicacion.ncompania;
  }

  agregarParametrosCore(): void {
    this.parametros['imagen'] = 'logo_cliente.png';
    this.parametros['estilo'] = 'estilos_cliente.jrtx';
    this.parametros['path'] = null;
    this.parametros['nombrereportejasper'] = this.nombreReporteJasper;
  }

  descargaPdf(reg: any) {
    this.formatoexportar = 'pdf';
    this.componente.componentehijo.descargarReporte(reg);
  }


}
