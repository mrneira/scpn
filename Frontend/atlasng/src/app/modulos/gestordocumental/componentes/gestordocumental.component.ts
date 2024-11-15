import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../util/servicios/dto.servicios';
import { Consulta } from '../../../util/dto/dto.component';
import { Mantenimiento } from '../../../util/dto/dto.component';
import { BaseComponent } from '../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-ges-gestordocumental',
  templateUrl: 'gestordocumental.html'
})
export class GestorDocumentalComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  cgesarchivo = undefined;
  ndocumento = undefined;
  displayLov = false;
  descarga = false;
  update = false;
  nuevo = false;
  elim = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tgesarchivo', 'GESTORDOCUMENTAL', false, false);
    this.componentehijo = this;
  }
  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
  }

  showDialog(cgesarchivo: any) {
    this.lregistros = [];
    if (this.isNumber(cgesarchivo)) {
      this.cgesarchivo = cgesarchivo;
      this.consultarArchivo(this.cgesarchivo, false);
      this.update = true;
      this.registro.cusuariomod=this.dtoServicios.mradicacion.cusuario;
      this.registro.fmodificacion=this.fechaactual;
      
    } else {
      this.crearNuevo();
      this.nuevo = true;
      this.registro.cusuarioing=this.dtoServicios.mradicacion.cusuario;
      this.registro.fingreso=this.fechaactual;
      
    }
    this.displayLov = true;
  }

  uploadHandler(event) {
    const file = event.files[0];
    const fReader = new FileReader();
    fReader.addEventListener('loadend', this.completaArchivo);
    fReader.readAsDataURL(file);
    this.ndocumento = this.registro.nombrearchivo = file.name;
    this.registro.tipodecontenido = file.type;
    this.registro.extension = file.name.substr(file.name.lastIndexOf('.') + 1);
    this.registro.tamanio = file.size; // bytes/1000
  }

  completaArchivo = (event) => {
    this.registro.archivo = event.srcElement.result.split('base64,')[1];
    this.actualizar();
    this.grabar();
  }

  actualizar() {
    super.actualizar();
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes        
    super.grabar();
    this.lregistroseliminar = [];
  }

  eliminar() {
    this.dtoServicios.mostrarDialogoLoading = true;
    setTimeout(() => {
      if (this.isNumber(this.cgesarchivo)) {
        this.elim = true;
        this.consultarArchivo(this.cgesarchivo, false);
      }
    },
      1000);
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    this.lregistros = [];
    this.displayLov = false;

    try {
      if (this.nuevo && resp.GESTORDOCUMENTAL != undefined) {
        this.nuevo = false;
        this.eventoCliente.emit({ cgesarchivo: resp.GESTORDOCUMENTAL[0].cgesarchivo, ndocumento: this.ndocumento });
      }
      if (this.update && this.isNumber(this.cgesarchivo)) {
        this.update = false;
        this.eventoCliente.emit({ cgesarchivo: this.cgesarchivo, ndocumento: this.ndocumento });
      }
      if (this.elim) {
        this.dtoServicios.mostrarDialogoLoading = this.elim = false;
      }
    }
    catch (Exception) {
    }
  }

  consultarArchivo(cgesarchivo: any, descarga: boolean) {
    if (this.isNumber(cgesarchivo)) {
      this.mfiltros.cgesarchivo = parseInt(cgesarchivo);
      this.descarga = descarga;
      this.consultar();
    }
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 'cgesarchivo', this.mfiltros, this.mfiltrosesp);
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  public postQuery(resp: any) {
    if (this.descarga) {
      this.descargaArchivo(resp.GESTORDOCUMENTAL[0]);
      this.descarga = false;
    } else {
      super.postQueryEntityBean(resp);
      this.selectRegistro(this.lregistros[0]);
    }
    if (this.elim) {
      this.enproceso = false;
      super.eliminar();
      this.grabar();
    }
  }

  descargaArchivo(registro: any) {
    this.descarga = true;
    const linkElement = document.createElement('a');
    let bytes = registro.archivo;
    var blob = new Blob([this.base64ToArrayBuffer(bytes)], { type: registro.tipodecontenido });
    const bloburl = URL.createObjectURL(blob);
    if (registro.tipodecontenido.includes('pdf') || registro.tipodecontenido.includes('image')) {
      window.open(bloburl);
    } else {
      linkElement.href = bloburl;
      linkElement.download = registro.nombrearchivo;
      //  linkElement.click();
      const clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': false
      });
      linkElement.dispatchEvent(clickEvent);
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

  isNumber(value) {
    return typeof value === 'number' && isFinite(value) && value != null && value != undefined;
  }
}