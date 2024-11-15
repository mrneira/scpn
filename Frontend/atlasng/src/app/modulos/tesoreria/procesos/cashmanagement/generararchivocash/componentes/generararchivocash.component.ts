import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-generararchivocash',
  templateUrl: 'generararchivocash.html'
})
export class GenerarArchivoCashComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lresumen: any[];
  public ldetalle: any[];
  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  selectedRegistros;
  graba: boolean = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttesrecaudacion', 'GENERACASH', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.fgeneracion = super.stringToFecha(super.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable));
    this.consultar();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
    //this.consultarDocumentos();
    //super.consultar();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const mfiltrosMod: any = { activo: true, negocio: true };
    const conModulo = new Consulta('tgenmodulo', 'Y', 't.nombre', mfiltrosMod, {});
    conModulo.cantidad = 100;
    this.addConsultaCatalogos('MODULOS', conModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');
    this.ejecutarConsultaCatalogos();
  }

  public crearDtoConsulta(): Consulta {
    this.mfiltrosesp.finicio = '<= ' + this.dtoServicios.mradicacion.fcontable;
    this.mfiltrosesp.ffin = '>= ' + this.dtoServicios.mradicacion.fcontable;
    this.mfiltros.cestado = 4;
    const consulta = new Consulta(this.entityBean, 'Y', 't.fcontable', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgenmodulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('TgenTransaccion', 'nombre', 'ntransaccion', 'i.ctransaccion = t.ctransaccion and i.cmodulo = t.cmodulo');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public consultarAnterior() {
    this.rqConsulta = [];
    super.consultarAnterior();
  }

  public consultarSiguiente() {
    this.rqConsulta = [];
    super.consultarSiguiente();
  }
  //MÉTODO PARA CONSULTAR DATOS DEL DOCUMENTOS AUTORIZADOS -- COMPONENTE DE CONSULTA
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    //this.crearDtoMantenimiento();
    this.rqMantenimiento.mdatos.fcontable = this.dtoServicios.mradicacion.fcontable;
    this.rqMantenimiento.mdatos.fgeneracion = this.mcampos.fgeneracion;
    this.rqMantenimiento.mdatos.cargaarchivo = "generar";

    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    this.crearDtoMantenimiento();
    super.grabar();

  }

  generarArchivo(accion: string) {
    this.rqMantenimiento.mdatos.cargaarchivo = accion;
    this.generarcash();
    this.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  consultaResumen() {
    this.rqConsulta.CODIGOCONSULTA = 'RESUMENRECAUDACION';
    this.rqConsulta.mdatos.fcontable = this.mfiltros.fcontable;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaDetalle(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuestaDetalle(resp: any) {
    if (resp.cod === 'OK') {
      if (resp.detalle === 'OK') {
        this.ldetalle = resp.resumenrecaudacion;
      }
    }
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      if (resp.cargaarchivo === "generar") {
        this.enproceso = false;
        this.lresumen = resp.resumen;
        this.rqMantenimiento.mdatos.cargaarchivo = "generar";
        const rqMan = this.getRequestMantenimiento();
        this.dtoServicios.ejecutarRestMantenimiento(rqMan, null, null).subscribe(
          resp => {
            if (resp.cod === 'OK') {
              this.grabo = true;
            }
            //this.encerarMensajes();
            this.respuestacore = resp;
            this.componentehijo.postCommit(resp);
            this.dtoServicios.llenarMensaje(resp, true, this.limpiamsgpeticion); // solo presenta errores.
            this.enproceso = false;
          },
          error => {
            this.dtoServicios.manejoError(error);
            this.enproceso = false;
            this.grabo = false;
          }
        );
      }
      if (resp.cargaarchivo === "descargar") {
        this.registro.nombre = resp.archivogenerado.nombre + '.' + resp.archivogenerado.extension;
        this.registro.tipo = resp.archivogenerado.tipo;
        this.registro.archivoDescarga = resp.archivogenerado.contenido;
        this.registro.extension = resp.archivogenerado.extension;
        this.descargaAdjunto(this.registro);
        this.lmantenimiento = [];
        this.enproceso = false;
        this.recargar();
      }
    }
    this.lmantenimiento = [];
  }

  descargaAdjunto(registro: any) {
    const linkElement = document.createElement('a');
    let bytes = registro.archivoDescarga;
    let base = this.arrayBufferToBase64(bytes);
    var blob = new Blob([this.base64ToArrayBuffer(bytes)], { type: registro.tipo });
    const bloburl = URL.createObjectURL(blob);
    if (registro.extension === 'pdf') {
      window.open(bloburl);
    } else {
      linkElement.href = bloburl;
      linkElement.download = registro.nombre;
      //  linkElement.click();
      const clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': false
      });
      linkElement.dispatchEvent(clickEvent);
    }
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

  generarcash(): boolean {
    this.graba = false;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        reg.mdatos.generar = true;
        this.graba = true;
      }
    }
    return this.graba;
  }
}
