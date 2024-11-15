import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-certificado-cartera',
  templateUrl: 'carteraIsspol.html'
})
export class CarteraIsspolComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  datosisspol;
  msgIsspol;
  sumaCuotas;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'LISTAOPERACIONES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros, this.route);
  }

  ngAfterViewInit() {
  }

  public selectRegistro(registro: any) {
  }

  // Inicia CONSULTA *********************
  consultar() {
    
    this.rqMantenimiento.mdatos.CODIGOCONSULTA = 'CARTERAISSPOL';
    this.rqMantenimiento.mdatos.cpersona = this.mcampos.cpersona;
    super.grabar();

  }

 
  public postCommit(resp: any) {
    if (resp.cod === "OK") {
      if (resp.creditosISSPOL[0].Mensaje.MensajeError == 4 || resp.creditosISSPOL[0].Mensaje.MensajeError == 3){
        this.msgIsspol = resp.creditosISSPOL[0].Mensaje.DescripcionError
        this.datosisspol=resp.creditosISSPOL = [];
        this.sumaCuotas = 0;
      }else{
        this.sumaCuotas = 0;
        this.msgIsspol="";
        this.datosisspol = resp.creditosISSPOL;
        this.datosisspol = this.datosisspol.filter(item => item.TipoCredito != 'PQ PLAZO FIJO QUIROGRAFARIO')
        this.datosisspol.forEach(li => {
          this.sumaCuotas = this.sumaCuotas+li.CuotaTotal;
          if(li.Mora == 0)
          li.Mora = "No";
          if(li.Mora == 1)
          li.Mora = "Si";
        });
      }
      
    }else{
      error => {
        
        this.dtoServicios.manejoError(error);
        
      };
    }
    
  }


  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
    this.lovPersonas.mfiltros.csocio = 1;
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (!this.estaVacio(reg.registro)) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.consultar();
    }
  }

}
