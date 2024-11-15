import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { Options } from 'fullcalendar';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-agendapagos',
  templateUrl: 'agendapagos.html'
})

export class AgendapagosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild('formFiltros') formFiltros: NgForm;

  displayEvent: any;
  public mdatosarchivosngstr = {};
  public mostrarFeriado :boolean = false;
  public mostrarPermiso :boolean = false;
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'AGENDA', false, false);
    this.componentehijo = this;
  }

  events: any[];

  header: any;
  ngOnInit() {
    this.obtenerDatos();
    super.init(this.formFiltros);
    this.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };

  }
  

  onClikCalendar(reg: any) {
    let id = Number(reg.calEvent._id);
    this.selectRegistro(this.events[id]);

    this.jasper.nombreArchivo = 'rptInvRecuperacionesDeInversiones';


    let lfinicio: number = this.registro.mdatos.fvencimiento;
    let lffin: number = lfinicio;
    let lcinversion: number = -1;
    let lemisorcdetalle: string = "||";
    let linstrumentocdetalle: string = "||";
    this.jasper.formatoexportar = 'pdf';
    this.jasper.parametros['@i_cinversion'] = lcinversion;
    this.jasper.parametros['@i_instrumentocdetalle'] = linstrumentocdetalle;
    this.jasper.parametros['@i_fdesde'] = lfinicio;
    this.jasper.parametros['@i_fhasta'] = lffin;
    this.jasper.parametros['@i_emisorcdetalle'] = lemisorcdetalle;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvRecuperacionesDeInversiones';
    this.jasper.generaReporteCore();
   

  
  
  }



  cargadatos() {

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

  obtenerDatos() {
    this.rqConsulta.CODIGOCONSULTA = 'INVAGENDAPAGOS';
    this.rqConsulta.mdatos.anio = this.fechaactual.getFullYear();
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.lregistros = [];
          if (resp.cod === 'OK') {
            this.events = resp.EVENTOS;

          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

}


