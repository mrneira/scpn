import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

@Component({
  selector: 'app-inactivacion',
  templateUrl: 'inactivacion.html'
})
export class InactivacionComponent extends BaseComponent implements OnInit, AfterViewInit {


  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, '', 'PORTAFOLIORF', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fvaloracion = new Date();
    this.mcampos.camposfecha.fcorte = new Date();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  grabar(): void {

    this.confirmationService.confirm({
      message: 'Está seguro de inhabilitar la migración de inversiones?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {

        this.rqMantenimiento.copcion = '591829';
        this.rqMantenimiento.mostrarmenu = false;
        this.rqMantenimiento.activo = false;
        super.grabar();
      },
      reject: () => {
      }
    });


  }

}
