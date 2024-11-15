import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { SelectItem } from 'primeng/primeng';
import { DetalleOperativoCarteraComponent } from './_detalleOperativoCartera.component';

@Component({
  selector: 'app-operativo-contable',
  templateUrl: 'operativoContableCartera.html'
})
export class OperativoContableCarteraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(DetalleOperativoCarteraComponent)
  detalleOperativoComponent: DetalleOperativoCarteraComponent;

  public lrubros: SelectItem[] = [{ label: '...', value: null }];
  public loperativo: any = [];
  public habilitadetalle = false;
  public mostrarDialogoOperativo = false;
  public sumasaldovencido = 0;
  public sumasaldoxvencer = 0;
  public sumasaldo = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'SALDOSCONTABLESCARTERA', false, true);
  }

  ngOnInit() {
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

    if (this.estaVacio(this.mcampos.csaldo)) {
      super.mostrarMensajeError('RUBRO ES REQUERIDO');
      return;
    }

    if (this.mcampos.csaldo === 'R-INT-MORA') {
      this.fijarConsultaInteres();
      super.consultar();
    }else{
      this.fijarFiltrosConsulta();
      super.consultar();    }  
  }

  private fijarFiltrosConsulta() {
    super.encerarConsulta();
    this.habilitadetalle = false;
    this.rqConsulta = { 'mdatos': {} };
    this.lregistros = [];
    const fcierre = this.fechaToInteger(this.mcampos.fcontable);
    //NCH 20220928
    if (this.mcampos.csaldo == 'CAP-CAR'){
      this.rqConsulta.mdatos.CODIGOCONSULTA = 'SALDOSCONTABLESCARTERA';
      this.rqConsulta.storeprocedure = "sp_CarConSaldosContablesCapital";
      this.rqConsulta.parametro_i_fcierre = fcierre;
      this.rqConsulta.parametro_i_particion = fcierre.toString().substring(0, 4) + fcierre.toString().substring(4, 6);
      this.rqConsulta.parametro_i_csaldo = this.mcampos.csaldo;
      this.rqConsulta.parametro_i_detalle = false;
    }
    else {
      this.rqConsulta.mdatos.CODIGOCONSULTA = 'SALDOSCONTABLESCARTERA';
      this.rqConsulta.storeprocedure = "sp_CarConSaldosContables";
      this.rqConsulta.parametro_i_fcierre = fcierre;
      this.rqConsulta.parametro_i_particion = fcierre.toString().substring(0, 4) + fcierre.toString().substring(4, 6);
      this.rqConsulta.parametro_i_csaldo = this.mcampos.csaldo;
      this.rqConsulta.parametro_i_detalle = false;
    }

    if (this.mcampos.csaldo !== 'CAP-CAR' && this.mcampos.csaldo !== 'INT-CAR') {
      this.detalleOperativoComponent.mcampos = this.mcampos;
      this.detalleOperativoComponent.consultar();
      this.habilitadetalle = true;
    }
  }

  consultaDetalleOperativo(registro: any) {

    if (this.mcampos.csaldo === 'R-INT-MORA') {
      super.encerarConsulta();
      this.rqConsulta = { 'mdatos': {} };
      
      const fcierre = this.fechaToInteger(this.mcampos.fcontable);
      const finicio = Number(this.mcampos.fcontable.getFullYear() + '0101');
      this.rqConsulta.parametro_i_ccuenta   = registro.ccuenta;
      this.rqConsulta.parametro_i_finicio   = finicio;
      this.rqConsulta.parametro_i_ffin      = fcierre;
      this.rqConsulta.parametro_i_detalle   = true;
      this.rqConsulta.mdatos.CODIGOCONSULTA = 'SALDOSOPERATIVOCARTERA';
      this.rqConsulta.storeprocedure = "sp_ConRptComprobantesPorCuenta";
      super.consultar();

    }else {
      super.encerarConsulta();
      this.rqConsulta = { 'mdatos': {} };
      this.mcampos.cuenta = registro.ccuenta + ' - ' + registro.ncuenta

      const fcierre = this.fechaToInteger(this.mcampos.fcontable);
      this.rqConsulta.parametro_i_fcierre = fcierre;
      this.rqConsulta.parametro_i_csaldo = this.mcampos.csaldo;
      this.rqConsulta.parametro_i_cproducto = registro.cproducto;
      this.rqConsulta.parametro_i_ctipoproducto = registro.ctipoproducto;
      //NCH 20220928
      this.rqConsulta.parametro_i_estado = registro.cestadooperacion; 
      this.rqConsulta.parametro_i_estatus = registro.cestatus; 
      this.rqConsulta.mdatos.CODIGOCONSULTA = 'SALDOSOPERATIVOCARTERA';
      this.rqConsulta.storeprocedure = "sp_CarConSaldosOperativo";
      super.consultar();
    }
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (this.rqConsulta.mdatos.CODIGOCONSULTA === 'SALDOSOPERATIVOCARTERA') {
      this.loperativo = resp.SALDOSOPERATIVOCARTERA;
      this.mostrarDialogoOperativo = true;

      this.sumasaldovencido = 0;
      this.sumasaldoxvencer = 0;
      this.sumasaldo = 0;
      for (const i in this.loperativo) {
        if (this.loperativo.hasOwnProperty(i)) {
          const item = this.loperativo[i];
          this.sumasaldovencido += item.saldovencido;
          this.sumasaldoxvencer += item.saldoxvencer;
          this.sumasaldo += item.saldo;
        }
      }
    } else {
      super.postQueryEntityBean(resp);
      this.calcularTotales();
    }
  }
  // Fin CONSULTA *********************

  /** Consulta catalogos */
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosEspRubro: any = { 'csaldo': 'in (select distinct csaldo from TcarSaldosContables)' };
    const consultaRubro = new Consulta('TmonSaldo', 'Y', 't.nombre', {}, mfiltrosEspRubro);
    consultaRubro.cantidad = 100;
    this.addConsultaCatalogos('RUBROS', consultaRubro, this.lrubros, this.llenaListaCatalogoAux, 'csaldo');
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
    if (!this.estaVacio(this.mcampos.csaldo)) {
      this.jasper.formatoexportar = resp;
      // Agregar parametros
      if (this.mcampos.csaldo == 'CAP-CAR'){
        const fcierre = this.fechaToInteger(this.mcampos.fcontable); //NCH 20220928
        this.jasper.parametros['@i_fcierre'] = fcierre;
        this.jasper.parametros['@i_particion'] = fcierre.toString().substring(0, 4) + fcierre.toString().substring(4, 6);;
        this.jasper.parametros['@i_csaldo'] = this.mcampos.csaldo;
        this.jasper.parametros['@i_nsaldo'] = this.lrubros.find(x => x.value === this.mcampos.csaldo).label;
        this.jasper.nombreArchivo = 'OperativoContable_' + fcierre;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaOperativoContableCapital';
        this.jasper.generaReporteCore();

      }
      else if(this.mcampos.csaldo == 'R-INT-MORA'){
        const fcierre = this.calendarToFechaString(this.mcampos.fcontable);
        this.jasper.parametros['@i_fcorte'] = fcierre;
        this.jasper.parametros['@i_ccuenta'] = '75209';
        this.jasper.parametros['@i_detalle'] = true;
        this.jasper.nombreArchivo = 'OperativoContable_' + fcierre;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaOperativoContableMora';
        this.jasper.generaReporteCore();
      }
      else{   

      const fcierre = this.fechaToInteger(this.mcampos.fcontable);
      this.jasper.parametros['@i_fcierre'] = fcierre;
      this.jasper.parametros['@i_particion'] = fcierre.toString().substring(0, 4) + fcierre.toString().substring(4, 6);;
      this.jasper.parametros['@i_csaldo'] = this.mcampos.csaldo;
      this.jasper.parametros['@i_nsaldo'] = this.lrubros.find(x => x.value === this.mcampos.csaldo).label;
      this.jasper.nombreArchivo = 'OperativoContable_' + fcierre;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaOperativoContable';
      this.jasper.generaReporteCore();
      }
    } else {
      this.mostrarMensajeError("RUBRO ES REQUERIDO");
    }
  }

  /*
  NUEVA FUNCIONALDAD
  PARA OBTENER LA RENTABILIDAD DE INTERES DE MORA
  RNI20240605 
  */

  /* Sobreescribe la funcion llenaListaCatalogo para mostrar la opcion de interes de mora */
  public llenaListaCatalogoAux(pLista: any, pListaResp, campopk = 'pk', agregaRegistroVacio = true, componentehijo = null): any {
    while (pLista.length > 0) {
        pLista.pop();
    }
    if (agregaRegistroVacio) {
        pLista.push({ label: '...', value: null });
    }
    let cmapo1 = null;
    let cmapo2 = null;
    if (campopk.indexOf('.') > 0) {
        const arrpks = campopk.split('.');
        cmapo1 = arrpks[0];
        cmapo2 = arrpks[1];
    }
    for (const i in pListaResp) {
        if (pListaResp.hasOwnProperty(i)) {
            const reg = pListaResp[i];
            if (campopk.indexOf('pk') < 0) {
                pLista.push({ label: reg.nombre, value: reg[campopk] });
            } else if (cmapo1 === null) {
                pLista.push({ label: reg.nombre, value: reg.pk });
            } else {
                pLista.push({ label: reg.nombre, value: reg[cmapo1][cmapo2] });
            }
        }
    }
    pLista.push({label: 'RENDIMEINTO INTERES DE MORA', value: 'R-INT-MORA'});
  }

  /* Funcion para obtener los valores del rendimiento del interes de mora */
  private fijarConsultaInteres(){
    super.encerarConsulta();
    this.habilitadetalle = false;
    this.rqConsulta = { 'mdatos': {} };
    this.lregistros = [];
    const fcierre = this.calendarToFechaString(this.mcampos.fcontable);

    this.rqConsulta.mdatos.CODIGOCONSULTA = 'SALDOSCONTABLESCARTERA';
    this.rqConsulta.storeprocedure = "sp_ConRptRendimientoInteresMora";
    this.rqConsulta.parametro_i_ccuenta = '75209';
    this.rqConsulta.parametro_i_fcorte = fcierre;
    this.rqConsulta.parametro_i_detalle = false;

    this.detalleOperativoComponent.mcampos = this.mcampos;
    this.detalleOperativoComponent.consultarMora();
    this.habilitadetalle = true;
  }


}
