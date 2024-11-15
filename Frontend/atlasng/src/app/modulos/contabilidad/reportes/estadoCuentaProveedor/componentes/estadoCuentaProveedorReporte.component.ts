import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovProveedoresComponent} from '../../../lov/proveedores/componentes/lov.proveedores.component';

@Component({
  selector: 'app-estadocuenta-proveedor-reporte',
  templateUrl: 'estadoCuentaProveedorReporte.html'
})
export class EstadoCuentaProveedorReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovProveedoresComponent)
  public lovProveedores: LovProveedoresComponent;

  public lestadosCxC: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'ESTADOCUENTAPROVEEDOR', false);
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
  mostrarLovProveedores(): void {
    this.lovProveedores.showDialog();
  }

  /**Retorno de lov de Clientes. */
  fijarLovProveedores(reg: any): void {
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
    const mfiltrosEstadosCxP: any = {'ccatalogo': 1005};

    const consultaEstadosCxP = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstadosCxP, {});
    consultaEstadosCxP.cantidad = 10;
    this.addConsultaPorAlias('ESTADOSCXP', consultaEstadosCxP);
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
    if (this.mfiltros.finicial == undefined || this.mfiltros.ffinal == undefined) {
      super.mostrarMensajeError('INGRESE RANGO DE FECHAS');
      return;
    }
    this.jasper.nombreArchivo = 'rptConEstadoCuentaProveedor';
    this.jasper.formatoexportar=resp;
    // Agregar parametros
    this.jasper.parametros['@i_finicial'] = this.mfiltros.finicial;
    this.jasper.parametros['@i_ffinal'] = this.mfiltros.ffinal;
    this.jasper.parametros['@i_cpersona'] = this.mfiltros.cpersona;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConEstadoCuentaProveedor';
    this.jasper.generaReporteCore();
  }
}
