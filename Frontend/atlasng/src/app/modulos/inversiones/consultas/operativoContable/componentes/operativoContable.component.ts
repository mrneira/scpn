
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-operativoContable',
  templateUrl: 'operativoContable.html'
})
export class OperativoContableComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lrubros: SelectItem[] = [{ label: '...', value: null }];
  public loperativo: any = [];
  public mostrarDialogoOperativo = false;

  public totalsaldo = 0;
  public mblnOperativoContable: boolean = null;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'OPERATIVOINVERSIONES', false, true);
  }

  ngOnInit() {
    this.mblnOperativoContable = (sessionStorage.getItem('t') === "3201");

    this.componentehijo = this;
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    this.mcampos.fcontable = super.integerToDate(this.dtoServicios.mradicacion.fcontable);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.fcontable)) {
      super.mostrarMensajeError('FECHA CONTABLE ES REQUERIDO');
      return;
    }

    if (this.estaVacio(this.mcampos.rubrocdetalle)) {
      super.mostrarMensajeError('RUBRO ES REQUERIDO');
      return;
    }

    this.fijarFiltrosConsulta();
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'INVSALDOOPERATIVO';
    this.rqConsulta.storeprocedure = "sp_InvConSaldosContables";
    super.consultar();
  }

  private fijarFiltrosConsulta() {
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };
    const fcierre = this.fechaToInteger(this.mcampos.fcontable);
    this.rqConsulta.parametro_i_fcierre = fcierre;
    this.rqConsulta.parametro_i_rubrocdetalle = this.mcampos.rubrocdetalle;
  }

  consultaDetalleOperativo(registro: any) {
    this.mostrarDialogoOperativo = true;
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };
    this.mcampos.cuenta = registro.ccuenta + ' - ' + registro.ncuenta;

    this.mcampos.emisor = this.estaVacio(registro.nemisor) ? '' : registro.nemisor + ' - ' + registro.ninstrumento;
    this.rqConsulta.parametro_i_fcierre = this.fechaToInteger(this.mcampos.fcontable);
    this.rqConsulta.parametro_i_rubrocdetalle = this.mcampos.rubrocdetalle;
    this.rqConsulta.parametro_i_cemisor = registro.cemisor;

    this.rqConsulta.mdatos.CODIGOCONSULTA = 'INVSALDOOPERATIVO';

    if (this.mblnOperativoContable) {
      this.rqConsulta.storeprocedure = "sp_InvDetalleOperativoInversion";
    }
    else {
      this.rqConsulta.storeprocedure = "sp_InvDetalleOperativo";
    }
    super.consultar();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (this.mostrarDialogoOperativo) {
      this.loperativo = resp.INVSALDOOPERATIVO;
      this.totalsaldo = 0;

      for (const i in this.loperativo) {
        if (this.loperativo.hasOwnProperty(i)) {
          const item = this.loperativo[i];
          this.totalsaldo += item.saldo;
        }
      }
    } else {
      this.lregistros = resp.INVSALDOOPERATIVO;
    }

    this.calcularTotales();
  }
  // Fin CONSULTA *********************

  /** Consulta catalogos */
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosEspRubro: any = { "cdetalle": "in ('INT', 'CAP') and ccatalogo = 1219" };
    const consultaRubro = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', {}, mfiltrosEspRubro);
    consultaRubro.cantidad = 100;
    this.addConsultaCatalogos('RUBROS', consultaRubro, this.lrubros, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  cerrarDialogoOperativo() {
    this.mostrarDialogoOperativo = false;
    this.loperativo = [];
  }

  calcularTotales(): void {
    this.mcampos.totalcontable = 0;
    this.mcampos.totaloperativo = 0;

    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        this.mcampos.totalcontable += reg.saldocontable;
        this.mcampos.totaloperativo += reg.saldo;
      }
    }
  }
  imprimir(resp: any): void {
    //if (this.estaVacio(this.mcampos.csaldo)) {
      // Agregar parametros
      //this.jasper.formatoexportar = "";
      var fechacierre = this.fechaToInteger(this.mcampos.fcontable);
      var particion = fechacierre.toString()
      particion = particion.substring(0,6)
      var rubrosaldo = "";
      if(this.mcampos.rubrocdetalle=="CAP"){
        rubrosaldo = "Capital"
      }else{
        rubrosaldo = "Interés"
      }

      var formatoexportar = resp
      this.jasper.formatoexportar = formatoexportar;
      this.jasper.parametros['@i_fcierre'] = fechacierre;
      this.jasper.parametros['@i_particion'] = particion;
      this.jasper.parametros['@i_csaldo'] = this.mcampos.rubrocdetalle;
      this.jasper.parametros['@i_nsaldo'] = rubrosaldo;
      this.jasper.parametros['@i_rubrocdetalle'] = this.mcampos.rubrocdetalle;
      this.jasper.nombreArchivo = 'OperativoContable';
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptInvConsultaOperativoContable';
      this.jasper.generaReporteCore();
    /*} else {
      this.mostrarMensajeError("RUBRO ES REQUERIDO");
    }*/
  }

}
