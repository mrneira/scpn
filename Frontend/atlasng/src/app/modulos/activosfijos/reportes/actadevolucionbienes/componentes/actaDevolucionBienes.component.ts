import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovDevolucionesComponent } from '../../../lov/devoluciones/componentes/lov.devoluciones.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-reporte-ActaDevolucionBienes',
  templateUrl: 'actaDevolucionBienes.html'
})
export class ActaDevolucionBienesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(LovDevolucionesComponent)
  private lovdevoluciones: LovDevolucionesComponent;

  public ltipodoc: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfkardexprodcodi', 'CONSULTAPRODUCTOSFUNCIONARIO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
   
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
    if(!this.validaFiltrosConsulta()){
      return;
    }
    this.consultarFuncionariosActa();
    
  }
 
  mostrarlovdevoluciones(): void {
    
    this.lovdevoluciones.mfiltros.tipoingresocdetalle = "DEVFUN";    
    this.lovdevoluciones.showDialog(true);
  }

  /**Retorno de lov de Devoluciones. */
  fijarLovDevolucionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cingreso = reg.registro.cingreso;     
      this.consultar();
    }
  }

  //MÉTODO PARA CONSULTAR LISTADO DE PRODUCTOS ASIGNADOS A FUNCIONARIOS -- COMPONENTE DE CONSULTA
  consultarFuncionariosActa() {
    this.rqConsulta.CODIGOCONSULTA = 'AF_LISTADEVOLUCION';
    this.rqConsulta.storeprocedure = "sp_AcfConListadoFuncionariosActaDevolucion";
    this.rqConsulta.parametro_cingreso = this.mfiltros.cingreso;

    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaDocumentos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaDocumentos(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.AF_LISTADEVOLUCION;
    }
  }

  Descargar(resp: any, event) {
    this.rqConsulta.CODIGOCONSULTA = 'AF_DESCARGAACTADEVOLUCION';
    this.rqConsulta.mdatos.cingreso = this.mfiltros.cingreso;
    this.rqConsulta.mdatos.cpersona =  resp.cusuariodevolucion;
    this.rqConsulta.mdatos.UsuarioDevuelve = resp.UsuarioDevuelve;
    this.rqConsulta.mdatos.tipodescarga = event.currentTarget.name;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.descargaAdjunto(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
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
  }


}
