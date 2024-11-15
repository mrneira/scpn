import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from './../../../personas/lov/personas/componentes/lov.personas.component';
import { JasperComponent } from './../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-certificado-prima-seguros',
  templateUrl: 'certificadoPrimaSeguros.html'
})

export class CertificadoPrimaSegurosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovPersonasComponent)
  private lovSocios: LovPersonasComponent;
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  public activateGenerarReporte = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CONSULTACERTIFICADO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros, this.route);
  }

  ngAfterViewInit() { }

  mostrarLovPersonas(): void {
    this.lovSocios.mfiltros.csocio = 1;
    this.lovSocios.mcampos.identificacion = undefined;
    this.lovSocios.mcampos.nombre = undefined;
    this.lovSocios.showDialog();
  }

  fijarLovSociosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.activateGenerarReporte = false;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.consultar();
    }
  }

  consultar() {
    this.rqConsulta = [];
    this.rqConsulta.cmodulo = 27;
    this.rqConsulta.ctransaccion = 201;
    this.rqConsulta.CODIGOCONSULTA = 'DATOSSOCIO';
    this.rqConsulta.cpersona = this.mcampos.cpersona;
    this.rqConsulta.bandeja = false;
    super.consultar();
  }

  public postQuery(resp: any) {
    if (resp["cod"] == "OK") {
      this.rqConsulta = [];
      this.rqConsulta.CODIGOCONSULTA = 'CERTIFICADOPRIMASEGURO';
      this.rqConsulta.storeprocedure = "sp_SgsCertificadoPrimaSeguro";
      this.rqConsulta.parametro_i_identificacion = this.mcampos.identificacion;
      this.msgs = [];
      this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
        .subscribe(
          resppriseg => {
            if(resppriseg["cod"] == "OK"){
              this.validarCertificado(resppriseg["CERTIFICADOPRIMASEGURO"]);
            }else{
              this.mostrarMensajeError("SUCEDIÓ UN ERROR AL VERIFICAR EL CERTIFICADO DE PRIMA DE SEGURO.");
            }
          },
          error => {
            this.dtoServicios.manejoError(error);
          });
      this.rqConsulta.CODIGOCONSULTA = null;
    }
  }

  validarCertificado(operaciones){
    let auxactivate = null;
    for(let i = 0; i < operaciones.length; i++){
      auxactivate = "EL SOCIO CON CÉDULA DE IDENTIDAD: " + operaciones[i]["identificacion"] + ", POSEE LA OPERACIÓN: " + operaciones[i]["coperacion"] + ", QUE REGISTRA VALORES A PAGAR POR CONCEPTO DE PRIMA DE SEGURO " + operaciones[i]["producto"] + ".";
      break;
    }
    if(auxactivate == null){
      this.activateGenerarReporte = true;
    }else{
      this.mostrarMensajeError(auxactivate);
    }
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  descargarReporte(tipo = null) {
    this.jasper.formatoexportar = (tipo == "PDF") ? 'pdf' : 'xls';
    this.jasper.nombreArchivo = 'CertificadoPrimaSeguro';
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Seguros/rptSgsCertificadoPrimaSeguro';
    this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
    this.jasper.parametros['@s_fullname'] = this.mcampos.npersona;
    this.jasper.generaReporteCore();
  }
}
