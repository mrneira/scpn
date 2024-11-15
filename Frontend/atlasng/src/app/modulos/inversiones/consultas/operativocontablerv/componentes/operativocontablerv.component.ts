import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JasperComponent } from 'app/util/componentes/jasper/componentes/jasper.component';
import { Consulta } from 'app/util/dto/dto.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';



@Component({
  selector: 'app-operativocontablerv',
  templateUrl: 'operativocontablerv.html'
})
export class OperativocontablervComponent extends BaseComponent implements OnInit,AfterViewInit {
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
    this.mblnOperativoContable = (sessionStorage.getItem('t') === "3203");

    this.componentehijo = this;
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    this.mcampos.fcontable = super.integerToDate(this.dtoServicios.mradicacion.fcontable);
  }

  //NCH 20220211 OpRentVar
  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.fcontable)) {
      super.mostrarMensajeError('FECHA CONTABLE ES REQUERIDO');
      return;
    }

    this.fijarFiltrosConsulta();
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'INVSALDOOPERATIVO';
    this.rqConsulta.storeprocedure = "sp_InvConSaldosContablesRentaVariable";
    super.consultar();
  }

  private fijarFiltrosConsulta() {
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };
    const fcierre = this.fechaToInteger(this.mcampos.fcontable);
    this.rqConsulta.parametro_i_fcierre = fcierre;
  }

  consultaDetalleOperativo(registro: any) {
    this.mostrarDialogoOperativo = true;
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };
    this.mcampos.cuenta = registro.ccuenta + ' - ' + registro.ncuenta;

    this.mcampos.emisor = this.estaVacio(registro.nemisor) ? '' : registro.nemisor + ' - ' + registro.ninstrumento;
    this.rqConsulta.parametro_i_fcierre = this.fechaToInteger(this.mcampos.fcontable);
    this.rqConsulta.parametro_i_cemisor = registro.cemisor;
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'INVSALDOOPERATIVO';

    if (this.mblnOperativoContable) {
      this.rqConsulta.storeprocedure = "sp_InvConSaldosContablesRVDetalle"; 
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
        this.mcampos.totalcontable += reg.saldo1;//NCH 20220704//saldocontable;
        this.mcampos.totaloperativo += reg.saldo;
      }
    }
  }

  descargar(reg:any): void { 
    this.jasper.formatoexportar = reg
      this.jasper.parametros['@i_fcierre'] = this.fechaToInteger(this.mcampos.fcontable);
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptInvConsultaOperativoContableRentaVariable';
      this.jasper.generaReporteCore();
  }


  
 

}
