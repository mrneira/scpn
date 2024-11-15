import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-solicitud',
  templateUrl: 'solicitud.html'
})
export class SolicitudComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  selectedRegistros;
  mostrarGrabar = true;
  public mostrarPermiso = false;
  public mostrarVacacion = false;
  public mostrarHoraExtra = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomsolicitud', 'SOLICITUDES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();

  }

  ngAfterViewInit() {
  }

  crearNuevo() {

  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {

  }
  //METODO PARA GUARDAR X TIPO DE REGISTRO
  cancelar() {
    this.registro = this.registroSeleccionado;
    this.mostrarPermiso = false;
    this.mostrarHoraExtra = false;
    this.mostrarVacacion = false;
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);

  }
  public buscarregistro(registro: any) {
    this.registroSeleccionado = registro;
    this.registro = this.clone(this.registroSeleccionado);

    if (registro.tipocdetalle === "PER") {
      this.mostrarPermiso = true;
    }

    if (registro.tipocdetalle === "VAC") {
      this.mostrarVacacion = true;
    }
    if (registro.tipocdetalle === "HOR") {
      this.mostrarHoraExtra = true;
    }
  }
  consultarDatos(registro: any){
    this.rqConsulta.CODIGOCONSULTA = 'TGESARCHIVO';
    this.rqConsulta.mdatos.carchivo = registro.cgesarchivo;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.descargaArchivo(resp.ARCHIVO);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }
  descargaArchivo(registro: any) {
    const linkElement = document.createElement('a');
      let bytes = registro.archivo;
      var blob = new Blob([this.base64ToArrayBuffer(bytes)], { type: registro.tipo });
      const bloburl = URL.createObjectURL(blob);
      
        linkElement.href = bloburl;
        linkElement.download = registro.nombrearchivo;
        linkElement.name=registro.nombrearchivo;

        const clickEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': false
        });
        linkElement.dispatchEvent(clickEvent);
      
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
  

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
  
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.validaRegistros();
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    this.consultar();
  }
  // Fin MANTENIMIENTO *********************

  consultar() {
    this.rqConsulta.CODIGOCONSULTA = 'ASOLICITUDJEFE';
    this.rqConsulta.mdatos.cjefe=sessionStorage.getItem("cfuncionario");
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {

          if (resp.cod === 'OK') {
            this.postQuery(resp);
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  validaRegistros(): boolean {
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        reg.actualizar = true;
        reg.ajefe = true;
        this.selectRegistro(reg);
        this.actualizar();
      }
    }
    if (this.selectedRegistros != null && this.selectedRegistros.length > 0) {
      return true;
    }
    return false;
  }

}
