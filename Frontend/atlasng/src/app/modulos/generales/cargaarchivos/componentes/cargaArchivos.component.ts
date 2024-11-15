import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ArchivoComponent } from '../../archivo/componentes/archivo.component';
import { JasperComponent } from '../../../../util/componentes/jasper/componentes/jasper.component';
import { ResultadoCargaComponent } from '../submodulos/resultadocarga/componentes/resultadoCarga.component';



@Component({
  selector: 'app-carga-archivos',
  templateUrl: 'cargaArchivos.html'
})
export class CargaArchivosComponent extends BaseComponent implements OnInit, AfterViewInit {


  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(ResultadoCargaComponent)
  resultadoCargaComponente: ResultadoCargaComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public ltipoarchivo: SelectItem[] = [{ label: '...', value: null }];
  content: string = null;
  public mostrarfechas = false;
  public lmeses: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CARGAARCHIVOS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    if (sessionStorage.getItem('m') === '28')
      this.mostrarfechas = true;
    this.mcampos.anio = this.anioactual;
    this.consultarCatalogosGenerales();
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    // Consulta datos.
    this.fijarFiltrosConsulta();
    const conResultado = this.resultadoCargaComponente.crearDtoConsulta();
    this.addConsultaPorAlias(this.resultadoCargaComponente.alias, conResultado);


  }

  public fijarFiltrosConsulta() {
    this.resultadoCargaComponente.fijarFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.resultadoCargaComponente.postQuery(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.resultadoCargaComponente.lregistros = [];
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento['cmodulo'] = sessionStorage.getItem('m');
    this.rqMantenimiento['ctransaccion'] = sessionStorage.getItem('t');
    if (sessionStorage.getItem('m') === '28') {
      this.mcampos.fechaaporte = this.mcampos.anio + this.mcampos.mes;
      if (this.estaVacio(this.mcampos.fechaaporte)) {
        this.mostrarMensajeError("NO SE HA SELECCIONADO LA FECHA DE APORTE");
        return;
      }
      this.rqMantenimiento.fechaaporte = this.mcampos.fechaaporte;
    }

    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
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
    if (!this.estaVacio(resp.ccomprobante)) {
      this.mcampos.ccomprobante = resp.ccomprobante;
      this.descargarReporteComprobanteContable();
    }
  }

  descargarReporteComprobanteContable(): void {
    let tipoComprobante = '';
    tipoComprobante = 'Diario';
    // Agregar parametros
    this.jasper.parametros['@i_ccomprobante'] = this.mcampos.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }

  validaGrabar() {
    if (!this.validaFiltrosConsulta('DEBE LLENAR LOS CAMPOS REQUERIDOS')) {
      return false;
    }
    return super.validaGrabar();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const tipoarchivo = new ArchivoComponent(this.router, this.dtoServicios);
    tipoarchivo.mfiltros.cmodulo = sessionStorage.getItem('m');//27;
    const consTipoArchivo = tipoarchivo.crearDtoConsulta();
    this.addConsultaCatalogos('TIPOARCHIVO', consTipoArchivo, this.ltipoarchivo, super.llenaListaCatalogo, 'ctipoarchivo');

    this.ejecutarConsultaCatalogos();
  }

  uploadHandler(event) {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento['cmodulo'] = 0;
    this.rqMantenimiento['ctransaccion'] = 54;
    this.rqMantenimiento.narchivo = event.files[0].name;
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
    const rqMan = this.getRequestMantenimiento();
    this.dtoServicios.ejecutarRestMantenimiento(rqMan, null, null).subscribe(
      resp => {
        if (resp.cod === 'OK') {
          this.grabo = true;
        }
        this.encerarMensajes();
        this.respuestacore = resp;
        this.componentehijo.postCommit(resp);
        this.dtoServicios.llenarMensaje(resp, true); // solo presenta errores.
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

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  cancelarSubir() {
    this.rqMantenimiento.narchivo = '';
    this.resultadoCargaComponente.lregistros = [];
    this.resultadoCargaComponente.mfiltros.numeroejecucion = 0;
    this.resultadoCargaComponente.mfiltros.ctipoarchivo = 0;
  }

  consultarCatalogosGenerales() {
    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 20;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }
}
