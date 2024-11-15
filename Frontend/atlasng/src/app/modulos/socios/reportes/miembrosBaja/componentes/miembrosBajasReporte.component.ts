import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovPersonasComponent} from '../../../../personas/lov/personas/componentes/lov.personas.component'

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'miembrosBajaReporte.html'
})
export class MiembrosBajasReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  public ltbaja: SelectItem[] = [{label: '...', value: null}];
  public ljerarquia: SelectItem[] = [{label: '...', value: null}];
  public lgrado: SelectItem[] = [{label: '...', value: null}];
  public lestadopolicia: SelectItem[] = [{label: '...', value: null}];
  public selectedEstaods: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEPOLICIASBAJA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fIniAlta = new Date();
    this.mcampos.camposfecha.fFinAlta = new Date();
    this.mcampos.camposfecha.fIniBaja = new Date();
    this.mcampos.camposfecha.fFinBaja = new Date();
    this.mcampos.camposfecha.fIniNacimiento = new Date();
    this.mcampos.camposfecha.fFinNacimiento = new Date();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

   validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  descargarReporte(): void {
    let listaEstados : any = [];


    for (const i in this.mcampos.estadopolicia) {
      //if (lista.hasOwnProperty(i)) {
        const reg = this.mcampos.estadopolicia[i];
        //if (reg.mdatos.tipoplancdetalle === 'PC-FA'){
          listaEstados.push({"estado": reg});
        //}
    }
    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    this.jasper.nombreArchivo = 'ReportePoliciasBaja';

    if((this.mcampos.fIniAlta != null && this.mcampos.fFinAlta == null) || (this.mcampos.fIniAlta == null && this.mcampos.fFinAlta != null) || (this.mcampos.fIniAlta > this.mcampos.fFinAlta) ||
    (this.mcampos.fIniNacimiento != null && this.mcampos.fFinNacimiento == null) || (this.mcampos.fIniNacimiento == null && this.mcampos.fFinNacimiento != null) || (this.mcampos.fIniNacimiento > this.mcampos.fFinNacimiento) ||
    (this.mcampos.fIniBaja != null && this.mcampos.fFinBaja == null) || (this.mcampos.fIniBaja == null && this.mcampos.fFinBaja != null) || (this.mcampos.fIniBaja > this.mcampos.fFinBaja)){
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
    }else{
    if (this.mcampos.tbaja === undefined || this.mcampos.tbaja === null) {
      this.mcampos.tbaja = 0
    }
    if (this.mcampos.estadopolicia === undefined || this.mcampos.estadopolicia === null) {
      this.mcampos.estadopolicia = ''
    }


    if (this.mcampos.jerarquia === undefined || this.mcampos.jerarquia === null) {
      this.mcampos.jerarquia = ''
    }

    if (this.mcampos.grado === undefined || this.mcampos.grado === null) {
      this.mcampos.grado = 0;
    }

    if (this.mcampos.fIniAlta === undefined || this.mcampos.fIniAlta === null) {
      this.mcampos.fIniAlta = null
    }

    if (this.mcampos.fFinAlta === undefined || this.mcampos.fFinAlta === null) {
      this.mcampos.fFinAlta = null
    }
    if (this.mcampos.fIniBaja === undefined || this.mcampos.fIniBaja === null) {
      this.mcampos.fIniBaja = null
    }

    if (this.mcampos.fFinBaja === undefined || this.mcampos.fFinBaja === null) {
      this.mcampos.fFinBaja = null
    }

    if (this.mcampos.fIniNacimiento === undefined || this.mcampos.fIniNacimiento === null) {
      this.mcampos.fIniNacimiento = null
    }

    if (this.mcampos.fFinNacimiento === undefined || this.mcampos.fFinNacimiento === null) {
      this.mcampos.fFinNacimiento = null
    }
    // Agregar parametros
    // var fechini=new Date('1900-01-01');
    // var fechfin=new Date('2300-12-31');
    // this.mcampos.fIniAlta=(this.estaVacio(this.mcampos.fIniAlta))?fechini:this.mcampos.fIniAlta;
    // this.mcampos.fFinAlta=(this.estaVacio(this.mcampos.fFinAlta))?fechfin:this.mcampos.fFinAlta;
    // this.mcampos.fIniBaja=(this.estaVacio(this.mcampos.fIniBaja))?fechini:this.mcampos.fIniBaja;
    // this.mcampos.fFinBaja=(this.estaVacio(this.mcampos.fFinBaja))?fechfin:this.mcampos.fFinBaja;
    // this.mcampos.fIniNacimiento=(this.estaVacio(this.mcampos.fIniNacimiento))?fechini:this.mcampos.fIniNacimiento;
    // this.mcampos.fFinNacimiento=(this.estaVacio(this.mcampos.fFinNacimiento))?fechfin:this.mcampos.fFinNacimiento;


    this.jasper.parametros['@i_fIniAlta'] = this.mcampos.fIniAlta;
    this.jasper.parametros['@i_fFinAlta'] = this.mcampos.fFinAlta;
    this.jasper.parametros['@i_fIniBaja'] = this.mcampos.fIniBaja;
    this.jasper.parametros['@i_fFinBaja'] = this.mcampos.fFinBaja;
    this.jasper.parametros['@i_fIniNacimiento'] = this.mcampos.fIniNacimiento;
    this.jasper.parametros['@i_fFinNacimiento'] = this.mcampos.fFinNacimiento;
    this.jasper.parametros['@i_tBaja'] = this.mcampos.tbaja;
    this.jasper.parametros['@i_jerarquia'] = this.mcampos.jerarquia;
    this.jasper.parametros['@i_estado'] = listaEstados;
    //this.jasper.parametros['@i_estado'] = this.mcampos.estadopolicia;
    this.jasper.parametros['@i_grado'] = this.mcampos.grado;
    this.jasper.parametros['@i_usuariolog'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Socios/PoliciasBaja';

    this.jasper.generaReporteCore();
    // this.mcampos.fIniAlta=null;
    // this.mcampos.fFinAlta=null;
    // this.mcampos.fIniBaja=null;
    // this.mcampos.fFinBaja=null;
    this.mcampos.fIniNacimiento=null;
    this.mcampos.fFinNacimiento=null;
  }
  }


  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosEstUsr: any = { 'ccatalogo': 2701 };
    const consultaJerarquia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaJerarquia.cantidad = 100;
    this.addConsultaCatalogos('JERARQUIA', consultaJerarquia, this.ljerarquia, super.llenaListaCatalogo, 'cdetalle');

    const consultaGrado = new Consulta('tsoctipogrado', 'Y', 't.nombre', {}, {});
    consultaGrado.cantidad = 100;
    this.addConsultaCatalogos('GRADO', consultaGrado, this.lgrado, super.llenaListaCatalogo, 'cgrado');

    const mfiltrosEstUsr1: any = { 'ccatalogo': 2703 };
    const consultaEstadoPolicia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr1,{});
    consultaEstadoPolicia.cantidad = 100;
    this.addConsultaCatalogos('ESTADO', consultaEstadoPolicia, this.lestadopolicia, super.llenaListaCatalogo, 'cdetalle', null, false);

 
    const consultaBaja = new Consulta('tsoctipobaja','Y','t.nombre',{},{});
    consultaBaja.cantidad = 100;
    this.addConsultaCatalogos('BAJA', consultaBaja, this.ltbaja, super.llenaListaCatalogo, 'ctipobaja');

    this.ejecutarConsultaCatalogos();
  }

}
