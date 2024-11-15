import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
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
  selector: 'app-datos',
  templateUrl: '_datos.html'

})
export class DatosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formularioDatoSocio') formularioDatoSocio: NgForm;
  @Input() 
  expediente: BaseComponent;
  
  desEditar = false;
  bandeja = false;
  cexpediente = "No existe una asignación de expediente";//MNE 20231024
  public respuestaEmit: any = { 'mdatos': {} };

  @Output()
  childChanged = new EventEmitter<string>();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'DATOS', true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {

  }

  generarCodigoExpediente(): void {
    //if (!this.estaVacio(this.socio.mcampos.tipobaja)) {
    //this.getAnioBaja();
    
    if (!this.bandeja) {
      this.expediente.componentehijo.generarCodigoExpediente();
    }


    this.respuestaEmit.expediente = this.expediente;
    this.respuestaEmit.collapsed = false;
    this.childChanged.emit(this.respuestaEmit);
    //}

  }

  


}
