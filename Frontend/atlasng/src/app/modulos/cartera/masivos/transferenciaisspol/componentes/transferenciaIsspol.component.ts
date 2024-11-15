import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-cargar-descuentos',
  templateUrl: 'transferenciaIsspol.html'
})

export class TransferenciaIsspolComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lparticion: SelectItem[] = [{ label: "...", value: null }];
  public ltipoarchivo: SelectItem[] = [{ label: "...", value: null }];
  public ltotales: any = [];
  public displayEvent: any;
  public mdatosarchivosngstr = {};

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarTransferenciaPersona', 'CARGATRANSFERENCIA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  clickButton(model: any) {
    this.displayEvent = model;
  }

  eventClick(model: any) {
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title,
        allDay: model.event.allDay
        // other params
      },
      duration: {}
    }
    this.displayEvent = model;
  }

  updateEvent(model: any) {
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title
        // other params
      },
      duration: {
        _data: model.duration._data
      }
    }
    this.displayEvent = model;
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
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    super.encerarMensajes();
    this.crearDtoMantenimiento();
    super.grabar(false);
  }

  public crearDtoMantenimiento() {
    this.rqMantenimiento.mdatos.narchivo = this.mcampos.narchivo;
    super.addMantenimientoPorAlias(this.alias, super.getMantenimiento(1));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  // Fin MANTENIMIENTO *********************

  onSelectArchivo(event) {
    super.encerarMensajes();

    const file = event.files[0];
    this.mcampos.narchivo = file.name;
    this.mcampos.extension = file.name.substr(file.name.lastIndexOf('.') + 1);
    this.mcampos.tipo = file.type;
    this.mcampos.tamanio = file.size / 1000; // bytes/1000
    this.mcampos.cusuarioing = this.dtoServicios.mradicacion.cusuario;

    // Valida tipo de archivo
    if (this.mcampos.extension !== "xls" && this.mcampos.extension !== "xlsx") {
      this.mostrarMensajeError("SE REQUIERE ARCHIVO TIPO EXCEL");
      return;
    }

    const fReader = new FileReader();
    fReader.addEventListener('loadend', this.actualizaArchivo);
    fReader.readAsDataURL(file);
  }

  cancelarSubir() {
    this.lregistros = [];
    this.ltotales = [];
  }

  actualizaArchivo = (event) => {
    this.mcampos.archivo = event.srcElement.result.split('base64,')[1];
    this.obtnerdatos();
  }

  obtnerdatos() {
    this.rqConsulta.CODIGOCONSULTA = 'CARGATRANSFERENCIA';
    this.rqConsulta.mdatos = this.mcampos;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.lregistros = [];
          this.ltotales = [];
          if (resp.cod === 'OK') {
            this.postQuery(resp);

            // Totalizador de datos
            this.mcampos.totalmonto = resp.TOTALESCARGA.totalmonto;
            this.mcampos.totalregistros = resp.TOTALESCARGA.totalregistros;
          } else {
            super.mostrarMensajeError(resp.msgusu);
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

}
