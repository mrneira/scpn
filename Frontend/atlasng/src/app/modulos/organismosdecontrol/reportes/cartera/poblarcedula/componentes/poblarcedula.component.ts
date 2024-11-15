import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ArchivoComponent } from '../../../../../generales/archivo/componentes/archivo.component';
import { ResultadoCargaComponent } from '../submodulos/resultadocarga/componentes/resultadoCarga.component';

@Component({
  selector: 'app-poblarcedula',
  templateUrl: 'poblarcedula.html'
})
export class PoblarCedulaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(ResultadoCargaComponent)
  resultadoCargaComponente: ResultadoCargaComponent;

  public ltipoarchivo: SelectItem[] = [{ label: '...', value: null }];

    constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CARGAARCHIVOS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // NO APLICA
  }

  actualizar() {
    // NO APLICA
  }

  eliminar() {
    // NO APLICA
  }

  cancelar() {
    // NO APLICA
  }

  public selectRegistro(registro: any) {
    // NO APLICA
  }

  // Inicia CONSULTA *********************
  consultar() {
    // NO APLICA
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.resultadoCargaComponente.postQuery(resp);
  }
  // Fin CONSULTA *********************

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    this.resultadoCargaComponente.lregistros = resp.lregistros;
    this.rqMantenimiento.lregistros = resp.lregistros;
    this.resultadoCargaComponente.postCommit(resp);  
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const tipoarchivo = new ArchivoComponent(this.router, this.dtoServicios);
    const consTipoArchivo = tipoarchivo.crearDtoConsulta();
    this.addConsultaCatalogos('TIPOARCHIVO', consTipoArchivo, this.ltipoarchivo, super.llenaListaCatalogo, 'ctipoarchivo');

    this.ejecutarConsultaCatalogos();
  }

  uploadHandler(event) {
    this.rqMantenimiento.narchivo = event.files[0].name;
    this.rqMantenimiento.cargaarchivo = 'upload';
    this.getBase64(event);
  }

  getBase64(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.propagateChange(myReader.result);
    }
    myReader.readAsDataURL(file);
  }

  propagateChange = (value: any) => {
    this.rqMantenimiento.archivo = value;
    const rqMan = this.getRequestMantenimiento();
    this.dtoServicios.ejecutarRestMantenimiento(rqMan, null, null).subscribe(
      resp => {
        if (resp.cod === 'OK') {
          this.grabo = true;
        }
        this.encerarMensajes();
        this.respuestacore = resp;
        this.componentehijo.postCommit(resp);
        this.dtoServicios.llenarMensaje(resp, true); // solo presenta errores.
        this.enproceso = false;
      },
      error => {
        this.dtoServicios.manejoError(error);
        this.enproceso = false;
        this.grabo = false;
      }
      // finalizacion
    );
  };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  cancelarSubir() {
    this.limpiarCampos();
  }

  limpiarCampos() {
    this.rqMantenimiento.narchivo = '';
    this.resultadoCargaComponente.lregistros = [];
  }

  
  imprimir(resp: any): void {
    const linkElement1 = document.createElement('a');
    var Fecha = new Date();
    var mes = Fecha.getMonth() + 1;
    var dia = Fecha.getDate();
    var respmes = '';
    var respdia = '';
    if (mes < 10) {
      respmes = '0'
    }
    if (dia < 10) {
      respdia = '0'
    }
    var data = ""; 
    var archivo = "";
    var separador = ('\t'); 
    var salto = ('\n');
    var cabecera = 'P01' + separador + this.resultadoCargaComponente.lregistros[0].mdatos.codigo + separador + dia + '/' + respdia +respmes + mes +'/'  + Fecha.getFullYear().toString();
    var contador = 0;
    var numerolineas = 0;
    
    for(const i in this.resultadoCargaComponente.lregistros){
      if (this.resultadoCargaComponente.lregistros.hasOwnProperty(i)) {
        const reg = this.resultadoCargaComponente.lregistros[i];
         if (reg.identificacion !== undefined && reg.identificacion !== null) {
           
            this.mcampos.identificacion = reg.identificacion;
            this.mcampos.nombre = reg.nombre;
            this.mcampos.fnacimiento = reg.mdatos.fnacimiento;
            
            if(reg.mdatos.status === 'OK')
            {
              data =  data + reg.identificacion  + separador + 
              reg.nombre + separador + 
              reg.mdatos.fnacimiento + separador + salto ;
              contador ++;
            }            
           
          }
        }  
      }          
          numerolineas = contador + 1; 
          archivo = cabecera +separador + numerolineas + separador + salto + data;  
          var blob = new Blob([archivo], { type: 'application/octet-stream' });
          const bloburl = URL.createObjectURL(blob);          
          linkElement1.href = bloburl;         
          linkElement1.download = "P01E" + this.resultadoCargaComponente.lregistros[0].mdatos.codigo +  dia + respdia + respmes + mes + Fecha.getFullYear().toString() +'.' + "txt";
          const clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': false
          });
        linkElement1.dispatchEvent(clickEvent);
  
  }

}
