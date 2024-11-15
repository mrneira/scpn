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
  templateUrl: 'NovedadesReporte.html'
})
export class NovedadesReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  public ljerarquia: SelectItem[] = [{label: '...', value: null}];
  public lgrado: SelectItem[] = [{label: '...', value: null}];
  public lestadopolicia: SelectItem[] = [{label: '...', value: null}];
  public ltiponovedad: SelectItem[] = [{label: '...', value: null}];
  public selectedEstaods: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTENOVEDADES', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.finicio = new Date();
    this.mcampos.camposfecha.ffin = new Date();
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
    this.jasper.nombreArchivo = 'ReporteNovedad';

    if((this.mcampos.finicio != null && this.mcampos.ffin == null) || (this.mcampos.finicio == null && this.mcampos.ffin != null) || (this.mcampos.finicio > this.mcampos.ffin) ){
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");

  }else{

    if (this.mcampos.jerarquia === undefined || this.mcampos.jerarquia === null) {
      this.mcampos.jerarquia = '';
    }

    if (this.mcampos.grado === undefined || this.mcampos.grado === null) {
      this.mcampos.grado = -1;
    }

    if (this.mcampos.estadopolicia === undefined || this.mcampos.estadopolicia === null) {
      this.mcampos.estadopolicia = '';
    }

    if (this.mcampos.tiponovedad === undefined || this.mcampos.tiponovedad === null) {
      this.mcampos.tiponovedad = '';
    }

    if (this.mcampos.finicio === undefined || this.mcampos.finicio === null) {
      this.mcampos.finicio = null
    }

    if (this.mcampos.ffin === undefined || this.mcampos.ffin === null) {
      this.mcampos.ffin = null
    }

    // Agregar parametros
    this.jasper.parametros['@i_jerarquia'] = this.mcampos.jerarquia;
    this.jasper.parametros['@i_grado'] = this.mcampos.grado;
    this.jasper.parametros['@i_estado'] = listaEstados;
    this.jasper.parametros['@i_novedad'] = this.mcampos.tiponovedad;
    this.jasper.parametros['@i_fIniOfi'] = this.mcampos.finicio;
    this.jasper.parametros['@i_fFinOfi'] = this.mcampos.ffin;
    this.jasper.parametros['@i_usuariolog'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Socios/NovedadesOficios';

    this.jasper.generaReporteCore();
  }
  }

  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovPersonas.mfiltros.tipodepersona = 'N';
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;

    }
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosEstUsr: any = { 'ccatalogo': 2701 };
    const consultaJerarquia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaJerarquia.cantidad = 50;
    this.addConsultaCatalogos('JERARQUIA', consultaJerarquia, this.ljerarquia, super.llenaListaCatalogo, 'cdetalle');

    const consultaGrado = new Consulta('tsoctipogrado', 'Y', 't.nombre', {}, {});
    consultaGrado.cantidad = 100;
    this.addConsultaCatalogos('GRADO', consultaGrado, this.lgrado, super.llenaListaCatalogo, 'cgrado');

    const mfiltrosEstUsr1: any = { 'ccatalogo': 2703};
    const consultaEstadoPolicia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr1,{});
    consultaEstadoPolicia.cantidad = 50;
    this.addConsultaCatalogos('ESTADOPOLICIA', consultaEstadoPolicia, this.lestadopolicia, super.llenaListaCatalogo, 'cdetalle', null, false);

    const mfiltrosEstUsr2: any = {'ccatalogo': 220};
    const mfiltrosespEstUsr2: any = {'clegal': 'is null','cdetalle': `not in ('15','16','17','18','21','22')`};
    const consultaTipoNovedad = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr2, mfiltrosespEstUsr2);
    consultaTipoNovedad.cantidad = 50;
    this.addConsultaCatalogos('TIPONOVEDAD', consultaTipoNovedad, this.ltiponovedad, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
}
