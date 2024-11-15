import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { Options } from 'fullcalendar';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-estructurasg',
  templateUrl: 'estructurasg.html'
})

export class EstructurasgComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ltipoArchivo: SelectItem[] = [
    { label: "...", value: null },
    { label: "G01", value: "g01" },
    { label: "G02", value: "g02" }
  ];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'ESTRUCTURAS', false, false);
    this.componentehijo = this;
  }

  events: any[];

  header: any;
  ngOnInit() {
    super.init(this.formFiltros);
  }
    cargadatos() {
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

  LimpiarRegistros(){
    this.lregistros=[];
  }

  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento
    if (this.mcampos.tipoEstructura === 'g01'){
      this.rqMantenimiento.mdatos.spcabecera = 'sp_investructuracabg1';
      this.rqMantenimiento.mdatos.spdetalle = 'sp_investructuradetg1';
    }
    else {
      this.rqMantenimiento.mdatos.spcabecera = 'sp_investructuracabg2';
      this.rqMantenimiento.mdatos.spdetalle = 'sp_investructuradetg2';
      this.rqMantenimiento.mdatos.fcorte = this.fechaToInteger(this.mcampos.fcorte);
    }
    this.rqMantenimiento.mdatos.tipoEstructura = this.mcampos.tipoEstructura;
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
        this.rqMantenimiento.mdatos.accion = null;
        this.registro.nombre = resp.archivogenerado.nombre;
        this.registro.tipo = resp.archivogenerado.tipo;
        this.registro.archivoDescarga = resp.archivogenerado.contenido;
        this.registro.extension = resp.archivogenerado.extension;
        this.descargaAdjunto(this.registro);
        this.enproceso = false;
        this.consultar();
      }
  }

  descargaAdjunto(registro: any) {
    const linkElement = document.createElement("a");
    let bytes = registro.archivoDescarga;
    let base = this.arrayBufferToBase64(bytes);
    var blob = new Blob([this.base64ToArrayBuffer(bytes)], {
      type: registro.tipo
    });
    const bloburl = URL.createObjectURL(blob);
    if (registro.extension === "pdf") {
      window.open(bloburl);
    } else {
      linkElement.href = bloburl;
      linkElement.download = registro.nombre;
      //  linkElement.click();
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: false
      });
      linkElement.dispatchEvent(clickEvent);
    }
  }

  arrayBufferToBase64(buffer) {
    var binary = "";
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