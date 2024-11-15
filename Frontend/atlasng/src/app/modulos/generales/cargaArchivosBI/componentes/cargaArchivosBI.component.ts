import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ArchivoComponent } from '../../../generales/archivo/componentes/archivo.component';

import { ResultadoCargaComponent } from '../submodulos/resultadocarga/componentes/resultadoCarga.component';



@Component({
  selector: 'app-carga-archivosBI',
  templateUrl: 'cargaArchivosBI.html'
})
export class CargaArchivosBIComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(ResultadoCargaComponent)
  resultadoCargaComponente: ResultadoCargaComponent;

  public lmodulo: SelectItem[] = [{ label: '...', value: null }];
  content: string = null;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CARGAARCHIVOSBI', false, false);
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
    this.crearDtoConsulta();
    super.consultar();
  }

  private crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const conResultado = this.resultadoCargaComponente.crearDtoConsulta();
    this.addConsultaPorAlias(this.resultadoCargaComponente.alias, conResultado);
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.cmodulo = this.registro.cmodulo;
    this.resultadoCargaComponente.mfiltros.cmodulo = this.registro.cmodulo;
  }
  validaFiltrosConsulta(): boolean {
    return this.resultadoCargaComponente.validaFiltrosConsulta();
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.resultadoCargaComponente.postQuery(resp);
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    this.resultadoCargaComponente.postCommit(resp);
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const consultaEstatus = new Consulta('tgenmodulo', 'Y', 't.nombre', {}, {});
    consultaEstatus.cantidad = 100;
    this.addConsultaCatalogos('MODULO', consultaEstatus, this.lmodulo, super.llenaListaCatalogo, 'cmodulo');

    this.ejecutarConsultaCatalogos();
  }

  uploadHandler(event) {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento['cmoduloneg'] = this.registro.cmodulo;
    this.rqMantenimiento.narchivo = event.files[0].name;
    this.rqMantenimiento.mdatos.cmodulo = this.registro.cmodulo;
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
    this.encerarMensajes();
  }

  pasarModulo() {
    this.resultadoCargaComponente.mfiltros.cmodulo = this.registro.cmodulo;
    this.resultadoCargaComponente.consultar();
  }

}
