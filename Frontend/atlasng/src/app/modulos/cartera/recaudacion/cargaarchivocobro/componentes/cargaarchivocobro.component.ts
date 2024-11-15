import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-cargaarchivocobro',
  templateUrl: 'cargaarchivocobro.html'
})
export class CargaArchivoCobroComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lresumen: any[];
  public cargaok: boolean;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcarrecaudacion', 'RECAUDACION', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    var fecha = new Date();
    fecha.setDate(fecha.getDate());
    this.mcampos.fgeneracion = fecha;
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
  }

  generarArchivo(accion: string) {
    this.rqMantenimiento.mdatos.cargaarchivo = accion;
    this.grabar();
  }

  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.cargaarchivo = "save";
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
    if (resp.actualizado == "OK") {
      this.lresumen = resp.resumen;
      this.cargaok = true;
    }
  }

  onSelectArchivo(event) {
    const file = event.files[0];
    const fReader = new FileReader();
    fReader.addEventListener('loadend', this.actualizaArchivo);
    fReader.readAsDataURL(file);

    this.rqMantenimiento.mdatos.narchivo = file.name;
    this.rqMantenimiento.mdatos.extension = file.name.substr(file.name.lastIndexOf('.') + 1);
    this.rqMantenimiento.mdatos.tipo = file.type;
    this.rqMantenimiento.mdatos.tamanio = file.size / 1000; // bytes/1000
    this.rqMantenimiento.mdatos.cusuarioing = this.dtoServicios.mradicacion.cusuario;
  }

  actualizaArchivo = (event) => {
    this.rqMantenimiento.mdatos.archivo = event.srcElement.result.split('base64,')[1];
  }

  cargarArchivo(accion: string) {
    if (this.estaVacio(this.rqMantenimiento.mdatos.narchivo)) {
      super.mostrarMensajeError("SE REQUIERE CARGAR ARCHIVO");
      return;
    }
    this.rqMantenimiento.mdatos.cargaarchivo = accion;
    this.grabar();
  }
}
