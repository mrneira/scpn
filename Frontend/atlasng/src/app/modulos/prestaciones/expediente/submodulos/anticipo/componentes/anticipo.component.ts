import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { LovEtapaExpedienteComponent } from '../../../../lov/etapaexpediente/componentes/lov.etapaexpediente.component';



@Component({
  selector: 'app-anticipo',
  templateUrl: 'anticipo.html'

})
export class AnticipoComponent extends BaseComponent implements OnInit, AfterViewInit {

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpreexpediente', 'ANTICIPO', true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {

  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', 't.cexpediente', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle','nombre','nestado','t.ccatalogoestado = i.ccatalogo and t.cdetalleestado = i.cdetalle');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    //consulta el expediente activo de un socio.
    this.mfiltros.anticipo = true;
    this.mfiltros.cdetalletipoexp = 'ANT';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }



  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

  }
  // Fin CONSULTA *********************
}
