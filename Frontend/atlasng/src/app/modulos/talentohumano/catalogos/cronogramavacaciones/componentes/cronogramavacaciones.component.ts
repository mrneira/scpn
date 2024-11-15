import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { Options } from 'fullcalendar';


@Component({
  selector: 'app-cronogramavacaciones',
  templateUrl: 'cronogramavacaciones.html'
})

export class CronogramavacacionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public lcharSeparacion: SelectItem[] = [{ label: '...', value: null }];

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  public lregistrosProb = [];
  displayEvent: any;
  public mdatosarchivosngstr = {};
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnommatrizvacacion', 'CARGAVACACION', false, false);
    this.componentehijo = this;
  }

  events: any[];

  ngOnInit() {
    super.init(this.formFiltros);
  }


  ngAfterViewInit() {
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

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

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
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento

    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  onSelectArchivoFirma(event) {
    const file = event.files[0];

    const fReader = new FileReader();
    fReader.addEventListener('loadend', this.actualizaArchivoFirma);
    fReader.readAsDataURL(file);

    this.mcampos.narchivo = file.name;
    this.mcampos.extension = file.name.substr(file.name.lastIndexOf('.') + 1);
    this.mcampos.tipo = file.type;
    this.mcampos.tamanio = file.size / 1000; // bytes/1000
    this.mcampos.cusuarioing = this.dtoServicios.mradicacion.cusuario;
  }
  actualizaArchivoFirma = (event) => {
    this.mcampos.archivo = event.srcElement.result.split('base64,')[1];
    this.obtnerdatos();
  }
  obtnerdatos() {
    this.rqConsulta.CODIGOCONSULTA = 'CARGAVACACION';
    this.rqConsulta.mdatos = this.mcampos;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.lregistros = [];
          if (resp.cod === 'OK') {
            for (const i in resp.CARGADATOSVACACION) {
              const reg = resp.CARGADATOSVACACION[i];
              reg.cmatrizv = undefined;
              reg.idreg = Math.floor((Math.random() * 100000) + 1);
             
            }
            this.lregistros=resp.CARGADATOSVACACION;
            this.lregistrosOriginales=resp.CARGADATOSVACACION;
            this.lregistrosProb = resp.CARGADATOSVACACIONERROR;
            super.mostrarMensajeSuccess(resp.msgusu);

          }

        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

}


