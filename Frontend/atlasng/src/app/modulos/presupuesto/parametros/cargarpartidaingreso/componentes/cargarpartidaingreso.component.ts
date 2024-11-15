import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ArchivoComponent } from '../../../../generales/archivo/componentes/archivo.component';
import { ResultadoCargaComponent } from '../submodulos/resultadocarga/componentes/resultadocarga.component';


@Component({
  selector: 'app-carga-archivos',
  templateUrl: 'cargarpartidaingreso.html'
})
export class CargarPartidaIngresoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(ResultadoCargaComponent)
  resultadoCargaComponente: ResultadoCargaComponent;

  public ltipoarchivo: SelectItem[] = [{ label: '...', value: null }];
  content: string = null;

  lOperacion: any = [];
  permitegrabar = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CARGAARCHIVOS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {


    super.init(this.formFiltros);
    this.consultarCatalogos();
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
    // NO APLICA
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.resultadoCargaComponente.postQuery(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    if (this.resultadoCargaComponente.lregistros.length == 0) {
      this.mostrarMensajeError("NO EXISTEN REGISTROS PARA PROCESAR.");
    }
    else {
      if (this.lOperacion.cod == "000") {
        this.mostrarMensajeError(this.lOperacion.msgusu);
      }
      else {
        this.resultadoCargaComponente.lregistros = [];
        this.rqMantenimiento.cargaarchivo = 'read';
        this.crearDtoMantenimiento();
        // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
        super.grabar();
        this.limpiarCampos();

      }
    }
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    this.lOperacion.cod = resp.cod;
    this.lOperacion.msgusu = resp.msgusu;
    this.resultadoCargaComponente.lregistros = resp.lregistros;
    this.rqMantenimiento.lregistros = resp.lregistros;
    this.rqMantenimiento.ccuenta = this.mcampos.ccuenta;
    this.resultadoCargaComponente.postCommit(resp);

    if (this.rqMantenimiento.cargaarchivo == 'upload'){
      this.permitegrabar  = resp.permitegrabar;
    }
    
    if (resp.cod == "OK" && resp.msgusu == undefined && this.rqMantenimiento.cargaarchivo == 'read') {
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'CARGA DEL PRESUPUESTO DE INGRESOS EXITOSA', detail: '' });
      this.dtoServicios.mostrarMensaje(this.msgs);
    }
  }

  validaGrabar() {
    if (!this.validaFiltrosConsulta('DEBE LLENAR LOS CAMPOS REQUERIDOS')) {
      return false;
    }
    return super.validaGrabar();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    this.lOperacion = [];
    const tipoarchivo = new ArchivoComponent(this.router, this.dtoServicios);
    const consTipoArchivo = tipoarchivo.crearDtoConsulta();
    this.addConsultaCatalogos('TIPOARCHIVO', consTipoArchivo, this.ltipoarchivo, super.llenaListaCatalogo, 'ctipoarchivo');

    this.ejecutarConsultaCatalogos();
  }

  uploadHandler(event) {

    this.rqMantenimiento.narchivo = event.files[0].name;
    this.lOperacion = [];
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
    this.limpiarCampos();
  }

  

  limpiarCampos() {
    this.rqMantenimiento.narchivo = '';
    this.rqMantenimiento.ncuentabancaria = '';
    this.resultadoCargaComponente.lregistros = [];
    this.lOperacion = [];
  }

}
