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
  selector: 'app-cargaarchivocash',
  templateUrl: 'cargaarchivocash.html'
})
export class CargaArchivoCashComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lresumen: any[];
  public lduplicados: any[];
  public cargaok: boolean;
  public dupliok: boolean;
  public lregistrosProb = [];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcarrecaudacion', 'RECAUDACION', false);
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
    //this.fijarListaAgencias();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {
    if (!this.validaFiltrosConsulta()) {
      return;

    }
  }

  generarArchivo(accion: string) {
    if (!this.estaVacio(this.lduplicados)) {
      this.mostrarMensajeError("EXISTEN REGISTROS DUPLICADOS");
      return;

    }
    this.rqMantenimiento.mdatos.cargaarchivo = accion;
    this.grabar();
  }

  grabar(): void {
  
      if (this.mcampos.archivo == undefined || this.mcampos.archivo == null) {
        this.mostrarMensajeError("ES NECESARIO SELECCIONAR UN ARCHIVO DE RESPUESTA");
        return;
      }
      if (this.mcampos.extension.toLocaleLowerCase() != "txt") {
        this.mostrarMensajeError("TIPO DE ARCHIVO INVÁLIDO");
        return;
      }

      this.lmantenimiento = []; // Encerar Mantenimiento
      this.rqMantenimiento.mdatos.fcontable = this.dtoServicios.mradicacion.fcontable;
     
      this.rqMantenimiento.mdatos.lreg= this.lregistros;
      this.crearDtoMantenimiento();
      super.grabar();
    
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  cancelarSubir() { }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (!this.estaVacio(resp.duplicados)) {
      this.lduplicados = resp.duplicados;
      this.dupliok = true;
      this.lregistros=resp.ldatos;
    }else{
      // if (resp.actualizado == "OK") {
        this.lresumen = resp.resumen;
        this.cargaok = true;
        this.lregistros=resp.ldatos;
     }
  }

  onSelectArchivo(event) {
    const file = event.files[0];
    const fReader = new FileReader();
    fReader.addEventListener('loadend', this.actualizaArchivo);
    fReader.readAsDataURL(file);

    this.rqMantenimiento.mdatos.narchivo = file.name;
    this.rqMantenimiento.mdatos.extension = file.name.substr(file.name.lastIndexOf('.') + 1);
    this.mcampos.extension = this.rqMantenimiento.mdatos.extension;
    this.rqMantenimiento.mdatos.tipo = file.type;
    if (this.mcampos.extension.toLocaleLowerCase() != "txt") {
      this.mostrarMensajeError("Archivos permitidos con extensión .txt");
      return;
    }
    this.rqMantenimiento.mdatos.tamanio = file.size / 1000; // bytes/1000
    this.rqMantenimiento.mdatos.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.rqMantenimiento.mdatos.cargaarchivo = "cargainicial";
    
  }
  actualizaArchivo = (event) => {
    this.rqMantenimiento.mdatos.archivo = event.srcElement.result.split('base64,')[1];
    this.mcampos.archivo = this.rqMantenimiento.mdatos.archivo;
    this.grabar();
  }

  cargarArchivo(accion: string) {
    if (this.estaVacio(this.rqMantenimiento.mdatos.narchivo)) {
      super.mostrarMensajeError("SE REQUIERE CARGAR UN ARCHIVO DE RESPUESTA");
      return;
    }

    this.rqMantenimiento.mdatos.cargaarchivo = accion;
    this.grabar();
  }


}
