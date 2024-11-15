import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-reporte-reportesExtracontables',
  templateUrl: 'reportesExtracontables.html'
})
export class ReportesExtracontablesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
 
  public ltipoproducto: SelectItem[] = [
    { label: '...', value: null },
    //{"label": "CUENTA POR COBRAR FONDOS ADMINISTRADOS", "value": 1},                      //RECOMENDACION(2)
    {"label": "CUENTAS POR COBRAR FONDOS ADMINISTRADOS", "value": 101},                   //RECOMENDACION(2)
    //{"label": "CUENTAS POR COBRAR ADMINISTRADORA DE FONDOS", "value": 102},               //RECOMENDACION(2)
    //{"label": "RENTABILIDAD DEL INTERÉS DE MORA", "value": 2},                            //RECOMENDACION(4)
    //{"label": "ANTICIPO PROVEEDORES", "value": 3},                                        //RECOMENDACION(6)
    //{"label": "DEPÓSITOS EN GARANTÍA", "value": 4},                                       //RECOMENDACION(7)
    //{"label": "OTRAS CUENTAS POR COBRAR CLIENTES", "value": 5},                           //RECOMENDACION(8)
    //{"label": "PROVISIÓN DE CUENTAS INCOBRABLES", "value": 6},                            //RECOMENDACION(10)
    //{"label": "OTROS ACTIVOS INTANGIBLES", "value": 7},                                   //RECOMENDACION(13-14)
    //{"label": "ACTIVOS FIJOS", "value": 8},                                               //RECOMENDACION(16)
    {"label": "SALDOS DE CUENTAS VERSUS SALDOS DE EXISTENCIAS GUARDALMACEN", "value": 9}, //RECOMENDACION(21-23)
    //{"label": "AMORTIZACIÓN POLIZAS DE SEGUROS", "value": 10},                            //RECOMENDACION(24-25)
    //{"label": "CUENTAS POR COBRAR INTRAINSTITUCIONALES", "value": 11},                    //RECOMENDACION(26)
    //{"label": "CUENTAS POR PAGAR VARIOS ACREEDORES", "value": 12},                      //RECOMENDACION(27)
    {"label": "CUENTAS POR PAGAR ADMINISTRADORA DE FONDOS", "value": 1201},               //RECOMENDACION(27)
    //{"label": "BENEFICIOS SOCIALES", "value": 13},                                        //RECOMENDACIONES (28-29-30-31-32)
    {"label": "RETENCIONES IMPUESTO A LA RENTA", "value": 14},                            //RECOMENDACION(33)
    {"label": "PRÉSTAMOS IESS", "value": 15},                                             //RECOMENDACION (34)
    //{"label": "RETENCIONES IMPUESTOS SRI", "value": 16},                                  //RECOMENDACION(35)
    {"label": "APORTES RECIBIDO POR LA ADMINISTRADORA DE FONDOS", "value": 17}            //RECOMENDACION(36)
  ];
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', '', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
      super.postQueryEntityBean(resp);
      
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Retorno de lov de productos. */
  imprimir(resp: any): void {
    if(this.mfiltros.reportes === undefined || this.mfiltros.reportes === null) 
    {
        this.mostrarMensajeError('REPORTE REQUERIDO');
        //this.mfiltros.reportes = 1;
    }
    else if(this.mfiltros.fcorte === undefined || this.mfiltros.fcorte === null){
        this.mostrarMensajeError('FECHA REQUERIDA');
    }
    else{
        this.jasper.parametros = {};
        this.jasper.parametros['@i_fcorte'] = this.mfiltros.fcorte;
        switch(this.mfiltros.reportes){
          case 1:{
            this.jasper.parametros['@i_finicio'] = new Date("2018-01-01");
            this.jasper.parametros['@i_cuentasInversiones'] = "715909002";
            this.jasper.parametros['@i_cuenta'] = "715030201";
            this.jasper.parametros['@i_cuentasPrestamos'] = "715909003,715909004,715909007";
            this.jasper.parametros['@i_cuentaVarias'] = "715909008";
            this.jasper.parametros['@i_cuentas'] = "715909003,715909004,715909007";
            this.jasper.parametros['@i_cuentasPrestaciones'] = "721010103,721010108";
            this.jasper.nombreArchivo = 'ReporteCuentasCobrarFondosAdministrativos';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptCuentasCobrarFondosAdministrativos';
            break;
          }
          case 101:{
            this.jasper.parametros['@i_finicio'] = new Date("2018-01-01");
            this.jasper.parametros['@i_cuentasInversiones'] = "715909002";
            this.jasper.parametros['@i_cuenta'] = "715030201";
            this.jasper.parametros['@i_cuentasPrestamos'] = "715909003,715909004,715909007";
            this.jasper.nombreArchivo = 'ReporteCuentasPorCobrarFondosAdministrados';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptCuentasCobrarFondosAdministrados';
            break;
          }
          case 102:{
            this.jasper.parametros['@i_finicio'] = new Date("2018-01-01");
            this.jasper.nombreArchivo = 'ReporteCuentasPorCobrarAdministradoraDeFondos';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptCuentasCobrarAdministradoraDeFondos';
            break;
          }
          case 2:{
              this.jasper.nombreArchivo = 'ReporteRentabilidadInteresMora';
              this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptRentabilidadInteresMora';
              break;
          }
          case 3:{
            this.jasper.parametros = {};
            this.jasper.parametros['@i_cuenta'] = "120702";
            this.jasper.nombreArchivo = 'ReporteAnticipoProveedores';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptAnticipoProveedores';
            break;
          }
          case 4:{
            this.jasper.parametros = {};
            this.jasper.parametros['@i_cuenta'] = "129006";
            this.jasper.nombreArchivo = 'ReporteDepositosEnGarantia';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptDepositosEnGarantia';
            break;
          }
          case 5:{
            this.jasper.nombreArchivo = 'ReporteOtrasCuentasCobrarClientes';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptOtrasCuentasCobrarClientes';
            break;
          }
          case 6:{
            this.jasper.nombreArchivo = 'ReporteProvisionCuentasIncobrables';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptProvisionCuentasIncobrables';
            break;
          }
          case 7:{
            this.jasper.parametros = {};
            this.jasper.nombreArchivo = 'ReporteOtrosActivosIntangibles';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptOtrosActivosIntangibles';
            break;
          }
          case 9:{
            this.jasper.nombreArchivo = 'ReporteSaldosCuentaGuardalmacen';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptSaldosCuentaGuardalmacen';
            break;
          }
          case 10:{
            this.jasper.parametros['@i_cuenta'] = "190202";
            this.jasper.nombreArchivo = 'ReportePolizaSeguros';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptPolizaSeguros';
            break;
          }
          case 11:{
            this.jasper.parametros['@i_cuenta'] = "715030201";
            this.jasper.nombreArchivo = 'ReporteCuentaCobrarAdministradora';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptCuentaCobrarAdministradora';            
            break;
          }
          case 12:{
            this.jasper.parametros['@i_cuenta'] = "21030190";
            this.jasper.nombreArchivo = 'ReporteCuentasVariosAcreedores';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptCuentasVariosAcreedores';            
            break;
          }
          case 1201:{
            this.jasper.parametros['@i_cuenta'] = "21030190";
            this.jasper.nombreArchivo = 'ReporteDeCuentasVariosAcreedores';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptCuentasPagarAdministradoraDeFondos';            
            break;
          }
          case 13:{
            this.jasper.parametros['@i_cuentas'] = "21040201,21040202,21040401";
            this.jasper.nombreArchivo = 'ReporteBeneficiosSociales';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptBenficiosSociales';
            break;
          }
          case 14:{
            this.jasper.nombreArchivo = 'ReporteRetencionRenta';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptRetencionRenta';
            break;
          }
          case 15:{
            this.jasper.parametros['@i_descuentos'] = "3,4";
            this.jasper.parametros['@i_cuenta'] = "21059001";
            this.jasper.nombreArchivo = 'ReportePrestamosIess';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptPrestamosIessNomina';
            break;
          }
          case 16:{
            this.jasper.parametros['@i_cuentas'] = "21060106,21060102,21060103,21060104";
            this.jasper.parametros['@i_cuentasFuente'] = "21050201,21060116,21060101,21060105,21060114,21060108";
            this.jasper.parametros['@i_cuentasRetIva'] = "21060102,21060103,21060104";
            this.jasper.nombreArchivo = 'ReporteRetencionesSri';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptRetencionImpuestosSri';
            break;
          }
          case 17:{
            this.jasper.parametros['@i_cuenta'] = "51010101";
            this.jasper.parametros['@i_cuenta2'] = "743010101";
            this.jasper.nombreArchivo = 'ReporteAportesRecibidosAdministracionDeFondos';
            this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptReporteAportesRecibidosAdministracionDeFondos';
            break;
          }
        }
        this.jasper.formatoexportar = resp;
        this.jasper.generaReporteCore();
    }
    
  }

  cambioReporte(value){
    //this.mfiltros.ffin
  }


}
