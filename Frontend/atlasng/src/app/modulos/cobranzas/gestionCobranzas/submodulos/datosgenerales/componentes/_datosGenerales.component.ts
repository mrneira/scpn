import {Component, OnInit, AfterViewInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';
import { SolicitudComponent } from './_solicitud.component';


@Component({
  selector: 'app-datos-generales',
  templateUrl: '_datosGenerales.html'
})
export class DatosGeneralesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Input()
  solicitud: SolicitudComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'INFORMACIONGENERAL', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {}

  crearNuevo() {}

  actualizar() {}

  eliminar() {}

  cancelar() {}

  public selectRegistro(registro: any) {}

  consultar() {}
  
  grabar(): void {}
}
