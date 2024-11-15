import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-prestamos',
  templateUrl: 'prestamos.html'
})
export class PrestamosComponent extends BaseComponent implements OnInit, AfterViewInit {

  totalmonto = 0;
  totalvencido = 0;
  nsaldo = 0;
  public OPERACIONESGARANTE: any;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'PRESTAMOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }



  // Inicia CONSULTA *********************

  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    //super.consultar();
  }

  public crearDtoConsulta() {
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 204;
    this.rqConsulta.CODIGOCONSULTA = 'EXPEDIENTEPRESTAMOS';
    this.rqConsulta.cpersona = this.mfiltros.cpersona;
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod === 'OK') {
            super.postQueryEntityBean(resp);
            this.OPERACIONESGARANTE = resp.OPERACIONESGARANTE;
            this.obtenertotal();
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  public fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {

  }
  // Fin CONSULTA *********************
  public obtenertotal(): number {
    let valor = 0;
    let vencido = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        // if (this.lregistros[i].cestatus === 'VIG') {
        valor += this.lregistros[i].saldo;
        vencido += this.lregistros[i].valorvencido;
        // }
      }
    }
    this.totalmonto = valor;
    this.totalvencido = vencido;
    //this.valoresExpediente.regDatos.tprestamos = valor;
    //this.valoresExpediente.calcularTotalLiquidacion(false, '');
    return valor
  }

  public limpiar() {
    this.lregistros = [];
    this.OPERACIONESGARANTE = [];
  }


  public liquidar(registro: any) {

    this.rqMantenimiento['cmodulo'] = 28;
    this.rqMantenimiento['ctransaccion'] = 4;
    this.rqMantenimiento['Monto'] = registro.mdatos.saldo;
    this.rqMantenimiento['Coperacion'] = registro.coperacion;

    this.encerarMensajes();
    const rqMan = this.getRequestMantenimiento();
    this.dtoServicios.ejecutarRestMantenimiento(rqMan).subscribe(
      resp => {
        // this.postCommitEntityBean(resp);
        this.dtoServicios.llenarMensaje(resp, true); // solo presenta errores.
        this.enproceso = false;
        this.grabo = true;
        let bytes = resp['reportebyte'];
        if (resp.cod === 'OK') {

        }

      },
      error => {
        this.dtoServicios.manejoError(error);
        this.enproceso = false;
        this.grabo = false;
      }
      // finalizacion
    );
  }









}
