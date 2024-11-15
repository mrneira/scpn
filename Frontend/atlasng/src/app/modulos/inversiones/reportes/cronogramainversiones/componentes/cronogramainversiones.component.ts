import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { Options } from 'fullcalendar';


@Component({
  selector: 'app-cronograma',
  templateUrl: 'cronogramainversiones.html'
})

export class CronogramaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  displayEvent: any;
  public mdatosarchivosngstr = {};
  public mostrarInversion :boolean = false;
  public mostrarFeriado :boolean = false;
  public mostrarPermiso :boolean = false;
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CRONOGRAMA', false, false);
    this.componentehijo = this;
  }

  events: any[];

  header: any;
  ngOnInit() {
    this.obtnerdatos();
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

   
    this.mostrarInversion= true;
  
  
  }
  salir(){
    this.mostrarInversion= false;
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





  obtnerdatos() {
    this.rqConsulta.CODIGOCONSULTA = 'CRONOGRAMAINV';
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


