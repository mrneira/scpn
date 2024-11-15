import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';

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
  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomsolicitud', 'SOLICITUDES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {

    super.init(this.formFiltros);
   // this.mfiltros.cfuncionario = sessionStorage.getItem("cfuncionario");
    
    this.consultar();
    this.consultarCatalogos();

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
  ActualzizarEstado() {
    var aprobado = true;
    if (this.registro.estadocdetalle === 'NEG') {
      aprobado = false;
    }

    this.registro.finalizada = true;
    this.registro.arrhh = aprobado;
    this.registro.aprobada = aprobado;
    this.registro.faprobacion = this.fechaactual;
    this.registro.cusuarioapr = this.dtoServicios.mradicacion.cusuario;
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
  consultarDatos(registro: any) {
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
    linkElement.name = registro.nombrearchivo;

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
    this.rqConsulta.CODIGOCONSULTA = 'ASOLICITUDEMP';
    this.mcampos.cfuncionario = sessionStorage.getItem("cfuncionario");
    this.rqConsulta.mdatos = this.mcampos;
    
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


  consultarCatalogos(): void {


    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1138;
    this.catalogoDetalle.mfiltrosesp.cdetalle = 'not in (\'GEN\')';
    const consultaRelevancia = this.catalogoDetalle.crearDtoConsulta();
    consultaRelevancia.cantidad = 20;
    this.addConsultaCatalogos('ESTADO', consultaRelevancia, this.ltipo, super.llenaListaCatalogo, 'cdetalle', );
    this.ejecutarConsultaCatalogos();
  }
}
