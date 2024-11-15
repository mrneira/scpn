import {Component, OnInit, AfterViewInit, ViewChild, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';


@Component({
  selector: 'app-informacion-general',
  templateUrl: '_informacionGeneral.html'
})
export class InformacionGeneralComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Input()
  natural: BaseComponent;

  @Input()
  detalle: BaseComponent;

  public mensajecedula = 'CÉDULA NO VALIDA';
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'INFORMACIONGENERAL', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {}

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    this.grabarValidar();
  }


  grabarValidar() {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento['CODMODULOORIGEN'] = sessionStorage.getItem('m');
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = sessionStorage.getItem('t');
    this.rqMantenimiento['cmodulo'] = 3;
    this.rqMantenimiento['ctransaccion'] = 101;
    this.rqMantenimiento['rollback'] = true;

    this.natural.componentehijo.actualizar();
    this.detalle.componentehijo.actualizar();

    super.addMantenimientoPorAlias(this.natural.componentehijo.alias, this.natural.componentehijo.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalle.componentehijo.alias, this.detalle.componentehijo.getMantenimiento(2));

    this.encerarMensajes();
    const rqMan = this.getRequestMantenimiento();
    this.dtoServicios.ejecutarRestMantenimiento(rqMan).subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, true); // solo presenta errores.
        if (resp.cod === 'OK') {
          this.mostrarMensajeSuccess('VALIDACIÓN CORRECTA'); // solo presenta errores.
        } else {
          this.editable = true;
        }

      },
      error => {
        this.dtoServicios.manejoError(error);

      }

    );
  }

  validarDocumento(){
   
   this.grabarValidar();
    // this.rqMantenimiento['rollback'] = true;  
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        
        if (resp.cod != 'OK') {
          this.detalle.registro.identificacion=null;
        }
      
      })
}
 

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    super.cancelar();
    this.detalle.registro.identificacion = null;
    this.encerarMensajes();
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

  public postCommit(resp: any) {
    
  }

}

