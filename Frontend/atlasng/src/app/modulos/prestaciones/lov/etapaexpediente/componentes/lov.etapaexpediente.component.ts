import { Component, OnInit, Output, Input, EventEmitter, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-lov-eta-expediente',
  templateUrl: 'lov.etapaexpediente.html'
})
export class LovEtapaExpedienteComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  lhistorico: any[];

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpreflujoexpediente', 'FlujoExpediente', false);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.flujoid', this.mfiltros, '');
    consulta.addSubquery('Tpreetapa', 'descripcionetapa', 'etapa', ' t.cetapaactual = i.codigoetapa ');
    consulta.addSubquery('tpreexpediente', 'totalliquidacion', 'liquidacion', 'i.cexpediente = t.cexpediente');
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
     

  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }


  showDialog() {
    this.displayLov = true;
  }

  //llenar valores temporalmente
 public llenarHistorico() {
    this.lhistorico = [];
    this.lhistorico.push({ etapa: 'Atencion al cliente', fechainicio: '01/01/2017 13:57:00', fechafin: '01/01/2017 14:30:00', dias: '0.023', liquidacion: '30.987.98', estado: 'Aprobado', usuario:'Estefania Guanin', observacion: ''  });
    this.lhistorico.push({ etapa: 'Liquidacion', fechainicio: '01/01/2017 14:30:00' , fechafin: '01/01/2017 14:35:00', dias: '0.003', liquidacion: '30.987.98', estado: 'Aprobado', usuario:'Alberto Olivo', observacion: ''  });
    this.lhistorico.push({ etapa: 'Financiero', fechainicio: '01/06/2017 14:35:00' , fechafin: '01/06/2017 14:36:00', dias: '0.001', liquidacion: '30.987.98', estado: 'Rechazado', usuario:'Maritza Burgos ', observacion: 'liquidacion erronea'  });
  }
}
