import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
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
  selector: 'app-liquidacion',
  templateUrl: 'liquidacion.html'
})
export class LiquidacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsocCesantia', 'LIQUIDACION', true);
  }
  devolucion : boolean = false;
  cesantia : boolean = false;

  ngOnInit() {
    this.componentehijo = this;
  }

  ngAfterViewInit() {
    this.formvalidado = true;
  }

   // Inicia CONSULTA *********************
   consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', 't.cexpediente', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia('select p.descripcionetapa from  ' + this.obtenerBean('tpreflujoexpediente') + '   u , ' + this.obtenerBean('Tpreetapa') +
    ' p where p.codigoetapa = u.cetapaactual and u.cexpediente = t.cexpediente' , 'descripcionetapa');

    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    //modificar solo para pruebas 
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.cdetalleestado = "ACT";
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
//    this.cesantia = this.valoresExpediente.regDatos.transaccion === "cesantia" ? true:false;
//    this.devolucion = this.valoresExpediente.regDatos.transaccion === "devolucion" ? true:false; 
//    if (this.valoresExpediente.regDatos.bonificacionFallecimientoAC)
//    {this.cesantia =  true;
//    this.devolucion = false;
//    this.valoresExpediente.regDatos.tiempomixto = "NO";}
  }

 
}