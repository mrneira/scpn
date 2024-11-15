import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent } from '../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';


@Component({
  selector: 'app-archivo',
  templateUrl: 'archivo.html'
})

export class ArchivoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public lestado: SelectItem[] = [{label: '...', value: null}];
  public lcharSeparacion: SelectItem[] = [{label: '...', value: null}];

  public lmodulos: SelectItem[] = [{label: '...', value: null}];

   
  
  public mdatosarchivosngstr = {};
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenModuloArchivo', 'TGENModuloARCHIVO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
 
  }
  
  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.cmodulo)) {
      this.mostrarMensajeError('MÓDULO REQUERIDO');
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.cmodulo = this.mfiltros.cmodulo;;

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
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
 
  }
 


consultardatos(registro: any) {
const linkElement = document.createElement('a');


let bytes = registro.archivo;
let base = this.arrayBufferToBase64(bytes);
var blob = new Blob([this.base64ToArrayBuffer(bytes)], {type: registro.tipo});
const bloburl = URL.createObjectURL(blob);


if (registro.extension==='pdf'){
  window.open(bloburl);
}else{
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

descarga(registro: any) {
  let bytes = registro.archivo;
  var blob = new Blob([this.arrayBufferToBase64(bytes)], {type: registro.tipo});
  const bloburl = URL.createObjectURL(blob);
 
  window.open(bloburl);
  }
  
 arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
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
  onSelectArchivoFirma(event) {
    const file =  event.files[0];
    
    const fReader = new FileReader();
    fReader.addEventListener('loadend', this.actualizaArchivoFirma);
    fReader.readAsDataURL(file);
    
    this.registro.nombre=file.name;
    this.registro.extension=file.name.substr(file.name.lastIndexOf('.') + 1);
    this.registro.tipo= file.type;
    this.registro.tamanio = file.size / 1000; // bytes/1000
    this.registro.cmodulo= this.mfiltros.cmodulo;
    this.registro.cusuarioing=  this.dtoServicios.mradicacion.cusuario;
  }
actualizaArchivoFirma = (event) => {
 this.registro.archivo=event.srcElement.result.split('base64,')[1];
}
  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.carchivo', this.mfiltros, this.mfiltrosesp);
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();
    const mfiltrosModulo: any = {'activo': true};
    const consultaModulo = new Consulta('TgenModulo', 'Y', 't.nombre', mfiltrosModulo, {});
    consultaModulo.cantidad = 50;
    this.addConsultaCatalogos('MODULO', consultaModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');
    this.ejecutarConsultaCatalogos();
  }
}

