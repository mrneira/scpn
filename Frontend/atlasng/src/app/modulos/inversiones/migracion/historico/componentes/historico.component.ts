
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
  selector: 'app-historico',
  templateUrl: 'historico.html'
})
export class HistoricoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(ResultadoCargaComponent)
  resultadoCargaComponente: ResultadoCargaComponent;

  public ltipoarchivo: SelectItem[] = [{ label: '...', value: null }];
  content: string = null;

  lOperacion: any = [];

  lregistrosBancos: any = [];

  private mImportarDesde2013: boolean = true;

  private mImportarVectorPrecios: boolean = false;
  private mImportarPreciosCierre: boolean = false;

  private anio: number = 2013;

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
        this.rqMantenimiento.lregistrosBancos = this.lregistrosBancos;


        this.crearDtoMantenimiento();
        
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

    this.lregistrosBancos = resp.lregistrosBancos;

    this.resultadoCargaComponente.postCommit(resp);

    if (resp.cod == "OK" && resp.msgusu == undefined && this.rqMantenimiento.cargaarchivo == 'read') {
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'CARGA EXITOSA', detail: '' });
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
    this.encerarMensajes();

    if (this.mImportarDesde2013 && ((this.mImportarVectorPrecios && this.mImportarPreciosCierre) || (!this.mImportarVectorPrecios && !this.mImportarPreciosCierre)))
    {
      this.mostrarMensajeError("Seleccione una sola opción: Vector de Precios o Precios de Cierre");
      return;
    }
    else if(this.estaVacio(this.anio) || Number(this.anio) < 2013 || Number(this.anio) > 2018)
    {
      this.mostrarMensajeError("El año debe ser mayor a 2012 y menor a 2019");
      return;
    }

    this.rqMantenimiento.narchivo = event.files[0].name;
    this.lOperacion = [];
    this.rqMantenimiento.cargaarchivo = 'upload';

    this.rqMantenimiento.lblnImportarDesde2013 = this.mImportarDesde2013;
    this.rqMantenimiento.lblnImportarVectorPrecios = this.mImportarVectorPrecios;
    this.rqMantenimiento.lblnImportarPreciosCierre = this.mImportarPreciosCierre;
    this.rqMantenimiento.anio = this.anio;

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
        this.dtoServicios.llenarMensaje(resp, true);
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

  /**Muestra lov de cuentas contables */
  limpiarCampos() {
    this.rqMantenimiento.narchivo = '';
    this.resultadoCargaComponente.lregistros = [];
    this.lOperacion = [];
  }

}
