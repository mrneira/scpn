import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-cargaproductos',
  templateUrl: 'cargaproductos.html'
})

export class CargaProductosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;



  public lmes: SelectItem[] = [{ label: '...', value: null }];
  public lcharSeparacion: SelectItem[] = [{ label: '...', value: null }];

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  public lregistrosProb = [];
  displayEvent: any;
  public mdatosarchivosngstr = {};
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfproductocodificado', 'DECUENTOPERSONA', false, false);
    this.componentehijo = this;
  }

  events: any[];
  
  ngOnInit() {
    super.init(this.formFiltros);
    this.consultaCatalogoMes();
  
  }
  completaMes( mes:number):any{
    var mesNuevo="";
     if(mes<10){
         mesNuevo="0"+mes;
     }else{
         mesNuevo=mes+"";
         
     }
     return mesNuevo;
 }


/**Retorno de lov de paises. */
fijarLovParametroSelec(reg: any): void {
  if (reg.registro !== undefined) {
    this.mcampos.anio = reg.registro.anio;
  }
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
  consultaCatalogoMes(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmes, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
  obtnerdatos() {
    this.rqConsulta.CODIGOCONSULTA = 'CARGAPRODUCTOS';
    this.rqConsulta.mdatos=this.mcampos;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.lregistros = [];
        if (resp.cod === 'OK') {
          this.lregistros = resp.CARGAPRODUCTOS;
          this.lregistrosProb=resp.CARGAPRODUCTOSERROR;
          
          super.mostrarMensajeSuccess(resp.msgusu);
          for (const i in this.lregistros) {
            const reg = this.lregistros[i];
            reg.cdescuentop = undefined;
          }
        }else{
          super.mostrarMensajeError(resp.msgusu);
        }
        
     //   this.cargadatos();
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  }
  

