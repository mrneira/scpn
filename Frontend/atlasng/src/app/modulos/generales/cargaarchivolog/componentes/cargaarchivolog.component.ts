import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-cargaarchivolog',
  templateUrl: 'cargaarchivolog.html'
})
export class CargaArchivoLogComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public ltipoarchivo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tgencargaarchivolog', 'CARGAARCHIVOLOG', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.cargarTipoArchivo();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.clog', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 1000;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    for (const i in this.lregistros) {
      this.lregistros[i].fcarga = super.calendarToFechaString(this.lregistros[i].fcarga);
      //this.lregistros[i].freal = super.calendarToFechaString(this.lregistros[i].freal);
    }
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
  }

  cargarTipoArchivo() {
    this.rqConsulta.CODIGOCONSULTA = 'COR_TIPOARCHIVO';
    this.rqConsulta.storeprocedure = "sp_CoreConTipoArchivo";

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaCargarTipoArchivo(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
    this.rqConsulta.CODIGOCONSULTA = undefined;
    this.rqConsulta.storeprocedure = undefined;
  }

  private manejaCargarTipoArchivo(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      resp.COR_TIPOARCHIVO.forEach(element => {
        this.ltipoarchivo.push({ label: element.nombre, value: element.nombre });
      });
    }
  }

}
