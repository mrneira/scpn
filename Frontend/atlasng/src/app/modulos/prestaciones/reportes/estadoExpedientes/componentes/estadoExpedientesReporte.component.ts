import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovPersonasComponent} from '../../../../personas/lov/personas/componentes/lov.personas.component'

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'estadoExpedientesReporte.html'
})
export class EstadoExpedientesReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  public lestadopolicias: SelectItem[] = [{label: '...', value: null}];
  //public lestadoexpedientes: SelectItem[] = [{label: '...', value: null}];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'ESTADOEXPEDIENTESREPORTE', false);
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

  imoprimir(resp:any): void {
    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    this.jasper.nombreArchivo = 'ReporteEstadoExpedientes';
    if((this.mcampos.finicio != null && this.mcampos.ffin == null) || (this.mcampos.finicio == null && this.mcampos.ffin != null) || (this.mcampos.finicio > this.mcampos.ffin) ){
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");

  }else{


    if (this.mcampos.finiciol === undefined || this.mcampos.finicio === null) {
      this.mcampos.finicio = null
    }

    if (this.mcampos.ffin === undefined || this.mcampos.ffin === null) {
      this.mcampos.ffin = null
    }

    if (this.mcampos.estadopolicia === undefined || this.mcampos.estadopolicia === null) {
      this.mcampos.estadopolicia = '';
    }

    /*if (this.mcampos.estadoexpediente === undefined || this.mcampos.estadoexpediente === null) {
      this.mcampos.estadoexpediente = '';
    }*/

    // Agregar parametros
    this.jasper.parametros['@i_fInicioSesion'] = this.mcampos.finicio;
    this.jasper.parametros['@i_fFinSesion'] = this.mcampos.ffin;
    this.jasper.parametros['@i_estado_policia'] = this.mcampos.estadopolicia;
    this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
    //this.jasper.parametros['@i_estado_expediente'] = this.mcampos.estadoexpediente;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Listado_Estado_Expedientes';
    this.jasper.formatoexportar= resp;
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
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  llenarConsultaCatalogos(): void {

    const mfiltrosEstUsr1: any = {'ccatalogo': 2703};
    const consultaEstadoPolicia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr1, {});
    consultaEstadoPolicia.cantidad = 50;
    this.addConsultaPorAlias('ESTADOPOLICIA', consultaEstadoPolicia);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lestadopolicias, resp.ESTADOPOLICIA, 'cdetalle');
      //this.llenaListaCatalogo(this.lestadoexpedientes, resp.TIPONOVEDAD, 'cdetalle');

    }
    this.lconsulta = [];
  }
}
