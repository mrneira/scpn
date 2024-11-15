import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-reporte-PagosModificados',
  templateUrl: 'reportePagosModificados.html'
})
export class ReportePagosModificadosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  selectedRegistros: any;
  public lmodulos: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttestransaccion', 'REPORTEPAGOSMODIFICADOS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    //this.consultar();  // para ejecutar consultas automaticas.
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if(!this.validaFiltrosConsulta()){
      return;
    }
    this.consultarPagosModificados();
    //super.consultar();
  }

 
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const mfiltrosMod: any = { activo: true, negocio: true };
    const conModulo = new Consulta('tgenmodulo', 'Y', 't.nombre', mfiltrosMod, {});
    conModulo.cantidad = 300;
    this.addConsultaCatalogos('MODULOS', conModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');
    this.ejecutarConsultaCatalogos();
  }

    consultarPagosModificados() {
      this.rqConsulta.CODIGOCONSULTA = 'TS_PAGOS_MODIFICADOS';
      this.rqConsulta.storeprocedure = "sp_TesRptPagosModificados";
      this.rqConsulta.parametro_finicio = this.mfiltros.finicio === undefined ? "" : this.mfiltros.finicio;
      this.rqConsulta.parametro_modulo = (this.mfiltros.cmodulo === undefined || this.mfiltros.cmodulo === null) ? '-1' : this.mfiltros.cmodulo;

      this.msgs = [];
  
      this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
        .subscribe(
        resp => {
          this.manejaRespuestaDocumentos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
    }
  
    private manejaRespuestaDocumentos(resp: any) {
      this.lregistros = [];
      if (resp.cod === 'OK') {
        this.lregistros = resp.TS_PAGOS_MODIFICADOS;
      }
    }

  validaRegistros() {
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        this.selectRegistro(reg);
      }
    }
    if (this.selectedRegistros != null && this.selectedRegistros.length > 0) {
      return true;
    }
    return false;
  }
  public imprimir(resp: any): void {
    let listaPagosMod : any = [];
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        this.selectRegistro(reg);
        listaPagosMod.push({"fmodificacion": this.selectedRegistros[i].fmodificacion,
                            "identificacionbeneficiario":this.selectedRegistros[i].identificacionbeneficiario,
                            "nombrebeneficiario":this.selectedRegistros[i].nombrebeneficiario,
                            "numerocuentabeneficiario":this.selectedRegistros[i].numerocuentabeneficiario,
                            "tipoCuenta":this.selectedRegistros[i].tipoCuenta,
                            "tipoBanco":this.selectedRegistros[i].tipoBanco,
                            "valorpago":this.selectedRegistros[i].valorpago,
                            "transaccion":this.selectedRegistros[i].transaccion
                          })
      }
    }

    this.jasper.nombreArchivo = 'ReportePagosModificados';
    this.jasper.parametros['@i_finicio'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_lcpagos'] = listaPagosMod;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Tesoreria/rptTesPagosModificados';
    this.jasper.formatoexportar = resp;
    this.jasper.generaReporteCore();
  }

}
