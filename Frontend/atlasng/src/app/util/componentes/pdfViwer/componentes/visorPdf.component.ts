import {Component, OnInit, AfterViewInit, ViewChild, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../servicios/dto.servicios';
import {Consulta} from '../../../dto/dto.component';
import {Mantenimiento} from '../../../dto/dto.component';
import {BaseComponent} from '../../../shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';




// enum FormatoExportar {Excel= 'xls', Pdf= 'pdf'}

@Component({
  selector: 'app-pdfViwer',
  templateUrl: './visorPdf.component.html'
})
export class VisorPdfComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Input()
  formulario: NgForm;

  @Input()
  componente: BaseComponent;

  // private lformatoExportar: FormatoExportar[];

  private path: string;

  public parametros: Object;

  public nombreArchivo = 'REPORTE';

  public nombreReporteJasper = '';

  private formatoexportar = 'pdf';

  private mensaje;

  public pdfSrc: any;

  public mostrarDialogoVisor: boolean;

  public esmodal: boolean = true;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'PDFVIWER', 'PDFVIWER', false);
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
  generaReporteCore(): void {
    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');

    this.rqMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    this.rqMantenimiento['cmodulo'] = 0;
    this.rqMantenimiento['ctransaccion'] = 100;

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
          this.pdfSrc = this.base64ToArrayBuffer(bytes);
          
          if (this.pdfSrc !== undefined) {
            this.mostrarDialogoVisor = true;
            this.esmodal = true;
          }
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

  public base64ToArrayBuffer(base64) {
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


  validarFormulario(): boolean {
    return this.formulario.valid;
  }

  mostrarPdf() {
    if (!this.formulario.valid) {
      this.mensaje = 'FILTROS DE CONSULTA REQUERIDOS'
      this.mostrarMensajeError(this.mensaje);
      return;
    }
    this.componente.componentehijo.descargarReporte();
  }

}
