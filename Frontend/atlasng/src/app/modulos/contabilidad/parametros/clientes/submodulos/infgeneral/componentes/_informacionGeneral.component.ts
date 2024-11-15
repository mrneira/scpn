import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-informacion-general-cliente',
  templateUrl: '_informacionGeneral.html'
})
export class InformacionGeneralComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Input()
  cliente: BaseComponent;

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
    
    this.cliente.registro.fingreso= this.fechaactual;
    this.cliente.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
  }
  validarDocumento() {

    this.rqConsulta.CODIGOCONSULTA = 'VALPROVEEDOR';
    this.rqConsulta.mdatos.documento = this.cliente.registro.identificacion;
    this.rqConsulta.mdatos.tipo = this.cliente.registro.tipoidentificacioncdetalle;
    this.rqConsulta.mdatos.esnuevo = this.cliente.registro.esnuevo;
    this.rqConsulta.mdatos.cliente= true;

    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
         
          if (resp.cod != 'OK') {
            this.cliente.registro.identificacion=null;
            super.mostrarMensajeError(resp.msgusu);           
          }

        })
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

}
