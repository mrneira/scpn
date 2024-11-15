import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { CamposGarComponent } from './_camposGar.component';
import { OperacionGarComponent } from './_operacionGar.component';

@Component({
  selector: 'app-datos-generales',
  templateUrl: '_datosGenerales.html'
})
export class DatosGeneralesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Input()
  operaciongar: OperacionGarComponent;

  @Input()
  campos: CamposGarComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'INFORMACIONGENERAL', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  public selectRegistro(registro: any) {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    // No existe para el padre
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // No existe para el padre
  }

  public cambiaTipoGarantia() {
    this.operaciongar.cambiaTipoGarantia();
    this.campos.mcampos.ctipogarantia = this.operaciongar.registro.ctipogarantia;
    this.campos.mcampos.ctipobien = this.operaciongar.registro.ctipobien;
    this.cambiaTipoBien();
  }

  public cambiaTipoBien() {
    this.campos.mcampos.ctipobien = this.operaciongar.registro.ctipobien;
    this.campos.consultarCamposParametros();
  }
}
