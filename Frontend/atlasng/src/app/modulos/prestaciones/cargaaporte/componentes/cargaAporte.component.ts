import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ArchivoComponent } from '../../../generales/archivo/componentes/archivo.component';
import { JasperComponent } from '../../../../util/componentes/jasper/componentes/jasper.component';
import { ResultadoCargaComponent } from '../submodulos/resultadocarga/componentes/resultadoCarga.component';



@Component({
  selector: 'app-carga-aporte',
  templateUrl: 'cargaAporte.html'
})
export class CargaAporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(ResultadoCargaComponent)
  resultadoCargaComponente: ResultadoCargaComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public ltipoarchivo: SelectItem[] = [{ label: '...', value: null }];
  public lmeses: SelectItem[] = [{ label: "...", value: null }];
  content: string = null;
  mostrargrabar: boolean = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpreaporte', 'CARGAARCHIVOS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.consultarCatalogosGenerales();
    this.mcampos.anio = this.anioactual;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // NO APLICA
  }

  actualizar() {
    // NO APLICA
  }

  eliminar() {
    // NO APLICA
  }

  cancelar() {
    // NO APLICA
  }

  public selectRegistro(registro: any) {
    // NO APLICA
  }

  // Inicia CONSULTA *********************
  consultar() {
  }

  public crearDtoConsulta() {
  }

  private fijarFiltrosConsulta() {
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.resultadoCargaComponente.postQuery(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // this.resultadoCargaComponente.lregistros = [];
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.actualizarsaldosenlinea = true;

    if (this.rqMantenimiento.cargaarchivo == 'read') {
      this.mostrarMensajeError("REFRESQUE LA PÁGINA.");
      return;
    }

    if (this.resultadoCargaComponente.lregistros.lenght == 0) {
      this.mostrarMensajeError("NO EXISTEN REGISTROS PARA PROCESAR.");
    }
    else {
      this.resultadoCargaComponente.lregistros = [];
      this.rqMantenimiento.archivo=null;
      this.rqMantenimiento.cargaarchivo = 'read';
      this.rqMantenimiento.lregistros = this.lregistros;
      this.rqMantenimiento.registrosok = this.mcampos.registrosok;
      this.rqMantenimiento.registroserror = this.mcampos.registroserror;
      this.rqMantenimiento.registrostotal = this.mcampos.registrostotal;
      //this.rqMantenimiento.fechaaporte = this.fechaToIntegerMes(this.mcampos.fechaaporte);
      this.mcampos.fechaaporte = this.mcampos.anio + this.mcampos.mes;

      this.rqMantenimiento.fechaaporte = this.mcampos.fechaaporte;
      this.crearDtoMantenimiento();
      super.grabar();
      this.limpiarCampos();
    }
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    this.resultadoCargaComponente.mfiltros.numeroejecucion = resp.numejecucion;
    this.resultadoCargaComponente.mfiltros.ctipoarchivo = this.rqMantenimiento.ctipoarchivo;
    this.resultadoCargaComponente.mfiltros.idproceso = resp.idproceso;
    this.resultadoCargaComponente.postCommit(resp);
    if (resp.mayorizado === 'OK') {
      this.mcampos.ccomprobante = resp.ccomprobante;
      this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
      this.descargarReporteComprobanteContable();
    }
  }

  descargarReporteComprobanteContable(): void {
    let tipoComprobante = '';
    tipoComprobante = 'Diario'; // CCA cambios realizados por afa
    // Agregar parametros
    this.jasper.nombreArchivo="DIARIO GENERAL POR REGISTRO DE CARGA DE APORTES";
    this.jasper.parametros['@i_ccomprobante'] = this.mcampos.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }
  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  validaGrabar() {
    if (!super.validaFiltrosConsulta('DEBE LLENAR LOS CAMPOS REQUERIDOS')) {
      return false;
    }
    return super.validaGrabar();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const tipoarchivo = new ArchivoComponent(this.router, this.dtoServicios);
    tipoarchivo.mfiltros.cmodulo = 28;
    const consTipoArchivo = tipoarchivo.crearDtoConsulta();
    this.addConsultaCatalogos('TIPOARCHIVO', consTipoArchivo, this.ltipoarchivo, super.llenaListaCatalogo, 'ctipoarchivo');

    this.ejecutarConsultaCatalogos();
  }

  limpiarCampos() {
    this.rqMantenimiento.narchivo = '';
    //this.rqMantenimiento.ncuentabancaria = '';
    this.resultadoCargaComponente.lregistros = [];
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  cancelarSubir() {
    this.rqMantenimiento.narchivo = '';
    this.resultadoCargaComponente.lregistros = [];
    this.resultadoCargaComponente.mfiltros.numeroejecucion = 0;
    this.resultadoCargaComponente.mfiltros.ctipoarchivo = 0;
  }

  uploadHandler(event) {
    this.rqMantenimiento.narchivo = event.files[0].name;
    this.rqMantenimiento.cargaarchivo = 'upload';
    this.getBase64(event);
  }

  getBase64(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.propagateChange(myReader.result);
    }
    myReader.readAsDataURL(file);
  }

  propagateChange = (value: any) => {
    this.rqMantenimiento.archivo = value;
    this.mcampos.fechaaporte = this.mcampos.anio + this.mcampos.mes;
    if (this.estaVacio(this.mcampos.fechaaporte)) {
      this.mostrarMensajeError("NO SE HA SELECCIONADO LA FECHA DE APORTE");
      return;
    }
    this.rqMantenimiento.fechaaporte = this.mcampos.fechaaporte;
    const rqMan = this.getRequestMantenimiento();
    this.dtoServicios.ejecutarRestMantenimiento(rqMan, null, null).subscribe(
      resp => {
        if (resp.cod === 'OK') {
          this.grabo = true;
          this.resultadoCargaComponente.lregistrosconflicto = resp.LREGISTROSCONFLICTO;
          this.lregistros = resp.LREGISTROS;
          this.mcampos.registrosok = resp.registrosok;
          this.mcampos.registroserror = resp.registroserror;
          this.mcampos.registrostotal = resp.registrostotal;
        
          if (!resp.ERRORES) {
            this.mostrargrabar = true;
            super.mostrarMensajeSuccess(resp.msgusu);
          }


        }else{
          super.mostrarMensajeError(resp.msgusu);
        }
        //  this.encerarMensajes();
        this.respuestacore = resp;
        this.componentehijo.postCommit(resp);
        //    this.dtoServicios.llenarMensaje(resp, true); // solo presenta errores.
        this.enproceso = false;
      },
      error => {
        this.dtoServicios.manejoError(error);
        this.enproceso = false;
        this.grabo = false;
      }
      // finalizacion
    );
  };

  consultarCatalogosGenerales() {
    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 20;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }
}
