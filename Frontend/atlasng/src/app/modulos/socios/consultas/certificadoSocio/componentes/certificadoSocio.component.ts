import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovSociosCertificadosComponent } from './../submodulo/socioscertificados/componentes/lov.socioscertificados.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-certificado-cartera',
  templateUrl: 'certificadoSocio.html'
})
export class CertificadoSocioComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovSociosCertificadosComponent)
  private lovSocio: LovSociosCertificadosComponent;

  public lTipoGeneracion: SelectItem[] = [
    { label: '...', value: null },
    { label: 'Individual', value:  'INDIVIDUAL'},
    { label: 'Masivo', value:  'GRUPO'}
  ];
  
  public ltypePeriodo: SelectItem[] = [
    { label: '...', value: null },
    { label: 'Establecer manualmente', value:  'MANUAL'},
    { label: 'Desde que ingresó a la institución hasta la actualidad', value:  'ACTUALIDAD'}
  ];

  public ltypePeriodoModal: SelectItem[] = [
    { label: '...', value: null },
    { label: 'Establecer manualmente', value:  'MANUALMODAL'},
    { label: 'Desde que ingresó a la institución hasta la actualidad', value:  'ACTUALIDADMODAL'}
  ];

  public existeListaSocios = true;
  public activateGenerarReporte = false;
  public searchdatos = null;
  public lregistroscertificados = [];
  public estadoBtnTabla = false;
  public mostrarDialogoConfigAportanteRepMasivo = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CERTIFICADOSOCIO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros, this.route);
    this.mcampos.incluiropcancelada = false;
  }

  eventoIncluirOpCanceladas(event: Event){
    this.mcampos.incluiropcancelada = event;
  }

  eventoIncluirOpCanceladasModal(event: Event){
    this.mcampos.incluiropcanceladamodal = event;
  }

  eventoSelectModoGenearcion(){
    this.mcampos.identificacion = null;
    this.mcampos.nombre = null;
    this.mcampos.incluiropcancelada = false;
    this.mcampos.tipoPeriodo = null;
    this.mcampos.finicio = null;
    this.mcampos.ffin = null;
    this.activateGenerarReporte = false;
    this.existeListaSocios = true;
    if(this.mcampos.tipoGenetacion == "GRUPO"){
      this.lregistroscertificados = [];
    }
    this.estadoBtnTabla = false;
  }

  eliminarRegistro(reg: Event){
    let  pos = null;
    let aux = this.lregistroscertificados;
    this.lregistroscertificados = [];
    for (let index = 0; index < aux.length; index++) {
      if(aux[index]["identificacion"] == reg["identificacion"]){
        pos = index;
        break;
      }
    }
    aux.splice(pos, 1);
    for(let i = 0; i < aux.length; i++){
      this.lregistroscertificados.push({
        identificacion: aux[i]["identificacion"],
        fullname: aux[i]["fullname"],
        tipocertificacion: aux[i]["tipocertificacion"],
        incluircanceladas: aux[i]["incluircanceladas"],
        periodo: aux[i]["periodo"],
        searchdatos: aux[i]["searchdatos"],
        fechainicio: aux[i]["fechainicio"],
        fechafin : aux[i]["fechafin"]
      });
    }
  }

  habilitarGenerarReporteMasivo(){
    if(this.lregistroscertificados.length > 0){
      this.estadoBtnTabla = !this.estadoBtnTabla;
      this.activateGenerarReporte = this.estadoBtnTabla;
    }else{
      this.mostrarMensajeError("NO AGREGADO SOCIOS PARA GENERAR EL CERTIFICADO.");
    }
  }

  public agregarConfigAportanteRepMasivo(){
    if(!this.mcampos.tipoPeriodomodal){
      this.mostrarMensajeError("ES OBLIGATORIO SELECCIONAR UN PERIODO.");
      return;
    }
    let fechaInicio = null;
    let fechaFinal = null;
    if(this.mcampos.tipoPeriodomodal == "MANUALMODAL"){
      if(!this.mcampos.finiciomodal || !this.mcampos.ffinmodal){
        this.mostrarMensajeError("DEBE INGRESAR UN PERIDO DE TIEMPO.");
        return;
      }
      if(new Date(this.mcampos.finiciomodal).getTime() > new Date(this.mcampos.ffinmodal).getTime()){
        this.mostrarMensajeError("LA FECHA DESDE NO PUEDE SER MAYOR A LA FECHA HASTA.");
        return;
      }
      fechaInicio = String(this.mcampos.finiciomodal.getFullYear()) + "-" + String(((this.mcampos.finiciomodal.getMonth()+1) < 10) ? "0" + ((this.mcampos.finiciomodal.getMonth()+1)): (this.mcampos.finiciomodal.getMonth()+1)) + "-" + String((this.mcampos.finiciomodal.getDate() < 10) ? "0" + this.mcampos.finiciomodal.getDate() : this.mcampos.finicio.getDate());
      fechaFinal = String(this.mcampos.ffinmodal.getFullYear()) + "-" + String(((this.mcampos.ffinmodal.getMonth()+1) < 10) ? "0" + ((this.mcampos.ffinmodal.getMonth()+1)): (this.mcampos.ffinmodal.getMonth()+1)) + "-" + String((this.mcampos.ffinmodal.getDate() < 10) ? "0" + this.mcampos.ffinmodal.getDate() : this.mcampos.ffinmodal.getDate());
    }else{
      const dataNow = new Date();
      fechaInicio = this.mcampos.auxfiniciomodal;
      fechaFinal = String(dataNow.getFullYear()) + "-" + String(((dataNow.getMonth()+1) < 10) ? "0" + ((dataNow.getMonth()+1)): (dataNow.getMonth()+1)) + "-" + String((dataNow.getDate() < 10) ? "0" + dataNow.getDate() : dataNow.getDate());
    }
    let aux = this.lregistroscertificados;
    this.lregistroscertificados= [];
    aux.push({
      identificacion: this.mcampos.identificacionmodal,
      fullname: this.mcampos.nombremodal,
      tipocertificacion: "APORTANTE",
      incluircanceladas: (this.mcampos.incluiropcanceladamodal) ? "SI" : "NO",
      periodo: fechaInicio + " a " + fechaFinal,
      searchdatos: this.searchdatos,
      fechainicio: fechaInicio,
      fechafin : fechaFinal
    });
    for(let i = 0; i < aux.length; i++){
      this.lregistroscertificados.push({
        identificacion: aux[i]["identificacion"],
        fullname: aux[i]["fullname"],
        tipocertificacion: aux[i]["tipocertificacion"],
        incluircanceladas: aux[i]["incluircanceladas"],
        periodo: aux[i]["periodo"],
        searchdatos: aux[i]["searchdatos"],
        fechainicio: aux[i]["fechainicio"],
        fechafin : aux[i]["fechafin"]
      });
    }
    this.mostrarDialogoConfigAportanteRepMasivo = false;
  }

  public cerrarDialogoAportanteRepMasivo(){
    this.mostrarDialogoConfigAportanteRepMasivo = false;
  }
  
  /**Muestra lov de personas */
  mostrarLovSocio(): void {
    this.lovSocio.mcampos.identificacion = null;
    this.lovSocio.showDialog();
    this.lovSocio.mfiltros.csocio = 1;
    this.activateGenerarReporte = false;
  }

  /**Retorno de lov de personas. */
  fijarLovEncontrado(reg: any): void {
    this.mcampos.incluiropcancelada = false;
    this.mcampos.tipoPeriodo = null;
    this.mcampos.finicio = null;
    this.mcampos.ffin = null;
    this.activateGenerarReporte = false;
    this.searchdatos = (reg && reg["searchdatos"]) ? reg["searchdatos"]: null;
    if (reg && reg["registro"] != null){
      if(this.mcampos.tipoGenetacion && this.mcampos.tipoGenetacion == 'GRUPO'){
        if(this.searchdatos == 'SOCIOAPORTANTE'){
          let aux = this.lregistroscertificados;
          if(!aux.find(r=>(r["identificacion"] == reg.registro.identificacion))){
            this.mcampos.identificacionmodal = reg.registro.identificacion;
            this.mcampos.nombremodal = reg.registro.fullname;
            this.mcampos.incluiropcanceladamodal = false;
            this.mcampos.finiciomodal = null;
            this.mcampos.tipoPeriodomodal = null;
            this.mcampos.auxfiniciomodal = reg.registro.fingreso;
            this.mcampos.ffinmodal = null;
            this.mostrarDialogoConfigAportanteRepMasivo = true;
          }else{
            this.lregistroscertificados= [];
            this.mostrarMensajeError("EL SOCIO YA SE ENCUENTRA AGREGADO.");
            for(let i = 0; i < aux.length; i++){
              this.lregistroscertificados.push({
                identificacion: aux[i]["identificacion"],
                fullname: aux[i]["fullname"],
                tipocertificacion: aux[i]["tipocertificacion"],
                incluircanceladas: aux[i]["incluircanceladas"],
                periodo: aux[i]["periodo"],
                searchdatos: aux[i]["searchdatos"],
                fechainicio: aux[i]["fechainicio"],
                fechafin : aux[i]["fechafin"]
              });
            }
          }
        }else{
          let aux = this.lregistroscertificados;
          this.lregistroscertificados= [];
          if(!aux.find(r=>(r["identificacion"] == reg.registro.identificacion))){
            aux.push({
              identificacion: reg.registro.identificacion,
              fullname: reg.registro.fullname,
              tipocertificacion: (this.searchdatos == "SOCIONOAPORTANTE") ? "NO APORTANTE": "PERSONA NATURAL",
              incluircanceladas: "NO APLICA",
              periodo: "NO APLICA",
              searchdatos: this.searchdatos,
              fechainicio: "0000-00-00",
              fechafin : "0000-00-00"
            });
          }else{
            this.mostrarMensajeError("EL SOCIO YA SE ENCUENTRA AGREGADO.");
          }
          for(let i = 0; i < aux.length; i++){
            this.lregistroscertificados.push({
              identificacion: aux[i]["identificacion"],
              fullname: aux[i]["fullname"],
              tipocertificacion: aux[i]["tipocertificacion"],
              incluircanceladas: aux[i]["incluircanceladas"],
              periodo: aux[i]["periodo"],
              searchdatos: aux[i]["searchdatos"],
              fechainicio: aux[i]["fechainicio"],
              fechafin : aux[i]["fechafin"]
            });
          }
        }
      }else{
        this.mcampos.identificacion = reg.registro.identificacion;
        this.mcampos.nombre = reg.registro.fullname;
        this.existeListaSocios = true;
        this.activateGenerarReporte = true;
      }
    }else{
      this.registro.identificacion = this.lovSocio.mcampos.identificacion;
      this.mostrarMensajeError("LA PERSONA NO SE ENCUENTRA REGISTRADA EN EL SISTEMA; POR FAVOR, PROCEDA A REGISTRALA PARA PODER GENERAR EL CERTIFICADO.");
      this.existeListaSocios = false;
    }
  }

  //GuardarSocio
  crearNuevoSocio() {
    if (!this.registro.identificacion) {
      this.mostrarMensajeError("LA IDENTIFICACIÓN ES UN CAMPO OBLIGATORIO.");
      return;
    } else {
      let cedula = String(this.registro.identificacion);
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
    if (!this.registro.apellidopaterno || (this.registro.apellidopaterno && ((String(this.registro.apellidopaterno)).trim()).length <= 0)) {
      this.mostrarMensajeError("EL APELLIDO PATERNO ES UN CAMPO OBLIGATORIO.");
      return;
    }
    if (!this.registro.apellidomaterno || (this.registro.apellidomaterno && ((String(this.registro.apellidomaterno)).trim()).length <= 0)) {
      this.mostrarMensajeError("EL APELLIDO MATERNO ES UN CAMPO OBLIGATORIO.");
      return;
    }
    if (!this.registro.primernombre || (this.registro.primernombre && ((String(this.registro.primernombre)).trim()).length <= 0)) {
      this.mostrarMensajeError("EL PRIMER NOMBRE ES UN CAMPO OBLIGATORIO.");
      return;
    }
    if (!this.registro.segundonombre || (this.registro.segundonombre && ((String(this.registro.segundonombre)).trim()).length <= 0)) {
      this.mostrarMensajeError("EL SEGUNDO NOMBRE ES UN CAMPO OBLIGATORIO.");
      return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    const mantenimiento = super.getMantenimiento(1);
    mantenimiento.bean = "tsoccertificado";
    mantenimiento.ins = [this.registro];
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
    super.grabar();
  }
  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) { }

  public postCommit(resp: any) {
    if (resp.cod === 'OK' && resp["CERTIFICADOSOCIO"] != null && resp["CERTIFICADOSOCIO"].length == 1 && resp["CERTIFICADOSOCIO"][0]["identificacion"]) {
      if(this.mcampos.tipoGenetacion && this.mcampos.tipoGenetacion == 'GRUPO'){
        let aux = this.lregistroscertificados;
        this.lregistroscertificados= [];
        aux.push({
          identificacion: resp["CERTIFICADOSOCIO"][0]["identificacion"],
          fullname: this.registro.apellidopaterno + " " + this.registro.apellidomaterno + " " + this.registro.primernombre + " " + this.registro.segundonombre,
          tipocertificacion: "PERSONA NATURAL",
          incluircanceladas: "NO APLICA",
          periodo: "NO APLICA",
          searchdatos: this.searchdatos,
          fechainicio: "0000-00-00",
          fechafin : "0000-00-00"
        });
        for(let i = 0; i < aux.length; i++){
          this.lregistroscertificados.push({
            identificacion: aux[i]["identificacion"],
            fullname: aux[i]["fullname"],
            tipocertificacion: aux[i]["tipocertificacion"],
            incluircanceladas: aux[i]["incluircanceladas"],
            periodo: aux[i]["periodo"],
            searchdatos: aux[i]["searchdatos"],
            fechainicio: aux[i]["fechainicio"],
            fechafin : aux[i]["fechafin"]
          });
        }
        this.existeListaSocios = true;
      }else{
        this.mcampos.identificacion = resp["CERTIFICADOSOCIO"][0]["identificacion"];
        this.mcampos.nombre = this.registro.apellidopaterno + " " + this.registro.apellidomaterno + " " + this.registro.primernombre + " " + this.registro.segundonombre;
        this.existeListaSocios = true;
        this.activateGenerarReporte = true;
      }
    } else {
      this.mostrarMensajeError("SUCEDIÓ UN ERRO AL GRABAR EL SOCIO; POR FAVOR, INTENTE NUEVAMENTE.");
    }
  }

  descargarReporte() {
    if(this.mcampos.tipoGenetacion == "INDIVIDUAL"){
      switch(this.searchdatos){
        case "SOCIOAPORTANTE":{
          if(!this.mcampos.tipoPeriodo){
            this.mostrarMensajeError("ES OBLIGATORIO SELECCIONAR UN PERIODO.");
            return;
          }
          let fechaInicioInt = null;
          let fechaFinalInt = null;
          
          if(this.mcampos.tipoPeriodo == "MANUAL"){
            if(!this.mcampos.finicio || !this.mcampos.ffin){
              this.mostrarMensajeError("DEBE INGRESAR UN PERIDO DE TIEMPO.");
              return;
            }
            if(new Date(this.mcampos.finicio).getTime() > new Date(this.mcampos.ffin).getTime()){
              this.mostrarMensajeError("LA FECHA DESDE NO PUEDE SER MAYOR A LA FECHA HASTA.");
              return;
            }
            fechaInicioInt = parseInt(String(this.mcampos.finicio.getFullYear()) + String(((this.mcampos.finicio.getMonth()+1) < 10) ? "0" + ((this.mcampos.finicio.getMonth()+1)): (this.mcampos.finicio.getMonth()+1)) + String((this.mcampos.finicio.getDate() < 10) ? "0" + this.mcampos.finicio.getDate() : this.mcampos.finicio.getDate()));
            fechaFinalInt = parseInt(String(this.mcampos.ffin.getFullYear()) + String(((this.mcampos.ffin.getMonth()+1) < 10) ? "0" + ((this.mcampos.ffin.getMonth()+1)): (this.mcampos.ffin.getMonth()+1)) + String((this.mcampos.ffin.getDate() < 10) ? "0" + this.mcampos.ffin.getDate() : this.mcampos.ffin.getDate()));
          }else{
            const dataNow = new Date();
            fechaInicioInt = parseInt(String(dataNow.getFullYear()) + String(((dataNow.getMonth()+1) < 10) ? "0" + ((dataNow.getMonth()+1)): (dataNow.getMonth()+1)) + String((dataNow.getDate() < 10) ? "0" + dataNow.getDate() : dataNow.getDate()));
            fechaFinalInt = fechaInicioInt;
          }
          this.jasper.nombreArchivo = 'rptCertificadoSocioRegistrado';
          this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
          this.jasper.parametros['@i_searchdatos'] = this.searchdatos;
          this.jasper.parametros['@i_incluiropcancelada'] = this.mcampos.incluiropcancelada;
          this.jasper.parametros['@i_tipoperiodo'] = this.mcampos.tipoPeriodo;
          this.jasper.parametros['@i_fechainicial'] = fechaInicioInt;
          this.jasper.parametros['@i_fechafinal'] = fechaFinalInt;
          this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Socios/rptCertificadoSocioRegistrado';
          this.jasper.formatoexportar = 'pdf';
          this.jasper.generaReporteCore();
        } break;
        case "SOCIONOAPORTANTE":{
          this.jasper.nombreArchivo = 'rptCertificadoSocioRegimen';
          this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
          this.jasper.parametros['@i_searchdatos'] = this.searchdatos;
          this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Socios/rptCertificadoSocioRegimen';
          this.jasper.formatoexportar = 'pdf';
          console.log(this.jasper);
          this.jasper.generaReporteCore();
        } break;
        case "PERSONA":{
          this.jasper.nombreArchivo = 'rptCertificadoPersonaNatural';
          this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
          this.jasper.parametros['@i_searchdatos'] = this.searchdatos;
          this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Socios/rptCertificadoPersonaNatural';
          this.jasper.formatoexportar = 'pdf';
          console.log(this.jasper);
          this.jasper.generaReporteCore();
        } break;
        case "CERTIFICADO":{
          this.jasper.nombreArchivo = 'rptCertificadoPersonaNatural';
          this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
          this.jasper.parametros['@i_searchdatos'] = this.searchdatos;
          this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Socios/rptCertificadoPersonaNatural';
          this.jasper.formatoexportar = 'pdf';
          console.log(this.jasper);
          this.jasper.generaReporteCore();
        } break;
        default:{
          this.mostrarMensajeError("EL REPORTE AL QUE INTENTA ACCEDER, NO ESTA PERMITIDO.");
        } break;
      }
    }else{
      let certificados = null;
      for(let i = 0; i < this.lregistroscertificados.length; i++){
        if(certificados == null){
          certificados = this.lregistroscertificados[i]["identificacion"] + "\&\&"  + this.lregistroscertificados[i]["searchdatos"] +  "\&\&"  + ((this.lregistroscertificados[i]["searchdatos"] != "SOCIOAPORTANTE") ? "NO APLICA||00000000||00000000": this.lregistroscertificados[i]["incluircanceladas"] + "||" + String(this.lregistroscertificados[i]["fechainicio"]).split("-")[0] + String(this.lregistroscertificados[i]["fechainicio"]).split("-")[1] + String(this.lregistroscertificados[i]["fechainicio"]).split("-")[2] + "||" + String(this.lregistroscertificados[i]["fechafin"]).split("-")[0] + String(this.lregistroscertificados[i]["fechafin"]).split("-")[1] + String(this.lregistroscertificados[i]["fechafin"]).split("-")[2]);
        }else{
          certificados = certificados + "\\" + this.lregistroscertificados[i]["identificacion"] + "\&\&"  + this.lregistroscertificados[i]["searchdatos"] +  "\&\&"  + ((this.lregistroscertificados[i]["searchdatos"] != "SOCIOAPORTANTE") ? "NO APLICA||00000000||00000000": this.lregistroscertificados[i]["incluircanceladas"] + "||" + String(this.lregistroscertificados[i]["fechainicio"]).split("-")[0] + String(this.lregistroscertificados[i]["fechainicio"]).split("-")[1] + String(this.lregistroscertificados[i]["fechainicio"]).split("-")[2] + "||" + String(this.lregistroscertificados[i]["fechafin"]).split("-")[0] + String(this.lregistroscertificados[i]["fechafin"]).split("-")[1] + String(this.lregistroscertificados[i]["fechafin"]).split("-")[2]);
        }
      }
      if(certificados != null){
        this.jasper.nombreArchivo = 'rptCertificado Masivo';
        this.jasper.parametros['@i_socios'] = certificados;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Socios/rptCertificadoMasivo';
        this.jasper.formatoexportar = 'pdf';
        this.jasper.generaReporteCore();
      }else{
        this.mostrarMensajeError("NO SE HAN AGREGADO REGISTROS PARA GENERAR REPORTE MASIVO.");
      }
    }
  }
}
