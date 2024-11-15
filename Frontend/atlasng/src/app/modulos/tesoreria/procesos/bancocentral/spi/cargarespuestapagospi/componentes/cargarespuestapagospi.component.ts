import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-cargarespuestapagospi',
  templateUrl: 'cargarespuestapagospi.html'
})
export class CargaRespuestaPagoSpiComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public lcharSeparacion: SelectItem[] = [{ label: '...', value: null }];

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  displayEvent: any;
  public rutaarchivo: string;
  public mostrarresumen: boolean = true;
  public lcontabilizacion: any;

  public mdatosarchivosngstr = {};
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CABECERARESPUESTASPI', false, false);
    this.componentehijo = this;
  }

  events: any[];

  ngOnInit() {
    super.init(this.formFiltros);
    this.grabo = false;
    this.mostrarresumen = true;
  }

  ngAfterViewInit() {
  }
  clickButton(model: any) {
    this.displayEvent = model;
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  onSelectArchivo(event) {
    const file = event.files[0];
    const fReader = new FileReader();
    fReader.addEventListener('loadend', this.obtenerArchivoBase64);
    fReader.readAsDataURL(file);

    this.mcampos.narchivo = file.name;
    this.mcampos.extension = file.name.substr(file.name.lastIndexOf('.') + 1);
    this.mcampos.tipo = file.type;
    if (this.mcampos.extension.toLocaleLowerCase() != "zip") {
      this.mostrarMensajeError("Archivos permitidos con extensión .zip");
      return;
    }
    this.mcampos.tamanio = file.size / 1000; // bytes/1000
    this.mcampos.cusuarioing = this.dtoServicios.mradicacion.cusuario;
  }
  obtenerArchivoBase64 = (event) => {
    this.mcampos.archivo = event.srcElement.result.split('base64,')[1];
    this.obtnerdatos();
  }
  obtnerdatos() {
    this.rqMantenimiento.mdatos.cargaarchivo = "upload";
    this.rqMantenimiento.mdatos.narchivo = this.mcampos.narchivo;
    this.rqMantenimiento.mdatos.extension = this.mcampos.extension;
    this.rqMantenimiento.mdatos.tipo = this.mcampos.tipo;
    this.rqMantenimiento.mdatos.tamanio = this.mcampos.tamanio;
    this.rqMantenimiento.mdatos.archivo = this.mcampos.archivo;
    this.rqMantenimiento.mdatos.tipotransaccion = 'P';
    this.msgs = [];
    const rqMan = this.getRequestMantenimiento();
    this.dtoServicios.ejecutarRestMantenimiento(rqMan, null, null).subscribe(
      resp => {
        if (resp.cod === 'OK') {
          this.lregistros = resp.cabecera;
          this.rutaarchivo = resp.rutaarchivo;
          if (resp.cargaarchivo == "save") { this.grabo = true; }
          this.enproceso = false;
        }
        else {
          super.mostrarMensajeError(resp.msgusu)
        }
        this.enproceso = false;
      },
      error => {
        this.dtoServicios.manejoError(error);
        this.enproceso = false;
        this.grabo = false;
      }
    );
  }

  // Inicia CONSULTA *********************
  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (!this.grabo) {
      if (this.mcampos.archivo == undefined || this.mcampos.archivo == null) {
        this.mostrarMensajeError("ES NECESARIO SELEECIONAR UN ARCHIVO DE RESPUESTA");
        return;
      }
      if (this.mcampos.extension.toLocaleLowerCase() != "zip") {
        this.mostrarMensajeError("TIPO DE ARCHIVO INVÁLIDO");
        return;
      }
      this.lmantenimiento = []; // Encerar Mantenimiento
      this.rqMantenimiento.mdatos.cargaarchivo = "save";
      this.rqMantenimiento.mdatos.rutaarchivo = this.rutaarchivo;
      this.rqMantenimiento.mdatos.CABECERARESPUESTASPI = this.lregistros;

      this.crearDtoMantenimiento();
      super.grabar();
    }
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  cancelarSubir() { }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cargaarchivo == "save") {
      this.lregistros = [];
      this.grabo = false;
    }
    if (resp.comprobantes != undefined) {
      this.mostrarresumen = false;
      this.lcontabilizacion = resp.comprobantes;
      this.grabo = true;
    }
  }


}