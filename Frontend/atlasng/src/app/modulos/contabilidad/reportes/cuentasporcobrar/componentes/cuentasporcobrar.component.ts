import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovClientesComponent} from '../../../lov/clientes/componentes/lov.clientes.component';

@Component({
  selector: 'app-cuentasporcobrar',
  templateUrl: 'cuentasporcobrar.html'
})
export class CuentasporcobrarComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovClientesComponent)
  public lovClientes: LovClientesComponent;

  public lestadosCxC: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'DEUDASCLIENTESREPORTE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1 );
    this.mfiltros.finicio =  finicio;
    this.mfiltros.ffin = this.fechaactual;

  }

  ngAfterViewInit() {
  }

  /**Muestra lov de Clientes */
  mostrarLovClientes(): void {
    this.lovClientes.showDialog();
  }

  /**Retorno de lov de Clientes. */
  fijarLovClientes(reg: any): void {
      if (reg.registro !== undefined) {
        this.mfiltros.cpersona = reg.registro.cpersona;
        this.mfiltros.ccompania = reg.registro.ccompania;
        this.mcampos.identificacionProv = reg.registro.identificacion;
        this.mcampos.nombreProv = reg.registro.nombre;
        this.mcampos.cpersona = reg.registro.cpersona;
      }
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
        .subscribe(
        resp => {
            this.encerarMensajes();
            this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
            this.manejaRespuestaCatalogos(resp);
        },
        error => {
            this.dtoServicios.manejoError(error);
        });
  }


  llenarConsultaCatalogos(): void {
    const mfiltrosEstadosCxC: any = {'ccatalogo': 1012};

    const consultaEstadosCxC = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstadosCxC, {});
    consultaEstadosCxC.cantidad = 500;
    this.addConsultaPorAlias('ESTADOSCXC', consultaEstadosCxC);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lestadosCxC, resp.ESTADOSCXC, 'cdetalle');
    }
    this.lconsulta = [];
  }

  imprimir(resp: any): void {
    if (this.mfiltros.finicio == undefined || this.mfiltros.ffin == undefined) {
      super.mostrarMensajeError('INGRESE RANGO DE FECHAS');
      return;
    }
    this.jasper.nombreArchivo = 'ReporteDeudasClientes';
    this.jasper.formatoexportar=resp;
    // Agregar parametros
    this.jasper.parametros['@i_finicial'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_ffinal'] = this.mfiltros.ffin;

    this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacionProv;
    this.jasper.parametros['@i_estadocdetalle'] = this.mfiltros.estadoCxC;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConCuentasPorCobrar';
    this.jasper.generaReporteCore();
  }
}
