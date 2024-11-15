import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from './../../../../../../../util/servicios/dto.servicios';
import { Consulta } from './../../../../../../../util/dto/dto.component';
import { NgForm } from '@angular/forms';
import { BaseLovComponent } from './../../../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-socioscertificados',
  templateUrl: 'lov.socioscertificados.html'
})
export class LovSociosCertificadosComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();

  public res;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'LOVSOCIOSCERTIFICADOS', false);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    if (!this.mcampos.identificacion) {
      this.mostrarMensajeError("LA IDENTIFICACIÓN ES UN CAMPO OBLIGATORIO.");
      return;
    } else {
      let cedula = String(this.mcampos.identificacion);
      if (cedula.length == 10) {
        let digito_region = cedula.substring(0, 2);
        if (parseInt(digito_region) >= 1 && parseInt(digito_region) <= 24) {
          let ultimo_digito = cedula.substring(9, 10);
          let pares = parseInt(cedula.substring(1, 2)) + parseInt(cedula.substring(3, 4)) + parseInt(cedula.substring(5, 6)) + parseInt(cedula.substring(7, 8));
          let numero1 = (parseInt(cedula.substring(0, 1)) * 2);
          if (numero1 > 9) { numero1 = (numero1 - 9); }
          let numero3 = (parseInt(cedula.substring(2, 3)) * 2);
          if (numero3 > 9) { numero3 = (numero3 - 9); }
          let numero5 = (parseInt(cedula.substring(4, 5)) * 2);
          if (numero5 > 9) { numero5 = (numero5 - 9); }
          let numero7 = (parseInt(cedula.substring(6, 7)) * 2);
          if (numero7 > 9) { numero7 = (numero7 - 9); }
          let numero9 = (parseInt(cedula.substring(8, 9)) * 2);
          if (numero9 > 9) { numero9 = (numero9 - 9); }
          let impares = numero1 + numero3 + numero5 + numero7 + numero9;
          let suma_total = (pares + impares);
          let primer_digito_suma = String(suma_total).substring(0, 1);
          let decena = (parseInt(primer_digito_suma) + 1) * 10;
          let digito_validador = decena - suma_total;
          if (digito_validador == 10) { digito_validador = 0; }
          if (digito_validador != parseInt(ultimo_digito)) {
            this.mostrarMensajeError("LA IDENTIFICACIÓN ES INCORRECTA.");
            return;
          }
        } else {
          this.mostrarMensajeError("LA IDENTIFICACIÓN NO PERTENECE A NINGUNA REGIÓN.");
          return;
        }
      } else {
        this.mostrarMensajeError("LA IDENTIFICACIÓN TIENE UNA LONGITUD DIFERENTE A 10 DIGITOS.");
        return;
      }
    }
    this.rqConsulta = [];
    this.rqConsulta.cmodulo = 27;
    this.rqConsulta.ctransaccion = 17;
    this.rqConsulta.CODIGOCONSULTA = 'CERTIFICADOSOCIO';
    this.rqConsulta.identificacion = this.mcampos.identificacion;
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          if (resp.cod === 'OK' && resp["DATASOCIO"] != null) {
            this.eventoCliente.emit({ 
              registro: {
                identificacion: resp["DATASOCIO"]["identificacion"], 
                fullname: resp["DATASOCIO"]["fullname"],
                fingreso: resp["DATASOCIO"]["fingreso"]
              },
              searchdatos: resp["searchdatos"]
            });
            this.displayLov = false;
          } else {
            this.eventoCliente.emit({ 
              registro: null,
              searchdatos: resp["searchdatos"]
            });
            this.displayLov = false;
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        }
      );
    this.lconsulta = [];
  }

  public postQuery(resp: any) { }

  showDialog() {
    this.displayLov = true;
  }

  limpiar() {
    this.mcampos.identificacion = undefined;
  }
}
