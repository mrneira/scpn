import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';



@Component({
  selector: 'app-lov-kardexprodcodi',
  templateUrl: 'lov.kardexprodcodi.html'
})
export class LovKardexProdCodiComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;
  consultarPorStoreProcedure = false;

  public lmodulo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfkardexprodcodi', 'AF_CONKARDEXPC', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {

    if (this.consultarPorStoreProcedure) {
      this.rqConsulta.CODIGOCONSULTA = 'AF_CONKARDEXPC';
      this.rqConsulta.storeprocedure = "sp_AcfConKardexProdCodi";
      this.rqConsulta.parametro_cusuarioasignado = this.mfiltros.cusuarioasignado;
      this.msgs = [];
      this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
        .subscribe(
          resp => {
            this.manejaRespuesta(resp);
          },
          error => {
            this.dtoServicios.manejoError(error);
          });
      this.rqConsulta.CODIGOCONSULTA = null;
    } else {
      const consulta = new Consulta(this.entityBean, 'Y', 't.cbarras', this.mfiltros, this.mfiltrosesp);
      consulta.addSubquery('tacfproducto', 'nombre', 'nombre', 'i.cproducto = t.cproducto');
      consulta.setCantidad(50);
      this.addConsulta(consulta);
      return consulta;
    }
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  private manejaRespuesta(resp: any) {
    super.postQueryEntityBean(resp); 
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  private fijarFiltrosConsulta() {
  }

  seleccionaRegistro(evento: any) {
    this.eventoCliente.emit({ registro: evento.data });
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }
}
